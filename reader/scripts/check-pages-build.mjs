import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolvePagesBase } from '../lib/pages-base.mjs';
import { readLibrary } from '../lib/book-library.mjs';
import { pagesPublicDocuments } from '../lib/pages-public-documents.mjs';

const readerRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(readerRoot, 'dist-pages');
const base = resolvePagesBase({ explicit: process.env.PAGES_BASE_PATH, repository: process.env.GITHUB_REPOSITORY });
const readOutput = relative => readFile(path.join(output, relative), 'utf8');

const [readerHtml, printHtml, manifestText] = await Promise.all([
  readOutput('index.html'),
  readOutput('print/index.html'),
  readFile(path.resolve(readerRoot, '../book/assets/manifest.json'), 'utf8'),
]);

const hostedLibrary = await readLibrary({ publicBase: base, documentAllowlist: pagesPublicDocuments });
assert.equal(pagesPublicDocuments.length, 64, 'The publication allowlist count changed and requires an explicit rights/disclosure review.');
assert.deepEqual(Object.keys(hostedLibrary.documents).sort(), [...pagesPublicDocuments].sort(), 'The hosted Markdown set must match the reviewed publication allowlist exactly.');

for (const [name, html] of [['reader', readerHtml], ['print', printHtml]]) {
  assert.match(html, /<div id="root"><\/div>/, `${name} root`);
  assert.ok(html.includes(`${base}favicon.svg`), `${name} favicon must use the Pages base`);
  assert.ok(html.includes(`${base}assets/`), `${name} bundle must use the Pages base`);
  assert.equal(html.includes('/_next/'), false, `${name} must not require the server build`);
}

await stat(path.join(output, '.nojekyll'));
const expected = JSON.parse(manifestText).images.map(item => item.filename).sort();
const emitted = (await readdir(path.join(output, 'book-assets'))).sort();
assert.deepEqual(emitted, expected, 'Every registered image must be deployed exactly once.');

const assetDirectory = path.join(output, 'assets');
const javascript = (await Promise.all((await readdir(assetDirectory)).filter(name => name.endsWith('.js')).map(name => readFile(path.join(assetDirectory, name), 'utf8')))).join('\n');
assert.ok(javascript.includes(`${base}book-assets/`), 'Embedded Markdown snapshot must use the Pages asset base.');
if (base !== '/') assert.equal(/["']\/book-assets\//.test(javascript), false, 'Repository-site build must not contain root-only book asset URLs.');

console.log(`PASS - GitHub Pages static build: ${expected.length} assets at ${base}`);
