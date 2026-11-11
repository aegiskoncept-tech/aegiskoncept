import React from 'react';
import Link from 'next/link';
import { Stage, Serp, AdCard, Chat, Laptop, VFrame } from './Mockups';

export interface CaseCardProps {
  id: string;
  client: string;
  industryName: string;
  services: string[];
  oneLine: string;
  cover?: string;
  logo?: string;
  cls?: string;
}

export function renderCaseVisual(
  id: string,
  client: string,
  cover?: string,
  logo?: string,
  cls: string = 'r54'
) {
  const logoEl = logo ? (
    <span className={`stg-logo lgo-${logo}`} aria-hidden="true" />
  ) : (
    <span className="stg-logo txt" aria-hidden="true">
      {client}
    </span>
  );

  if (cover) {
    return (
      <Stage cls={cls} label={`${client} real result`}>
        <span className="shotwrap">
          <span className={`shot sh-${cover}`} role="img" aria-label={`${client} screenshot`} />
        </span>
        {logoEl}
      </Stage>
    );
  }

  if (id === '10q-challenge') {
    return (
      <Stage cls={cls} label={`${client} real result`}>
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
      <Stage cls={cls} label={`${client} real result`}>
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
      <Stage cls={cls} label={`${client} real result`}>
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

  if (id === 'the-attic-storey') {
    return (
      <Stage cls={cls} label={`${client} real result`}>
        {logoEl}
        <div className="phone">
          <div className="top">
            <span className="av">AS</span>
            <span>
              <b style={{ fontSize: '11px' }}>The Attic Storey</b>
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
            <i className="t5" />
            <i className="t2 r" />
            <i className="t1" />
            <i className="t4 r" />
            <i className="t5" />
            <i className="t2" />
          </div>
        </div>
        <VFrame label="Brand reel" style={{ right: '9%', bottom: '10%' }} />
      </Stage>
    );
  }

  if (id === 'in2-nutrition') {
    return (
      <Stage cls={cls} label={`${client} real result`}>
        {logoEl}
        <VFrame
          label="Performance reel"
          style={{ left: '16%', top: '9%', transform: 'rotate(-3deg)' }}
        />
        <AdCard
          brand="IN2"
          line="Fuel your next PR."
          cta="Shop now"
          style={{ right: '9%', bottom: '12%', transform: 'rotate(3deg)' }}
        />
      </Stage>
    );
  }

  return (
    <Stage cls={cls} label={`${client} real result`}>
      {logoEl}
      <Laptop
        url={`${id}.com`}
        head={client}
        btn="View project"
      />
    </Stage>
  );
}

export default function CaseCard({
  id,
  client,
  industryName,
  services,
  oneLine,
  cover,
  logo,
  cls = 'r54',
}: CaseCardProps) {
  return (
    <Link className="case rv" href={`/our-work/${id}`}>
      {renderCaseVisual(id, client, cover, logo, cls)}
      <span className="xs mu">
        {industryName} · {services.join(' + ')}
      </span>
      <span className="sf h3">{client}</span>
      <span className="mu">{oneLine}</span>
    </Link>
  );
}

