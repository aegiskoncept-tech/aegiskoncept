import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Vis } from '@/components/site/Mockups';
import CaseCard from '@/components/site/CaseCard';
import { db } from '@/lib/db';
import { FALLBACK_CASES, getFallbackCase } from '@/lib/staticFallbacks';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Thank You | AegisKoncept',
  description: "Your message reached us. We'll reply within 1 working day.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ThankYouPage() {
  let casesData: any[] = [];
  try {
    casesData = await db.caseStudy.findMany({
      take: 3,
      orderBy: { order: 'asc' },
    });
  } catch (err) {
    console.warn('[ThankYou] DB unavailable, using fallback cases:', err);
  }

  if (!casesData || casesData.length === 0) {
    casesData = FALLBACK_CASES.slice(0, 3).map(getFallbackCase).filter(Boolean);
  }

  return (
    <>
      <section className="dk">
        <div className="in sec">
          <div className="split-r">
            <div className="stack" style={{ gap: 24 }}>
              <h1 className="sf d1">Got It. Thank You!</h1>
              <p className="ld">
                Your message reached us. We&apos;ll reply within 1 working day. In a hurry? WhatsApp us at{' '}
                <a
                  href="https://wa.me/917303468073?text=Hi%20AegisKoncept%2C%20I%20just%20submitted%20the%20contact%20form"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--lime)', textDecoration: 'underline' }}
                >
                  +91 73034 68073
                </a>
                .
              </p>
              <div className="row-btn">
                <Link className="btn b-l" href="/our-work">
                  See Our Work
                </Link>
                <Link className="btn b-o" href="/insights">
                  Read the Blog
                </Link>
              </div>
            </div>

            <div>
              <Vis kind="brand" cls="rarch" />
            </div>
          </div>
        </div>
      </section>

      <section className="cr">
        <div className="in sec">
          <div className="stack" style={{ gap: 28 }}>
            <h2 className="sf h2">While You Wait.</h2>
            <div className="cols c3">
              {casesData.map((c) => {
                let services: string[] = [];
                try {
                  services = JSON.parse(c.services);
                } catch {
                  services = [c.services];
                }

                return (
                  <CaseCard
                    key={c.id}
                    id={c.slug}
                    client={c.client}
                    industryName={c.industryId || 'Client Work'}
                    services={services}
                    oneLine={c.oneLine}
                    cover={c.coverMediaId || undefined}
                    logo={c.logoMediaId || undefined}
                    cls="r11"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
