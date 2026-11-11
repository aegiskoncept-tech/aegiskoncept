import React from 'react';

export function Stage({
  children,
  cls = 'r54',
  lt = false,
  label = '',
}: {
  children: React.ReactNode;
  cls?: string;
  lt?: boolean;
  label?: string;
}) {
  return (
    <div
      className={`stage ${cls}${lt ? ' lt' : ''}`}
      role="img"
      aria-label={label}
    >
      <div className="glow" />
      {children}
    </div>
  );
}

export function Laptop({
  url = 'yourbrand.in',
  head = 'Homes that feel like you.',
  btn = 'Book a call',
}: {
  url?: string;
  head?: string;
  btn?: string;
}) {
  return (
    <div className="lap">
      <div className="bar">
        <i />
        <i />
        <i />
        <span>{url}</span>
      </div>
      <div className="pg">
        <div>
          <div className="hd">{head}</div>
          <div className="sk" style={{ width: '90%' }} />
          <div className="sk" style={{ width: '70%' }} />
          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginTop: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                background: 'var(--lime)',
                fontWeight: 600,
                padding: '6px 9px',
              }}
            >
              {btn}
            </span>
            <span style={{ border: '1px solid var(--ink)', padding: '6px 9px' }}>
              See more
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          <i className="t2" style={{ aspectRatio: '1' }} />
          <i className="t5" style={{ aspectRatio: '1' }} />
          <i className="t4" style={{ aspectRatio: '1' }} />
          <i className="t3" style={{ aspectRatio: '1' }} />
        </div>
      </div>
    </div>
  );
}

export function Serp({
  q = 'best gym near dwarka',
  title = 'Your Business · Dwarka',
  url = 'yourbusiness.in',
  style,
}: {
  q?: string;
  title?: string;
  url?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="serp" style={style}>
      <div className="q">{q}</div>
      <div className="top">
        <span style={{ color: 'var(--mute-l)' }}>{url}</span>
        <b>{title}</b>
        <span style={{ color: 'var(--mute-l)' }}>★★★★★ · Open now</span>
      </div>
      <div>
        <span style={{ color: 'var(--mute-l)' }}>other-site.com</span>
        <b>Another business</b>
      </div>
      <div>
        <span style={{ color: 'var(--mute-l)' }}>directory.in</span>
        <b>A listing site</b>
      </div>
    </div>
  );
}

export function AdCard({
  brand = 'Your Brand',
  line = 'Free trial this week',
  cta = 'Send message',
  style,
}: {
  brand?: string;
  line?: string;
  cta?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="ad" style={style}>
      <div className="h">
        <span
          className="av"
          style={{ width: '22px', height: '22px', background: 'var(--ink)' }}
        />
        <span>
          <b>{brand}</b>
          <br />
          <span style={{ color: 'var(--mute-l)' }}>Sponsored</span>
        </span>
      </div>
      <div className="img">{line}</div>
      <div className="cta">
        <span>{cta}</span>
        <span>→</span>
      </div>
    </div>
  );
}

export function Chat({
  msgs,
  style,
}: {
  msgs: Array<{ d: 'i' | 'o'; m: string }>;
  style?: React.CSSProperties;
}) {
  return (
    <div className="chat" style={style}>
      {msgs.map((item, idx) => (
        <div key={idx} className={`bub ${item.d}`}>
          {item.m}
        </div>
      ))}
    </div>
  );
}

export function VFrame({
  label = 'Reel',
  style,
}: {
  label?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="vfr" style={style}>
      <span className="rec">● REC · 4K</span>
      <span className="pl" aria-hidden="true">
        <svg viewBox="0 0 100 110">
          <path d="M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 Z" />
        </svg>
        <i />
      </span>
      <span className="vl">{label}</span>
      <span className="vt">
        <i />
      </span>
    </div>
  );
}

export function CalendarMockup() {
  const plan = '1 2 . 1 3 2 1 . 1 2 . 1 3 . 2 1 . 2 1 3 . 1 2 . 1 2 . 3'.split(' ');
  const nm: Record<string, string> = { '1': 'Reel', '2': 'Post', '3': 'DMs', '.': '' };
  return (
    <div className="cal">
      {plan.slice(0, 28).map((c, i) => (
        <span
          key={i}
          className={c !== '.' ? `t${c}` : ''}
          style={{
            border: c === '.' ? '1px solid #3A3734' : undefined,
            color: c === '2' ? 'var(--cream)' : undefined,
          }}
        >
          {nm[c]}
        </span>
      ))}
    </div>
  );
}

export function Cover({
  word,
  kind = '',
  cls = '',
}: {
  word: string;
  kind?: string;
  cls?: string;
}) {
  const fill = kind === '' ? '#D3E45B' : '#191919';
  return (
    <div className={`cover ${kind} ${cls}`} aria-hidden="true">
      <span className="w">{word}</span>
      <svg viewBox="0 0 100 110">
        <path
          d="M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 H70 V56 C70 42 62 31 50 24 C38 31 30 42 30 56 V110 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export function Vis({
  kind,
  lt = false,
  cls = 'r54',
}: {
  kind: string;
  lt?: boolean;
  cls?: string;
}) {
  if (kind === 'site') {
    return (
      <Stage cls={cls} lt={lt} label="Example website">
        <Laptop url="yourbrand.in" head="Homes that feel like you." />
      </Stage>
    );
  }
  if (kind === 'seo') {
    return (
      <Stage cls={cls} lt={lt} label="Example Google result">
        <Serp
          q="best gym near dwarka"
          title="Your Business · Dwarka"
          url="yourbusiness.in"
        />
      </Stage>
    );
  }
  if (kind === 'ads') {
    return (
      <Stage cls={cls} lt={lt} label="Example ads">
        <AdCard
          brand="Your Brand"
          line="Free trial this week"
          cta="Send WhatsApp message"
          style={{
            left: '14%',
            top: '12%',
            transform: 'rotate(-4deg)',
          }}
        />
        <AdCard
          brand="Your Brand"
          line="Book your slot today"
          cta="Learn more"
          style={{
            right: '12%',
            bottom: '12%',
            transform: 'rotate(3deg)',
          }}
        />
      </Stage>
    );
  }
  if (kind === 'dm') {
    return (
      <Stage cls={cls} lt={lt} label="Example DMs answered">
        <Chat
          msgs={[
            { d: 'i', m: 'Hi! Do you deliver to Gurugram?' },
            {
              d: 'o',
              m: 'Yes, we do! It takes 2–3 days. Want the link?',
            },
            { d: 'i', m: 'Yes please!' },
            {
              d: 'o',
              m: 'Here you go. Use code HELLO for free delivery.',
            },
          ]}
        />
      </Stage>
    );
  }
  if (kind === 'cal') {
    return (
      <Stage cls={cls} lt={lt} label="Example monthly content calendar">
        <CalendarMockup />
      </Stage>
    );
  }
  if (kind === 'vid') {
    return (
      <Stage cls={cls} lt={lt} label="Example video reel">
        <VFrame
          label="Brand reel"
          style={{ position: 'relative', transform: 'rotate(-3deg)' }}
        />
        <AdCard
          brand="Your Brand"
          line="New drop. Watch now."
          cta="Shop now"
          style={{
            right: '10%',
            bottom: '12%',
            transform: 'rotate(3deg)',
          }}
        />
      </Stage>
    );
  }
  if (kind === 'map') {
    return (
      <div className={`stage ${cls} lt`} role="img" aria-label="Map showing our Dwarka office">
        <MapArt />
      </div>
    );
  }
  if (kind === 'brand') {
    return (
      <div className={`stage ${cls}`} role="img" aria-label="The AegisKoncept arch">
        <BrandArch />
      </div>
    );
  }
  return (
    <Stage cls={cls} lt={lt} label="Example website">
      <Laptop />
    </Stage>
  );
}

export function MapArt() {
  return (
    <>
      <svg
        viewBox="0 0 400 300"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0 }}
      >
        <rect width="400" height="300" fill="#E9E3D8" />
        <g stroke="#D3CBBD" strokeWidth="10" fill="none">
          <path d="M-10 80 L410 120" />
          <path d="M60 -10 L120 310" />
          <path d="M-10 230 L410 200" />
          <path d="M260 -10 L300 310" />
        </g>
        <g stroke="#DDD6C9" strokeWidth="4" fill="none">
          <path d="M-10 160 L410 150" />
          <path d="M180 -10 L200 310" />
          <path d="M340 -10 L360 310" />
        </g>
        <path d="M-10 270 C120 250 220 290 410 260" stroke="#C9C1B3" strokeWidth="18" fill="none" />
      </svg>
      <svg className="pin" viewBox="0 0 100 110" width="44" height="48" aria-hidden="true">
        <path d="M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 H70 V56 C70 42 62 31 50 24 C38 31 30 42 30 56 V110 Z" fill="#191919" />
      </svg>
    </>
  );
}

export function BrandArch() {
  return (
    <>
      <svg
        viewBox="0 0 100 110"
        style={{ position: 'absolute', inset: '8% 14%', width: '72%', height: '84%' }}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M4 110 V56 C4 30 26 12 50 3 C74 12 96 30 96 56 V110"
          fill="none"
          stroke="#3A3734"
          strokeWidth="0.5"
        />
        <path
          d="M18 110 V58 C18 38 32 24 50 16 C68 24 82 38 82 58 V110"
          fill="none"
          stroke="#4A4642"
          strokeWidth="0.5"
        />
      </svg>
      <div style={{ position: 'relative', width: '30%' }}>
        <svg viewBox="0 0 100 110" width="100%" height="auto" aria-hidden="true">
          <path d="M8 110 V54 C8 28 28 10 50 0 C72 10 92 28 92 54 V110 H70 V56 C70 42 62 31 50 24 C38 31 30 42 30 56 V110 Z" fill="var(--lime)" />
        </svg>
      </div>
    </>
  );
}

