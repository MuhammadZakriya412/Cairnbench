import { CircleAlert } from 'lucide-react';
import React from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface KbdProps {
  keys: ReadonlyArray<string>;
  ariaLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function Kbd({
  keys,
  ariaLabel,
  onClick,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: KbdProps): React.ReactElement {
  if (loading) {
    return (
      <span
        role="status"
        aria-busy="true"
        aria-label="Keyboard shortcut loading"
        className="inline-flex items-center gap-[var(--space-4)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--surface)] px-[var(--space-8)] py-[var(--space-4)] opacity-70"
      >
        <span
          aria-hidden="true"
          className="inline-block w-[var(--space-24)] h-[var(--space-12)] rounded-[var(--radius-5)] bg-[var(--border-strong)] opacity-50"
        />
      </span>
    );
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="inline-flex flex-wrap items-center gap-[var(--space-8)] rounded-[var(--radius-6)] border border-[var(--danger)] bg-[var(--surface)] p-[var(--space-8)] font-[family-name:var(--font-sans)] text-[length:var(--text-12)] text-[var(--danger)]"
      >
        <CircleAlert
          aria-hidden="true"
          className="shrink-0 w-[var(--space-16)] h-[var(--space-16)]"
        />
        <span>{errorMessage}</span>
        {errorCode ? (
          <code className="font-[family-name:var(--font-mono)] text-[var(--text-muted)]">
            {errorCode}
          </code>
        ) : null}
        {onRetry ? (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {COPY['action.retry']}
          </Button>
        ) : null}
      </div>
    );
  }

  if (keys.length === 0 || emptyMessage) {
    return (
      <div className="inline-flex flex-wrap items-center gap-[var(--space-8)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-8)] font-[family-name:var(--font-sans)] text-[length:var(--text-12)] text-[var(--text-muted)]">
        <span>{emptyMessage ?? 'No shortcut bound.'}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  const keyNodes = keys.map((keyText, idx) => (
    <kbd
      key={`${keyText}-${idx}`}
      className="inline-flex items-center justify-center rounded-[var(--radius-5)] border border-[var(--border-strong)] bg-[var(--surface)] px-[var(--space-8)] py-[var(--space-4)] font-[family-name:var(--font-mono)] text-[length:var(--text-12)] font-medium leading-[var(--leading-body)] text-[var(--text)]"
    >
      {keyText}
    </kbd>
  ));

  if (onClick || disabled) {
    return (
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel ?? keys.join(' + ')}
        onClick={onClick}
        className="inline-flex items-center gap-[var(--space-4)] min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] rounded-[var(--radius-5)] p-[var(--space-4)] cursor-pointer touch-manipulation transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent-wash)] active:scale-[0.99] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {keyNodes}
      </button>
    );
  }

  return (
    <span aria-label={ariaLabel} className="inline-flex items-center gap-[var(--space-4)]">
      {keyNodes}
    </span>
  );
}
