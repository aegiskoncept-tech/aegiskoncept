import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/site/Breadcrumb';
import CaseCard, { renderCaseVisual } from '@/components/site/CaseCard';
import CtaBand from '@/components/site/CtaBand';
import { Vis } from '@/components/site/Mockups';
import JsonLd from '@/components/seo/JsonLd';
import { getCreativeWorkSchema, getBreadcrumbSchema } from '@/lib/jsonLd';
import { db } from '@/lib/db';
import { FALLBACK_CASES, getFallbackCase } from '@/lib/staticFallbacks';

export async function generateStaticParams() {
  try {
    const cases = await db.caseStudy.findMany({ select: { slug: true } });
    if (cases.length > 0) {
      return cases.map((c) => ({ slug: c.slug }));
    }
  } catch (err) {
    console.warn('generateStaticParams [cases] query failed, using static fallback:', err);
  }
  return FALLBACK_CASES.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let cs = null;
  try {
    cs = await db.caseStudy.findUnique({ where: { slug: params.slug } });
  } catch {}
  if (!cs) cs = getFallbackCase(params.slug);
  if (!cs) return { title: 'Our Work | AegisKoncept' };

  return {
    title: `${cs.client} Case Study | AegisKoncept`,
    description: cs.oneLine,
    alternates: {
      canonical: `/our-work/${cs.slug}`,
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let cs: any = null;
  try {
    cs = await db.caseStudy.findUnique({
      where: { slug: params.slug },
      include: { reviews: true },
    });
  } catch (err) {
    console.warn(`Database query for case study ${params.slug} failed, falling back to static data:`, err);
  }
  if (!cs) cs = getFallbackCase(params.slug);
  if (!cs) notFound();

  // Parse services
  let servicesArr: string[] = [];
  try {
    servicesArr = JSON.parse(cs.services);
  } catch {}

  // Parse did list
  let didArr: string[] = [];
  try {
    didArr = JSON.parse(cs.did);
  } catch {}

  // Parse results
  let resultsArr: Array<{ num: string; lbl: string }> = [];
  try {
    const parsed = JSON.parse(cs.results);
    if (Array.isArray(parsed)) {
      resultsArr = parsed.map((item: any) => ({
        num: Array.isArray(item) ? item[0] : item.num || '',
        lbl: Array.isArray(item) ? item[1] : item.lbl || '',
      }));
    }
  } catch {}

  // Parse shots
  let shotsArr: Array<{ k: string; cap: string }> = [];
  try {
    if (cs.shots) {
      const parsed = JSON.parse(cs.shots);
      if (Array.isArray(parsed)) {
        shotsArr = parsed.map((item: any) => ({
          k: Array.isArray(item) ? item[0] : item.k || item.shot || '',
          cap: Array.isArray(item) ? item[1] : item.cap || item.caption || '',
        }));
      }
    }
  } catch {}

  // Videos shot for this client
  let clientVideos: any[] = [];
  try {
    clientVideos = await db.video.findMany({
      where: { posterMediaId: cs.slug },
    });
  } catch {}

  // Industry name
  let industry: any = null;
  try {
    industry = cs.industryId
      ? await db.industry.findUnique({ where: { slug: cs.industryId } })
      : null;
  } catch {}

  // More work (2 other cases)
  let otherCases: any[] = [];
  try {
    otherCases = await db.caseStudy.findMany({
      where: { id: { not: cs.id } },
      take: 2,
      orderBy: { order: 'asc' },
    });
  } catch {}

  // Check for approved review
  const approvedReview = (cs.reviews || []).find((r: any) => r.status === 'APPROVED');

  const initials = cs.ownerName
    ? cs.ownerName
        .replace(/&amp;/g, '')
        .replace(/&/g, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w: string) => w[0])
        .join('')
    : 'AK';

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Our Work', url: '/our-work' },
    { name: cs.client, url: `/our-work/${cs.slug}` },
  ]);
  const creativeWorkSchema = getCreativeWorkSchema({
    client: cs.client,
    slug: cs.slug,
    oneLine: cs.oneLine,
    industry: industry?.name,
  });

  return (
    <>
      <JsonLd data={[breadcrumbSchema, creativeWorkSchema]} />
      {/* 1. Hero */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Our Work', href: '/our-work' },
                { label: cs.client },
              ]}
            />

            <div className="split" style={{ alignItems: 'end' }}>
              <div className="stack" style={{ gap: '18px' }}>
                <span className="lbl">
                  {industry ? industry.name : ''} · {cs.location}
                </span>
                <h1 className="sf d1">{cs.client}</h1>
              </div>
              <div className="stack" style={{ gap: '18px' }}>
                <p className="ld">{cs.oneLine}</p>
                {didArr.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {didArr.map((d, idx) => (
                      <span key={idx} className="chip">
                        {d}
                      </span>
                    ))}
                  </div>
                )}
                {cs.liveUrl && (
                  <a
                    className="btn b-l"
                    href={cs.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: 'fit-content' }}
                  >
                    Visit the live site ↗
                  </a>
                )}
              </div>
            </div>

            <div className="rv" style={{ marginTop: '12px' }}>
              {renderCaseVisual(
                cs.slug,
                cs.client,
                cs.coverMediaId || undefined,
                cs.logoMediaId || undefined,
                'r169'
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Problem & What We Did */}
      <section className="cr">
        <div className="in sec">
          <div className="stack" style={{ gap: '72px' }}>
            <div className="split rv">
              <h2 className="sf h2">The Problem</h2>
              <p className="measure" style={{ fontSize: '20px' }}>
                {cs.challenge}
              </p>
            </div>

            <div className="split rv">
              <h2 className="sf h2">What We Did</h2>
              <div
                className="stack measure"
                style={{ gap: '18px', fontSize: '20px' }}
              >
                <p>{cs.approach}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {servicesArr.map((svcName, idx) => (
                    <span key={idx} className="chip">
                      {svcName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Result */}
      <section className="dk">
        <div className="in sec">
          <div className="split">
            <h2 className="sf h2 rv">The Result</h2>
            <div className="rv">
              {resultsArr.length > 0 ? (
                <>
                  <div className="stats">
                    {resultsArr.map((res, idx) => (
                      <div key={idx} className="st">
                        <span className="sf stn">{res.num}</span>
                        <span className="mu sm">{res.lbl}</span>
                      </div>
                    ))}
                  </div>
                  {cs.extra && (
                    <p className="ld" style={{ marginTop: '24px' }}>
                      {cs.extra}
                    </p>
                  )}
                </>
              ) : (
                <p className="measure" style={{ fontSize: '20px' }}>
                  {cs.oneLine}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Proof (Screenshot gallery with captions) */}
      {shotsArr.length > 0 && (
        <section className="dk">
          <div className="in sec" style={{ paddingTop: 0 }}>
            <div className="stack" style={{ gap: '28px' }}>
              <div className="split rv" style={{ alignItems: 'end' }}>
                <h2 className="sf h2">The Proof.</h2>
                <p className="ld mu">
                  Real screenshots from Google Search, Search Console, Google Maps and
                  Semrush.
                </p>
              </div>
              <div className="sgal">
                {shotsArr.map((shot, idx) => (
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
      )}

      {/* 5. Videos shot for this client */}
      {clientVideos.length > 0 && (
        <section className="dk">
          <div className="in sec" style={{ paddingTop: 0 }}>
            <div className="stack" style={{ gap: '28px' }}>
              <h2 className="sf h3">Videos we shot for {cs.client}</h2>
              <div className="vgrid">
                {clientVideos.map((v) => (
                  <Link key={v.id} className="vcard rv" href="/videos">
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
      )}

      {/* 6. Owner Card & Review (Strict honesty rule) */}
      {cs.ownerName && (
        <section className="wh">
          <div className="in sec-s">
            <div className="who-card rv">
              <span className="wc-m sf" aria-hidden="true">
                {initials}
              </span>
              <div className="stack" style={{ gap: '4px' }}>
                <span className="xs mu">The people we work with</span>
                <span className="sf h3">{cs.ownerName}</span>
                <span className="mu">
                  {cs.ownerRole}, {cs.client}
                </span>
              </div>

              {/* Only approved reviews display quote publicly */}
              {approvedReview && (
                <blockquote className="wc-q">
                  &ldquo;{approvedReview.text}&rdquo;
                </blockquote>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 7. More Work */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '40px' }}>
            <h2 className="sf h2">More Work.</h2>
            <div className="cols c2">
              {otherCases.map((o) => {
                let svcsArr: string[] = [];
                try {
                  svcsArr = JSON.parse(o.services);
                } catch {}
                return (
                  <CaseCard
                    key={o.id}
                    id={o.slug}
                    client={o.client}
                    industryName={o.location || 'India'}
                    services={svcsArr}
                    oneLine={o.oneLine}
                    cover={o.coverMediaId || undefined}
                    logo={o.logoMediaId || undefined}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA Band */}
      <CtaBand
        title="Want Something Like This?"
        sub="Let's talk about your business and what you want to change."
      />
    </>
  );
}

