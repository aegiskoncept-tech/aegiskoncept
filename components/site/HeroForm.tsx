'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trackLeadSubmission } from '@/lib/analytics';

export default function HeroForm({
  activeService,
}: {
  activeService: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLElement>(null);
  const [userTouchedService, setUserTouchedService] = useState(false);
  const [selectedService, setSelectedService] = useState('Website');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [business, setBusiness] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; service?: boolean }>({});

  useEffect(() => {
    if (!userTouchedService && activeService) {
      setSelectedService(activeService);
    }
  }, [activeService, userTouchedService]);

  // 3D tilt on mousemove
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const heroEl = el.closest('.hero');
    if (!heroEl) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer:fine)').matches;
    if (reduce || !fine) return;

    const onMouseMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      el.style.transform = `perspective(1200px) rotateY(${(x * 4).toFixed(2)}deg) rotateX(${(-y * 4).toFixed(2)}deg)`;
    };

    const onMouseLeave = () => {
      el.style.transform = '';
    };

    heroEl.addEventListener('mousemove', onMouseMove as EventListener);
    heroEl.addEventListener('mouseleave', onMouseLeave);

    return () => {
      heroEl.removeEventListener('mousemove', onMouseMove as EventListener);
      heroEl.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = true;
    if (!phone.trim()) newErrors.phone = true;
    if (!selectedService) newErrors.service = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          service: selectedService,
          business: business.trim(),
          sourcePage: '/',
        }),
      });

      if (res.ok) {
        trackLeadSubmission(selectedService, '/');
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
    <aside className="hform" ref={formRef} aria-labelledby="hf-title">
      <p className="xs" style={{ fontWeight: 600, color: 'var(--mute-l)' }}>
        Free · No obligation
      </p>
      <h2
        id="hf-title"
        className="sf"
        style={{ fontSize: 'clamp(30px,2.6vw,40px)', lineHeight: 1 }}
      >
        Get a Free Quote.
      </h2>
      <p className="sm mu">
        Tell us what you need. We&apos;ll send a clear quote within 1 working day.
      </p>

      <form className="js-form stack" style={{ gap: '14px' }} onSubmit={handleSubmit} noValidate>
        <label className="fld" htmlFor="h-name">
          Your name
          <input
            id="h-name"
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

        <label className="fld" htmlFor="h-phone">
          Phone / WhatsApp
          <input
            id="h-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
            }}
            required
          />
          {errors.phone && <span className="err">Add a number so we can reply.</span>}
        </label>

        <label className="fld" htmlFor="h-svc">
          What do you need?
          <select
            id="h-svc"
            value={selectedService}
            onChange={(e) => {
              setUserTouchedService(true);
              setSelectedService(e.target.value);
              if (errors.service) setErrors((prev) => ({ ...prev, service: false }));
            }}
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
          {errors.service && <span className="err">Pick one, or choose &quot;Not sure yet&quot;.</span>}
        </label>

        <label className="fld" htmlFor="h-biz">
          <span>
            Business name <span className="mu" style={{ fontWeight: 400 }}>(optional)</span>
          </span>
          <input
            id="h-biz"
            autoComplete="organization"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />
        </label>

        <button
          className="btn b-d"
          type="submit"
          style={{ width: '100%' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Get My Quote'}
        </button>

        <p className="xs mu" style={{ textAlign: 'center' }}>
          No spam. A real person will reply.
        </p>
      </form>
    </aside>
  );
}

