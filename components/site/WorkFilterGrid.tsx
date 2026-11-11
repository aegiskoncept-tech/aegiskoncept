'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CaseCard from './CaseCard';

export interface CaseItem {
  id: string;
  client: string;
  industryName: string;
  services: string[];
  oneLine: string;
  cover?: string;
  logo?: string;
}

const FILTERS = [
  { key: 'all', label: 'All work' },
  { key: 'Website', label: 'Websites' },
  { key: 'SEO', label: 'SEO' },
  { key: 'Ads', label: 'Ads' },
  { key: 'Social Media', label: 'Social media' },
  { key: 'Video', label: 'Video' },
];

export default function WorkFilterGrid({
  cases,
}: {
  cases: CaseItem[];
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCases = cases.filter((c) => {
    if (activeFilter === 'all') return true;
    return c.services.some((s) => s.toLowerCase().includes(activeFilter.toLowerCase()));
  });

  return (
    <>
      {/* Sticky filter bar */}
      <section
        className="dk wfil"
        style={{
          position: 'sticky',
          top: 'calc(76px + env(safe-area-inset-top, 0px))',
          zIndex: 5,
          borderBlock: '1px solid var(--line-d)',
          backgroundColor: 'var(--ink)',
        }}
      >
        <div className="in" style={{ paddingBlock: '14px' }}>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              alignItems: 'center',
            }}
            role="group"
            aria-label="Filter by service"
          >
            {FILTERS.map((f) => {
              const isOn = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  className={`chip${isOn ? ' on' : ''}`}
                  type="button"
                  data-f={f.key}
                  aria-pressed={isOn}
                  style={{ flex: 'none' }}
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </button>
              );
            })}
            <Link
              className="chip"
              href="/videos"
              style={{ flex: 'none', marginLeft: 'auto' }}
            >
              Watch videos ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Case Grid */}
      <section className="dk">
        <div className="in sec">
          <div className="cols c2" id="work-grid" style={{ gap: '64px 32px' }}>
            {filteredCases.map((c) => (
              <div key={c.id} data-svcs={c.services.join(' ')}>
                <CaseCard
                  id={c.id}
                  client={c.client}
                  industryName={c.industryName}
                  services={c.services}
                  oneLine={c.oneLine}
                  cover={c.cover}
                  logo={c.logo}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

