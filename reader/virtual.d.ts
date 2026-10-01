/// <reference types="vite/client" />
declare module 'virtual:book-library' {
  const library: import('./lib/book-types').BookLibrary;
  export default library;
}
