import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../Button';
import type { ButtonSize, ButtonVariant } from '../Button';
import { COPY } from '../copy';

export interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onCopy?: (value: string) => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function CopyButton({
  value,
  label = COPY['action.copy'],
  copiedLabel = COPY['action.copied'],
  variant = 'secondary',
  size = 'sm',
  onCopy,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: CopyButtonProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  if (errorMessage || emptyMessage || loading) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        loading={loading}
        emptyMessage={emptyMessage}
        emptyActionLabel={emptyActionLabel}
        onEmptyAction={onEmptyAction}
        errorMessage={errorMessage}
        errorCode={errorCode}
        onRetry={onRetry}
      >
        {label}
      </Button>
    );
  }

  const handleCopy = async () => {
    if (disabled) {
      return;
    }
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        // Clipboard API may be unavailable in restricted contexts; onCopy still runs.
      }
    }
    if (onCopy) {
      await onCopy(value);
    }
    setCopied(true);
  };

  const iconNode = copied ? (
    <Check
      aria-hidden="true"
      className="w-[var(--space-16)] h-[var(--space-16)] text-[var(--success)]"
    />
  ) : (
    <Copy aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)]" />
  );

  return (
    <span className="inline-flex items-center gap-[var(--space-8)]">
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        icon={iconNode}
        onClick={() => {
          void handleCopy();
        }}
      >
        {copied ? copiedLabel : label}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ''}
      </span>
    </span>
  );
}
