import { CircleAlert, User } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/Button';
import { COPY } from '../ui/copy';

export interface OrgSwitcherProps {
  organizationName?: string;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function OrgSwitcher({
  organizationName = 'Personal',
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: OrgSwitcherProps): React.ReactElement {
  if (loading) {
    return (
      <span
        role="status"
        aria-busy="true"
        aria-label="Organization switcher loading"
        className="inline-flex items-center min-h-[var(--target-desktop)] px-[var(--space-12)] py-[var(--space-4)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--surface)] opacity-70"
      >
        <span
          aria-hidden="true"
          className="inline-block h-[var(--space-12)] w-[var(--space-48)] rounded-[var(--radius-5)] bg-[var(--border)]"
        />
      </span>
    );
  }

  if (errorMessage) {
    return (
      <span
        role="alert"
        className="inline-flex items-center gap-[var(--space-8)] px-[var(--space-8)] py-[var(--space-4)] rounded-[var(--radius-5)] border border-[var(--danger)] bg-[var(--surface)] text-[length:var(--text-12)] text-[var(--danger)]"
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
      <span className="inline-flex items-center gap-[var(--space-8)] px-[var(--space-8)] py-[var(--space-4)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--surface)] text-[length:var(--text-12)] text-[var(--text-muted)]">
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
    <button
      type="button"
      disabled={disabled}
      aria-label={`Organization: ${organizationName}`}
      title={`Organization: ${organizationName}`}
      className="inline-flex items-center justify-center gap-[var(--space-8)] min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] px-[var(--space-8)] md:px-[var(--space-12)] py-[var(--space-4)] rounded-[var(--radius-5)] border border-[var(--border-strong)] bg-[var(--surface)] font-[family-name:var(--font-sans)] text-[length:var(--text-12)] font-medium text-[var(--text)] transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent-wash)] active:scale-[0.99] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    >
      <User aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)] shrink-0 text-[var(--text-muted)]" />
      <span className="sr-only md:not-sr-only">{organizationName}</span>
    </button>
  );
}
