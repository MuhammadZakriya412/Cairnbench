import { CircleAlert } from 'lucide-react';
import React from 'react';
import { COPY } from '../copy';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-[var(--on-accent)] border border-[var(--accent)] hover:opacity-90 active:scale-[0.99]',
  secondary:
    'bg-[var(--surface)] text-[var(--text)] border border-[var(--border-strong)] hover:bg-[var(--accent-wash)] active:scale-[0.99]',
  ghost:
    'bg-transparent text-[var(--text)] border border-transparent hover:bg-[var(--surface)] hover:border-[var(--border)] active:scale-[0.99]',
  danger:
    'bg-[var(--surface)] text-[var(--danger)] border border-[var(--danger)] hover:bg-[var(--accent-wash)] active:scale-[0.99]',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] px-[var(--space-12)] py-[var(--space-4)] text-[length:var(--text-14)] gap-[var(--space-8)]',
  md: 'min-h-[var(--control-height)] min-w-[var(--target-desktop)] px-[var(--space-16)] py-[var(--space-8)] text-[length:var(--text-16)] gap-[var(--space-8)]',
  lg: 'min-h-[var(--target-touch)] min-w-[var(--target-touch)] px-[var(--space-24)] py-[var(--space-12)] text-[length:var(--text-16)] gap-[var(--space-12)]',
};

const BASE_BUTTON_CLASSES =
  'inline-flex items-center justify-center rounded-[var(--radius-5)] font-[family-name:var(--font-sans)] font-medium leading-[var(--leading-body)] whitespace-nowrap shrink-0 cursor-pointer select-none touch-manipulation transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed';

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  children,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
  type = 'button',
  className = '',
  ...rest
}: ButtonProps): React.ReactElement {
  if (errorMessage) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--danger)] bg-[var(--surface)] p-[var(--space-12)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text)]"
      >
        <div className="flex items-center gap-[var(--space-8)]">
          <CircleAlert
            aria-hidden="true"
            className="shrink-0 text-[var(--danger)] w-[var(--space-16)] h-[var(--space-16)]"
          />
          <span>{errorMessage}</span>
          {errorCode ? (
            <code className="font-[family-name:var(--font-mono)] text-[length:var(--text-12)] text-[var(--text-muted)]">
              {errorCode}
            </code>
          ) : null}
        </div>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className={`${BASE_BUTTON_CLASSES} ${VARIANT_CLASSES.secondary} ${SIZE_CLASSES.sm}`}
          >
            {COPY['action.retry']}
          </button>
        ) : null}
      </div>
    );
  }

  if (emptyMessage) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-12)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        <span>{emptyMessage}</span>
        {onEmptyAction ? (
          <button
            type="button"
            onClick={onEmptyAction}
            className={`${BASE_BUTTON_CLASSES} ${VARIANT_CLASSES.secondary} ${SIZE_CLASSES.sm}`}
          >
            {emptyActionLabel}
          </button>
        ) : null}
      </div>
    );
  }

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : undefined}
      className={`${BASE_BUTTON_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`.trim()}
      {...rest}
    >
      {loading ? (
        <span
          role="status"
          aria-live="polite"
          className="inline-flex items-center gap-[var(--space-8)]"
        >
          <span
            aria-hidden="true"
            className="inline-block w-[var(--space-16)] h-[var(--space-8)] rounded-[var(--radius-999)] bg-current opacity-50"
          />
          <span>{children}</span>
        </span>
      ) : (
        <>
          {icon ? (
            <span aria-hidden="true" className="inline-flex items-center shrink-0">
              {icon}
            </span>
          ) : null}
          {children ? <span>{children}</span> : null}
        </>
      )}
    </button>
  );
}
