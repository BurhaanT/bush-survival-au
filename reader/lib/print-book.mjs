export const PRINT_WARNING = /** @type {const} */ ('WORKING EDITION — NOT FOR FIELD USE');
export const PRINT_RELEASE_GATE = /** @type {const} */ ('FIELD_READY_BUILD=NO');

export function selectPrintBook(library) {
  const edition = library.documents['book/EDITION_STATUS.md']?.markdown;
  if (!edition || !/FIELD_READY_BUILD=NO/.test(edition) || /FIELD_READY_BUILD=YES/.test(edition)) {
    throw new Error('Print view refused: FIELD_READY_BUILD=NO is missing or ambiguous.');
  }
  const chapters = library.chapterIds.map(id => {
    const document = library.documents[id];
    if (!document) throw new Error(`Print chapter is missing: ${id}`);
    return { ...document };
  });
  const updated = chapters.map(document => document.modified).sort((a, b) => a.localeCompare(b)).at(-1);
  if (!updated) throw new Error('Print view refused: no canonical chapters were supplied.');
  return { title: library.title, chapters, images: { ...library.images }, revision: library.revision, updated, editionStatus: /** @type {const} */ ('working-draft'), releaseGate: PRINT_RELEASE_GATE, warning: PRINT_WARNING };
}
