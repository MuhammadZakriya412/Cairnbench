import { CircleAlert } from 'lucide-react';
import React from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export type SkeletonVariant = 'line' | 'block' | 'row';

export interface SkeletonProps {
  label?: string;
  lines?: number;
  variant?: SkeletonVariant;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

const VARIANT_HEIGHT_CLASS: Record<SkeletonVariant, string> = {
  line: 'h-[var(--space-16)]',
  row: 'h-[var(--control-height)]',
  block: 'h-[var(--space-64)]',
};

export function Skeleton({
  label = 'Loading content',
  lines = 1,
  variant = 'line',
  loading = true,
  disabled = false,
  onClick,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: SkeletonProps): React.ReactElement {
  if (errorMessage) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--danger)] bg-[var(--surface)] p-[var(--space-12)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--danger)]"
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

  if (emptyMessage) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-12)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        <span>{emptyMessage}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  if (!loading) {
    if (onClick || disabled) {
      return (
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          className="inline-flex items-center min-h-[var(--target-desktop)] rounded-[var(--radius-6)] border border-[var(--border-strong)] bg-[var(--surface)] px-[var(--space-12)] py-[var(--space-8)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text)] cursor-pointer touch-manipulation transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent-wash)] active:scale-[0.99] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {label}
        </button>
      );
    }

    return (
      <div className="rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-12)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        {label}
      </div>
    );
  }

  const count = Math.max(1, lines);
  const items = Array.from({ length: count }, (_, idx) => idx);

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className="flex flex-col gap-[var(--space-8)] w-full"
    >
      {items.map((idx) => (
        <div
          key={idx}
          aria-hidden="true"
          className={`w-full rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] opacity-70 transition-opacity duration-[var(--shimmer-cycle)] ease-[var(--ease-calm)] ${VARIANT_HEIGHT_CLASS[variant]}`}
        />
      ))}
    </div>
  );
}
