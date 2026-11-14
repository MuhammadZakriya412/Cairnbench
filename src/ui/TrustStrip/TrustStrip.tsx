import { CircleAlert } from 'lucide-react';
import React from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface TrustStripProps {
  items?: ReadonlyArray<string>;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

const DEFAULT_TRUST_ITEMS: ReadonlyArray<string> = [
  COPY['trust.1'],
  COPY['trust.2'],
  COPY['trust.3'],
];

export function TrustStrip({
  items = DEFAULT_TRUST_ITEMS,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: TrustStripProps): React.ReactElement {
  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Trust strip loading"
        className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-24)] py-[var(--space-24)] opacity-70"
      >
        <div
          aria-hidden="true"
          className="h-[var(--space-48)] border-t-2 border-[var(--accent)] pt-[var(--space-16)] rounded-[var(--radius-5)] bg-[var(--surface)]"
        />
        <div
          aria-hidden="true"
          className="h-[var(--space-48)] border-t-2 border-[var(--accent)] pt-[var(--space-16)] rounded-[var(--radius-5)] bg-[var(--surface)]"
        />
        <div
          aria-hidden="true"
          className="h-[var(--space-48)] border-t-2 border-[var(--accent)] pt-[var(--space-16)] rounded-[var(--radius-5)] bg-[var(--surface)]"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--danger)] bg-[var(--surface)] p-[var(--space-16)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--danger)]"
      >
        <div className="flex items-center gap-[var(--space-8)]">
          <CircleAlert
            aria-hidden="true"
            className="shrink-0 w-[var(--space-16)] h-[var(--space-16)]"
          />
          <span>{errorMessage}</span>
          {errorCode ? (
            <code className="font-[family-name:var(--font-mono)] text-[length:var(--text-12)] text-[var(--text-muted)]">
              {errorCode}
            </code>
          ) : null}
        </div>
        {onRetry ? (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {COPY['action.retry']}
          </Button>
        ) : null}
      </div>
    );
  }

  if (emptyMessage || items.length === 0) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-16)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        <span>{emptyMessage ?? 'No trust statements available.'}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div
      aria-disabled={disabled ? 'true' : undefined}
      className={`grid grid-cols-1 md:grid-cols-3 gap-[var(--space-24)] py-[var(--space-24)] font-[family-name:var(--font-sans)] text-[var(--text)] ${
        disabled ? 'opacity-60' : ''
      }`.trim()}
    >
      {items.map((fact, idx) => (
        <div
          key={`trust-item-${String(idx)}`}
          className="border-t-2 border-[var(--accent)] pt-[var(--space-16)]"
        >
          <p className="m-0 text-[length:var(--text-16)] leading-[var(--leading-body)] text-[var(--text)]">
            {fact}
          </p>
        </div>
      ))}
    </div>
  );
}
