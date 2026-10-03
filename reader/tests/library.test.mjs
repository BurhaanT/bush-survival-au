import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { readLibrary, parseManifest, resolveDocumentLink, projectRoot, prototypePath, bookLibraryPlugin } from '../lib/book-library.mjs';
import { parseSvgIntrinsicSize, parseSvgViewBox, readBookImages, validatePageSliceNotes, validatePageSlices } from '../lib/book-images.mjs';
import { PRINT_RELEASE_GATE, PRINT_WARNING, selectPrintBook } from '../lib/print-book.mjs';
import { normalisePagesBase, resolvePagesBase } from '../lib/pages-base.mjs';
import { pagesPublicDocuments } from '../lib/pages-public-documents.mjs';

test('GitHub Pages base paths cover root, project and configured sites', () => {
  assert.equal(normalisePagesBase('/'), '/');
  assert.equal(normalisePagesBase('victoria-guide'), '/victoria-guide/');
  assert.equal(resolvePagesBase({ repository: 'reader/victoria-guide' }), '/victoria-guide/');
  assert.equal(resolvePagesBase({ repository: 'reader/reader.github.io' }), '/');
  assert.equal(resolvePagesBase({ explicit: '/', repository: 'reader/victoria-guide' }), '/');
  assert.throws(() => normalisePagesBase('/../unsafe/'), /safe absolute URL path/);
  assert.throws(() => normalisePagesBase('/unsafe?query/'), /safe absolute URL path/);
});

test('Pages workflow follows GitHub\'s reported base path behind an explicit deploy gate', async () => {
  const workflow = await readFile(path.join(projectRoot, '.github/workflows/deploy-pages.yml'), 'utf8');
  assert.doesNotMatch(workflow, /Require a site-root Pages URL/);
  assert.match(workflow, /Report Pages target and visibility/);
  assert.match(workflow, /REPORTED_PAGES_BASE_URL: \$\{\{ steps\.pages\.outputs\.base_url \}\}/);
  assert.match(workflow, /REPORTED_PAGES_BASE_PATH: \$\{\{ steps\.pages\.outputs\.base_path \}\}/);
  assert.equal((workflow.match(/PAGES_BASE_PATH: \$\{\{ steps\.pages\.outputs\.base_path \}\}\//g) || []).length, 2);
  assert.equal((workflow.match(/\$GITHUB_API_URL\/repos\/\$GITHUB_REPOSITORY\/pages/g) || []).length, 1);
  assert.match(workflow, /jq -er 'if \(has\("public"\) and \(\.public \| type == "boolean"\)\) then \(\.public \| tostring\)/);
  assert.match(workflow, /if \[\[ "\$pages_public" == "true" \]\]/);
  assert.match(workflow, /Pages site as publicly accessible/);
  assert.doesNotMatch(workflow, /PAGES_BASE_PATH: \/bush-survival-au\//);
  assert.match(workflow, /if: \$\{\{ vars\.PUBLISH_BOOK_READER == 'YES' \}\}/);
  assert.match(workflow, /path: reader\/dist-pages/);
});

test('hosted library snapshots prefix every image with the GitHub Pages base', async () => {
  const [library, rootLibrary] = await Promise.all([
    readLibrary({ publicBase: '/victoria-guide/', documentAllowlist: pagesPublicDocuments }),
    readLibrary({ documentAllowlist: pagesPublicDocuments }),
  ]);
  assert.equal(library.revision, rootLibrary.revision, 'deployment paths must not change the content revision');
  for (const item of Object.values(library.images)) {
    assert.match(item.url, new RegExp('^/victoria-guide/book-assets/' + item.filename.replace('.', '\\.') + '\\?v=[0-9a-f]{12}$'));
  }
});

test('hosted Markdown is limited to the reviewed publication allowlist', async () => {
  const library = await readLibrary({ documentAllowlist: pagesPublicDocuments });
  assert.equal(pagesPublicDocuments.length, 61);
  assert.deepEqual(Object.keys(library.documents).sort(), [...pagesPublicDocuments].sort());
  await assert.rejects(
    readLibrary({ documentAllowlist: pagesPublicDocuments.filter(id => id !== library.chapterIds[0]) }),
    /omits required documents/,
  );
  await assert.rejects(
    readLibrary({ documentAllowlist: [...pagesPublicDocuments, 'PROJECT_BRIEF.md'] }),
    /missing or no longer reachable/,
  );
});

test('manifest determines all 15 chapters in their exact order', async () => {
  const manifest = await readFile(path.join(projectRoot, 'book/MANIFEST.md'), 'utf8');
  const library = await readLibrary();
  assert.deepEqual(library.chapterIds, parseManifest(manifest));
  assert.equal(library.chapterIds.length, 15);
});

test('every chapter is the actual unchanged Markdown, not a separately authored copy', async () => {
  const library = await readLibrary();
  for (const id of library.chapterIds) assert.equal(library.documents[id].markdown, await readFile(path.join(projectRoot, id), 'utf8'));
});

test('print projection contains only the 15 canonical chapters in manifest order', async () => {
  const library = await readLibrary();
  const originalDocuments = library.documents;
  const originalImages = library.images;
  const printBook = selectPrintBook(library);
  assert.deepEqual(Object.keys(printBook).sort(), ['chapters', 'editionStatus', 'images', 'releaseGate', 'revision', 'title', 'updated', 'warning']);
  assert.deepEqual(printBook.chapters.map(document => document.id), library.chapterIds);
  assert.equal(printBook.chapters.length, 15);
  for (const document of printBook.chapters) assert.equal(document.markdown, await readFile(path.join(projectRoot, document.id), 'utf8'));
  assert.equal('documents' in printBook, false);
  assert.equal('prototypeId' in printBook, false);
  assert.equal(printBook.editionStatus, 'working-draft');
  assert.equal(printBook.releaseGate, PRINT_RELEASE_GATE);
  assert.equal(printBook.warning, PRINT_WARNING);
  assert.equal(printBook.releaseGate, 'FIELD_READY_BUILD=NO');
  assert.equal(printBook.warning, 'WORKING EDITION — NOT FOR FIELD USE');
  assert.equal(library.documents, originalDocuments);
  assert.equal(library.images, originalImages);
  assert.notEqual(printBook.images, library.images);
  assert.notEqual(printBook.chapters[0], library.documents[library.chapterIds[0]]);
});

test('print projection fails closed if a chapter or the working-edition gate is missing or ambiguous', async () => {
  const library = await readLibrary();
  const missingChapter = { ...library, documents: { ...library.documents } };
  delete missingChapter.documents[library.chapterIds[3]];
  assert.throws(() => selectPrintBook(missingChapter), new RegExp(library.chapterIds[3].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  const missingGate = { ...library, documents: { ...library.documents, 'book/EDITION_STATUS.md': { ...library.documents['book/EDITION_STATUS.md'], markdown: '# status' } } };
  assert.throws(() => selectPrintBook(missingGate), /FIELD_READY_BUILD=NO/);
  const ambiguousGate = { ...library, documents: { ...library.documents, 'book/EDITION_STATUS.md': { ...library.documents['book/EDITION_STATUS.md'], markdown: 'FIELD_READY_BUILD=NO\nFIELD_READY_BUILD=YES' } } };
  assert.throws(() => selectPrintBook(ambiguousGate), /missing or ambiguous/);
});

test('the longer review prototype remains separate and keeps all ten warnings', async () => {
  const library = await readLibrary();
  assert.equal(library.chapterIds.includes(prototypePath), false);
  assert.equal(library.prototypeId, prototypePath);
  assert.equal((library.documents[prototypePath].markdown.match(/REVIEW COPY — NOT EMERGENCY GUIDANCE/g) || []).length, 10);
});

test('source register and edition controls are available without importing private enquiry drafts', async () => {
  const library = await readLibrary();
  assert.ok(library.documents['SOURCE_REGISTER.md']);
  assert.match(library.documents['book/EDITION_STATUS.md'].markdown, /FIELD_READY_BUILD=NO/);
  assert.equal(library.documents['research/reviewer-briefs/INITIAL_REVIEW_ENQUIRIES.md'], undefined);
  assert.equal(library.documents['COMMERCIAL_MODEL.md'], undefined);
});

test('revision is stable if the files have not changed', async () => {
  const first = await readLibrary();
  const second = await readLibrary();
  assert.equal(first.revision, second.revision);
  assert.match(first.revision, /^[a-f0-9]{64}$/);
});

test('invalid and duplicate manifest paths fail clearly', () => {
  assert.throws(() => parseManifest(''), /empty/);
  assert.throws(() => parseManifest('`chapters/a.md`\n`chapters/a.md`'), /duplicate/);
  assert.throws(() => parseManifest('`chapters/../../secret.md`'), /Invalid/);
});

test('relative links resolve from the source chapter, not the webpage URL', () => {
  assert.equal(resolveDocumentLink('book/chapters/00-front-matter.md', '../../CONTENT_VALIDATION_GATE.md'), 'CONTENT_VALIDATION_GATE.md');
  assert.equal(resolveDocumentLink('book/chapters/00-front-matter.md', '#purpose'), 'book/chapters/00-front-matter.md');
  assert.equal(resolveDocumentLink('book/chapters/08-fire.md', '../../research/evidence-packets/EP-015-bushfire-threat-and-last-resort-shelter.md'), 'research/evidence-packets/EP-015-bushfire-threat-and-last-resort-shelter.md');
});

test('file traversal, encoded Windows paths, hidden folders and outside schemes are rejected', () => {
  for (const target of ['../../../../secret.md', '%2e%2e/%2e%2e/%2e%2e/secret.md', 'C:\\secret.md', '/secret.md', 'file:///secret.md', 'javascript:alert(1)', '//outside.example/file.md', '../../.codex/secret.md', '../../reader/node_modules/secret.md', '%00.md', '%E0%A4%A']) {
    assert.equal(resolveDocumentLink('book/chapters/a.md', target), null, target);
  }
});

test('GitHub-flavoured Markdown preserves lists, tables, warnings and emphasis', () => {
  const text = '# Test\n\n> **REVIEW COPY**\n\n1. One\n2. Two\n\n| A | B |\n|---|---|\n| 1 | 2 |';
  const html = renderToStaticMarkup(createElement(Markdown, { children: text, remarkPlugins: [remarkGfm], skipHtml: true }));
  for (const expected of ['<h1>Test</h1>', '<blockquote>', '<strong>REVIEW COPY</strong>', '<ol>', '<table>']) assert.ok(html.includes(expected), expected);
});

test('raw HTML and executable link schemes are not enabled', () => {
  const text = '<script>alert(1)</script>\n\n[unsafe](javascript:alert%281%29)';
  const html = renderToStaticMarkup(createElement(Markdown, { children: text, remarkPlugins: [remarkGfm], skipHtml: true }));
  assert.equal(html.includes('<script'), false);
  assert.equal(html.includes('javascript:'), false);
});

async function callEndpoint(request, endpoint = '/__book/library') {
  let handler;
  bookLibraryPlugin().configureServer({ middlewares: { use(route, callback) { if (route === endpoint) handler = callback; } } });
  const response = { status: 200, headers: {}, body: '', setHeader(key, value) { this.headers[key] = value; }, writeHead(status) { this.status = status; return this; }, end(body = '') { this.body = body; } };
  await handler(request, response);
  return response;
}

test('local content endpoint is read-only and rejects foreign origins/hosts', async () => {
  assert.equal((await callEndpoint({ method: 'POST', headers: { host: '127.0.0.1:4317' } })).status, 405);
  assert.equal((await callEndpoint({ method: 'GET', headers: { host: 'attacker.example' } })).status, 403);
  assert.equal((await callEndpoint({ method: 'GET', headers: { host: '127.0.0.1:4317', origin: 'https://attacker.example' } })).status, 403);
  assert.equal((await callEndpoint({ method: 'GET', headers: { host: '127.0.0.1:4317', 'sec-fetch-site': 'cross-site' } })).status, 403);
});

test('local content endpoint returns current Markdown and prevents caching', async () => {
  const response = await callEndpoint({ method: 'GET', headers: { host: '127.0.0.1:4317' } });
  assert.equal(response.status, 200);
  assert.equal(response.headers['Cache-Control'], 'no-store');
  const library = JSON.parse(response.body);
  assert.equal(library.chapterIds.length, 15);
  assert.equal(library.documents[library.chapterIds[0]].markdown, await readFile(path.join(projectRoot, library.chapterIds[0]), 'utf8'));
});

test('local print endpoint returns only the current fail-closed canonical projection', async () => {
  const headers = { host: '127.0.0.1:4317' };
  assert.equal((await callEndpoint({ method: 'POST', headers }, '/__book/print-library')).status, 405);
  assert.equal((await callEndpoint({ method: 'GET', headers: { host: 'attacker.example' } }, '/__book/print-library')).status, 403);
  const response = await callEndpoint({ method: 'GET', headers }, '/__book/print-library');
  assert.equal(response.status, 200);
  assert.equal(response.headers['Cache-Control'], 'no-store');
  assert.equal(response.headers['X-Book-Reader'], 'victoria-print-v1');
  const printBook = JSON.parse(response.body);
  assert.equal(printBook.releaseGate, 'FIELD_READY_BUILD=NO');
  assert.equal(printBook.editionStatus, 'working-draft');
  assert.equal(printBook.chapters.length, 15);
  assert.equal('documents' in printBook, false);
  assert.equal('prototypeId' in printBook, false);
});

test('all registered working images have files, warnings, attribution and source records', async () => {
  const { images, files } = await readBookImages(projectRoot);
  assert.equal(Object.keys(images).length, 149);
  for (const item of Object.values(images)) {
    assert.equal(item.status, 'working-draft');
    for (const field of ['registerId', 'caption', 'credit', 'source', 'licence', 'limit']) assert.ok(item[field], field);
    assert.ok(files[item.filename].bytes.length > 500);
    assert.match(files[item.filename].contentType, /^image\//);
    assert.ok(item.source.startsWith('https://'));
    assert.match(item.url, new RegExp('^/book-assets/' + item.filename.replace('.', '\\.') + '\\?v=[0-9a-f]{12}$'));
  }
});

test('page-slice metadata covers every portrait SVG with semantic context', async () => {
  const { images } = await readBookImages(projectRoot);
  const diagrams = Object.values(images).filter(item => item.filename.endsWith('.svg'));
  const portrait = diagrams.filter(item => item.pageLayoutRequired);
  assert.equal(diagrams.length, 50);
  assert.equal(portrait.length, 40);
  assert.equal(portrait.filter(item => item.pageSlices).length, 40);
  for (const item of portrait) {
    assert.equal(item.pageSlices[0], item.viewBox.y, item.filename);
    assert.equal(item.pageSlices.at(-1), item.viewBox.y + item.viewBox.height, item.filename);
    assert.equal(item.pageSliceNotes.length, item.pageSlices.length - 1, item.filename);
  }
  assert.equal(portrait.reduce((total, item) => total + item.pageSlices.length - 1, 0), 123);
  assert.equal(Object.values(images).reduce((total, item) => total + (item.pageSlices ? item.pageSlices.length - 1 : 1), 0), 232);
  assert.deepEqual(images['book/assets/sheet-shelter-setup-card.svg'].pageSlices, [0, 560, 1205, 2235, 3275, 4200]);
  assert.deepEqual(images['book/assets/warrigal-bower-stop-check.svg'].pageSlices, [0, 900, 1800]);
  assert.deepEqual(images['book/assets/asthma-first-aid-card.svg'].pageSlices, [0, 1000, 1900, 2700]);
  assert.deepEqual(images['book/assets/burn-first-aid-card.svg'].pageSlices, [0, 900, 1800, 2700]);
  assert.deepEqual(images['book/assets/first-actions-card.svg'].pageSlices, [0, 900, 1800, 2700]);
  assert.deepEqual(images['book/assets/serious-deterioration-action-card.svg'].pageSlices, [0, 900, 1800, 2700]);
  assert.deepEqual(images['book/assets/layered-signalling-safe-site-card.svg'].pageSlices, [0, 900, 1800, 2700]);
  assert.deepEqual(images['book/assets/rabbit-food-gate.svg'].pageSlices, [0, 900, 1800]);
  assert.deepEqual(images['book/assets/emergency-rabbit-snare-card.svg'].pageSlices, [0, 900, 1800, 2700, 3600]);
  assert.equal(images['book/assets/rabbit-snare-construction-diagram.svg'].pageLayoutRequired, false);
  assert.equal(images['book/assets/rabbit-snare-placement-diagram.svg'].pageLayoutRequired, false);
  assert.equal(images['book/assets/bower-spinach-fruit-beaumaris.jpg'].licence, 'CC BY-NC 4.0; personal non-commercial edition only');
});

test('semantic image crops cannot be internally scrolled away from their registered boundary', async () => {
  const css = await readFile(path.join(projectRoot, 'reader/app/globals.css'), 'utf8');
  assert.match(css, /\.figure-crop\s*\{[^}]*overflow:\s*clip;/);
  assert.match(css, /\.figure-crop>img\s*\{[^}]*position:\s*absolute;[^}]*top:\s*0;/);
});

test('invalid SVG page slicing fails closed', () => {
  const viewBox = parseSvgViewBox('<svg viewBox="0 0 1000 2000"></svg>');
  assert.deepEqual(viewBox, { x: 0, y: 0, width: 1000, height: 2000 });
  assert.deepEqual(parseSvgIntrinsicSize('<svg width="1000" height="2000" viewBox="0 0 1000 2000"></svg>'), { width: 1000, height: 2000 });
  assert.throws(() => parseSvgIntrinsicSize('<svg viewBox="0 0 1000 2000"></svg>'), /unitless width and height/);
  assert.deepEqual(validatePageSlices('card.svg', viewBox, [0, 900, 2000]), [0, 900, 2000]);
  assert.deepEqual(validatePageSliceNotes([0, 900, 2000], ['Start here.', 'Continue only from the first panel.']), ['Start here.', 'Continue only from the first panel.']);
  assert.throws(() => validatePageSlices('card.png', viewBox, [0, 1000, 2000]), /require an SVG/);
  assert.throws(() => validatePageSlices('card.svg', viewBox, [1, 1000, 2000]), /complete SVG/);
  assert.throws(() => validatePageSlices('card.svg', viewBox, [0, 1200, 2000]), /too tall/);
  assert.throws(() => validatePageSliceNotes([0, 900, 2000], ['Only one note.']), /Every page slice/);
});

test('every chapter image resolves to its canonical registered local asset', async () => {
  const library = await readLibrary();
  let count = 0;
  const referenced = new Set();
  for (const id of library.chapterIds) {
    for (const match of library.documents[id].markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(id), match[1]));
      assert.ok(library.images[target], target);
      referenced.add(target);
      count++;
    }
  }
  assert.equal(count, 149);
  assert.equal(referenced.size, 149);
  assert.deepEqual([...referenced].sort(), Object.keys(library.images).sort());
});

test('registered image endpoint returns exact bytes and does not expose arbitrary paths', async () => {
  const headers = { host: '127.0.0.1:4317' };
  const response = await callEndpoint({ method: 'GET', headers, url: '/shelter-section.svg' }, '/book-assets/');
  assert.equal(response.status, 200);
  assert.equal(response.headers['Content-Type'], 'image/svg+xml');
  assert.equal(response.headers['Cache-Control'], 'no-store');
  assert.deepEqual(response.body, await readFile(path.join(projectRoot, 'book/assets/shelter-section.svg')));
  for (const url of ['/manifest.json', '/../../SOURCE_REGISTER.md', '/%2e%2e/secret.svg', '/missing.svg', '/constructor', '/__proto__']) {
    assert.equal((await callEndpoint({ method: 'GET', headers, url }, '/book-assets/')).status, 404, url);
  }
});

test('image endpoint rejects writes and foreign-site requests', async () => {
  const endpoint = '/book-assets/';
  const url = '/adult-cpr-hands.png';
  assert.equal((await callEndpoint({ method: 'POST', url, headers: { host: '127.0.0.1:4317' } }, endpoint)).status, 405);
  for (const headers of [{ host: 'evil.example' }, { host: '127.0.0.1:4317', origin: 'https://evil.example' }, { host: '127.0.0.1:4317', 'sec-fetch-site': 'cross-site' }]) {
    assert.equal((await callEndpoint({ method: 'GET', url, headers }, endpoint)).status, 403);
  }
});

test('production bundle emits all 149 registered image files without a second asset collection', async () => {
  const emitted = [];
  await bookLibraryPlugin().generateBundle.call({ emitFile(item) { emitted.push(item); } });
  assert.equal(emitted.length, 149);
  for (const item of emitted) {
    assert.equal(item.type, 'asset');
    assert.deepEqual(item.source, await readFile(path.join(projectRoot, 'book/assets', path.basename(item.fileName))));
  }
});
