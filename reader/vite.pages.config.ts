import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { bookLibraryPlugin } from './lib/book-library.mjs';
import { resolvePagesBase } from './lib/pages-base.mjs';
import { pagesPublicDocuments } from './lib/pages-public-documents.mjs';

const readerRoot = fileURLToPath(new URL('.', import.meta.url));
const pagesBase = resolvePagesBase({
  explicit: process.env.PAGES_BASE_PATH,
  repository: process.env.GITHUB_REPOSITORY,
});

export default defineConfig({
  appType: 'mpa',
  base: pagesBase,
  css: { postcss: { plugins: [tailwindcss()] } },
  publicDir: 'public',
  resolve: { alias: { '@': readerRoot } },
  plugins: [bookLibraryPlugin({ publicBase: pagesBase, documentAllowlist: pagesPublicDocuments }), react()],
  build: {
    outDir: 'dist-pages',
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        reader: fileURLToPath(new URL('index.html', import.meta.url)),
        print: fileURLToPath(new URL('print/index.html', import.meta.url)),
      },
    },
  },
});
