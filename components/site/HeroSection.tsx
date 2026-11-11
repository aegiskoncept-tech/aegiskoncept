'use client';

import React, { useState } from 'react';
import HeroCanvas from './HeroCanvas';
import HeroSlider, { SLIDES } from './HeroSlider';
import HeroForm from './HeroForm';

const HERO_TICK = [
  { n: '3.51M', t: 'Google impressions · 10Q Challenge' },
  { n: '#1', t: 'on Google for "bitsat mentorship program 2027"' },
  { n: '100%', t: 'plots sold · Allied Industrial Park' },
  { n: '9,873', t: 'Google Maps actions · healthcare clinic' },
  { n: '2.02M', t: 'B2B reach · Allied Industrial Park' },
  { n: 'Position 0', t: "Google's answer · Shigeru Beauty" },
  { n: '27.3K', t: 'organic clicks · 10Q Challenge' },
];

export default function HeroSection() {
  const [activeService, setActiveService] = useState(SLIDES[0].service);
  const [activeSlideNum, setActiveSlideNum] = useState('01');
  const [burstCount, setBurstCount] = useState(0);

  const handleSlideChange = (serviceName: string) => {
    setActiveService(serviceName);
    const idx = SLIDES.findIndex((s) => s.service === serviceName);
    if (idx !== -1) {
      setActiveSlideNum(`0${idx + 1}`);
    }
    setBurstCount((c) => c + 1);
  };

  return (
    <section className="hero js">
      <HeroCanvas burstTrigger={burstCount} />
      <span className="spot" />
      <span className="bgnum" aria-hidden="true">
        {activeSlideNum}
      </span>

      <div className="in hgrid">
        <HeroSlider onSlideChange={handleSlideChange} />
        <HeroForm activeService={activeService} />
      </div>

      <div className="htick" aria-label="Recent results">
        <div className="htr">
          {[...HERO_TICK, ...HERO_TICK].map((item, idx) => (
            <span key={idx}>
              <b>{item.n}</b> {item.t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

