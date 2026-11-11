import React from 'react';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/site/Breadcrumb';

export const metadata: Metadata = {
  title: 'Terms and Conditions | AegisKoncept',
  description: 'Terms and conditions for using the AegisKoncept website.',
};

const sections = [
  {
    title: 'Using this website',
    body: 'By using this site, you agree to these terms. The content is general information and may change.',
  },
  {
    title: 'Our services',
    body: 'Our work is covered by a separate written proposal or agreement with the scope, price and timeline.',
  },
  {
    title: 'Our content',
    body: 'The AegisKoncept name, logo and website content belong to us. Client work is shown with permission.',
  },
  {
    title: 'Questions',
    body: 'Email hello@aegiskoncept.com.',
  },
];

export default function TermsAndConditionsPage() {
  return (
    <section className="cr">
      <div className="in sec">
        <div className="stack" style={{ gap: 28, maxWidth: 760 }}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Terms and Conditions', href: '/terms-and-conditions' },
            ]}
          />

          <h1 className="sf h1">Terms and Conditions</h1>
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

