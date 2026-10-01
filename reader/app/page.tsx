import library from 'virtual:book-library';
import BookReader from './reader';
export default function Home() { return <BookReader initialLibrary={library} />; }
