import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import library from 'virtual:book-library';
import BookReader from './app/reader';
import './app/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('The book reader root is missing.');

createRoot(root).render(<StrictMode><BookReader initialLibrary={library} /></StrictMode>);
