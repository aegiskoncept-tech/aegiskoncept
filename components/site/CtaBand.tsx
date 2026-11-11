'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackLeadSubmission } from '@/lib/analytics';

export default function CtaBand({
  title = "Got a Goal? Let's Make a Plan.",
  sub = "Tell us where your business is today and where you want it to be. We'll reply within 1 working day.",
  service = 'Website',
}: {
  title?: string;
  sub?: string;
  service?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedService, setSelectedService] = useState(service);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; contact?: boolean }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = true;
    if (!contact.trim()) newErrors.contact = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: contact.trim(),
          service: selectedService,
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
        }),
      });

      if (res.ok) {
        trackLeadSubmission(selectedService, typeof window !== 'undefined' ? window.location.pathname : '/');
        router.push('/thank-you');
      } else {
        alert('There was a problem submitting your request. Please try again or WhatsApp us.');
      }
    } catch {
      alert('There was a problem submitting your request. Please try again or WhatsApp us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="lm">
      <div className="in sec">
        <div className="split" style={{ alignItems: 'end' }}>
          <div className="stack rv" style={{ gap: '20px' }}>
            <h2 className="sf h2">{title}</h2>
            <p className="ld">{sub}</p>
            <div className="row-btn">
              <a
                className="btn b-o"
                href="https://wa.me/917303468073"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="rv">
            <form className="form js-form" onSubmit={handleSubmit} noValidate>
              <label className="fld" htmlFor="cta-name">
                Your name
                <input
                  id="cta-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
                  }}
                  required
                />
                {errors.name && <span className="err">Please add your name.</span>}
              </label>

              <label className="fld" htmlFor="cta-contact">
                Phone or email
                <input
                  id="cta-contact"
                  autoComplete="email"
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    if (errors.contact) setErrors((prev) => ({ ...prev, contact: false }));
                  }}
                  required
                />
                {errors.contact && (
                  <span className="err">Add a phone number or email so we can reply.</span>
                )}
              </label>

              <label className="fld full" htmlFor="cta-service">
                What do you need help with?
                <select
                  id="cta-service"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                >
                  <option value="">Pick one</option>
                  <option value="Website">Website</option>
                  <option value="SEO">SEO</option>
                  <option value="Ads (Google / Meta)">Ads (Google / Meta)</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Video / Shoots">Video / Shoots</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </label>

              <div className="full row-btn" style={{ alignItems: 'center' }}>
                <button className="btn b-d" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Get a Free Quote'}
                </button>
                <span className="xs mu">No spam. A real person will reply.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

