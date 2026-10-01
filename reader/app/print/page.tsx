import library from 'virtual:book-library';
import { selectPrintBook } from '@/lib/print-book.mjs';
import PrintBook from './print-book';

export default function PrintPage() {
  return <PrintBook book={selectPrintBook(library)} />;
}
