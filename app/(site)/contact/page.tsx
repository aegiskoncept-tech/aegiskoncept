import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/site/ContactForm';
import { Vis } from '@/components/site/Mockups';

export const metadata: Metadata = {
  title: 'Contact Us | AegisKoncept - Digital Marketing Agency Dwarka, Delhi',
  description:
    "Tell us about your business and what you want to achieve. We'll reply within 1 working day. Office in Dwarka, New Delhi.",
};

const nextSteps = [
  {
    title: 'We reply',
    desc: 'Within 1 working day, by email, call or WhatsApp.',
  },
  {
    title: 'Quick call',
    desc: '30 minutes to understand your goals.',
  },
  {
    title: 'Clear proposal',
    desc: "What we'll do, when, and the price. In writing.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero & Form Section */}
      <section className="dk">
        <div className="in sec">
          <div className="stack" style={{ gap: 28 }}>
            <nav className="crumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>Contact</span>
            </nav>

            <div className="split" style={{ alignItems: 'start' }}>
              <div className="stack" style={{ gap: 24 }}>
                <h1 className="sf d1">Let&apos;s Talk.</h1>
                <p className="ld">
                  Tell us about your business and what you want to achieve. We&apos;ll reply within 1 working day.
                </p>

                <div className="stack" style={{ gap: 18, marginTop: 12 }}>
                  <div
                    className="stack"
                    style={{ gap: 2, borderTop: '1px solid var(--line-d)', paddingTop: 14 }}
                  >
                    <span className="xs mu">Email</span>
                    <span className="h4 sf" style={{ userSelect: 'all' }}>
                      hello@aegiskoncept.com
                    </span>
                  </div>

                  <div
                    className="stack"
                    style={{ gap: 2, borderTop: '1px solid var(--line-d)', paddingTop: 14 }}
                  >
                    <span className="xs mu">Call or WhatsApp</span>
                    <span className="h4 sf" style={{ userSelect: 'all' }}>
                      +91 73034 68073
                    </span>
                    <a
                      className="tl arr sm"
                      href="https://wa.me/917303468073?text=Hi%20AegisKoncept%2C%20I%20want%20to%20talk%20about%20my%20business"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open WhatsApp
                    </a>
                  </div>

                  <div
                    className="stack"
                    style={{ gap: 2, borderTop: '1px solid var(--line-d)', paddingTop: 14 }}
                  >
                    <span className="xs mu">Office</span>
                    <span>[Street address], Dwarka, New Delhi 110075</span>
                    <span className="mu sm">Mon–Sat, [hours] · Please book before visiting</span>
                  </div>
                </div>
              </div>

              <Suspense
                fallback={
                  <div style={{ background: 'var(--panel)', padding: 'clamp(24px, 3vw, 40px)', minHeight: 400 }}>
                    <p className="mu">Loading form...</p>
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens Next? */}
      <section className="cr">
        <div className="in sec">
          <div className="stack" style={{ gap: 32 }}>
            <h2 className="sf h2">What Happens Next?</h2>
            <div className="cols c3" style={{ borderTop: '2px solid var(--ink)' }}>
              {nextSteps.map((step, idx) => (
                <div
                  key={step.title}
                  className="stack rv"
                  style={{ gap: 6, paddingTop: 18 }}
                >
                  <span className="sf" style={{ fontSize: 44, lineHeight: 1 }}>
                    {idx + 1}
                  </span>
                  <b style={{ fontSize: 19 }}>{step.title}</b>
                  <span className="mu">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us in Dwarka */}
      <section className="wh">
        <div className="in sec">
          <div className="split" style={{ alignItems: 'center' }}>
            <Vis kind="map" cls="r43" />
            <div className="stack" style={{ gap: 16 }}>
              <h2 className="sf h2">Visit Us in Dwarka.</h2>
              <p className="mu ld">
                Easy to reach from Dwarka Expressway and Gurugram. Please book a time before you come.
              </p>
              <a
                className="btn b-o"
                href="https://www.google.com/maps/search/AegisKoncept+Dwarka"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: 'fit-content' }}
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

