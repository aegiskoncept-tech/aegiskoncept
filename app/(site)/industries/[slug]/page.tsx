import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/site/Breadcrumb';
import FixRows, { FixRowItem } from '@/components/site/FixRows';
import Faq, { FaqItem } from '@/components/site/Faq';
import CaseCard from '@/components/site/CaseCard';
import CtaBand from '@/components/site/CtaBand';
import { Vis } from '@/components/site/Mockups';
import JsonLd from '@/components/seo/JsonLd';
import { getFaqSchema, getBreadcrumbSchema } from '@/lib/jsonLd';
import { db } from '@/lib/db';
import { FALLBACK_INDUSTRIES, getFallbackIndustry } from '@/lib/staticFallbacks';

export async function generateStaticParams() {
  try {
    const industries = await db.industry.findMany({ select: { slug: true } });
    if (industries.length > 0) {
      return industries.map((i) => ({ slug: i.slug }));
    }
  } catch (err) {
    console.warn('generateStaticParams [industries] query failed, using static fallback:', err);
  }
  return FALLBACK_INDUSTRIES.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let ind = null;
  try {
    ind = await db.industry.findUnique({ where: { slug } });
  } catch {}
  if (!ind) ind = getFallbackIndustry(slug);
  if (!ind) return { title: 'Industry Not Found | AegisKoncept' };

  return {
    title: `Digital Marketing for ${ind.name} | AegisKoncept`,
    description: ind.sub,
    alternates: {
      canonical: `/industries/${ind.slug}`,
    },
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let ind: any = null;
  try {
    ind = await db.industry.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.warn(`Database query for industry ${slug} failed, falling back to static data:`, err);
  }
  if (!ind) ind = getFallbackIndustry(slug);
  if (!ind) notFound();

  // Parse issues (FixRows)
  let issuesList: FixRowItem[] = [];
  try {
    const parsed = JSON.parse(ind.issues);
    if (Array.isArray(parsed)) {
      issuesList = parsed.map((item: any) => ({
        problem: Array.isArray(item) ? item[0] : item.problem || '',
        detail: Array.isArray(item) ? item[1] : item.detail || '',
        fix: Array.isArray(item) ? item[2] : item.fix || '',
        serviceSlug: Array.isArray(item) ? item[3] : item.serviceSlug || '',
      }));
    }
  } catch {}

  // Parse faqs
  let faqsList: FaqItem[] = [];
  try {
    const parsed = JSON.parse(ind.faqs);
    if (Array.isArray(parsed)) {
      faqsList = parsed.map((item: any) => ({
        q: Array.isArray(item) ? item[0] : item.q || '',
        a: Array.isArray(item) ? item[1] : item.a || '',
      }));
    }
  } catch {}

  // Cases derived from this industry
  let matchingCases: any[] = [];
  try {
    matchingCases = await db.caseStudy.findMany({
      where: { industryId: ind.slug },
      orderBy: { order: 'asc' },
    });
  } catch {}

  // Other industries for chips
  let otherIndustries: any[] = [];
  try {
    otherIndustries = await db.industry.findMany({
      where: { id: { not: ind.id } },
      select: { slug: true, name: true },
    });
  } catch {}

  if (!otherIndustries || otherIndustries.length === 0) {
    otherIndustries = FALLBACK_INDUSTRIES.filter((s) => s !== ind.slug).map((s) => ({
      slug: s,
      name: getFallbackIndustry(s)?.name || s,
    }));
  }

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Industries', url: '/industries' },
    { name: ind.name, url: `/industries/${ind.slug}` },
  ]);
  const faqSchema = getFaqSchema(faqsList);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema].filter(Boolean) as any} />
      {/* 1. Hero */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Industries', href: '/industries' },
                { label: ind.name },
              ]}
            />
            <div className="split-r">
              <div className="stack" style={{ gap: '24px' }}>
                <span className="lbl">{ind.name}</span>
                <h1 className="sf h1">{ind.h1}</h1>
                <p className="ld">{ind.sub}</p>
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
                <Vis kind={ind.visualKind || 'site'} cls="rarch" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Problems & How We Fix Them */}
      {issuesList.length > 0 && (
        <section className="cr">
          <div className="in sec">
            <div className="stack" style={{ gap: '32px' }}>
              <div className="split rv" style={{ alignItems: 'end' }}>
                <h2 className="sf h2">The Problems. And How We Fix Them.</h2>
                <p className="ld mu">
                  Common hurdles in {ind.name}, and our battle-tested solutions.
                </p>
              </div>
              <FixRows rows={issuesList} />
            </div>
          </div>
        </section>
      )}

      {/* 3. Where We'd Start */}
      <section className="wh">
        <div className="in sec">
          <div className="stack" style={{ gap: '32px' }}>
            <div className="split rv" style={{ alignItems: 'end' }}>
              <h2 className="sf h2">Where We&apos;d Start.</h2>
              <p className="ld mu">
                Most businesses in this space try to do everything at once. Here is the
                smart sequence.
              </p>
            </div>
            <div className="cols c3">
              {[
                {
                  step: '1. Foundation',
                  title: 'Fix the Conversion Asset',
                  desc: 'A modern, lightning-fast website or landing page that builds instant trust and makes enquiry effortless.',
                },
                {
                  step: '2. High-Intent Traffic',
                  title: 'Capture Active Buyers',
                  desc: 'Rank on Google Search and run tightly targeted Google Ads for people actively looking for what you sell right now.',
                },
                {
                  step: '3. Brand Recall & Retention',
                  title: 'Scale Organic & Social',
                  desc: 'Consistent 4K reels, stories, retargeting ads, and review generation to ensure customers keep coming back.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="stack rv"
                  style={{
                    gap: '10px',
                    borderTop: '2px solid var(--ink)',
                    paddingTop: '18px',
                  }}
                >
                  <span className="xs mu">{item.step}</span>
                  <b style={{ fontSize: '20px' }}>{item.title}</b>
                  <span className="mu">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Work in this Industry */}
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
              <h2 className="sf h2 rv">Our Work in {ind.name}.</h2>
              <Link className="tl arr" href="/our-work">
                All work
              </Link>
            </div>

            {matchingCases.length > 0 ? (
              <div className="cols c2" style={{ gap: '56px 32px' }}>
                {matchingCases.map((c) => {
                  let svcsArr: string[] = [];
                  try {
                    svcsArr = JSON.parse(c.services);
                  } catch {}
                  return (
                    <CaseCard
                      key={c.id}
                      id={c.slug}
                      client={c.client}
                      industryName={ind.name}
                      services={svcsArr}
                      oneLine={c.oneLine}
                      cover={c.coverMediaId || undefined}
                      logo={c.logoMediaId || undefined}
                    />
                  );
                })}
              </div>
            ) : (
              <div
                className="rv"
                style={{
                  background: 'var(--panel)',
                  padding: '48px',
                  textAlign: 'center',
                }}
              >
                <h3 className="sf h2" style={{ marginBottom: '12px' }}>
                  Be our first {ind.name} story.
                </h3>
                <p className="ld mu" style={{ maxWidth: '520px', margin: '0 auto 24px' }}>
                  We are looking for an ambitious business in {ind.name} to partner with and build our marquee case study.
                </p>
                <Link className="btn b-l" href="/contact">
                  Let&apos;s Build Together
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Your First 90 Days */}
      <section className="cr">
        <div className="in sec">
          <div className="stack" style={{ gap: '32px' }}>
            <h2 className="sf h2 rv">Your First 90 Days.</h2>
            <div className="cols c3">
              {[
                {
                  month: 'Month 1',
                  focus: 'Audit & Quick Wins',
                  desc: 'Full competitor teardown, Google Maps optimization, technical fixes, and fast lead generation campaigns.',
                },
                {
                  month: 'Month 2',
                  focus: 'Scale What Works',
                  desc: 'Scale high-converting ad sets, launch content schedule, and roll out targeted SEO landing pages.',
                },
                {
                  month: 'Month 3',
                  focus: 'Compounding Growth',
                  desc: 'Systematize review collection, optimize CPA, and expand into retargeting and video reels.',
                },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="stack rv"
                  style={{
                    gap: '8px',
                    borderTop: '1px solid var(--ink)',
                    paddingTop: '18px',
                  }}
                >
                  <span className="xs mu">{m.month}</span>
                  <span className="sf h3">{m.focus}</span>
                  <span className="mu">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Industry FAQ */}
      {faqsList.length > 0 && (
        <section className="wh">
          <div className="in sec">
            <div className="split">
              <div className="stack rv" style={{ gap: '16px' }}>
                <h2 className="sf h2">Questions?</h2>
                <p className="mu">
                  Common questions from {ind.name} founders and managers.
                </p>
              </div>
              <Faq items={faqsList} />
            </div>
          </div>
        </section>
      )}

      {/* 7. Other Industries Chips */}
      <section className="dk">
        <div className="in sec-s">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <span className="sm mu">Other industries:</span>
            {otherIndustries.map((o) => (
              <Link key={o.slug} className="chip" href={`/industries/${o.slug}`}>
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA Band */}
      <CtaBand
        title={`Ready to Grow Your ${ind.name} Business?`}
        sub="Tell us where you are today. We'll send a clear roadmap and proposal."
      />
    </>
  );
}

