'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PrintBookData } from '@/lib/book-types';
import { BookMarkdown } from '../book-markdown';

export default function PrintBook({ book: initialBook }: { book: PrintBookData }) {
  const isLive = import.meta.env.DEV;
  const [book, setBook] = useState(initialBook);
  const [snapshotState, setSnapshotState] = useState<'loading' | 'current' | 'saved'>(isLive ? 'loading' : 'saved');
  const [snapshotError, setSnapshotError] = useState('');
  const expectedChapterIds = useRef(initialBook.chapters.map(chapter => chapter.id).join('\n'));
  const root = useRef<HTMLElement>(null);
  const decodeKey = useRef('');
  const [fontsReady, setFontsReady] = useState(false);
  const [assetState, setAssetState] = useState({ ready: false, loaded: 0, expected: 0, failed: 0 });
  const auditAssets = useCallback(() => {
    const element = root.current;
    if (!element) return;
    const figures = [...element.querySelectorAll<HTMLElement>('[data-asset-id]')];
    const frames = [...element.querySelectorAll<HTMLImageElement>('img[data-print-frame]')];
    const expected = figures.reduce((total, figure) => total + Number(figure.dataset.printFrameCount || 0), 0);
    const loaded = frames.filter(image => image.complete && image.naturalWidth > 0).length;
    const unavailable = element.querySelectorAll('.image-pending,.figure-page-not-ready,.figure-load-error').length;
    const failed = figures.filter(figure => figure.dataset.imageState === 'failed').length + unavailable;
    const complete = expected > 0 && frames.length === expected && loaded === expected && failed === 0;
    if (!complete) {
      decodeKey.current = '';
      setAssetState({ ready: false, loaded, expected, failed });
      return;
    }
    const key = `${book.revision}:${expected}:${frames.length}`;
    if (decodeKey.current === key) return;
    decodeKey.current = key;
    setAssetState({ ready: false, loaded, expected, failed: 0 });
    void Promise.all(frames.map(image => image.decode())).then(() => {
      if (decodeKey.current === key) setAssetState({ ready: true, loaded, expected, failed: 0 });
    }).catch(() => {
      if (decodeKey.current === key) setAssetState({ ready: false, loaded, expected, failed: 1 });
    });
  }, [book.revision]);
  const scheduleAudit = useCallback(() => { requestAnimationFrame(auditAssets); }, [auditAssets]);
  const refreshSnapshot = useCallback(async () => {
    if (!isLive) { setSnapshotState('saved'); return; }
    setSnapshotState('loading');
    setSnapshotError('');
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}__book/print-library`, { cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Live print snapshot unavailable.');
      const candidate = await response.json() as PrintBookData;
      if (candidate.releaseGate !== 'FIELD_READY_BUILD=NO' || candidate.editionStatus !== 'working-draft' || candidate.warning !== 'WORKING EDITION — NOT FOR FIELD USE' || candidate.chapters?.map(chapter => chapter.id).join('\n') !== expectedChapterIds.current || !candidate.images) throw new Error('Live print snapshot failed its release gate or canonical chapter check.');
      setBook(candidate);
      setSnapshotState('current');
    } catch (error) {
      setSnapshotError(error instanceof Error ? error.message : 'Live print snapshot unavailable.');
      setSnapshotState('saved');
    }
  }, [isLive]);
  useEffect(() => {
    if (!isLive) return;
    const frame = requestAnimationFrame(() => { void refreshSnapshot(); });
    return () => cancelAnimationFrame(frame);
  }, [isLive, refreshSnapshot]);
  useEffect(() => {
    let active = true;
    const frame = requestAnimationFrame(auditAssets);
    const observer = new MutationObserver(auditAssets);
    if (root.current) observer.observe(root.current, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-image-state'] });
    void document.fonts.ready.then(() => { if (active) { setFontsReady(true); auditAssets(); } });
    return () => { active = false; cancelAnimationFrame(frame); observer.disconnect(); };
  }, [auditAssets]);
  const ready = !snapshotError && snapshotState !== 'loading' && fontsReady && assetState.ready;
  const updated = isLive ? new Intl.DateTimeFormat('en-AU', { dateStyle: 'long', timeZone: 'Australia/Melbourne' }).format(new Date(book.updated)) : 'Build-time Markdown snapshot';
  const printLinks = Object.fromEntries(book.chapters.map((document, index) => {
    const number = String(index).padStart(2, '0');
    return [document.id, { chapterAnchor: `print-chapter-${number}`, headingPrefix: `print-${number}-` }];
  }));
  return <div className="print-book-shell">
    <nav className="print-screen-tools" aria-label="Print preview controls">
      <a href={import.meta.env.BASE_URL}>Back to reader</a>
      <button type="button" className="print-refresh" disabled={!isLive || snapshotState === 'loading'} onClick={() => void refreshSnapshot()}>{isLive ? 'Reload Markdown' : 'Saved Markdown build'}</button>
      <output className={`print-asset-state${ready ? ' is-ready' : ''}`}>{snapshotError ? `Print snapshot blocked — ${snapshotError}` : snapshotState === 'loading' ? 'Refreshing canonical Markdown snapshot' : ready ? `${assetState.loaded} image panels and fonts ready${snapshotState === 'saved' ? ' · saved build snapshot' : ''}` : assetState.failed ? `${assetState.failed} image or registered placement failure${assetState.failed === 1 ? '' : 's'}` : `Preparing fonts and images ${assetState.loaded}/${assetState.expected || '…'}`}</output>
      <button type="button" disabled={!ready} onClick={() => window.print()}>Print or save marked draft</button>
    </nav>
    <main className="print-book" aria-label="Complete working field-guide print view" ref={root} onLoadCapture={scheduleAudit} onErrorCapture={scheduleAudit}>
      <section className="print-cover">
        <p className="print-cover-kicker">VICTORIA · PERSONAL WORKING EDITION</p>
        <h1>{book.title}</h1>
        <p className="print-cover-warning">{book.warning}</p>
        <p>This document renders the 15 canonical Markdown chapters in their manifest order. Independent specialist review, reader testing, final pagination and physical print proof remain incomplete.</p>
        <dl>
          <div><dt>Revision</dt><dd>{book.revision.slice(0, 12)}</dd></div>
          <div><dt>{isLive ? 'Latest source-file time' : 'Snapshot type'}</dt><dd>{updated}</dd></div>
          <div><dt>Release gate</dt><dd>{book.releaseGate}</dd></div>
        </dl>
      </section>
      <section className="print-toc" aria-labelledby="print-contents-heading">
        <p className="print-cover-kicker">WORKING CONTENTS</p>
        <h2 id="print-contents-heading">Contents</h2>
        <p>Page numbers will be added only after final pagination. Select a section while reviewing on screen.</p>
        <ol>{book.chapters.map((doc, index) => <li key={doc.id}><a href={`#print-chapter-${String(index).padStart(2, '0')}`}><span>{String(index).padStart(2, '0')}</span>{doc.title}</a></li>)}</ol>
      </section>
      {book.chapters.map((doc, index) => <section className="print-chapter" id={`print-chapter-${String(index).padStart(2, '0')}`} data-chapter-id={doc.id} data-chapter-index={String(index).padStart(2, '0')} key={doc.id}>
        <div className="print-chapter-label">SECTION {String(index).padStart(2, '0')} · WORKING DRAFT</div>
        <div className="print-chapter-warning">{book.warning} · {book.releaseGate}</div>
        <article className="book-prose" aria-label={doc.title}>
          <BookMarkdown doc={doc} images={book.images} presentation="print" headingPrefix={`print-${String(index).padStart(2, '0')}-`} printLinks={printLinks} />
        </article>
      </section>)}
      <div className={`print-readiness-warning${ready ? ' is-ready' : ''}`} role="alert">PRINT LOAD CHECK INCOMPLETE — the Markdown snapshot, fonts or image panels may be missing. Cancel printing and wait for the ready message above.</div>
    </main>
    <div className="print-draft-footer" aria-hidden="true">WORKING DRAFT · NOT FOR EMERGENCY USE</div>
  </div>;
}
