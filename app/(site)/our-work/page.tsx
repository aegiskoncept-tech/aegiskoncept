import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/site/Breadcrumb';
import WorkFilterGrid, { CaseItem } from '@/components/site/WorkFilterGrid';
import CtaBand from '@/components/site/CtaBand';
import { renderCaseVisual } from '@/components/site/CaseCard';
import { Vis } from '@/components/site/Mockups';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Our Work | AegisKoncept',
  description:
    'Websites we built, Google rankings we won, ads that brought leads, and videos we shot. Real clients, real numbers in Delhi NCR, UK and beyond.',
};

const WORK_STATS = [
  { n: '3.51M', l: 'Google impressions for 10Q Challenge' },
  { n: '9,873', l: 'Google Maps actions for a clinic' },
  { n: '100%', l: 'plots sold for Allied Industrial Park' },
  { n: '2.02M', l: 'B2B reach at ₹3.75 CPM' },
];

const MORE_SEO = [
  {
    k: 's20',
    cap: '6.18K clicks and 50.8K impressions in 24 hours · 12.2% CTR',
  },
  {
    k: 's21',
    cap: '3.08K clicks and 23.6K impressions in 24 hours · 13.1% CTR',
  },
  {
    k: 's22',
    cap: '4.38K clicks · 35.3K impressions · average position 4.9',
  },
  {
    k: 's23',
    cap: 'Clicks 822 → 1.54K · impressions 94K → 371K · position 17.7 → 6.2',
  },
  {
    k: 's24',
    cap: 'Clicks 194 → 664 · impressions 43K → 222K · position 22.4 → 7.2',
  },
  {
    k: 's25',
    cap: 'After restructuring: position 26.9 → 7.2 · impressions 2.6×',
  },
];

export default async function OurWorkHubPage() {
  const allCasesFromDb = await db.caseStudy.findMany({
    orderBy: { order: 'asc' },
  });

  const featured = allCasesFromDb.find((c) => c.slug === '10q-challenge') || allCasesFromDb[0];
  const gridCases = allCasesFromDb.filter((c) => c.slug !== '10q-challenge');

  const casesFormatted: CaseItem[] = gridCases.map((c) => {
    let svcs: string[] = [];
    try {
      svcs = JSON.parse(c.services);
    } catch {}

    return {
      id: c.slug,
      client: c.client,
      industryName: c.location || 'India',
      services: svcs,
      oneLine: c.oneLine,
      cover: c.coverMediaId || undefined,
      logo: c.logoMediaId || undefined,
    };
  });

  // Featured case stats
  let featStats: Array<{ num: string; lbl: string }> = [];
  try {
    const parsed = JSON.parse(featured.results);
    if (Array.isArray(parsed)) {
      featStats = parsed.slice(0, 4).map((item: any) => ({
        num: Array.isArray(item) ? item[0] : item.num || '',
        lbl: Array.isArray(item) ? item[1] : item.lbl || '',
      }));
    }
  } catch {}

  // Live client sites
  const liveSites = allCasesFromDb.filter((c) => {
    try {
      const svcs = JSON.parse(c.services);
      return c.liveUrl && Array.isArray(svcs) && svcs.includes('Website');
    } catch {
      return false;
    }
  });

  return (
    <>
      {/* 1. Hero */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Our Work' },
              ]}
            />
            <div className="split" style={{ alignItems: 'end' }}>
              <h1 className="sf d1">Our Work.</h1>
              <p className="ld">
                Websites we built, Google rankings we won, ads that brought leads, and
                videos we shot. Real clients, real numbers.
              </p>
            </div>

            <div className="stats">
              {WORK_STATS.map((s, idx) => (
                <div key={idx} className="st">
                  <span className="sf stn">{s.n}</span>
                  <span className="mu sm">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Story: 10Q Challenge */}
      {featured && (
        <section className="dk">
          <div className="in sec" style={{ paddingTop: 0 }}>
            <Link
              className="split-r case rv"
              href={`/our-work/${featured.slug}`}
              style={{ alignItems: 'center', textDecoration: 'none' }}
            >
              {renderCaseVisual(
                featured.slug,
                featured.client,
                featured.coverMediaId || undefined,
                featured.logoMediaId || undefined,
                'r43'
              )}
              <div className="stack" style={{ gap: '16px' }}>
                <span className="lbl">Featured · SEO + Website</span>
                <span className="sf h1">{featured.client}</span>
                <span className="mu ld">{featured.oneLine}</span>

                {featStats.length > 0 && (
                  <div className="stats sm2">
                    {featStats.map((item, idx) => (
                      <div key={idx} className="st">
                        <span className="sf stn">{item.num}</span>
                        <span className="mu sm">{item.lbl}</span>
                      </div>
                    ))}
                  </div>
                )}

                <span className="btn b-l" style={{ width: 'fit-content' }}>
                  Read the Story
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* 3. Sticky Filter Bar & Grid */}
      <WorkFilterGrid cases={casesFormatted} />

      {/* 4. Websites We've Built. Live Now. */}
      {liveSites.length > 0 && (
        <section className="cr">
          <div className="in sec">
            <div className="stack" style={{ gap: '32px' }}>
              <div className="split rv" style={{ alignItems: 'end' }}>
                <h2 className="sf h2">Websites We&apos;ve Built. Live Now.</h2>
                <p className="ld mu">
                  Click any one to see it working, in India, the UK and beyond.
                </p>
              </div>
              <div className="sites">
                {liveSites.map((c) => {
                  let domain = c.liveUrl || '';
                  try {
                    const u = new URL(c.liveUrl!);
                    domain = u.hostname.replace('www.', '');
                  } catch {}

                  return (
                    <a
                      key={c.id}
                      className="site-row rv"
                      href={c.liveUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="sf h3">{c.client}</span>
                      <span className="mu sm">{domain}</span>
                      <span className="mu sm hide-m">{c.location}</span>
                      <span className="go" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. More SEO Results */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <div className="split rv" style={{ alignItems: 'end' }}>
              <h2 className="sf h2">More SEO Results.</h2>
              <p className="ld mu">
                Straight from Google Search Console, across other client sites.
              </p>
            </div>
            <div className="sgal">
              {MORE_SEO.map((shot, idx) => (
                <figure key={idx} className="sfig rv">
                  <span
                    className={`shot sh-${shot.k}`}
                    role="img"
                    aria-label={shot.cap}
                    style={{ aspectRatio: '16/10' }}
                  />
                  <figcaption className="sm mu">{shot.cap}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. We Shoot Too */}
      <section className="cr">
        <div className="in sec">
          <div className="split" style={{ alignItems: 'center' }}>
            <div className="stack rv" style={{ gap: '18px' }}>
              <h2 className="sf h2">We Shoot Too.</h2>
              <p className="ld mu">
                Gym reels, brand films and ad creatives, shot in 4K by our own crew.
              </p>
              <Link
                className="btn b-d"
                href="/videos"
                style={{ width: 'fit-content' }}
              >
                Watch Our Videos
              </Link>
            </div>
            <div className="vgrid v3 rv">
              {[
                {
                  title: 'Thrive Gym High-Energy Commercial Reel',
                  label: 'Fitness Reel · 4K Production',
                },
                {
                  title: 'The Attic Storey Architecture & Interior Film',
                  label: 'Brand Reel · Delhi Studio',
                },
                {
                  title: 'IN2 Nutrition Performance Drop',
                  label: 'Commercial Reel · 4K Production',
                },
              ].map((v, idx) => (
                <Link key={idx} className="vcard" href="/videos">
                  <div className="vthumb">
                    <Vis kind="vid" cls="r169" />
                  </div>
                  <div className="vbody">
                    <span className="xs mu">{v.label}</span>
                    <span className="sf h3">{v.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Band */}
      <CtaBand
        title="Want Results Like These?"
        sub="Tell us what you want to change. We'll show you how we'd do it."
      />
    </>
  );
}

