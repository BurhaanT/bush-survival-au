import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import library from 'virtual:book-library';
import { selectPrintBook } from './lib/print-book.mjs';
import PrintBook from './app/print/print-book';
import './app/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('The print-view root is missing.');

createRoot(root).render(<StrictMode><PrintBook book={selectPrintBook(library)} /></StrictMode>);
