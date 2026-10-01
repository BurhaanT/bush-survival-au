'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, FileText, PanelLeft, RefreshCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import type { BookDocument, BookLibrary } from '@/lib/book-types';
import { BookMarkdown, cleanHeading, resolveLink, slug } from './book-markdown';

type Panel = { id: string; raw?: boolean; anchor?: string } | null;
function Contents({ library, current, navigate, openPanel }: { library: BookLibrary; current: string; navigate: (id: string) => void; openPanel: (panel: Panel) => void }) {
  const { setOpenMobile } = useSidebar();
  const choose = (id: string) => { navigate(id); setOpenMobile(false); };
  return <Sidebar className="book-sidebar">
    <SidebarHeader className="reader-brand"><BookOpen size={25} strokeWidth={1.5} /><div><strong>Victoria</strong><span>BUSH SURVIVAL FIELD GUIDE</span></div></SidebarHeader>
    <SidebarContent><nav aria-label="Table of contents" className="toc">
      <div className="toc-label">CONTENTS <span>{library.chapterIds.length} sections</span></div>
      <SidebarMenu>{library.chapterIds.map((id, index) => <SidebarMenuItem key={id}>
        <SidebarMenuButton isActive={current === id} className="chapter-link" onClick={() => choose(id)} aria-current={current === id ? 'page' : undefined}>
          <span className="chapter-number">{String(index).padStart(2, '0')}</span><span>{index === 0 ? 'Introduction' : library.documents[id].title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>)}</SidebarMenu>
      <div className="toc-label review-label">SEPARATE REVIEW MATERIAL</div>
      <SidebarMenu><SidebarMenuItem><SidebarMenuButton className="chapter-link review-link" isActive={current === library.prototypeId} onClick={() => choose(library.prototypeId)} aria-current={current === library.prototypeId ? 'page' : undefined}>
        <FileText size={17} /><span>Emergency core draft<small>Not part of the book</small></span>
      </SidebarMenuButton></SidebarMenuItem></SidebarMenu>
    </nav></SidebarContent>
    <SidebarFooter className="toc-footer"><span className="draft-dot" /><span>Personal working edition</span><Button variant="ghost" onClick={() => openPanel({ id: 'book/EDITION_STATUS.md' })}>Status</Button></SidebarFooter>
  </Sidebar>;
}
function MenuButton() { const { toggleSidebar } = useSidebar(); return <Button variant="ghost" className="contents-button" onClick={toggleSidebar}><PanelLeft size={17} /><span>Contents</span></Button>; }

function Paper({ doc, mode, heading, anchor, children }: { doc: BookDocument; mode: string; heading: string; anchor: string; children: ReactNode }) {
  const columns = useRef<HTMLDivElement>(null), viewport = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0), [pages, setPages] = useState(1), [step, setStep] = useState(0);
  const paged = mode === 'pages';
  useEffect(() => {
    const el = columns.current, windowEl = viewport.current;
    if (!el || !windowEl) return;
    const measure = () => {
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const distance = el.clientWidth + gap;
      const count = paged && distance ? Math.max(1, Math.round((el.scrollWidth + gap) / distance)) : 1;
      setStep(distance); setPages(count); setPage(p => Math.min(p, count - 1));
    };
    const observer = new ResizeObserver(measure); observer.observe(windowEl);
    const mutations = new MutationObserver(measure); mutations.observe(el, { childList: true, subtree: true, characterData: true });
    el.addEventListener('load', measure, true);
    el.addEventListener('error', measure, true);
    const frame = requestAnimationFrame(measure);
    void document.fonts.ready.then(measure);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); mutations.disconnect(); el.removeEventListener('load', measure, true); el.removeEventListener('error', measure, true); };
  }, [doc.markdown, paged]);
  const reveal = useCallback((target: HTMLElement) => {
    if (paged && step && columns.current) {
      const offset = target.getBoundingClientRect().left - columns.current.getBoundingClientRect().left;
      setPage(Math.max(0, Math.min(pages - 1, Math.floor((offset + 1) / step))));
      if (viewport.current) viewport.current.scrollLeft = 0;
    } else if (!paged) target.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [paged, step, pages]);
  useEffect(() => {
    if (!anchor || !columns.current) return;
    const target = [...columns.current.querySelectorAll<HTMLElement>('[id]')].find(el => el.id === anchor);
    if (target) reveal(target);
  }, [anchor, reveal]);
  return <>
    <article className={'paper ' + (paged ? 'paper-paged' : 'paper-flow')} aria-label={doc.title}>
      <div className="running-head"><span>VICTORIA / FIELD GUIDE</span><span>{heading}</span></div>
      <div className="page-window" ref={viewport}><div className="book-prose page-columns" ref={columns}
        onFocusCapture={e => { if (paged) reveal(e.target as HTMLElement); }}
        style={paged ? { transform: 'translateX(-' + page * step + 'px)' } : undefined}>{children}</div></div>
      <footer className="paper-footer"><span>WORKING DRAFT · NOT FOR EMERGENCY USE</span><span>{paged ? String(page + 1).padStart(2, '0') : 'REVIEW COPY'}</span></footer>
    </article>
    {paged && <Pagination className="page-controls" aria-label="Preview page navigation"><PaginationContent>
      <PaginationItem><Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft size={17} /> Previous page</Button></PaginationItem>
      <PaginationItem><span aria-live="polite">Page {page + 1} of {pages}<small>in this section</small></span></PaginationItem>
      <PaginationItem><Button variant="outline" disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}>Next page <ChevronRight size={17} /></Button></PaginationItem>
    </PaginationContent></Pagination>}
  </>;
}

export default function BookReader({ initialLibrary }: { initialLibrary: BookLibrary }) {
  const [library, setLibrary] = useState(initialLibrary), [current, setCurrent] = useState(initialLibrary.chapterIds[0]);
  const [anchor, setAnchor] = useState(''), [mode, setMode] = useState('flow'), [panel, setPanel] = useState<Panel>(null);
  const [sync, setSync] = useState(import.meta.env.DEV ? 'Reading Markdown' : 'Saved Markdown snapshot'), [error, setError] = useState('');
  const content = useRef<HTMLElement>(null), referenceBody = useRef<HTMLDivElement>(null);
  const isLive = import.meta.env.DEV;
  const refresh = useCallback(async () => {
    if (!isLive) return;
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}__book/library`, { cache: 'no-store' });
      if (!response.ok) throw new Error('unavailable');
      const fresh: BookLibrary = await response.json();
      setLibrary(previous => previous.revision === fresh.revision ? previous : fresh);
      setSync('Live Markdown'); setError('');
    } catch { setSync('Last loaded copy'); setError('The Markdown could not be refreshed. The last loaded text is still shown. Reconnect and refresh before reviewing changes.'); }
  }, [isLive]);
  useEffect(() => {
    if (!isLive) return;
    const initialRefresh = setTimeout(() => { void refresh(); }, 0);
    const timer = setInterval(() => { if (!document.hidden) void refresh(); }, 4000);
    return () => { clearTimeout(initialRefresh); clearInterval(timer); };
  }, [isLive, refresh]);
  useEffect(() => {
    const readHash = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1)), id = hash.get('chapter');
      setCurrent(id && (library.chapterIds.includes(id) || id === library.prototypeId) ? id : library.chapterIds[0]);
      setAnchor(hash.get('section') || '');
    };
    readHash(); window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, [library.chapterIds, library.prototypeId]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!referenceBody.current) return;
      referenceBody.current.scrollTop = 0;
      if (panel?.anchor) [...referenceBody.current.querySelectorAll<HTMLElement>('[id]')].find(el => el.id === panel.anchor)?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [panel]);
  const navigate = (id: string, section = '') => {
    setCurrent(id); setAnchor(section);
    window.location.hash = new URLSearchParams({ chapter: id, ...(section ? { section } : {}) }).toString();
    if (!section) { window.scrollTo({ top: 0 }); content.current?.focus({ preventScroll: true }); }
    else if (id === current && mode === 'flow') requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  };
  const onLink = (from: string, href: string) => {
    const id = resolveLink(from, href);
    let fragment = '';
    try { fragment = decodeURIComponent(href.split('#').slice(1).join('#')); } catch { /* Preserve readable content for malformed links. */ }
    if (id && (library.chapterIds.includes(id) || id === library.prototypeId)) { setPanel(null); navigate(id, fragment); }
    else setPanel({ id: id || href, anchor: fragment });
  };
  const doc = library.documents[current] || library.documents[library.chapterIds[0]], index = library.chapterIds.indexOf(doc.id), review = index < 0;
  const heading = review ? 'SEPARATE REVIEW DRAFT' : index === 0 ? 'INTRODUCTION' : 'SECTION ' + String(index).padStart(2, '0');
  const headings = [...doc.markdown.matchAll(/^## (.+)$/gm)].map(m => cleanHeading(m[1]));
  const reference = panel ? library.documents[panel.id] : null;
  return <SidebarProvider style={{ '--sidebar-width': '18.5rem' } as CSSProperties}>
    <a className="skip-link" href="#reading-text">Skip to book text</a>
    <Contents library={library} current={current} navigate={navigate} openPanel={setPanel} />
    <main className="reader-main" id="reading-text" ref={content} tabIndex={-1}>
      <header className="reader-toolbar"><div className="toolbar-left"><MenuButton /><span className="toolbar-divider" /><span>Book reader</span></div>
        <div className="toolbar-right"><a className="print-view-link" href={`${import.meta.env.BASE_URL}print/`} target="_blank" rel="noopener noreferrer"><FileText size={15} />Print view</a><span className="sync-state"><span className="live-dot" />{sync}</span><Button variant="ghost" size="icon" aria-label="Refresh Markdown" title="Refresh Markdown" onClick={refresh} disabled={!isLive}><RefreshCw size={16} /></Button></div></header>
      <div className="draft-banner"><TriangleAlert size={17} /><p><strong>Working draft.</strong> {review ? 'This separate sample contains incomplete, unapproved instructions.' : 'Content is still being researched and reviewed.'} Do not use this in an emergency.</p></div>
      {error && <div role="alert" className="sync-error">{error}</div>}
      <div className="reading-desk">
        <div className="section-toolbar"><div className="section-heading"><span className="eyebrow">{heading}</span><h1>{review ? 'Emergency core — review sample' : index === 0 ? 'Introduction' : doc.title}</h1></div>
          <div className="section-actions">
            {!!headings.length && <NativeSelect className="section-jump" aria-label="Jump within this section" value={anchor} onChange={event => navigate(doc.id, event.target.value)}>
              <NativeSelectOption value="">Jump to a topic…</NativeSelectOption>
              {headings.map((title, i) => <NativeSelectOption key={title + i} value={slug(title)}>{title}</NativeSelectOption>)}
            </NativeSelect>}
            <fieldset className="view-options" aria-label="Reading layout"><Button variant={mode === 'flow' ? 'secondary' : 'ghost'} aria-pressed={mode === 'flow'} onClick={() => setMode('flow')}>Read</Button><Button className="pages-option" variant={mode === 'pages' ? 'secondary' : 'ghost'} aria-pressed={mode === 'pages'} onClick={() => setMode('pages')}>Book pages</Button></fieldset>
          </div></div>
        <div className="reading-layout"><div className="paper-stack">
          <Paper key={doc.id + ':' + doc.modified + ':' + mode} doc={doc} mode={mode} heading={heading} anchor={anchor}><BookMarkdown doc={doc} images={library.images || {}} onLink={onLink} /></Paper>
          <div className="layout-note">Layout preview, not final print pagination. Original wording and warnings are unchanged.</div>
          <div className="source-row"><span>{doc.id.split('/').at(-1)}</span><Button variant="ghost" onClick={() => setPanel({ id: doc.id, raw: true })}><FileText size={16} /> View Markdown</Button></div>
          {!review && <nav className="chapter-controls" aria-label="Chapter navigation"><Button variant="ghost" disabled={index === 0} onClick={() => navigate(library.chapterIds[index - 1])}><ChevronLeft size={17} /> Previous section</Button><span>{index + 1} / {library.chapterIds.length}</span><Button variant="ghost" disabled={index === library.chapterIds.length - 1} onClick={() => navigate(library.chapterIds[index + 1])}>Next section <ChevronRight size={17} /></Button></nav>}
        </div><aside className="chapter-outline" aria-label="In this section"><div className="eyebrow">IN THIS SECTION</div>{headings.map((title, i) => <a key={title + i} href={'#' + new URLSearchParams({ chapter: doc.id, section: slug(title) })} onClick={e => { e.preventDefault(); navigate(doc.id, slug(title)); }}>{title}</a>)}
          <div className="outline-note"><span>READING THE SOURCE</span><p>{isLive ? 'Markdown edits appear here while the local reader is running.' : 'This is a saved snapshot. Local edits require a new build.'}</p><p>This page does not change the book.</p></div></aside></div>
      </div>
    </main>
    <Sheet open={!!panel} onOpenChange={open => { if (!open) setPanel(null); }}><SheetContent className="reference-sheet">
      <SheetHeader><SheetTitle>{panel?.raw ? 'Markdown source' : reference?.title || 'Reference unavailable'}</SheetTitle><SheetDescription>{panel?.id} · Read-only review material</SheetDescription></SheetHeader>
      <div className="reference-warning">Working material · not approved emergency guidance</div>
      <div className="reference-body" ref={referenceBody}>{reference ? panel?.raw ? <pre className="raw-markdown">{reference.markdown}</pre> : <div className="book-prose"><BookMarkdown doc={reference} images={library.images || {}} onLink={onLink} /></div> : <p>This file is not included in the reader. The original link is preserved in the Markdown; no replacement content has been invented.</p>}</div>
    </SheetContent></Sheet>
  </SidebarProvider>;
}
