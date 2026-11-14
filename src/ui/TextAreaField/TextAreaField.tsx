import { CircleAlert } from 'lucide-react';
import React, { useId } from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface TextAreaFieldProps {
  label: string;
  hint?: string;
  error?: string;
  rows?: number;
  value: string;
  onChange: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  errorCode?: string;
  onRetry?: () => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

export function TextAreaField({
  label,
  hint,
  error,
  rows = 4,
  value,
  onChange,
  id,
  name,
  disabled = false,
  loading = false,
  required = false,
  errorCode,
  onRetry,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
}: TextAreaFieldProps): React.ReactElement {
  const reactId = useId();
  const textareaId = id ?? `textarea-${reactId}`;
  const hintId = `${textareaId}-hint`;
  const errorId = `${textareaId}-error`;
  const emptyId = `${textareaId}-empty`;

  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={`${label} loading`}
        className="flex flex-col gap-[var(--space-8)] font-[family-name:var(--font-sans)]"
      >
        <span className="text-[length:var(--text-14)] font-medium text-[var(--text)]">
          {label}
        </span>
        <div
          aria-hidden="true"
          className="min-h-[var(--space-64)] w-full rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] opacity-70"
        />
      </div>
    );
  }

  const showEmpty = Boolean(emptyMessage && value.length === 0);
  const describedByIds: string[] = [];
  if (hint) {
    describedByIds.push(hintId);
  }
  if (error) {
    describedByIds.push(errorId);
  }
  if (showEmpty) {
    describedByIds.push(emptyId);
  }
  const ariaDescribedBy = describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

  return (
    <div className="flex flex-col gap-[var(--space-8)] font-[family-name:var(--font-sans)]">
      <label
        htmlFor={textareaId}
        className="text-[length:var(--text-14)] font-medium text-[var(--text)]"
      >
        {label}
      </label>

      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        value={value}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
        onChange={(event) => onChange(event.target.value, event)}
        className={`w-full rounded-[var(--radius-6)] border p-[var(--space-12)] bg-[var(--surface)] text-[length:var(--text-16)] text-[var(--text)] leading-[var(--leading-body)] transition-[opacity,transform] duration-[var(--duration-fast)] ease-[var(--ease-calm)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed ${
          error ? 'border-[var(--danger)]' : 'border-[var(--border-strong)]'
        }`}
      />

      {hint ? (
        <p
          id={hintId}
          className="m-0 text-[length:var(--text-12)] text-[var(--text-muted)] leading-[var(--leading-body)]"
        >
          {hint}
        </p>
      ) : null}

      {showEmpty ? (
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
