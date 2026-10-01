import { spawn } from 'node:child_process';
import { mkdirSync, openSync, closeSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const readerRoot = path.dirname(fileURLToPath(import.meta.url));
const url = 'http://127.0.0.1:4317/';
const noOpen = process.argv.includes('--no-open');

async function isRunning() {
  let response;
  try { response = await fetch(url + '__book/library', { signal: AbortSignal.timeout(1500) }); }
  catch { return false; }
  if (response.headers.get('X-Book-Reader') !== 'victoria-markdown-v1') throw new Error('Port 4317 is being used by a different application. No process has been stopped.');
  if (!response.ok) throw new Error('The reader is running but cannot read the Markdown. Check the book manifest and reader logs.');
  await response.body?.cancel();
  return true;
}

try {
  if (!await isRunning()) {
    const cli = path.join(readerRoot, 'node_modules/vinext/dist/cli.js');
    if (!existsSync(cli)) throw new Error('Reader dependencies are missing. Ask for the reader to be set up again.');
    const logRoot = path.join(readerRoot, '.reader-logs');
    mkdirSync(logRoot, { recursive: true });
    const output = openSync(path.join(logRoot, 'server.log'), 'a');
    const errors = openSync(path.join(logRoot, 'errors.log'), 'a');
    const child = spawn(process.execPath, [cli, 'dev'], { cwd: readerRoot, detached: true, windowsHide: true, stdio: ['ignore', output, errors] });
    child.on('error', error => { console.error(error.message); process.exitCode = 1; });
    child.unref(); closeSync(output); closeSync(errors);
    const until = Date.now() + 30_000;
    let ready = false;
    while (Date.now() < until) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (await isRunning()) { ready = true; break; }
    }
    if (!ready) throw new Error('The reader did not start. Check reader/.reader-logs/errors.log.');
  }
  if (!noOpen) {
    const browser = spawn('rundll32.exe', ['url.dll,FileProtocolHandler', url], { detached: true, windowsHide: true, stdio: 'ignore' });
    browser.on('error', error => { console.error(error.message); process.exitCode = 1; });
    browser.unref();
  }
  console.log('Book reader ready at ' + url);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
