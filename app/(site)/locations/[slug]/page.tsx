import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/site/Breadcrumb';
import FixRows, { FixRowItem } from '@/components/site/FixRows';
import Faq, { FaqItem } from '@/components/site/Faq';
import CaseCard from '@/components/site/CaseCard';
import CtaBand from '@/components/site/CtaBand';
import { Stage, Serp } from '@/components/site/Mockups';
import JsonLd from '@/components/seo/JsonLd';
import { getLocalBusinessSchema, getFaqSchema, getBreadcrumbSchema } from '@/lib/jsonLd';
import { db } from '@/lib/db';
import {
  FALLBACK_LOCATIONS,
  getFallbackLocation,
  FALLBACK_SERVICES,
  getFallbackService,
  getFallbackCase,
} from '@/lib/staticFallbacks';

export async function generateStaticParams() {
  try {
    const locations = await db.location.findMany({ select: { slug: true } });
    if (locations.length > 0) {
      return locations.map((l) => ({ slug: l.slug }));
    }
  } catch (err) {
    console.warn('generateStaticParams [locations] query failed, using static fallback:', err);
  }
  return FALLBACK_LOCATIONS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let loc = null;
  try {
    loc = await db.location.findUnique({ where: { slug: params.slug } });
  } catch {}
  if (!loc) loc = getFallbackLocation(params.slug);
  if (!loc) return { title: 'Locations | AegisKoncept' };

  return {
    title: `Digital Marketing Agency in ${loc.name} | AegisKoncept`,
    description: loc.sub,
    alternates: {
      canonical: `/locations/${loc.slug}`,
    },
  };
}

export default async function LocationDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let loc: any = null;
  try {
    loc = await db.location.findUnique({
      where: { slug: params.slug },
    });
  } catch (err) {
    console.warn(`Database query for location ${params.slug} failed, falling back to static data:`, err);
  }
  if (!loc) loc = getFallbackLocation(params.slug);
  if (!loc) notFound();

  // Parse JSON data safely
  let businessesChips: string[] = [];
  try {
    const parsed = JSON.parse(loc.businesses);
    if (Array.isArray(parsed)) businessesChips = parsed;
  } catch {}

  let challengesList: FixRowItem[] = [];
  try {
    const parsed = JSON.parse(loc.challenges);
    if (Array.isArray(parsed)) {
      challengesList = parsed.map((item: any) => ({
        problem: Array.isArray(item) ? item[0] : item.problem || '',
        detail: Array.isArray(item) ? item[1] : item.detail || '',
        fix: Array.isArray(item) ? item[2] : item.fix || '',
        serviceSlug: Array.isArray(item) ? item[3] : item.serviceSlug || '',
      }));
    }
  } catch {}

  let searchesList: string[] = [];
  try {
    const parsed = JSON.parse(loc.searches);
    if (Array.isArray(parsed)) searchesList = parsed;
  } catch {}

  let nearbyList: Array<{ name: string; slug: string }> = [];
  try {
    const parsed = JSON.parse(loc.nearbyIds);
    if (Array.isArray(parsed)) {
      nearbyList = parsed.map((item: any) => ({
        name: Array.isArray(item) ? item[0] : item.name || '',
        slug: Array.isArray(item) ? item[1] : item.slug || '',
      }));
    }
  } catch {}

  // Featured case study
  let featuredCase = null;
  try {
    featuredCase = loc.featuredCaseId
      ? await db.caseStudy.findUnique({ where: { slug: loc.featuredCaseId } })
      : null;
  } catch {}
  if (!featuredCase && loc.featuredCaseId) {
    featuredCase = getFallbackCase(loc.featuredCaseId);
  }

  // Local FAQs
  const localFaqs: FaqItem[] = loc.isOffice
    ? [
        {
          q: 'Where is your Dwarka office located?',
          a: 'Our main office is in Sector 7, Ramphal Chowk, Dwarka, New Delhi 110075. Please book a slot before visiting so our founders can give you full attention.',
        },
        {
          q: 'Do you only work with businesses in Dwarka?',
          a: 'No, we work with businesses across Delhi NCR, Gurugram, Noida, and internationally across the UK and US. You can work with us in person or entirely online.',
        },
        {
          q: 'How quickly can we start?',
          a: 'After our initial call or meeting, we send a written proposal within 24 hours. Once approved, work begins within 3 to 5 business days.',
        },
      ]
    : [
        {
          q: `Do you have an office in ${loc.name}?`,
          a: `Our main studio is located in Dwarka, New Delhi. For clients in ${loc.name}, we hold in-person meetings at your location or meet over Google Meet.`,
        },
        {
          q: `Can you rank my business on Google Maps in ${loc.name}?`,
          a: `Yes. We specialize in local SEO, Google Business Profile optimization, local citations, and geo-targeted schema to get you in the local top-3 Maps pack.`,
        },
        {
          q: `Which service is best for a business in ${loc.name}?`,
          a: `Most local businesses start with Local SEO + Google Maps optimization paired with targeted Instagram / Meta ads to drive direct WhatsApp enquiries.`,
        },
      ];

  // All 5 services
  let allServices: any[] = [];
  try {
    allServices = await db.service.findMany({
      orderBy: { order: 'asc' },
    });
  } catch {}

  if (!allServices || allServices.length === 0) {
    allServices = FALLBACK_SERVICES.map(getFallbackService).filter(Boolean);
  }

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Locations', url: '/locations' },
    { name: loc.name, url: `/locations/${loc.slug}` },
  ]);
  const localBusinessSchema = getLocalBusinessSchema({
    name: loc.name,
    slug: loc.slug,
    sub: loc.sub,
    zone: loc.zone || undefined,
  });
  const faqSchema = getFaqSchema(localFaqs);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, localBusinessSchema, faqSchema].filter(Boolean) as any} />
      {/* 1. Hero */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Locations', href: '/locations' },
                { label: loc.name },
              ]}
            />
            <div className="split-r">
              <div className="stack" style={{ gap: '24px' }}>
                <span className="lbl">{loc.zone || 'Delhi NCR'}</span>
                <h1 className="sf h1">{loc.h1}</h1>
                <p className="ld">{loc.sub}</p>
                <div className="row-btn">
                  <Link className="btn b-l" href="/contact">
                    Get a Free Quote
                  </Link>
                  <a
                    className="btn b-o"
                    href="https://wa.me/917303468073"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
              <div className="rv">
                {loc.isOffice ? (
                  <Stage cls="rarch" label="Dwarka Office Map">
                    <div
                      style={{
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        color: 'var(--cream)',
                      }}
                    >
                      <span className="lbl" style={{ color: 'var(--lime)' }}>
                        Office Location
                      </span>
                      <b className="sf h3" style={{ fontSize: '24px' }}>
                        Dwarka, New Delhi
                      </b>
                      <p className="sm mu">Sector 7, Ramphal Chowk · 110075</p>
                    </div>
                  </Stage>
                ) : (
                  <Stage cls="rarch" label={`${loc.name} local search`}>
                    <Serp
                      q={searchesList[0] || `best service in ${loc.name.toLowerCase()}`}
                      title={`Your Business · ${loc.name}`}
                      url="yourbrand.in"
                      style={{ position: 'relative' }}
                    />
                  </Stage>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Doing Business in X */}
      {loc.land && (
        <section className="cr">
          <div className="in sec">
            <div className="stack" style={{ gap: '24px' }}>
              <h2 className="sf h2 rv">Doing Business in {loc.name}.</h2>
              <p className="ld mu" style={{ maxWidth: '840px' }}>
                {loc.land}
              </p>

              {businessesChips.length > 0 && (
                <div className="stack rv" style={{ gap: '12px', marginTop: '12px' }}>
                  <span className="xs mu">Businesses we often help in this area</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {businessesChips.map((chip, idx) => (
                      <span key={idx} className="chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. Local Challenges FixRows */}
      {challengesList.length > 0 && (
        <section className="wh">
          <div className="in sec">
            <div className="stack" style={{ gap: '32px' }}>
              <div className="split rv" style={{ alignItems: 'end' }}>
                <h2 className="sf h2">Local Challenges. And How We Fix Them.</h2>
                <p className="ld mu">
                  Real challenges {loc.name} business owners face, and how we solve them.
                </p>
              </div>
              <FixRows rows={challengesList} />
            </div>
          </div>
        </section>
      )}

      {/* 4. What People Search in X */}
      {searchesList.length > 0 && (
        <section className="dk">
          <div className="in sec-s">
            <div className="stack" style={{ gap: '16px' }}>
              <span className="xs mu">What people search in {loc.name}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {searchesList.map((term, idx) => (
                  <span
                    key={idx}
                    className="chip"
                    style={{ background: 'var(--panel)' }}
                  >
                    &ldquo;{term}&rdquo;
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. How We Help (Services) */}
      <section className="cr">
        <div className="in sec">
          <div className="stack" style={{ gap: '32px' }}>
            <div className="split rv" style={{ alignItems: 'end' }}>
              <h2 className="sf h2">How We Help {loc.name} Businesses.</h2>
              <p className="ld mu">Five core capabilities from one dedicated agency.</p>
            </div>
            <div className="cols c3">
              {allServices.map((s) => (
                <Link
                  key={s.id}
                  className="case rv"
                  href={`/services/${s.slug}`}
                  style={{
                    background: 'var(--white)',
                    padding: '28px',
                    textDecoration: 'none',
                    gap: '10px',
                  }}
                >
                  <span className="sf h3">{s.name}</span>
                  <span className="mu sm">{s.line}</span>
                  <span className="go" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Case Study */}
      {featuredCase && (
        <section className="dk">
          <div className="in sec">
            <div className="stack" style={{ gap: '28px' }}>
              <div className="split rv" style={{ alignItems: 'end' }}>
                <h2 className="sf h2">Featured Client Story.</h2>
                <Link className="tl arr" href="/our-work">
                  All case studies
                </Link>
              </div>
              <div className="cols c2">
                <CaseCard
                  id={featuredCase.slug}
                  client={featuredCase.client}
                  industryName={featuredCase.location || 'India'}
                  services={JSON.parse(featuredCase.services || '[]')}
                  oneLine={featuredCase.oneLine}
                  cover={featuredCase.coverMediaId || undefined}
                  logo={featuredCase.logoMediaId || undefined}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. Local FAQ */}
      <section className="wh">
        <div className="in sec">
          <div className="split">
            <div className="stack rv" style={{ gap: '16px' }}>
              <h2 className="sf h2">Questions?</h2>
              <p className="mu">
                Common questions about marketing your business in {loc.name}.
              </p>
            </div>
            <Faq items={localFaqs} />
          </div>
        </div>
      </section>

      {/* 8. Nearby Areas */}
      {nearbyList.length > 0 && (
        <section className="dk">
          <div className="in sec-s">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <span className="sm mu">Nearby areas we also serve:</span>
              {nearbyList.map((n, idx) => (
                <Link key={idx} className="chip" href={`/locations/${n.slug}`}>
                  {n.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. CTA Band */}
      <CtaBand
        title={`Let's Grow Your Business in ${loc.name}.`}
        sub="Tell us about your business and goals. We'll send a clear local growth plan."
      />
    </>
  );
}

