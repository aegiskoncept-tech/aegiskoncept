import React from 'react';

export interface FaqItem {
  q: string;
  a: string;
}

export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((item, idx) => (
        <details key={idx}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}

