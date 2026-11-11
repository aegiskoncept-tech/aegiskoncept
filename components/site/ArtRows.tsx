import React from 'react';
import Link from 'next/link';
import { Cover } from './Mockups';

export interface ArtRowItem {
  slug: string;
  title: string;
  category: string;
  readMinutes: string;
  date: string;
  short: string;
  kind?: string;
}

export default function ArtRows({ items }: { items: ArtRowItem[] }) {
  return (
    <>
      {items.map((a) => (
        <Link
          key={a.slug}
          className="art-row"
          href={a.slug === 'seo-cost-india' ? '/insights/seo-cost-india' : '/insights'}
          data-cat={a.category}
        >
          <Cover word={a.short} kind={a.kind || ''} cls="r43" />
          <div className="stack" style={{ gap: '6px' }}>
            <span className="xs mu">
              {a.category} · {a.date}
            </span>
            <span className="sf h3">{a.title}</span>
          </div>
          <span className="rt mu sm" style={{ textAlign: 'right' }}>
            {a.readMinutes} read →
          </span>
        </Link>
      ))}
    </>
  );
}

