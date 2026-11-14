import { CircleAlert } from 'lucide-react';
import React from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface EmptyStateProps {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
  loading?: boolean;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  disabled = false,
  loading = false,
  errorMessage,
  errorCode,
  onRetry,
}: EmptyStateProps): React.ReactElement {
  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={title ? `${title} loading` : 'Empty state loading'}
        className="flex flex-col gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-24)] opacity-70"
      >
        <div
          aria-hidden="true"
          className="h-[var(--space-24)] w-1/3 rounded-[var(--radius-5)] bg-[var(--border-strong)] opacity-40"
        />
        <div
          aria-hidden="true"
          className="h-[var(--space-16)] w-2/3 rounded-[var(--radius-5)] bg-[var(--border)] opacity-60"
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

  return (
    <div className="flex flex-col items-start gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-24)] font-[family-name:var(--font-sans)]">
      {title ? (
        <h3 className="m-0 font-[family-name:var(--font-serif)] text-[length:var(--text-20)] font-normal leading-[var(--leading-heading)] text-[var(--text)]">
          {title}
        </h3>
      ) : null}

      <p className="m-0 max-w-[var(--measure-max)] text-[length:var(--text-16)] leading-[var(--leading-body)] text-[var(--text-muted)]">
        {description}
      </p>

      {actionLabel && onAction ? (
        <Button variant="secondary" size="md" disabled={disabled} onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
