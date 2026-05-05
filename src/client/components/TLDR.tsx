import React from 'react';

interface Props {
  tldr: string;
}

export function TLDR({ tldr }: Props) {
  if (!tldr) return null;

  const sentences = tldr
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0)
    .slice(0, 3);

  return (
    <div
      className="tldr-block"
      data-tldr="ai-overview"
      role="note"
      aria-label="Quick summary"
    >
      <div className="tldr-header">
        <span className="tldr-icon">◈</span>
        <span className="tldr-label">Quick Summary</span>
      </div>
      <ul className="tldr-list">
        {sentences.map((sentence, i) => (
          <li key={i} className="tldr-item">{sentence}</li>
        ))}
      </ul>

      <style>{`
        .tldr-block {
          background: linear-gradient(135deg, var(--color-sidebar) 0%, rgba(122, 96, 64, 0.08) 100%);
          border: 1px solid var(--color-border);
          border-left: 4px solid var(--color-accent);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          padding: var(--space-5) var(--space-6);
          margin-bottom: var(--space-8);
        }

        .tldr-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
        }

        .tldr-icon {
          color: var(--color-accent);
          font-size: 1rem;
        }

        .tldr-label {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .tldr-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .tldr-item {
          font-size: var(--font-size-sm);
          color: var(--color-text);
          line-height: 1.6;
          padding-left: var(--space-4);
          position: relative;
        }

        .tldr-item::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--color-accent);
          font-size: 0.8em;
        }
      `}</style>
    </div>
  );
}
