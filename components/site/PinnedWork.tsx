'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Stage, Serp, AdCard, Chat, Laptop, VFrame } from './Mockups';

interface CaseStudyItem {
  id: string;
  client: string;
  industryName: string;
  services: string[];
  oneLine: string;
  cover?: string;
  logo?: string;
}

const CASES_PINNED: CaseStudyItem[] = [
  {
    id: '10q-challenge',
    client: '10Q Challenge',
    industryName: 'Education & Coaching',
    services: ['SEO', 'Website', 'Content'],
    oneLine: 'From 20 to 1,000+ daily clicks during exam season.',
    logo: '10q-challenge',
  },
  {
    id: 'allied-industrial-park',
    client: 'Allied Industrial Park',
    industryName: 'Real Estate & B2B Spaces',
    services: ['Ads', 'Lead Generation'],
    oneLine: '100% of Phase 1 industrial plots sold out in 4 months.',
    logo: '1539c868',
  },
  {
    id: 'thrive-gym',
    client: 'Thrive Gym',
    industryName: 'Health & Fitness',
    services: ['Social Media', 'Video', 'Ads'],
    oneLine: '140+ new gym memberships in the first 90 days.',
    logo: '26a50833',
  },
  {
    id: 'west-coast-services',
    client: 'West Coast Services',
    industryName: 'Business Services',
    services: ['Website', 'SEO'],
    oneLine: 'New modern website that cut enquiry response time in half.',
    logo: 'bada290e',
  },
  {
    id: 'eco-utilities',
    client: 'Eco Utilities',
    industryName: 'Business Services',
    services: ['Website', 'Lead Generation'],
    oneLine: 'Over £2.4M in commercial energy contracts signed.',
    logo: '3dd9ad49',
  },
  {
    id: 'krickscricket',
    client: 'Kricks Cricket',
    industryName: 'Online Brands (D2C)',
    services: ['Website', 'E-commerce'],
    oneLine: 'D2C cricket store selling across India and the UK.',
  },
];

function renderCaseStage(id: string, client: string, logo?: string) {
  const logoEl = logo ? (
    <span className={`stg-logo lgo-${logo}`} aria-hidden="true" />
  ) : (
    <span className="stg-logo txt" aria-hidden="true">
      {client}
    </span>
  );

  if (id === '10q-challenge') {
    return (
      <Stage cls="r43" label={`${client} real result`}>
        {logoEl}
        <Serp
          q="bitsat mentorship program 2027"
          title="10Q Challenge · BITSAT Mentorship 2027"
          url="10qchallenge.in"
          style={{ left: '10%', top: '16%' }}
        />
        <Chat
          msgs={[
            { d: 'i', m: 'Which is the best BITSAT mentorship?' },
            { d: 'o', m: 'AI Overview: 10Q Challenge offers…' },
          ]}
          style={{ right: '7%', bottom: '12%', width: 'min(44%, 230px)' }}
        />
      </Stage>
    );
  }

  if (id === 'allied-industrial-park') {
    return (
      <Stage cls="r43" label={`${client} real result`}>
        {logoEl}
        <AdCard
          brand="Allied Industrial Park"
          line="Grow your factory here."
          cta="Learn more"
          style={{ left: '12%', top: '12%', transform: 'rotate(-4deg)' }}
        />
        <AdCard
          brand="Allied Industrial Park"
          line="Industrial plots from ₹1.5 Cr"
          cta="Get details"
          style={{ right: '10%', bottom: '12%', transform: 'rotate(3deg)' }}
        />
      </Stage>
    );
  }

  if (id === 'thrive-gym') {
    return (
      <Stage cls="r43" label={`${client} real result`}>
        {logoEl}
        <div className="phone">
          <div className="top">
            <span className="av">TG</span>
            <span>
              <b style={{ fontSize: '11px' }}>Thrive Gym</b>
              <br />
              <span style={{ opacity: 0.6 }}>Instagram</span>
            </span>
          </div>
          <div className="nums">
            <span>
              <b>Reels</b>weekly
            </span>
            <span>
              <b>Stories</b>daily
            </span>
            <span>
              <b>DMs</b>answered
            </span>
          </div>
          <div className="grid">
            <i className="t1 r" />
            <i className="t2" />
            <i className="t3" />
            <i className="t2 r" />
            <i className="t1" />
            <i className="t4" />
            <i className="t3" />
            <i className="t1 r" />
            <i className="t2" />
          </div>
        </div>
        <AdCard
          brand="Thrive Gym"
          line="Free trial this week"
          cta="Send WhatsApp message"
          style={{ right: '8%', bottom: '10%', transform: 'rotate(4deg)' }}
        />
      </Stage>
    );
  }

  if (id === 'west-coast-services') {
    return (
      <Stage cls="r43" label={`${client} real result`}>
        {logoEl}
        <Laptop
          url="westcoastservices.co.uk"
          head="We sort out the bills you hate opening."
          btn="Get a quote"
        />
      </Stage>
    );
  }

  if (id === 'eco-utilities') {
    return (
      <Stage cls="r43" label={`${client} real result`}>
        {logoEl}
        <Laptop
          url="ecoutilitiesltd.co.uk"
          head="Compare business energy prices."
          btn="Get a quote"
        />
      </Stage>
    );
  }

  return (
    <Stage cls="r43" label={`${client} real result`}>
      {logoEl}
      <Laptop
        url="krickscricket.com"
        head="Built for the big hit."
        btn="Shop bats"
      />
    </Stage>
  );
}

export default function PinnedWork() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    const barSpan = barSpanRef.current;
    if (!pin || !track || !barSpan) return;

    let dist = 0;

    const sizePin = () => {
      if (window.innerWidth > 900) {
        dist = track.scrollWidth - window.innerWidth + 96;
        pin.style.height = `${dist + window.innerHeight}px`;
      } else {
        pin.style.height = '';
        track.style.transform = '';
        barSpan.style.transform = '';
      }
    };

    const onScroll = () => {
      if (window.innerWidth <= 900 || !dist) return;
      const r = pin.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (76 - r.top) / dist));
      track.style.transform = `translate3d(${-p * dist}px,0,0)`;
      barSpan.style.transform = `scaleX(${p})`;
    };

    sizePin();
    window.addEventListener('resize', sizePin);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', sizePin);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="dk hpin" ref={pinRef}>
      <div className="pin-in">
        <div className="in pin-head">
          <h2 className="sf h2">Work We&apos;re Proud Of.</h2>
          <Link className="tl arr" href="/our-work">
            See all work
          </Link>
        </div>

        <div className="track" ref={trackRef}>
          {CASES_PINNED.map((c) => (
            <Link
              key={c.id}
              className="case wcard"
              href={`/our-work/${c.id}`}
            >
              {renderCaseStage(c.id, c.client, c.logo)}
              <span className="xs mu">
                {c.industryName} · {c.services.join(' + ')}
              </span>
              <span className="sf h3">{c.client}</span>
              <span className="mu">{c.oneLine}</span>
            </Link>
          ))}

          <Link className="wcard wend" href="/our-work">
            <span className="sf h2">
              See all
              <br />
              our work
            </span>
            <span className="go">→</span>
          </Link>
        </div>

        <div className="in">
          <div className="pin-bar">
            <span ref={barSpanRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
