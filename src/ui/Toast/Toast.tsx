import { Check, CircleAlert, Info, TriangleAlert, X } from 'lucide-react';
import React from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export interface ToastRegionProps {
  label?: string;
  children?: React.ReactNode;
}

export function ToastRegion({
  label = 'Notifications',
  children,
}: ToastRegionProps): React.ReactElement {
  return (
    <section
      aria-label={label}
      aria-live="polite"
      aria-atomic="false"
      className="flex flex-col gap-[var(--space-8)] font-[family-name:var(--font-sans)]"
    >
      {children}
    </section>
  );
}

const BORDER_CLASSES: Record<ToastVariant, string> = {
  info: 'border-[var(--border-strong)]',
  success: 'border-[var(--success)]',
  warning: 'border-[var(--warning)]',
  danger: 'border-[var(--danger)]',
};

function renderToastIcon(variant: ToastVariant): React.ReactElement {
  const base = 'shrink-0 w-[var(--space-16)] h-[var(--space-16)]';
  switch (variant) {
    case 'success':
      return <Check aria-hidden="true" className={`${base} text-[var(--success)]`} />;
    case 'warning':
      return <TriangleAlert aria-hidden="true" className={`${base} text-[var(--warning)]`} />;
    case 'danger':
      return <CircleAlert aria-hidden="true" className={`${base} text-[var(--danger)]`} />;
    case 'info':
      return <Info aria-hidden="true" className={`${base} text-[var(--accent)]`} />;
  }
}

export function Toast({
  message,
  variant = 'info',
  actionLabel,
  onAction,
  onDismiss,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: ToastProps): React.ReactElement {
  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Notification loading"
        className="flex items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-12)] shadow-[var(--shadow-md)] opacity-70"
      >
        <span
          aria-hidden="true"
          className="inline-block h-[var(--space-16)] w-[var(--space-64)] rounded-[var(--radius-5)] bg-[var(--border-strong)] opacity-50"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--danger)] bg-[var(--surface)] p-[var(--space-12)] shadow-[var(--shadow-md)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--danger)]"
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

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border bg-[var(--surface)] p-[var(--space-12)] shadow-[var(--shadow-md)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text)] ${BORDER_CLASSES[variant]}`}
    >
      <div className="flex items-center gap-[var(--space-8)]">
        {renderToastIcon(variant)}
        <span>{message}</span>
      </div>

      <div className="flex items-center gap-[var(--space-8)]">
        {actionLabel && onAction ? (
          <Button variant="secondary" size="sm" disabled={disabled} onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
        {onDismiss ? (
          <button
            type="button"
            disabled={disabled}
            aria-label="Dismiss notification"
            onClick={onDismiss}
            className="inline-flex items-center justify-center min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] rounded-[var(--radius-5)] border border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--accent-wash)] cursor-pointer focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <X aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)]" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
