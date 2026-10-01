import { readFile, realpath } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { normalisePagesBase } from './pages-base.mjs';

const filenamePattern = /^[a-z0-9][a-z0-9-]*\.(?:svg|png|jpg|webp)$/;
const mime = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const numberPattern = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?';

export function parseSvgViewBox(svg) {
  const match = new RegExp(`<svg\\b[^>]*\\bviewBox\\s*=\\s*["']\\s*(${numberPattern})\\s+(${numberPattern})\\s+(${numberPattern})\\s+(${numberPattern})\\s*["']`, 'i').exec(svg);
  if (!match) return undefined;
  const [x, y, width, height] = match.slice(1).map(Number);
  if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) throw new Error('Invalid SVG viewBox.');
  return { x, y, width, height };
}

export function parseSvgIntrinsicSize(svg) {
  const root = /<svg\b([^>]*)>/i.exec(svg)?.[1];
  if (!root) throw new Error('Invalid SVG root.');
  const read = name => new RegExp(`\\b${name}\\s*=\\s*["']\\s*(${numberPattern})\\s*["']`, 'i').exec(root)?.[1];
  const width = Number(read('width')), height = Number(read('height'));
  if (![width, height].every(Number.isFinite) || width <= 0 || height <= 0) throw new Error('SVG requires positive unitless width and height.');
  return { width, height };
}

export function validatePageSlices(filename, viewBox, boundaries) {
  if (boundaries === undefined) return undefined;
  if (!filename.endsWith('.svg') || !viewBox) throw new Error('Page slices require an SVG with a viewBox.');
  if (!Array.isArray(boundaries) || boundaries.length < 2 || boundaries.length > 16 || boundaries.some(value => !Number.isFinite(value))) throw new Error('Invalid page-slice boundaries.');
  const epsilon = 0.001;
  const bottom = viewBox.y + viewBox.height;
  if (Math.abs(boundaries[0] - viewBox.y) > epsilon || Math.abs(boundaries.at(-1) - bottom) > epsilon) throw new Error('Page slices must cover the complete SVG viewBox.');
  for (let index = 1; index < boundaries.length; index++) {
    const height = boundaries[index] - boundaries[index - 1];
    if (height <= 0) throw new Error('Page-slice boundaries must be strictly increasing.');
    if (height > viewBox.width * 1.1 + epsilon) throw new Error('A page slice is too tall for the page-safe layout.');
  }
  return [...boundaries];
}

export function validatePageSliceNotes(boundaries, notes) {
  if (boundaries === undefined && notes === undefined) return undefined;
  if (!boundaries || !Array.isArray(notes) || notes.length !== boundaries.length - 1) throw new Error('Every page slice requires one context note.');
  if (notes.some(note => typeof note !== 'string' || !note.trim() || note.length > 240)) throw new Error('Invalid page-slice context note.');
  return notes.map(note => note.trim());
}

export async function readBookImages(projectRoot, { publicBase = '/' } = {}) {
  const base = normalisePagesBase(publicBase);
  const directory = await realpath(path.join(projectRoot, 'book/assets'));
  const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
  if (!Array.isArray(manifest.images)) throw new Error('Invalid image manifest.');
  const images = Object.create(null), files = Object.create(null);
  for (const item of manifest.images) {
    if (!filenamePattern.test(item.filename) || images['book/assets/' + item.filename]) throw new Error('Invalid or duplicate book image.');
    if (!['working-draft', 'approved'].includes(item.status) || !item.caption || !item.credit || !item.source || !item.licence || !item.limit) throw new Error('Incomplete image evidence record.');
    if (new URL(item.source).protocol !== 'https:' || (item.licenceUrl && new URL(item.licenceUrl).protocol !== 'https:')) throw new Error('Image references must use HTTPS.');
    const file = await realpath(path.join(directory, item.filename));
    if (path.dirname(file) !== directory) throw new Error('Book image is outside the asset directory.');
    const bytes = await readFile(file);
    if (bytes.length > 12_000_000) throw new Error('Book image is too large.');
    const svg = item.filename.endsWith('.svg') ? bytes.toString('utf8') : undefined;
    if (svg && /<\s*(?:script|foreignObject)|\bon\w+\s*=|(?:href\s*=\s*["']\s*(?!#)|url\(\s*(?!#))/i.test(svg)) throw new Error('Active or external SVG content is not permitted.');
    const viewBox = svg ? parseSvgViewBox(svg) : undefined;
    if (svg && !viewBox) throw new Error('SVG requires a valid viewBox.');
    if (svg && viewBox) {
      const intrinsic = parseSvgIntrinsicSize(svg);
      const intrinsicRatio = intrinsic.width / intrinsic.height, viewBoxRatio = viewBox.width / viewBox.height;
      if (Math.abs(intrinsicRatio - viewBoxRatio) / viewBoxRatio > 0.001) throw new Error('SVG intrinsic dimensions must match its viewBox aspect ratio.');
    }
    const pageSlices = validatePageSlices(item.filename, viewBox, item.pageSlices);
    const pageSliceNotes = validatePageSliceNotes(pageSlices, item.pageSliceNotes);
    const id = 'book/assets/' + item.filename;
    const version = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
    images[id] = { ...item, ...(viewBox ? { viewBox, pageLayoutRequired: viewBox.height > viewBox.width } : {}), ...(pageSlices ? { pageSlices, pageSliceNotes } : {}), id, url: base + 'book-assets/' + item.filename + '?v=' + version };
    files[item.filename] = { bytes, contentType: mime[path.extname(item.filename)] };
  }
  return { images, files };
}
