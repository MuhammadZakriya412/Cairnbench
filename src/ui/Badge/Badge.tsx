import { Check, CircleAlert, Info, Tag, TriangleAlert } from 'lucide-react';
import React from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  variant?: BadgeVariant;
  children?: React.ReactNode;
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

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: 'border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)]',
  accent: 'border-[var(--accent)] bg-[var(--surface)] text-[var(--accent)]',
  success: 'border-[var(--success)] bg-[var(--surface)] text-[var(--success)]',
  warning: 'border-[var(--warning)] bg-[var(--surface)] text-[var(--warning)]',
  danger: 'border-[var(--danger)] bg-[var(--surface)] text-[var(--danger)]',
};

function renderVariantIcon(variant: BadgeVariant): React.ReactElement {
  const iconClass = 'shrink-0 w-[var(--space-12)] h-[var(--space-12)]';
  switch (variant) {
    case 'success':
      return <Check aria-hidden="true" className={iconClass} />;
    case 'warning':
      return <TriangleAlert aria-hidden="true" className={iconClass} />;
    case 'danger':
      return <CircleAlert aria-hidden="true" className={iconClass} />;
    case 'accent':
      return <Info aria-hidden="true" className={iconClass} />;
    case 'neutral':
      return <Tag aria-hidden="true" className={iconClass} />;
  }
}

export function Badge({
  variant = 'neutral',
  children,
  onClick,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: BadgeProps): React.ReactElement {
  if (loading) {
    return (
      <span
        role="status"
        aria-busy="true"
        aria-label="Badge loading"
        className="inline-flex items-center gap-[var(--space-4)] rounded-[var(--radius-999)] border border-[var(--border)] bg-[var(--surface)] px-[var(--space-8)] py-[var(--space-4)] opacity-70"
      >
        <span
          aria-hidden="true"
          className="inline-block w-[var(--space-32)] h-[var(--space-12)] rounded-[var(--radius-999)] bg-[var(--border-strong)] opacity-50"
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

  if (emptyMessage) {
    return (
      <div className="inline-flex flex-wrap items-center gap-[var(--space-8)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-8)] font-[family-name:var(--font-sans)] text-[length:var(--text-12)] text-[var(--text-muted)]">
        <span>{emptyMessage}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  const baseClass = `inline-flex items-center gap-[var(--space-4)] rounded-[var(--radius-999)] border px-[var(--space-8)] py-[var(--space-4)] font-[family-name:var(--font-mono)] text-[length:var(--text-12)] font-medium leading-[var(--leading-body)] ${VARIANT_CLASSES[variant]}`;

  if (onClick || disabled) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`${baseClass} min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] cursor-pointer touch-manipulation transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent-wash)] active:scale-[0.99] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {renderVariantIcon(variant)}
        <span>{children}</span>
      </button>
    );
  }

  return (
    <span className={baseClass}>
      {renderVariantIcon(variant)}
      <span>{children}</span>
    </span>
  );
}
