import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import { bookLibraryPlugin } from './lib/book-library.mjs';

// The local reader needs the actual Markdown, not a hosted worker filesystem.
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  server: { host: '127.0.0.1', port: 4317, strictPort: true },
  plugins: [bookLibraryPlugin(), vinext()],
});
