import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/site/Breadcrumb';
import CtaBand from '@/components/site/CtaBand';
import { Stage } from '@/components/site/Mockups';
import { ARCH_PATH } from '@/components/site/Icons';

export const metadata: Metadata = {
  title: 'About Us | AegisKoncept',
  description:
    'AegisKoncept is an independent digital marketing agency in Dwarka, New Delhi. Founded by Ritesh Kumar and Yogeesh Gahlot.',
};

export default function AboutPage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '28px' }}>
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'About' },
              ]}
            />
            <div className="split-r">
              <div className="stack" style={{ gap: '24px' }}>
                <h1 className="sf d1">A Team That Grows With You.</h1>
                <p className="ld">
                  We help Indian businesses grow online. One team for your website, Google,
                  ads and social media, working with you every month.
                </p>
                <div className="row-btn">
                  <Link className="btn b-l" href="/contact">
                    Work With Us
                  </Link>
                  <Link className="btn b-o" href="/our-work">
                    See Our Results
                  </Link>
                </div>
              </div>
              <div className="rv">
                <Stage cls="rarch" label="AegisKoncept Brand Arch">
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px',
                    }}
                  >
                    <svg viewBox="0 0 100 110" width="56" height="62" aria-hidden="true">
                      <path d={ARCH_PATH} fill="var(--lime)" />
                    </svg>
                    <span className="sf" style={{ fontSize: '28px', color: 'var(--cream)' }}>
                      AegisKoncept
                    </span>
                  </div>
                </Stage>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How We Started (Founders) */}
      <section className="cr">
        <div className="in sec">
          <div className="split">
            <div className="stack rv" style={{ gap: '24px' }}>
              <span className="lbl">The Story</span>
              <h2 className="sf h2">Built for Growing Businesses.</h2>
              <figure className="stack" style={{ gap: '18px', marginTop: '8px' }}>
                <div className="cols c2" style={{ maxWidth: '420px', gap: '12px' }}>
                  <div className="mono">RK</div>
                  <div className="mono" style={{ background: 'var(--ink)' }}>
                    YG
                  </div>
                </div>
                <blockquote
                  className="big-quote"
                  style={{ fontSize: 'clamp(26px,2.4vw,34px)' }}
                >
                  &ldquo;Most agencies hand clients over to interns after the sale. We wanted to build the agency we wished we had when we started.&rdquo;
                </blockquote>
                <figcaption className="sm mu">
                  Ritesh Kumar &amp; Yogeesh Gahlot, Founders
                </figcaption>
              </figure>
            </div>
            <div className="stack measure" style={{ gap: '20px', fontSize: '18px', lineHeight: 1.6 }}>
              <p>
                AegisKoncept started in December 2021 with a simple focus on SEO in New Delhi.
                Over the years, as our clients grew, they asked us to take over their websites,
                paid ads, video shoots, and social media channels.
              </p>
              <p>
                Today, we run an integrated team in Dwarka, working with ambitious brands across
                Delhi NCR, the UK, and North America. You don&apos;t get confusing jargon or
                vanity metrics — just clean execution, honest reporting, and real revenue impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Who Does What (Team Grid) */}
      <section className="wh">
        <div className="in sec">
          <div className="stack" style={{ gap: '40px' }}>
            <div className="split rv" style={{ alignItems: 'end' }}>
              <h2 className="sf h2">The People on Your Account.</h2>
              <p className="ld mu">Senior specialists who do the work themselves.</p>
            </div>
            <div className="cols c4">
              {[
                {
                  ini: 'RK',
                  name: 'Ritesh Kumar',
                  role: 'Founder · SEO & Growth',
                  desc: 'Started SEO in 2021. Leads technical search architecture, AI Overviews optimization and client strategy.',
                },
                {
                  ini: 'YG',
                  name: 'Yogeesh Gahlot',
                  role: 'Founder · Creative & Video',
                  desc: 'Leads our 4K video production crew, commercial cinematography, visual identity and ad creatives.',
                },
                {
                  ini: 'YK',
                  name: 'Yashi Kaushik',
                  role: 'Social Media & Community',
                  desc: 'Manages editorial calendars, viral reel scripting, and active DM customer service on client handles.',
                },
                {
                  ini: 'NK',
                  name: 'Nisha Khanna',
                  role: 'Content & Copywriting',
                  desc: 'Crafts persuasive long-form SEO guides, website copy, and high-converting ad copy in clean English.',
                },
              ].map((member, idx) => (
                <div
                  key={idx}
                  className="stack rv"
                  style={{
                    gap: '12px',
                    borderTop: '2px solid var(--ink)',
                    paddingTop: '20px',
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      width: '48px',
                      height: '48px',
                      fontSize: '18px',
                      borderRadius: '50%',
                    }}
                  >
                    {member.ini}
                  </div>
                  <div>
                    <b className="sf h3" style={{ fontSize: '22px' }}>
                      {member.name}
                    </b>
                    <span
                      className="xs mu"
                      style={{ display: 'block', marginTop: '2px' }}
                    >
                      {member.role}
                    </span>
                  </div>
                  <p className="mu sm">{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. How We Work */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: '40px' }}>
            <h2 className="sf h2 rv">How We Work With Clients.</h2>
            <div className="cols c4">
              {[
                {
                  num: '01',
                  title: 'Listen First',
                  desc: 'We learn your unit economics, profit margins and customer lifetime value before proposing any ad budget.',
                },
                {
                  num: '02',
                  title: 'No Junior Layers',
                  desc: 'You speak directly with the people writing your copy, configuring your ads and editing your footage.',
                },
                {
                  num: '03',
                  title: 'Clear Revenue Metrics',
                  desc: 'We measure success on qualified calls, closed appointments and booked sales, not vanity impressions.',
                },
                {
                  num: '04',
                  title: 'Long-Term Partners',
                  desc: 'Most of our clients have been with us for 2+ years. We grow alongside you from startup to scale.',
                },
              ].map((rule, idx) => (
                <div
                  key={idx}
                  className="stack rv"
                  style={{
                    gap: '10px',
                    borderTop: '1px solid var(--line-d)',
                    paddingTop: '18px',
                  }}
                >
                  <span className="n tab" style={{ color: 'var(--lime)' }}>
                    {rule.num}
                  </span>
                  <b style={{ fontSize: '20px' }}>{rule.title}</b>
                  <span className="mu sm">{rule.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Dwarka Office */}
      <section className="cr">
        <div className="in sec">
          <div className="split" style={{ alignItems: 'center' }}>
            <div className="stack rv" style={{ gap: '16px' }}>
              <h2 className="sf h2">Our Office in Dwarka.</h2>
              <p className="ld mu">
                Located near Ramphal Chowk, Sector 7, Dwarka. Convenient to reach from
                Dwarka Expressway, Airport, and Gurugram.
              </p>
              <p className="mu sm">
                Please book a prior appointment so we can prepare your business audit in advance.
              </p>
              <Link
                className="btn b-d"
                href="/contact"
                style={{ width: 'fit-content' }}
              >
                Book a Visit
              </Link>
            </div>
            <div className="rv">
              <Stage cls="r43" label="Office location">
                <div
                  style={{
                    padding: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    color: 'var(--cream)',
                  }}
                >
                  <span className="lbl" style={{ color: 'var(--lime)' }}>
                    Studio Address
                  </span>
                  <b className="sf h3" style={{ fontSize: '24px' }}>
                    AegisKoncept Studio
                  </b>
                  <p className="sm mu">
                    Sector 7, Ramphal Chowk, Dwarka
                    <br />
                    New Delhi, Delhi 110075
                  </p>
                  <span className="mu sm">Mon – Fri · 10am – 7pm</span>
                </div>
              </Stage>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Band */}
      <CtaBand
        title="Ready to Grow Your Business?"
        sub="Book an initial consultation with Ritesh and Yogeesh today."
      />
    </>
  );
}

