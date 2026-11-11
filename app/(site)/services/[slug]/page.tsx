import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/site/Breadcrumb';
import FixRows, { FixRowItem } from '@/components/site/FixRows';
import Faq, { FaqItem } from '@/components/site/Faq';
import CaseCard from '@/components/site/CaseCard';
import ArtRows, { ArtRowItem } from '@/components/site/ArtRows';
import CtaBand from '@/components/site/CtaBand';
import { Vis } from '@/components/site/Mockups';
import JsonLd from '@/components/seo/JsonLd';
import { getServiceSchema, getFaqSchema, getBreadcrumbSchema } from '@/lib/jsonLd';
import { db } from '@/lib/db';
import {
  FALLBACK_SERVICES,
  getFallbackService,
  FALLBACK_CASES,
  getFallbackCase,
  FALLBACK_INDUSTRIES,
  getFallbackIndustry,
} from '@/lib/staticFallbacks';

export async function generateStaticParams() {
  try {
    const services = await db.service.findMany({ select: { slug: true } });
    if (services.length > 0) {
      return services.map((s) => ({ slug: s.slug }));
    }
  } catch (err) {
    console.warn('generateStaticParams [services] query failed, using static fallback:', err);
  }
  return FALLBACK_SERVICES.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let service = null;
  try {
    service = await db.service.findUnique({ where: { slug } });
  } catch {}
  if (!service) service = getFallbackService(slug);
  if (!service) return { title: 'Services | AegisKoncept' };

  return {
    title: `${service.name} | AegisKoncept`,
    description: service.sub,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let service: any = null;
  try {
    service = await db.service.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.warn(`Database query for service ${slug} failed, falling back to static data:`, err);
  }
  if (!service) service = getFallbackService(slug);
  if (!service) notFound();

  // Parse JSON data safely
  let problems: FixRowItem[] = [];
  try {
    const rawProbs = JSON.parse(service.problems);
    const rawFixes = JSON.parse(service.fixes);
    if (Array.isArray(rawProbs) && Array.isArray(rawFixes)) {
      problems = rawProbs.map((p: string, i: number) => ({
        problem: p,
        fix: rawFixes[i] || '',
      }));
    }
  } catch {}

  let subServices: Array<{ title: string; desc: string }> = [];
  try {
    const rawSubs = JSON.parse(service.subServices);
    if (Array.isArray(rawSubs)) {
      subServices = rawSubs.map((item: any) =>
        Array.isArray(item)
          ? { title: item[0], desc: item[1] }
          : { title: item.title || '', desc: item.desc || '' }
      );
    }
  } catch {}

  let whatYouGet: Array<{ title: string; desc: string }> = [];
  try {
    const rawInc = JSON.parse(service.included);
    if (Array.isArray(rawInc)) {
      whatYouGet = rawInc.map((item: any) =>
        Array.isArray(item)
          ? { title: item[0], desc: item[1] }
          : { title: item.title || '', desc: item.desc || '' }
      );
    }
  } catch {}

  let signatureData = { title: '', items: [] as Array<[string, string]> };
  try {
    const rawSig = JSON.parse(service.signature);
    if (rawSig) {
      signatureData.title = rawSig.title || '';
      signatureData.items = Array.isArray(rawSig.items) ? rawSig.items : [];
    }
  } catch {}

  let whoItsFor: Array<{ title: string; desc: string }> = [];
  try {
    const rawWho = JSON.parse(service.who);
    if (Array.isArray(rawWho)) {
      whoItsFor = rawWho.map((item: any) =>
        Array.isArray(item)
          ? { title: item[0], desc: item[1] }
          : { title: item.title || '', desc: item.desc || '' }
      );
    }
  } catch {}

  let processSteps: string[] = [];
  try {
    const rawProc = JSON.parse(service.process);
    if (Array.isArray(rawProc)) processSteps = rawProc;
  } catch {}

  let deliverables: Array<[string, string]> = [];
  try {
    const rawDeliv = JSON.parse(service.deliverables);
    if (Array.isArray(rawDeliv)) deliverables = rawDeliv;
  } catch {}

  let toolsList: string[] = [];
  try {
    const rawTools = JSON.parse(service.tools);
    if (Array.isArray(rawTools)) toolsList = rawTools;
  } catch {}

  let proofStats: Array<[string, string, string]> = [];
  try {
    const rawProof = JSON.parse(service.proof);
    if (Array.isArray(rawProof)) proofStats = rawProof;
  } catch {}

  let faqs: FaqItem[] = [];
  try {
    const rawFaqs = JSON.parse(service.faqs);
    if (Array.isArray(rawFaqs)) {
      faqs = rawFaqs.map((f: any) =>
        Array.isArray(f) ? { q: f[0], a: f[1] } : { q: f.q, a: f.a }
      );
    }
  } catch {}

  // Other services for bottom links
  let otherServices: any[] = [];
  try {
    otherServices = await db.service.findMany({
      where: { id: { not: service.id } },
      select: { slug: true, name: true },
    });
  } catch {}

  if (!otherServices || otherServices.length === 0) {
    otherServices = FALLBACK_SERVICES.filter((s) => s !== service.slug).map((s) => ({
      slug: s,
      name: getFallbackService(s)?.name || s,
    }));
  }

  // Related cases
  let allCases: any[] = [];
  try {
    allCases = await db.caseStudy.findMany({
      take: 4,
      orderBy: { order: 'asc' },
    });
  } catch {}

  if (!allCases || allCases.length === 0) {
    allCases = FALLBACK_CASES.slice(0, 4).map(getFallbackCase).filter(Boolean);
  }

  // Industries related to this service
  let industries: any[] = [];
  try {
    industries = await db.industry.findMany({
      select: { slug: true, name: true },
    });
  } catch {}

  if (!industries || industries.length === 0) {
    industries = FALLBACK_INDUSTRIES.map((i) => ({
      slug: i,
      name: getFallbackIndustry(i)?.name || i,
    }));
  }

  // Recent blog articles
  const articles: ArtRowItem[] = [
    {
      slug: 'seo-cost-india',
      title: 'How Much Does SEO Cost in India?',
      category: 'SEO',
      readMinutes: '9 min',
      date: '10 Nov 2026',
      short: 'SEO cost',
      kind: '',
    },
    {
      slug: 'choose-agency',
      title: 'How to Choose the Right Digital Marketing Agency in India',
      category: 'Digital Marketing',
      readMinutes: '8 min',
      date: '6 Nov 2026',
      short: 'Picking an agency',
      kind: 'c',
    },
    {
      slug: 'google-vs-meta',
      title: 'Google Ads vs Meta Ads for Indian Businesses',
      category: 'Ads',
      readMinutes: '7 min',
      date: '4 Nov 2026',
      short: 'Google vs Meta',
      kind: 'l',
    },
  ];

  const isSocial = service.slug.includes('social');
  const isSeo = service.slug === 'seo';
  const isVideo = service.slug.includes('video');

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: service.name, url: `/services/${service.slug}` },
  ]);
  const serviceSchema = getServiceSchema({
    name: service.name,
    description: service.sub,
    slug: service.slug,
  });
  const faqSchema = getFaqSchema(faqs);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema, faqSchema].filter(Boolean) as any} />
      {/* 1. Hero */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/services' },
                { label: service.name },
              ]}
            />
            <div className="split-r">
              <div className="stack" style={{ gap: '24px' }}>
                <span className="lbl">{service.name}</span>
                <h1 className="sf h1">{service.h1}</h1>
                <p className="ld">{service.sub}</p>
                <div className="row-btn">
                  <Link className="btn b-l" href="/contact">
                    Get a Free Quote
                  </Link>
                  <Link className="btn b-o" href="/our-work">
                    See Our Work
                  </Link>
                </div>
              </div>
              <div className="rv">
                <Vis kind={service.visualKind || 'site'} cls="rarch" />
              </div>
            </div>

            {proofStats.length > 0 && (
              <div className="stats" style={{ marginTop: '24px' }}>
                {proofStats.map(([n, l, cid], idx) => {
                  if (cid) {
                    return (
                      <Link
                        key={idx}
                        className="st rv"
                        href={`/our-work/${cid}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <span className="sf stn">{n}</span>
                        <span className="mu sm">{l} →</span>
                      </Link>
                    );
                  }
                  return (
                    <div key={idx} className="st rv">
                      <span className="sf stn">{n}</span>
                      <span className="mu sm">{l}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Positioning Statement */}
      <section className="cr">
        <div className="in sec-s">
          <p
            className="sf rv"
            style={{
              maxWidth: '20em',
              fontSize: 'clamp(30px,3.2vw,46px)',
              lineHeight: 1.12,
            }}
          >
            {service.positioning}
          </p>
        </div>
      </section>

      {/* 3. Sound Familiar? Here's the Fix. */}
      {problems.length > 0 && (
        <section className="cr">
          <div className="in sec" style={{ paddingTop: 0 }}>
            <div className="stack" style={{ gap: '32px' }}>
              <div className="split rv" style={{ alignItems: 'end' }}>
                <h2 className="sf h2">Sound Familiar? Here&apos;s the Fix.</h2>
                <p className="ld mu">
                  The problems we hear most, and exactly what we do about each one.
                </p>
              </div>
              <FixRows rows={problems} />
            </div>
          </div>
        </section>
      )}

      {/* 4. What We Do Inside X */}
      {subServices.length > 0 && (
        <section className="wh">
          <div className="in sec">
            <div className="stack" style={{ gap: '40px' }}>
              <div className="split rv" style={{ alignItems: 'end' }}>
                <h2 className="sf h2">What We Do Inside {service.short}.</h2>
                <p className="ld mu">Pick one, or let us combine them into one plan.</p>
              </div>
              <div className="subs">
                {subServices.map((sub, i) => (
                  <div key={i} className="sub rv">
                    <span className="n tab">0{i + 1}</span>
                    <b className="sf h3">{sub.title}</b>
                    <span className="mu">{sub.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. What You Get */}
      {whatYouGet.length > 0 && (
        <section className="cr">
          <div className="in sec">
            <div className="stack" style={{ gap: '40px' }}>
              <h2 className="sf h2 rv">What You Get.</h2>
              <div className="cols c4">
                {whatYouGet.map((item, idx) => (
                  <div
                    key={idx}
                    className="stack rv"
                    style={{
                      gap: '10px',
                      borderTop: '2px solid var(--ink)',
                      paddingTop: '18px',
                    }}
                  >
                    <b style={{ fontSize: '20px' }}>{item.title}</b>
                    <span className="mu">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Signature section + Sticky Mockup */}
      <section className="dk">
        <div className="in sec">
          <div className="split">
            <div
              className="stack"
              style={{ gap: '24px', position: 'sticky', top: '120px' }}
            >
              <h2 className="sf h2">{signatureData.title || service.name}</h2>
              <div style={{ maxWidth: '380px' }}>
                <Vis kind={service.visualKind || 'site'} cls="r11" />
              </div>
            </div>
            <div>
              {/* Social media comparison */}
              {isSocial && (
                <div className="cols c2 rv" style={{ marginBottom: '28px' }}>
                  <div
                    className="stack"
                    style={{
                      gap: '10px',
                      borderTop: '1px solid var(--line-d)',
                      paddingTop: '16px',
                    }}
                  >
                    <span className="xs mu">Most agencies</span>
                    <span>Design posts</span>
                    <span>Write captions</span>
                    <span>Post on time</span>
                  </div>
                  <div
                    className="stack"
                    style={{
                      gap: '10px',
                      borderTop: '2px solid var(--lime)',
                      paddingTop: '16px',
                    }}
                  >
                    <span className="xs" style={{ color: 'var(--lime)' }}>
                      We also
                    </span>
                    <span>Reply to your DMs</span>
                    <span>Reply to comments</span>
                    <span>Pass leads to your team</span>
                  </div>
                </div>
              )}

              {signatureData.items.length > 0 && (
                <div className="stack">
                  {signatureData.items.map(([t, d], idx) => (
                    <div key={idx} className="tick rv">
                      <span />
                      <div className="stack" style={{ gap: '4px' }}>
                        <b style={{ fontSize: '19px' }}>{t}</b>
                        <span className="mu">{d}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Special Proof Gallery (SEO or Video) */}
      {isSeo && (
        <section className="dk">
          <div className="in sec">
            <div className="stack" style={{ gap: '28px' }}>
              <div className="split rv" style={{ alignItems: 'end' }}>
                <h2 className="sf h2">Real Results. Real Screenshots.</h2>
                <p className="ld mu">
                  Google Search, AI Overviews, Google Maps and Search Console, from our
                  client work.
                </p>
              </div>
              <div className="sgal">
                {[
                  { k: 's01', cap: '3.51M impressions in Google Search Console' },
                  { k: 's02', cap: '#1 on Google for "bitsat mentorship program 2027"' },
                  { k: 's24', cap: "Position 0: Google's AI Overview answer" },
                  { k: 's00', cap: '27.3K organic clicks during peak season' },
                  { k: 's12', cap: '9,873 Google Maps actions in 6 months' },
                  { k: 's23', cap: '+380% growth in organic search impressions' },
                ].map((shot, idx) => (
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <Link className="chip" href="/our-work/10q-challenge">
                  10Q Challenge →
                </Link>
                <Link className="chip" href="/our-work/allied-industrial-park">
                  Allied Industrial Park →
                </Link>
                <Link className="chip" href="/our-work/shigeru-beauty">
                  Shigeru Beauty →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {isVideo && (
        <section className="dk">
          <div className="in sec">
            <div className="stack" style={{ gap: '32px' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'end',
                  gap: '24px',
                }}
              >
                <h2 className="sf h2 rv">Watch Our Shoots.</h2>
                <Link className="tl arr" href="/videos">
                  All videos
                </Link>
              </div>
              <div className="vgrid">
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
                  {
                    title: 'Luxury Fragrance Autumn Collection',
                    label: 'Product Shoot · 4K Cinema',
                  },
                ].map((v, idx) => (
                  <Link key={idx} className="vcard rv" href="/videos">
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

      {/* 8. Who It's For */}
      {whoItsFor.length > 0 && (
        <section className="cr">
          <div className="in sec">
            <div className="stack" style={{ gap: '32px' }}>
              <h2 className="sf h2 rv">Who It&apos;s For.</h2>
              <div className="cols c3">
                {whoItsFor.map((item, idx) => (
                  <div
                    key={idx}
                    className="stack rv"
                    style={{
                      gap: '8px',
                      borderTop: '1px solid var(--ink)',
                      paddingTop: '18px',
                    }}
                  >
                    <span className="sf h3">{item.title}</span>
                    <span className="mu">{item.desc}</span>
                  </div>
                ))}
              </div>

              <div className="stack rv" style={{ gap: '14px', marginTop: '16px' }}>
                <span className="xs mu">Industries we do this for</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {industries.map((ind) => (
                    <Link
                      key={ind.slug}
                      className="chip"
                      href={`/industries/${ind.slug}`}
                    >
                      {ind.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9. How It Works */}
      {processSteps.length > 0 && (
        <section className="wh">
          <div className="in sec">
            <div className="stack" style={{ gap: '32px' }}>
              <h2 className="sf h2 rv">How It Works.</h2>
              <ol
                className="cols rv"
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  listStyle: 'none',
                  padding: 0,
                  borderTop: '2px solid var(--ink)',
                }}
              >
                {processSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="stack"
                    style={{ gap: '6px', paddingTop: '18px' }}
                  >
                    <span className="sf" style={{ fontSize: '44px', lineHeight: 1 }}>
                      {idx + 1}
                    </span>
                    <b>{step}</b>
                  </li>
                ))}
              </ol>

              {toolsList.length > 0 && (
                <div className="stack rv" style={{ gap: '12px', marginTop: '20px' }}>
                  <span className="xs mu">Tools we use</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {toolsList.map((tool, idx) => (
                      <span key={idx} className="chip">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 10. What's Included */}
      {deliverables.length > 0 && (
        <section className="cr">
          <div className="in sec">
            <div className="split">
              <div className="stack rv" style={{ gap: '16px' }}>
                <h2 className="sf h2">What&apos;s Included.</h2>
                <p className="mu">Exact numbers and the price are in your proposal.</p>
              </div>
              <div className="tbl rv">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">What</th>
                      <th scope="col">When / how much</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliverables.map(([what, when], idx) => (
                      <tr key={idx}>
                        <td>{what}</td>
                        <td className="mu">{when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 11. Related Work */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '40px' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'end',
                gap: '24px',
              }}
            >
              <h2 className="sf h2 rv">{service.short} Work We&apos;ve Done.</h2>
              <Link className="tl arr" href="/our-work">
                All work
              </Link>
            </div>
            <div className="cols c2" style={{ gap: '56px 32px' }}>
              {allCases.map((c) => {
                let svcsArr: string[] = [];
                try {
                  svcsArr = JSON.parse(c.services);
                } catch {}
                return (
                  <CaseCard
                    key={c.id}
                    id={c.slug}
                    client={c.client}
                    industryName={c.location || 'India'}
                    services={svcsArr}
                    oneLine={c.oneLine}
                    cover={c.coverMediaId || undefined}
                    logo={c.logoMediaId || undefined}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 12. Questions (FAQ) */}
      {faqs.length > 0 && (
        <section className="cr">
          <div className="in sec">
            <div className="split">
              <div className="stack rv" style={{ gap: '16px' }}>
                <h2 className="sf h2">Questions?</h2>
                <p className="mu">
                  Can&apos;t find yours?{' '}
                  <Link className="tl" href="/contact">
                    Just ask us.
                  </Link>
                </p>
              </div>
              <Faq items={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* 13. Read More & Other Services */}
      <section className="wh">
        <div className="in sec-s">
          <h2 className="sf h3" style={{ marginBottom: '12px' }}>
            Read more
          </h2>
          <ArtRows items={articles} />

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center',
              marginTop: '40px',
            }}
          >
            <span className="sm mu">Other services:</span>
            {otherServices.map((o) => (
              <Link key={o.slug} className="chip" href={`/services/${o.slug}`}>
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 14. CTA Band */}
      <CtaBand
        title={`Let's Talk About Your ${service.short}.`}
        sub="Tell us where you are today. We'll send a clear plan and price."
        service={service.short}
      />
    </>
  );
}

