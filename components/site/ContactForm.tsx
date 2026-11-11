'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { trackLeadSubmission } from '@/lib/analytics';

export default function ContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState('');
  const [biz, setBiz] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [budget, setBudget] = useState('');
  const [msg, setMsg] = useState('');
  const [okContact, setOkContact] = useState(true);

  const [errors, setErrors] = useState<{
    name?: boolean;
    email?: boolean;
    service?: boolean;
    ok?: boolean;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const svcParam = searchParams.get('service') || searchParams.get('svc');
    if (svcParam) {
      const map: Record<string, string> = {
        website: 'Website Design & Development',
        seo: 'Search Engine Optimization (SEO)',
        ads: 'Performance Marketing (Ads)',
        social: 'Social Media Marketing',
        video: 'Video Production',
      };
      setService(map[svcParam.toLowerCase()] || svcParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = true;
    if (!email.trim() || !email.includes('@')) newErrors.email = true;
    if (!service) newErrors.service = true;
    if (!okContact) newErrors.ok = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          business: biz.trim() || undefined,
          email: email.trim(),
          phone: phone.trim() || undefined,
          service,
          budget: budget || undefined,
          message: msg.trim() || undefined,
          sourcePage: '/contact',
        }),
      });

      if (res.ok) {
        trackLeadSubmission(service, '/contact');
        router.push('/thank-you');
      } else {
        alert('There was a problem sending your message. Please try again or WhatsApp us at +91 73034 68073.');
      }
    } catch {
      alert('There was a problem sending your message. Please try again or WhatsApp us at +91 73034 68073.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--panel)', padding: 'clamp(24px, 3vw, 40px)' }}>
      <h2 className="sf h3" style={{ marginBottom: 24 }}>
        Tell us about your project
      </h2>
      <form className="form js-form" onSubmit={handleSubmit} noValidate>
        <label className={`fld ${errors.name ? 'is-invalid' : ''}`} htmlFor="c-name">
          Your name *
          <input
            id="c-name"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
            }}
            required
          />
          {errors.name && <span className="err" style={{ display: 'block' }}>Please add your name.</span>}
        </label>

        <label className="fld" htmlFor="c-biz">
          Business name
          <input
            id="c-biz"
            autoComplete="organization"
            value={biz}
            onChange={(e) => setBiz(e.target.value)}
          />
        </label>

        <label className={`fld ${errors.email ? 'is-invalid' : ''}`} htmlFor="c-email">
          Email *
          <input
            id="c-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: false }));
            }}
            required
          />
          {errors.email && (
            <span className="err" style={{ display: 'block' }}>
              Please add an email like name@company.com
            </span>
          )}
        </label>

        <label className="fld" htmlFor="c-phone">
          Phone / WhatsApp
          <input
            id="c-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label className={`fld ${errors.service ? 'is-invalid' : ''}`} htmlFor="c-svc">
          What do you need? *
          <select
            id="c-svc"
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              if (errors.service) setErrors((prev) => ({ ...prev, service: false }));
            }}
            required
          >
            <option value="" disabled>Choose a service</option>
            <option value="Website Design & Development">Website Design & Development</option>
            <option value="Search Engine Optimization (SEO)">Search Engine Optimization (SEO)</option>
            <option value="Performance Marketing (Ads)">Performance Marketing (Ads)</option>
            <option value="Social Media Marketing">Social Media Marketing</option>
            <option value="Video Production">Video Production</option>
            <option value="Not sure yet / Multiple">Not sure yet / Multiple</option>
          </select>
          {errors.service && (
            <span className="err" style={{ display: 'block' }}>
              Pick one, or choose &quot;Not sure yet&quot;.
            </span>
          )}
        </label>

        <label className="fld" htmlFor="c-budget">
          Monthly budget
          <select
            id="c-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="">Prefer not to say</option>
            <option value="Under ₹25,000">Under ₹25,000</option>
            <option value="₹25,000 – ₹50,000">₹25,000 – ₹50,000</option>
            <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
            <option value="More than ₹1,00,000">More than ₹1,00,000</option>
          </select>
        </label>

        <label className="fld full" htmlFor="c-msg">
          What do you want to achieve?
          <textarea
            id="c-msg"
            rows={3}
            placeholder="For example: more enquiries from Google, a new website, more Instagram followers"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </label>

        <label
          className="full sm"
          style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontWeight: 400 }}
          htmlFor="c-ok"
        >
          <input
            id="c-ok"
            type="checkbox"
            checked={okContact}
            onChange={(e) => {
              setOkContact(e.target.checked);
              if (errors.ok) setErrors((prev) => ({ ...prev, ok: false }));
            }}
            required
            style={{ width: 20, height: 20, marginTop: 2, accentColor: 'var(--lime)' }}
          />
          <span>
            It&apos;s OK to contact me about this. (
            <Link href="/privacy-policy" style={{ textDecoration: 'underline' }}>
              Privacy policy
            </Link>
            )
          </span>
        </label>
        {errors.ok && (
          <span className="err" style={{ display: 'block' }}>
            Please consent to be contacted.
          </span>
        )}

        <div className="full row-btn" style={{ alignItems: 'center' }}>
          <button className="btn b-l" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          <span className="note">No spam. A real person will reply.</span>
        </div>
      </form>
    </div>
  );
}

