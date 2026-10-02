'use client';

import { useState, type CSSProperties } from 'react';
import type { Root, RootContent } from 'mdast';
import Markdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { BookDocument, BookImage } from '@/lib/book-types';

export const cleanHeading = (value: string) => value.replace(/[*_\x60]/g, '').trim();
export const slug = (value: string) => cleanHeading(value).toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-');

function headingPlugin(options: { prefix?: string } = {}) {
  return (tree: Root) => {
    const counts = new Map<string, number>();
    const text = (node: Root | RootContent): string => 'value' in node ? String(node.value) : 'children' in node ? node.children.map(text).join('') : '';
    const walk = (node: Root | RootContent) => {
      if (node.type === 'heading') {
        const heading = cleanHeading(text(node));
        const name = slug(heading), count = counts.get(name) || 0;
        const lower = heading.toLowerCase();
        const className = /^(do this now|what to do now|first actions|start here|if this is happening now|find the urgent action|choose your situation|use what you see first)/.test(lower)
          ? ['action-heading']
          : /^(do not|stop|danger)/.test(lower)
            ? ['stop-heading']
            : /^(more detail|evidence|sources|review notes|reference)/.test(lower)
              ? ['reference-heading']
              : undefined;
        counts.set(name, count + 1);
        node.data = { ...node.data, hProperties: { id: `${options.prefix || ''}${name}${count ? '-' + count : ''}`, ...(className ? { className } : {}) } };
      }
      if ('children' in node) node.children.forEach(walk);
    };
    walk(tree);
  };
}

export function resolveLink(from: string, target: string) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target)) return null;
  let pathname: string;
  try { pathname = decodeURIComponent(target.split('#')[0]); } catch { return null; }
  if (!pathname) return from;
  if (pathname.startsWith('/') || pathname.includes('\\') || pathname.includes('\0')) return null;
  const parts = from.split('/').slice(0, -1);
  for (const part of pathname.split('/')) {
    if (part === '..') { if (!parts.length) return null; parts.pop(); }
    else if (part && part !== '.') parts.push(part);
  }
  return parts.join('/');
}

function BookFigure({ item, alt, printMode }: { item: BookImage; alt?: string; printMode: boolean }) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'failed'>('loading');
  const isDiagram = item.filename.endsWith('.svg');
  const description = alt || item.caption;
  const boundaries = item.pageSlices;
  const hasPageSlices = !!(isDiagram && item.viewBox && boundaries && boundaries.length > 1);
  const pageLayoutMissing = !!(isDiagram && item.pageLayoutRequired && !hasPageSlices);
  const frameCount = pageLayoutMissing ? 0 : hasPageSlices ? boundaries!.length - 1 : 1;
  const status = item.status === 'working-draft' ? 'WORKING ILLUSTRATION · INDEPENDENT REVIEW OUTSTANDING' : 'REVIEWED ILLUSTRATION';
  const sourceParts = item.source.split(';').map(value => value.trim()).filter(Boolean);
  const sourceLinks = sourceParts.filter(value => /^https?:\/\//i.test(value));
  const credit = <span className="figure-credit">{item.registerId} · {item.credit} · {sourceParts.map((value, index) => <span key={`${value}-${index}`}>{index ? ' · ' : ''}{/^https?:\/\//i.test(value) ? <a href={value} target="_blank" rel="noopener noreferrer">{sourceLinks.length > 1 ? `Source ${sourceLinks.indexOf(value) + 1}` : 'Source'}</a> : value}</span>)} · {item.licenceUrl ? <a href={item.licenceUrl} target="_blank" rel="noopener noreferrer">{item.licence}</a> : item.licence}</span>;
  const missing = <span className="figure-load-error" role="alert">Image could not load. Do not infer the missing visual from its caption.</span>;
  const unavailablePanel = <span className="figure-crop-unavailable">Panel visual unavailable. Use the full chapter; do not infer the missing action.</span>;
  const picture = (imageAlt: string, hidden = false, style?: CSSProperties, printFrame = false) => {
    // oxlint-disable-next-line next/no-img-element -- Preserve the checked original; do not proxy or transform factual artwork.
    return <img src={item.url} alt={imageAlt} aria-hidden={hidden || undefined} loading={printMode ? 'eager' : 'lazy'} data-print-frame={printFrame || undefined} onLoad={() => setImageState(current => current === 'failed' ? 'failed' : 'loaded')} onError={() => setImageState('failed')} style={style} />;
  };
  const full = <span className="figure-full">
    <span className="figure-status">{status}<span>{item.limit}</span></span>
    {imageState === 'failed' ? missing : picture(description, false, undefined, printMode)}
    {isDiagram && imageState !== 'failed' ? <a className="figure-open" href={item.url} target="_blank" rel="noopener noreferrer">Open full-size diagram</a> : null}
    <span className="figure-caption">{item.caption}</span>
    {credit}
  </span>;
  const pages = hasPageSlices && item.viewBox && boundaries ? <span className="figure-pages" role="document" aria-label={`${item.caption}, divided into ${boundaries.length - 1} readable page panels`}>
    <span className="figure-pages-limit"><strong>{status}</strong><span>{item.limit}</span></span>
    {imageState === 'failed' ? missing : null}
    {boundaries.slice(0, -1).map((start, index) => {
      const end = boundaries[index + 1], sliceHeight = end - start;
      const offset = ((start - item.viewBox!.y) / item.viewBox!.height * 100).toFixed(6);
      const part = index + 1, total = boundaries.length - 1;
      return <span className="figure-sheet" role="document" aria-label={`${item.caption}, part ${part} of ${total}`} data-panel-number={part} data-panel-total={total} key={`${start}-${end}`}>
        <span className="figure-slice-status"><strong>{status} · PART {part} OF {total}</strong><span>{item.pageSliceNotes?.[index]}</span><span>NOT FIELD-APPROVED. Confidence figures rate wording or layout only—not safety, treatment or success. Use this part in order with all parts, the chapter warning and current official advice; never use it alone.</span></span>
        {imageState === 'failed' ? unavailablePanel : <span className="figure-crop" style={{ aspectRatio: `${item.viewBox!.width} / ${sliceHeight}` }}>
          {picture(index === 0 ? description : '', index !== 0, { transform: `translateY(-${offset}%)` }, printMode)}
        </span>}
        <span className="figure-caption">{item.caption} · part {part} of {total}</span>
      </span>;
    })}
    <span className="figure-pages-meta"><a className="figure-open" href={item.url} target="_blank" rel="noopener noreferrer">Open full-size diagram</a>{credit}</span>
  </span> : null;
  const unavailable = pageLayoutMissing ? <span className="figure-page-not-ready" role="note"><strong>Readable Book Pages version not prepared</strong><span>This tall diagram is deliberately not shrunk or clipped. Switch to Read, or open the full-size diagram, until semantic page panels have been checked.</span><a className="figure-open" href={item.url} target="_blank" rel="noopener noreferrer">Open full-size diagram</a></span> : null;
  return <span className={`book-figure${isDiagram ? ' book-figure--diagram' : ''}${hasPageSlices ? ' book-figure--page-sliced' : ''}${pageLayoutMissing ? ' book-figure--page-unprepared' : ''}${printMode ? ' book-figure--print' : ''}`} data-asset-id={item.id} data-image-state={imageState} data-print-frame-count={frameCount}>
    {printMode && (hasPageSlices || pageLayoutMissing) ? null : full}
    {pages}
    {unavailable}
  </span>;
}

type PrintLink = { chapterAnchor: string; headingPrefix: string };

export function BookMarkdown({ doc, images, onLink, presentation = 'reader', headingPrefix = '', printLinks = {} }: { doc: BookDocument; images: Record<string, BookImage>; onLink?: (from: string, href: string) => void; presentation?: 'reader' | 'print'; headingPrefix?: string; printLinks?: Record<string, PrintLink> }) {
  const printMode = presentation === 'print';
  return <Markdown remarkPlugins={[remarkGfm, [headingPlugin, { prefix: headingPrefix }]]} skipHtml urlTransform={defaultUrlTransform} components={{
    a: ({ href, children }) => /^(https?:|mailto:|tel:)/i.test(href || '')
      ? <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
      : printMode
        ? (() => {
          const target = href ? resolveLink(doc.id, href) : null;
          const route = target ? printLinks[target] : undefined;
          if (!route) return <span className="print-cross-reference" title="Supporting project record — not included in this print view">{children}</span>;
          let fragment = '';
          try { fragment = decodeURIComponent((href || '').split('#').slice(1).join('#')); } catch { /* Leave malformed references at the chapter opening. */ }
          const destination = fragment ? `#${route.headingPrefix}${slug(fragment)}` : `#${route.chapterAnchor}`;
          return <a href={destination}>{children}</a>;
        })()
        : <a href={href || '#'} onClick={event => { event.preventDefault(); if (href) onLink?.(doc.id, href); }}>{children}</a>,
    img: ({ alt, src }) => {
      const id = typeof src === 'string' ? resolveLink(doc.id, src) : null;
      const item = id ? images[id] : undefined;
      return item ? <BookFigure key={item.url} item={item} alt={alt} printMode={printMode} /> : <span className="image-pending" role="note">Image reference: {alt || 'untitled'}. Not in the checked image register; image not loaded.</span>;
    },
    table: ({ children }) => <Table>{children}</Table>,
    thead: ({ children }) => <TableHeader>{children}</TableHeader>,
    tbody: ({ children }) => <TableBody>{children}</TableBody>,
    tr: ({ children }) => <TableRow>{children}</TableRow>,
    th: ({ children }) => <TableHead>{children}</TableHead>,
    td: ({ children }) => <TableCell>{children}</TableCell>,
  }}>{doc.markdown}</Markdown>;
}
