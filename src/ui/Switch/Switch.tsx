import { CircleAlert } from 'lucide-react';
import React, { useId } from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  error?: string;
  id?: string;
  disabled?: boolean;
  loading?: boolean;
  errorCode?: string;
  onRetry?: () => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export function Switch({
  label,
  checked,
  onChange,
  hint,
  error,
  id,
  disabled = false,
  loading = false,
  errorCode,
  onRetry,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
}: SwitchProps): React.ReactElement {
  const reactId = useId();
  const switchId = id ?? `switch-${reactId}`;
  const labelId = `${switchId}-label`;
  const hintId = `${switchId}-hint`;
  const errorId = `${switchId}-error`;
  const emptyId = `${switchId}-empty`;

  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={`${label} loading`}
        className="flex items-center justify-between gap-[var(--space-12)] min-h-[var(--target-desktop)] font-[family-name:var(--font-sans)]"
      >
        <span className="text-[length:var(--text-14)] font-medium text-[var(--text)]">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="inline-block w-[var(--space-48)] h-[var(--space-24)] rounded-[var(--radius-999)] border border-[var(--border)] bg-[var(--surface)] opacity-70"
        />
      </div>
    );
  }

  const describedByIds: string[] = [];
  if (hint) {
    describedByIds.push(hintId);
  }
  if (error) {
    describedByIds.push(errorId);
  }
  if (emptyMessage) {
    describedByIds.push(emptyId);
  }
  const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className="flex flex-col gap-[var(--space-8)] font-[family-name:var(--font-sans)]">
      <div className="flex items-center justify-between gap-[var(--space-12)] min-h-[var(--target-desktop)]">
        <span
          id={labelId}
          onClick={handleToggle}
          className={`text-[length:var(--text-14)] font-medium text-[var(--text)] select-none ${
            disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {label}
        </span>

        <button
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked ? 'true' : 'false'}
          aria-labelledby={labelId}
          aria-describedby={ariaDescribedBy}
          disabled={disabled}
          onClick={handleToggle}
          className={`inline-flex items-center gap-[var(--space-8)] min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] px-[var(--space-8)] py-[var(--space-4)] rounded-[var(--radius-6)] border cursor-pointer touch-manipulation transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed ${
            checked
              ? 'bg-[var(--accent)] text-[var(--on-accent)] border-[var(--accent)]'
              : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border-strong)]'
          }`}
        >
          <span
            aria-hidden="true"
            className={`inline-block w-[var(--space-12)] h-[var(--space-12)] rounded-[var(--radius-999)] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-calm)] ${
              checked
                ? 'bg-[var(--on-accent)] translate-x-[var(--space-4)]'
                : 'bg-[var(--border-strong)] translate-x-0'
            }`}
          />
          <span
            aria-hidden="true"
            className="font-[family-name:var(--font-mono)] text-[length:var(--text-12)]"
          >
            {checked ? 'On' : 'Off'}
          </span>
        </button>
      </div>

      {hint ? (
        <p
          id={hintId}
          className="m-0 text-[length:var(--text-12)] text-[var(--text-muted)] leading-[var(--leading-body)]"
        >
          {hint}
        </p>
      ) : null}

      {emptyMessage ? (
        <div
          id={emptyId}
          className="flex flex-wrap items-center justify-between gap-[var(--space-8)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-8)] text-[length:var(--text-12)] text-[var(--text-muted)]"
        >
          <span>{emptyMessage}</span>
          {onEmptyAction ? (
            <Button variant="secondary" size="sm" onClick={onEmptyAction}>
              {emptyActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <div
          id={errorId}
          role="alert"
          className="flex flex-wrap items-center justify-between gap-[var(--space-8)] text-[length:var(--text-12)] text-[var(--danger)]"
        >
          <span className="inline-flex items-center gap-[var(--space-8)]">
            <CircleAlert
              aria-hidden="true"
              className="shrink-0 w-[var(--space-16)] h-[var(--space-16)]"
            />
            <span>{error}</span>
            {errorCode ? (
              <code className="font-[family-name:var(--font-mono)] text-[var(--text-muted)]">
                {errorCode}
              </code>
            ) : null}
          </span>
          {onRetry ? (
            <Button variant="secondary" size="sm" onClick={onRetry}>
              {COPY['action.retry']}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
