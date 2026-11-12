import React from 'react';
import Link from 'next/link';
import { ArchMark } from './Icons';
import { SiteContactSettings, DEFAULT_CONTACT } from '@/lib/siteConfig';

const SERVICES = [
  { id: 'website-development-design', nav: 'Websites' },
  { id: 'seo', nav: 'SEO' },
  { id: 'performance-marketing', nav: 'Ads' },
  { id: 'social-media-marketing-management', nav: 'Social Media' },
  { id: 'video-production', nav: 'Video' },
];

const INDUSTRIES = [
  { id: 'ecommerce-d2c', name: 'Online Brands (D2C)' },
  { id: 'healthcare-wellness', name: 'Health & Fitness' },
  { id: 'interiors-design', name: 'Interiors & Design' },
  { id: 'startups', name: 'Startups' },
  { id: 'tech-saas', name: 'Tech & SaaS' },
  { id: 'education', name: 'Education & Coaching' },
  { id: 'real-estate', name: 'Real Estate & B2B Spaces' },
];

const DELHI_AREAS = [
  { id: 'dwarka', name: 'Dwarka' },
  { id: 'janakpuri', name: 'Janakpuri' },
  { id: 'uttam-nagar', name: 'Uttam Nagar' },
  { id: 'rajouri-garden', name: 'Rajouri Garden' },
  { id: 'rohini', name: 'Rohini' },
  { id: 'pitampura', name: 'Pitampura' },
  { id: 'karol-bagh', name: 'Karol Bagh' },
  { id: 'connaught-place', name: 'Connaught Place' },
  { id: 'lajpat-nagar', name: 'Lajpat Nagar' },
  { id: 'saket', name: 'Saket' },
  { id: 'vasant-kunj', name: 'Vasant Kunj' },
  { id: 'nehru-place', name: 'Nehru Place' },
  { id: 'laxmi-nagar', name: 'Laxmi Nagar' },
];

export default function Footer({ contact = DEFAULT_CONTACT }: { contact?: SiteContactSettings }) {
  const cleanWa = (contact.whatsapp || '917303468073').replace(/\D/g, '');
  return (
    <footer className="site-f">
      <div className="in">
        <Link className="big" href="/contact">
          Got a goal?
          <br />
          <span>Let&apos;s talk.</span>
        </Link>

        <div className="grid">
          <div className="stack" style={{ gap: '16px' }}>
            <Link className="logo" href="/">
              <ArchMark size={28} />
              <span className="sf" style={{ fontSize: '30px' }}>
                AegisKoncept
              </span>
            </Link>
            <p
              className="sm"
              style={{ color: 'var(--mute-d)', maxWidth: '28em' }}
            >
              Websites, SEO, ads and social media for growing Indian businesses.
              One team, based in Dwarka, New Delhi.
            </p>
          </div>

          <div>
            <h4>Services</h4>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.id}`}>{s.nav}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Industries</h4>
            <ul>
              {INDUSTRIES.map((ind) => (
                <li key={ind.id}>
                  <Link href={`/industries/${ind.id}`}>{ind.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/industries">All industries →</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/our-work">Our Work</Link>
              </li>
              <li>
                <Link href="/videos">Videos</Link>
              </li>
              <li>
                <Link href="/insights">Blog</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Say hello</h4>
            <ul>
              <li>{contact.email}</li>
              <li>{contact.phone}</li>
              <li>
                <a
                  href={`https://wa.me/${cleanWa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp us
                </a>
              </li>
              <li>{contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="floc">
          <h4>Locations</h4>
          <div className="floc-l">
            <Link href="/locations/delhi">
              <b>Digital Marketing in Delhi</b>
            </Link>
            {DELHI_AREAS.map((l) => (
              <Link key={l.id} href={`/locations/${l.id}`}>
                {l.name}
              </Link>
            ))}
            <Link href="/locations/gurugram">Gurugram</Link>
            <Link href="/locations/noida">Noida</Link>
            <Link href="/locations">All locations →</Link>
          </div>
        </div>

        <div className="base">
          <span>© 2026 AegisKoncept</span>
          <span style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms-and-conditions">Terms</Link>
            <Link href="/cookie-policy">Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

