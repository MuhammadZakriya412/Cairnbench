import { CircleAlert } from 'lucide-react';
import React from 'react';
import { BRAND_NAME } from '../../config/brand';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface LogoProps {
  showWordmark?: boolean;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
  className?: string;
}

export function Logo({
  showWordmark = false,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
  className = '',
}: LogoProps): React.ReactElement {
  if (loading) {
    return (
      <span
        role="status"
        aria-busy="true"
        aria-label={`${BRAND_NAME} logo loading`}
        className={`inline-flex items-center gap-[var(--space-8)] opacity-70 ${className}`.trim()}
      >
        <span
          aria-hidden="true"
          className="inline-block h-[var(--space-24)] w-[var(--space-24)] rounded-[var(--radius-5)] bg-[var(--border)]"
        />
        {showWordmark ? (
          <span
            aria-hidden="true"
            className="inline-block h-[var(--space-16)] w-[var(--space-64)] rounded-[var(--radius-5)] bg-[var(--border)]"
          />
        ) : null}
      </span>
    );
  }

  if (errorMessage) {
    return (
      <span
        role="alert"
        className={`inline-flex items-center gap-[var(--space-8)] font-[family-name:var(--font-sans)] text-[length:var(--text-12)] text-[var(--danger)] ${className}`.trim()}
      >
        <CircleAlert aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)] shrink-0" />
        <span>{errorMessage}</span>
        {errorCode ? (
          <code className="font-[family-name:var(--font-mono)] text-[length:var(--text-12)] text-[var(--text-muted)]">
            {errorCode}
          </code>
        ) : null}
        {onRetry ? (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {COPY['action.retry']}
          </Button>
        ) : null}
      </span>
    );
  }

  if (emptyMessage) {
    return (
      <span
        className={`inline-flex items-center gap-[var(--space-8)] font-[family-name:var(--font-sans)] text-[length:var(--text-12)] text-[var(--text-muted)] ${className}`.trim()}
      >
        <span>{emptyMessage}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </span>
    );
  }

  return (
    <span
      aria-disabled={disabled ? 'true' : undefined}
      className={`inline-flex items-center gap-[var(--space-8)] font-[family-name:var(--font-serif)] text-[length:var(--text-20)] font-medium tracking-[var(--tracking-heading)] text-[var(--text)] ${
        disabled ? 'opacity-60' : ''
      } ${className}`.trim()}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="w-[var(--space-24)] h-[var(--space-24)] shrink-0"
      >
        <rect x="7" y="3" width="10" height="4" rx="2" fill="var(--accent)" />
        <rect x="5" y="9" width="14" height="5" rx="2.5" fill="var(--accent)" />
        <rect x="3" y="16" width="18" height="5" rx="2.5" fill="var(--border-strong)" />
      </svg>
      {showWordmark ? <span>{BRAND_NAME}</span> : null}
    </span>
  );
}
