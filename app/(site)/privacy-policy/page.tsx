import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/site/Breadcrumb';

export const metadata: Metadata = {
  title: 'Privacy Policy | AegisKoncept',
  description: 'How AegisKoncept collects, uses, and protects your information.',
};

const sections = [
  {
    title: 'Who we are',
    body: 'AegisKoncept is a digital marketing agency in Dwarka, New Delhi. This page explains what information we collect on this website and how we use it.',
  },
  {
    title: 'What we collect',
    body: 'What you type into our forms (name, business, email, phone, the service you want and your message). If you allow cookies, we also collect anonymous data about how people use the site.',
  },
  {
    title: 'How we use it',
    body: 'To reply to you, send proposals, improve the website and check how our marketing is doing. We never sell your information.',
  },
  {
    title: 'Your choices',
    body: 'You can ask us to show, change or delete your information anytime. Just email hello@aegiskoncept.com.',
  },
  {
    title: 'Questions',
    body: 'Email hello@aegiskoncept.com.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="cr">
      <div className="in sec">
        <div className="stack" style={{ gap: 28, maxWidth: 760 }}>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Privacy Policy', href: '/privacy-policy' },
            ]}
          />

          <h1 className="sf h1">Privacy Policy</h1>
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

