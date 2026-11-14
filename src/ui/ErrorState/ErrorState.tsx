import { CircleAlert } from 'lucide-react';
import React from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface ErrorStateProps {
  message: string;
  code: string;
  onRetry?: () => void;
  retryLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export function ErrorState({
  message,
  code,
  onRetry,
  retryLabel = COPY['action.retry'],
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
}: ErrorStateProps): React.ReactElement {
  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Error details loading"
        className="flex items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-16)] opacity-70"
      >
        <div
          aria-hidden="true"
          className="h-[var(--space-16)] w-2/3 rounded-[var(--radius-5)] bg-[var(--border-strong)] opacity-40"
        />
      </div>
    );
  }

  if (emptyMessage) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-16)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        <span>{emptyMessage}</span>
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
      role="alert"
      className="flex flex-wrap items-center justify-between gap-[var(--space-16)] rounded-[var(--radius-6)] border border-[var(--danger)] bg-[var(--surface)] p-[var(--space-16)] font-[family-name:var(--font-sans)]"
    >
      <div className="flex items-start gap-[var(--space-12)]">
        <CircleAlert
          aria-hidden="true"
          className="shrink-0 w-[var(--space-20)] h-[var(--space-20)] text-[var(--danger)]"
        />
        <div className="flex flex-col gap-[var(--space-4)]">
          <p className="m-0 text-[length:var(--text-16)] leading-[var(--leading-body)] text-[var(--text)]">
            {message}
          </p>
          <code className="font-[family-name:var(--font-mono)] text-[length:var(--text-12)] text-[var(--text-muted)]">
            {code}
          </code>
        </div>
      </div>

      {onRetry ? (
        <Button variant="secondary" size="sm" disabled={disabled} onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
