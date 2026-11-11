import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/site/Breadcrumb';
import CtaBand from '@/components/site/CtaBand';
import { Vis } from '@/components/site/Mockups';
import { db } from '@/lib/db';
import { FALLBACK_SERVICES, getFallbackService } from '@/lib/staticFallbacks';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Services | AegisKoncept',
  description:
    'Five services, one team: Website design & development, SEO, Google & Meta ads, social media management, and video production. Based in Dwarka, Delhi.',
};

const GOALS = [
  {
    goal: 'I want my business to look good online.',
    slug: 'website-development-design',
    name: 'Website Design & Development',
  },
  {
    goal: 'I want to show up on Google.',
    slug: 'seo',
    name: 'SEO',
  },
  {
    goal: 'I need more leads, fast.',
    slug: 'performance-marketing',
    name: 'Google & Meta Ads',
  },
  {
    goal: 'I want to post regularly and reply to everyone.',
    slug: 'social-media-marketing-management',
    name: 'Social Media Management',
  },
  {
    goal: 'I need videos that look premium.',
    slug: 'video-production',
    name: 'Shoots & Video Production',
  },
  {
    goal: "I don't know where to start.",
    slug: 'seo',
    name: 'SEO',
  },
];

export default async function ServicesHubPage() {
  let services: any[] = [];
  try {
    services = await db.service.findMany({
      orderBy: { order: 'asc' },
    });
  } catch (err) {
    console.warn('ServicesHubPage database query failed, using static fallbacks:', err);
    services = FALLBACK_SERVICES.map(getFallbackService).filter(Boolean);
  }

  return (
    <>
      {/* 1. Hero */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Services' },
              ]}
            />
            <div className="split">
              <h1 className="sf d1">Five Services. One Team.</h1>
              <p className="ld">
                Everything your business needs to grow online, handled by one senior team
                in Delhi NCR. Start with the one that solves your immediate problem, then add
                the rest as you grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What's your goal? */}
      <section className="cr">
        <div className="in sec">
          <div className="stack" style={{ gap: '22px' }}>
            <h2 className="sf h3 rv">What&apos;s your goal?</h2>
            <div className="cols c2">
              {GOALS.map((g, idx) => (
                <Link
                  key={idx}
                  className="case rv"
                  href={`/services/${g.slug}`}
                  style={{
                    background: 'var(--white)',
                    padding: '32px',
                    gap: '10px',
                    textDecoration: 'none',
                  }}
                >
                  <span className="sf h3">&ldquo;{g.goal}&rdquo;</span>
                  <span className="mu">{g.name} →</span>
                </Link>
              ))}
            </div>
            <p className="note">
              Most clients use two services together, like a new website + SEO, or social media + ads.
            </p>
          </div>
        </div>
      </section>

      {/* 3. 5 Detailed Service Blocks */}
      <section className="wh">
        <div className="in sec">
          <div className="stack" style={{ gap: '96px' }}>
            {services.map((s) => {
              let incChips: string[] = [];
              try {
                const parsed = JSON.parse(s.included);
                if (Array.isArray(parsed)) {
                  incChips = parsed.map((item: any) =>
                    Array.isArray(item) ? item[0] : item.title || item.t || ''
                  );
                }
              } catch {}

              return (
                <div key={s.id} className="split-r rv">
                  <div className="stack" style={{ gap: '18px' }}>
                    <h2 className="sf h2">{s.name}</h2>
                    <p className="ld mu">{s.sub}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {incChips.map((chip, ci) => (
                        <span key={ci} className="chip">
                          {chip}
                        </span>
                      ))}
                    </div>
                    <Link
                      className="btn b-d"
                      href={`/services/${s.slug}`}
                      style={{ width: 'fit-content' }}
                    >
                      Learn More
                    </Link>
                  </div>
                  <Vis kind={s.visualKind || 'site'} lt={true} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CTA Band */}
      <CtaBand
        title="Not Sure Where to Start?"
        sub="Tell us your goal. We'll tell you the one or two things that will help most."
      />
    </>
  );
}

