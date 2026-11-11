import React from 'react';

export default function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] | null }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

