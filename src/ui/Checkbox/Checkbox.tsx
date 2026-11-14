import { Check, CircleAlert } from 'lucide-react';
import React, { useId } from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  error?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  loading?: boolean;
  errorCode?: string;
  onRetry?: () => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export function Checkbox({
  label,
  checked,
  onChange,
  hint,
  error,
  id,
  name,
  disabled = false,
  loading = false,
  errorCode,
  onRetry,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
}: CheckboxProps): React.ReactElement {
  const reactId = useId();
  const checkboxId = id ?? `checkbox-${reactId}`;
  const hintId = `${checkboxId}-hint`;
  const errorId = `${checkboxId}-error`;
  const emptyId = `${checkboxId}-empty`;

  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={`${label} loading`}
        className="flex items-center gap-[var(--space-12)] min-h-[var(--target-desktop)] font-[family-name:var(--font-sans)]"
      >
        <span
          aria-hidden="true"
          className="inline-block w-[var(--space-24)] h-[var(--space-24)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--surface)] opacity-70"
        />
        <span className="text-[length:var(--text-14)] font-medium text-[var(--text)]">
          {label}
        </span>
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

  return (
    <div className="flex flex-col gap-[var(--space-8)] font-[family-name:var(--font-sans)]">
      <div className="inline-flex items-center gap-[var(--space-12)] min-h-[var(--target-desktop)]">
        <input
          id={checkboxId}
          name={name}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          onChange={(event) => onChange(event.target.checked, event)}
          className="w-[var(--space-24)] h-[var(--space-24)] rounded-[var(--radius-5)] border border-[var(--border-strong)] bg-[var(--surface)] accent-[var(--accent)] cursor-pointer touch-manipulation focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <label
          htmlFor={checkboxId}
          className={`inline-flex items-center gap-[var(--space-8)] text-[length:var(--text-14)] font-medium text-[var(--text)] leading-[var(--leading-body)] select-none ${
            disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <span>{label}</span>
          {checked ? (
            <Check
              aria-hidden="true"
              className="shrink-0 w-[var(--space-16)] h-[var(--space-16)] text-[var(--accent)]"
            />
          ) : null}
        </label>
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
