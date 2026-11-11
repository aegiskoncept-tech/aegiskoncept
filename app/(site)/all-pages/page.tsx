import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'All Pages Directory | AegisKoncept',
  description: 'Complete directory of all pages across AegisKoncept website.',
};

import {
  FALLBACK_SERVICES,
  FALLBACK_CASES,
  FALLBACK_INDUSTRIES,
  FALLBACK_LOCATIONS,
  getFallbackIndustry,
  getFallbackLocation,
  getFallbackCase,
  getFallbackService,
} from '@/lib/staticFallbacks';

export default async function AllPages() {
  let services: any[] = [];
  let cases: any[] = [];
  let industries: any[] = [];
  let locations: any[] = [];

  try {
    [services, cases, industries, locations] = await Promise.all([
      db.service.findMany({ select: { slug: true, name: true }, orderBy: { order: 'asc' } }),
      db.caseStudy.findMany({ select: { slug: true, client: true }, orderBy: { order: 'asc' } }),
      db.industry.findMany({ select: { slug: true, name: true }, orderBy: { name: 'asc' } }),
      db.location.findMany({ select: { slug: true, name: true }, orderBy: { name: 'asc' } }),
    ]);
  } catch (err) {
    console.warn('AllPages database fetch failed, using static fallbacks:', err);
    services = FALLBACK_SERVICES.map((s) => ({ slug: s, name: getFallbackService(s)?.name || s }));
    cases = FALLBACK_CASES.map((c) => ({ slug: c, client: getFallbackCase(c)?.client || c }));
    industries = FALLBACK_INDUSTRIES.map((i) => ({ slug: i, name: getFallbackIndustry(i)?.name || i }));
    locations = FALLBACK_LOCATIONS.map((l) => ({ slug: l, name: getFallbackLocation(l)?.name || l }));
  }

  const groups = [
    {
      title: 'Main',
      links: [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/services', label: 'Services' },
        { href: '/our-work', label: 'Our Work' },
        { href: '/videos', label: 'Videos' },
        { href: '/industries', label: 'Industries' },
        { href: '/locations', label: 'Locations' },
        { href: '/insights', label: 'Blog' },
        { href: '/contact', label: 'Contact' },
      ],
    },
    {
      title: 'Services',
      links: services.map((s) => ({
        href: `/services/${s.slug}`,
        label: s.name,
      })),
    },
    {
      title: 'Our Work',
      links: cases.map((c) => ({
        href: `/our-work/${c.slug}`,
        label: c.client,
      })),
    },
    {
      title: 'Industries',
      links: industries.map((i) => ({
        href: `/industries/${i.slug}`,
        label: i.name,
      })),
    },
    {
      title: 'Locations',
      links: locations.map((l) => ({
        href: `/locations/${l.slug}`,
        label: l.name,
      })),
    },
    {
      title: 'Blog',
      links: [
        { href: '/insights/seo-cost-india', label: 'Article: SEO cost in India' },
        { href: '/insights/author/ritesh-kumar', label: 'Writer: Ritesh Kumar' },
      ],
    },
    {
      title: 'Other',
      links: [
        { href: '/thank-you', label: 'Thank you' },
        { href: '/privacy-policy', label: 'Privacy policy' },
        { href: '/terms-and-conditions', label: 'Terms' },
        { href: '/cookie-policy', label: 'Cookies' },
        { href: '/404', label: '404 page' },
      ],
    },
  ];

  const totalPages = groups.reduce((acc, g) => acc + g.links.length, 0);

  return (
    <section className="cr">
      <div className="in sec">
        <div className="stack" style={{ gap: 32 }}>
          <span className="lbl">For review</span>
          <h1 className="sf h1">Every Page on the Website.</h1>
          <p className="ld mu">
            {totalPages} pages. Open one, then click around like a visitor would.
          </p>

          <div className="cols c3" style={{ gap: '40px 32px' }}>
            {groups.map((group) => (
              <div key={group.title} className="stack" style={{ gap: 8 }}>
                <b style={{ fontSize: 18, borderBottom: '1px solid var(--line-c)', paddingBottom: 6 }}>
                  {group.title}
                </b>
                {group.links.map((link) => (
                  <Link key={link.href} className="tl" href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
