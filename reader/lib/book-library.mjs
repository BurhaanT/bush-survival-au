import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { readBookImages } from './book-images.mjs';
import { selectPrintBook } from './print-book.mjs';
import { normalisePagesBase } from './pages-base.mjs';

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const prototypePath = 'research/review-drafts/EMERGENCY_CORE_REVIEW_PROTOTYPE_v0.1.md';
const supplementary = ['SOURCE_REGISTER.md', 'CONTENT_VALIDATION_GATE.md', 'book/EDITION_STATUS.md'];
const excluded = new Set(['CURRENT_STATE.md', 'COMMERCIAL_MODEL.md', 'PHASE_1_MARKET_VALIDATION.md', 'VALIDATION_LOG.md', 'research/reviewer-briefs/INITIAL_REVIEW_ENQUIRIES.md']);

export function resolveDocumentLink(from, target) {
  if (!target || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target)) return null;
  let decoded;
  try { decoded = decodeURIComponent(target.split('#')[0]); } catch { return null; }
  if (!decoded) return from;
  if (decoded.includes('\\') || decoded.includes('\0') || decoded.startsWith('/')) return null;
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(from), decoded));
  if (resolved.startsWith('../') || !resolved.endsWith('.md')) return null;
  if (resolved.split('/').some(part => part.startsWith('.') || ['reader', 'node_modules', 'output'].includes(part))) return null;
  return resolved;
}

export function parseManifest(markdown) {
  const chapters = [...markdown.matchAll(/\x60(chapters\/[^\x60\r\n]+\.md)\x60/g)].map(match => 'book/' + match[1]);
  if (!chapters.length || new Set(chapters).size !== chapters.length) throw new Error('The book manifest is empty or has duplicate chapters.');
  for (const chapter of chapters) {
    if (resolveDocumentLink('book/MANIFEST.md', chapter.slice(5)) !== chapter) throw new Error('Invalid manifest path.');
  }
  return chapters;
}

async function readDocument(relativePath) {
  const root = await realpath(projectRoot);
  const filename = await realpath(path.join(root, relativePath));
  const relative = path.relative(root, filename);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Document is outside the book project.');
  const [markdown, info] = await Promise.all([readFile(filename, 'utf8'), stat(filename)]);
  if (!info.isFile() || info.size > 2_000_000) throw new Error('Unsupported Markdown file.');
  return { id: relativePath, title: /^# (.+)$/m.exec(markdown)?.[1].trim() || path.basename(relativePath, '.md'), markdown, modified: info.mtime.toISOString() };
}

/** @param {{ publicBase?: string, documentAllowlist?: readonly string[] }} [options] */
export async function readLibrary({ publicBase = '/', documentAllowlist } = {}) {
  const base = normalisePagesBase(publicBase);
  const manifest = await readFile(path.join(projectRoot, 'book/MANIFEST.md'), 'utf8');
  const chapterIds = parseManifest(manifest);
  const documents = {};
  const required = [...chapterIds, prototypePath, ...supplementary];
  const allowed = documentAllowlist ? new Set(documentAllowlist) : null;
  if (allowed && allowed.size !== documentAllowlist.length) throw new Error('The hosted-document allowlist contains duplicates.');
  if (allowed) {
    const omitted = required.filter(id => !allowed.has(id));
    if (omitted.length) throw new Error(`The hosted-document allowlist omits required documents: ${omitted.join(', ')}`);
  }
  for (const id of required) documents[id] = await readDocument(id);
  const queue = required.map(id => [id, 0]);
  const seen = new Set(required);
  while (queue.length) {
    const [id, depth] = queue.shift();
    if (depth >= 2) continue;
    for (const match of documents[id].markdown.matchAll(/\[[^\]\r\n]*\]\(([^)\r\n]+)\)/g)) {
      const target = resolveDocumentLink(id, match[1].trim().replace(/^<|>$/g, ''));
      if (!target || seen.has(target) || excluded.has(target) || (allowed && !allowed.has(target))) continue;
      seen.add(target);
      try { documents[target] = await readDocument(target); queue.push([target, depth + 1]); }
      catch { /* Keep the book readable; unavailable reference links are reported in the viewer. */ }
    }
  }
  if (allowed) {
    const missing = [...allowed].filter(id => !documents[id]);
    if (missing.length) throw new Error(`The hosted-document allowlist contains documents that are missing or no longer reachable: ${missing.join(', ')}`);
  }
  const { images, files } = await readBookImages(projectRoot, { publicBase: base });
  const revisionDocuments = Object.values(documents).sort((a, b) => a.id.localeCompare(b.id)).map(({ id, title, markdown }) => ({ id, title, markdown }));
  const revisionImages = Object.values(images).sort((a, b) => a.id.localeCompare(b.id)).map(({ url: _url, ...item }) => item);
  const revisionHash = createHash('sha256').update(manifest).update(JSON.stringify(revisionDocuments)).update(JSON.stringify(revisionImages));
  for (const file of Object.values(files)) revisionHash.update(file.bytes);
  const revision = revisionHash.digest('hex');
  return { title: documents[chapterIds[0]].title, chapterIds, prototypeId: prototypePath, documents, images, revision,
    updated: Object.values(documents).map(doc => doc.modified).sort((a, b) => a.localeCompare(b)).at(-1) };
}

/** @param {{ publicBase?: string, documentAllowlist?: readonly string[] }} [options] */
export function bookLibraryPlugin({ publicBase = '/', documentAllowlist } = {}) {
  const base = normalisePagesBase(publicBase);
  const virtualId = '\0virtual:book-library';
  const route = suffix => base + suffix;
  return {
    name: 'victoria-markdown-library',
    resolveId(id) { if (id === 'virtual:book-library') return virtualId; },
    async load(id) { if (id === virtualId) return 'export default ' + JSON.stringify(await readLibrary({ publicBase: base, documentAllowlist })) + ';'; },
    async generateBundle() {
      const { files } = await readBookImages(projectRoot);
      for (const [filename, file] of Object.entries(files)) this.emitFile({ type: 'asset', fileName: 'book-assets/' + filename, source: file.bytes });
    },
    configureServer(server) {
      server.middlewares.use(route('book-assets/'), async (req, res) => {
        if (req.method !== 'GET') { res.writeHead(405).end(); return; }
        if (!['127.0.0.1:4317', 'localhost:4317'].includes(req.headers.host || '') || req.headers['sec-fetch-site'] === 'cross-site') { res.writeHead(403).end(); return; }
        try {
          if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) { res.writeHead(403).end(); return; }
          const filename = (req.url || '').split('?')[0].replace(/^\//, '');
          const { files } = await readBookImages(projectRoot);
          const file = files[filename];
          if (!file) { res.writeHead(404).end(); return; }
          res.setHeader('Content-Type', file.contentType);
          res.setHeader('Cache-Control', 'no-store');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
          res.end(file.bytes);
        } catch { res.writeHead(503).end(); }
      });
      server.middlewares.use(route('__book/library'), async (req, res) => {
        if (req.method !== 'GET') { res.writeHead(405).end(); return; }
        if (!['127.0.0.1:4317', 'localhost:4317'].includes(req.headers.host || '') || req.headers['sec-fetch-site'] === 'cross-site') { res.writeHead(403).end(); return; }
        try {
          if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) { res.writeHead(403).end(); return; }
        } catch { res.writeHead(403).end(); return; }
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Book-Reader', 'victoria-markdown-v1');
        try { res.end(JSON.stringify(await readLibrary({ publicBase: base, documentAllowlist }))); }
        catch { res.writeHead(503).end(JSON.stringify({ error: 'The Markdown files could not be read. Check the book manifest.' })); }
      });
      server.middlewares.use(route('__book/print-library'), async (req, res) => {
        if (req.method !== 'GET') { res.writeHead(405).end(); return; }
        if (!['127.0.0.1:4317', 'localhost:4317'].includes(req.headers.host || '') || req.headers['sec-fetch-site'] === 'cross-site') { res.writeHead(403).end(); return; }
        try {
          if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) { res.writeHead(403).end(); return; }
        } catch { res.writeHead(403).end(); return; }
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Book-Reader', 'victoria-print-v1');
        try { res.end(JSON.stringify(selectPrintBook(await readLibrary({ publicBase: base, documentAllowlist })))); }
        catch { res.writeHead(503).end(JSON.stringify({ error: 'The canonical working-print snapshot could not be prepared.' })); }
      });
    },
  };
}
