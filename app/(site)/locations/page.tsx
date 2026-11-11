import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/site/Breadcrumb';
import CtaBand from '@/components/site/CtaBand';
import { db } from '@/lib/db';
import { FALLBACK_LOCATIONS, getFallbackLocation } from '@/lib/staticFallbacks';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Digital Marketing Across Delhi NCR | AegisKoncept',
  description:
    'Digital marketing services across Delhi NCR: Dwarka, Janakpuri, Rohini, Connaught Place, Gurugram, Noida and all major commercial hubs.',
};

export default async function LocationsHubPage() {
  let locations: any[] = [];
  try {
    locations = await db.location.findMany({
      orderBy: { order: 'asc' },
    });
  } catch (err) {
    console.warn('[LocationsHub] DB unavailable, falling back to static locations:', err);
  }

  if (!locations || locations.length === 0) {
    locations = FALLBACK_LOCATIONS.map((slug) => getFallbackLocation(slug)).filter(Boolean);
  }

  const delhiHub = locations.find((l) => l.slug === 'delhi') || locations[0];
  const delhiAreas = locations.filter((l) => l.parentId === 'delhi' || (l.zone && l.slug !== 'delhi' && l.slug !== 'gurugram' && l.slug !== 'noida'));
  const ncrHubs = locations.filter((l) => l.slug === 'gurugram' || l.slug === 'noida');

  return (
    <>
      {/* 1. Hero */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Locations' },
              ]}
            />
            <div className="split" style={{ alignItems: 'end' }}>
              <h1 className="sf d1">Digital Marketing Across Delhi NCR.</h1>
              <p className="ld">
                Our main office is in Dwarka, New Delhi. We work with businesses across
                Delhi, Gurugram and Noida, in person or on video calls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Delhi Card */}
      {delhiHub && (
        <section className="dk">
          <div className="in sec" style={{ paddingTop: 0 }}>
            <Link
              className="case rv"
              href={`/locations/${delhiHub.slug}`}
              style={{
                background: 'var(--panel)',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                textDecoration: 'none',
              }}
            >
              <span className="lbl">Capital Region Hub</span>
              <h2 className="sf h2" style={{ margin: 0 }}>
                {delhiHub.name}
              </h2>
              <p className="ld mu" style={{ maxWidth: '640px' }}>
                {delhiHub.sub}
              </p>
              <span className="tl arr">Explore Delhi Marketing Services</span>
            </Link>
          </div>
        </section>
      )}

      {/* 3. Delhi Areas Grid */}
      <section className="cr">
        <div className="in sec">
          <div className="stack" style={{ gap: '32px' }}>
            <div className="split rv" style={{ alignItems: 'end' }}>
              <h2 className="sf h2">Areas in Delhi.</h2>
              <p className="ld mu">
                Local SEO, Google Maps and Meta ads tailored to the customer profile of each area.
              </p>
            </div>

            <div className="areas">
              {delhiAreas.map((l) => (
                <Link key={l.id} className="ar rv" href={`/locations/${l.slug}`}>
                  <span className="xs mu">{l.zone || 'Delhi Area'}</span>
                  <b className="sf h3">{l.name}</b>
                  <span className="go" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>

            {/* Across NCR chips */}
            {ncrHubs.length > 0 && (
              <div className="stack rv" style={{ gap: '12px', marginTop: '16px' }}>
                <span className="xs mu">Across NCR</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ncrHubs.map((ncr) => (
                    <Link key={ncr.id} className="chip" href={`/locations/${ncr.slug}`}>
                      {ncr.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Why Location Matters in Delhi NCR */}
      <section className="wh">
        <div className="in sec">
          <div className="stack" style={{ gap: '32px' }}>
            <h2 className="sf h2 rv">Why Location Matters in Delhi NCR.</h2>
            <div className="cols c4">
              {[
                {
                  title: 'Hyperlocal Intent',
                  desc: 'Over 78% of mobile searches in Delhi include "near me" or specific colony and sector names.',
                },
                {
                  title: 'Google Maps Top 3',
                  desc: 'Winning the local 3-pack for high-intent keywords drives high-converting inbound calls with 0 ad spend.',
                },
                {
                  title: 'Geo-Targeted Ads',
                  desc: 'Targeting specific residential clusters and high-density metro corridors prevents ad budget wastage.',
                },
                {
                  title: 'WhatsApp Conversions',
                  desc: 'Delhi consumers prefer direct WhatsApp chat. We connect every ad and Maps listing directly to your team.',
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
                  <b style={{ fontSize: '20px' }}>{item.title}</b>
                  <span className="mu">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Band */}
      <CtaBand
        title="Let's Meet."
        sub="Visit us in Dwarka (please book first), or start with a video call."
      />
    </>
  );
}

