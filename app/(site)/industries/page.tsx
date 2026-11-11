import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/site/Breadcrumb';
import CtaBand from '@/components/site/CtaBand';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Industries We Serve | AegisKoncept',
  description:
    'Digital marketing tailored by sector: D2C brands, healthcare, interiors, real estate, education, SaaS and professional services in India.',
};

export default async function IndustriesHubPage() {
  const industries = await db.industry.findMany({
    orderBy: { order: 'asc' },
  });

  const allCases = await db.caseStudy.findMany({
    select: { industryId: true },
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
                { label: 'Industries' },
              ]}
            />
            <div className="split" style={{ alignItems: 'end' }}>
              <h1 className="sf d1">Industries We Serve.</h1>
              <p className="ld">
                Every sector has its own customer behaviour, search habits and objections.
                Here is how we market each one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Industries Hub Grid */}
      <section className="cr">
        <div className="in sec">
          <div className="ihub">
            {industries.map((ind) => {
              let firstIssue = { problem: '', fix: '' };
              try {
                const parsed = JSON.parse(ind.issues);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  const item = parsed[0];
                  firstIssue = {
                    problem: Array.isArray(item) ? item[0] : item.problem || '',
                    fix: Array.isArray(item) ? item[2] : item.fix || '',
                  };
                }
              } catch {}

              const caseCount = allCases.filter((c) => c.industryId === ind.slug).length;

              return (
                <Link
                  key={ind.id}
                  className="ihc rv"
                  href={`/industries/${ind.slug}`}
                >
                  <span className="xs mu">
                    {caseCount} {caseCount === 1 ? 'client' : 'clients'}
                  </span>
                  <span className="sf h3">{ind.name}</span>
                  {firstIssue.problem && (
                    <span className="mu sm">
                      {firstIssue.problem}? {firstIssue.fix}
                    </span>
                  )}
                  <span className="go" aria-hidden="true">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CTA Band */}
      <CtaBand
        title="Don't See Your Industry?"
        sub="Tell us about your business. We'll share what we've seen work for businesses like yours."
      />
    </>
  );
}

