import React from 'react';
import Link from 'next/link';

export interface CrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: CrumbItem[] }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span aria-hidden="true">/</span>}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

