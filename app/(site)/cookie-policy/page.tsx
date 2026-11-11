import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/site/Breadcrumb';

export const metadata: Metadata = {
  title: 'Cookie Policy | AegisKoncept',
  description: 'Information about how AegisKoncept uses cookies and tracking technologies.',
};

const sections = [
  {
    title: 'What cookies we use',
    body: 'Some cookies are needed for the site to work. Analytics and ad cookies (Google Analytics, Google Ads, Meta Pixel, Microsoft Clarity) only load if you say yes.',
  },
  {
    title: 'Changing your choice',
    body: 'You can change your choice anytime from the cookie settings link, or in your browser settings.',
  },
];

export default function CookiePolicyPage() {
  return (
    <section className="cr">
      <div className="in sec">
        <div className="stack" style={{ gap: 28, maxWidth: 760 }}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cookie Policy', href: '/cookie-policy' },
            ]}
          />

          <h1 className="sf h1">Cookie Policy</h1>
          <p className="mu">Last updated: 10 November 2026 · Draft, to be checked by a lawyer</p>

          <article className="prose" style={{ maxWidth: 'none' }}>
            {sections.map((sec) => (
              <div key={sec.title} style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 24, marginBottom: 8 }}>{sec.title}</h2>
                <p style={{ lineHeight: 1.6 }}>{sec.body}</p>
              </div>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
}

