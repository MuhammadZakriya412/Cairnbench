import { ArrowUpRight, CircleAlert } from 'lucide-react';
import React from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface ToolRowProps {
  index: number;
  appId: string;
  name: string;
  tagline: string;
  savedCount: number;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function ToolRow({
  index,
  appId,
  name,
  tagline,
  savedCount,
  href,
  onClick,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: ToolRowProps): React.ReactElement {
  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={`${name} tool row loading`}
        className="flex items-center justify-between gap-[var(--space-16)] border-b border-[var(--border)] py-[var(--space-16)] px-[var(--space-12)] opacity-70"
      >
        <span
          aria-hidden="true"
          className="inline-block h-[var(--space-20)] w-[var(--space-48)] rounded-[var(--radius-5)] bg-[var(--surface)]"
        />
        <span
          aria-hidden="true"
          className="inline-block h-[var(--space-20)] flex-1 rounded-[var(--radius-5)] bg-[var(--surface)]"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-[var(--space-12)] border-b border-[var(--danger)] bg-[var(--surface)] p-[var(--space-12)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--danger)]"
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
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-12)] border-b border-[var(--border)] bg-[var(--surface)] p-[var(--space-12)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        <span>{emptyMessage}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  const formattedIndex = String(index).padStart(2, '0');
  const resolvedHref = href ?? `/app/${encodeURIComponent(appId)}/workspace`;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <a
      href={disabled ? undefined : resolvedHref}
      role={disabled ? 'link' : undefined}
      aria-disabled={disabled ? 'true' : undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      className={`group flex flex-wrap items-center justify-between gap-[var(--space-16)] border-b border-[var(--border)] py-[var(--space-16)] px-[var(--space-12)] font-[family-name:var(--font-sans)] text-[var(--text)] no-underline transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--surface)] active:scale-[0.99] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer touch-manipulation'
      }`}
    >
      <div className="flex items-baseline gap-[var(--space-16)] min-w-0 flex-1">
        <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-14)] font-medium text-[var(--accent)] tabular-nums shrink-0">
          {formattedIndex}
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-[var(--space-4)] sm:gap-[var(--space-12)] min-w-0">
          <span className="font-[family-name:var(--font-serif)] text-[length:var(--text-20)] font-normal text-[var(--text)]">
            {name}
          </span>
          <span className="text-[length:var(--text-14)] text-[var(--text-muted)] leading-[var(--leading-body)]">
            {tagline}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-[var(--space-16)] shrink-0">
        <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-12)] text-[var(--text-muted)] tabular-nums">
          {savedCount} saved
        </span>
        <span className="inline-flex items-center gap-[var(--space-4)] text-[length:var(--text-14)] font-medium text-[var(--accent)]">
          <span>Open</span>
          <ArrowUpRight
            aria-hidden="true"
            className="w-[var(--space-16)] h-[var(--space-16)]"
          />
        </span>
      </div>
    </a>
  );
}
