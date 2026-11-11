import React from 'react';

export interface FixRowItem {
  problem: string;
  detail?: string;
  fix: string;
  serviceSlug?: string;
}

export default function FixRows({ rows }: { rows: FixRowItem[] }) {
  return (
    <div className="fx">
      {rows.map((row, idx) => (
        <div key={idx} className="fx-r rv">
          <div className="fx-p">
            <span className="xs mu">The problem</span>
            <b className="sf h4">&ldquo;{row.problem}&rdquo;</b>
            {row.detail && <span className="mu sm">{row.detail}</span>}
          </div>
          <div className="fx-a" aria-hidden="true">
            →
          </div>
          <div className="fx-s">
            <span className="xs mu">How we fix it</span>
            <span>{row.fix}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

