import {
  Close as PopoverClose,
  Content as PopoverContent,
  Portal as PopoverPortal,
  Popover,
  Trigger as PopoverTrigger,
} from '@radix-ui/react-popover';
import { CircleAlert, ExternalLink, Info, X } from 'lucide-react';
import React, { useId, useState } from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface InfoPopoverProps {
  topicId: string;
  summary: string;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function InfoPopover({
  topicId,
  summary,
  label,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: InfoPopoverProps): React.ReactElement {
  const reactId = useId();
  const summaryId = `info-popover-summary-${reactId}`;
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <span
        role="status"
        aria-busy="true"
        aria-label={label ? `${label} loading` : `Help for ${topicId} loading`}
        className="inline-flex items-center justify-center min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--surface)] opacity-70"
      >
        <span
          aria-hidden="true"
          className="inline-block w-[var(--space-16)] h-[var(--space-16)] rounded-[var(--radius-999)] bg-[var(--border-strong)] opacity-50"
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

  const triggerLabel = label ?? `Help for ${topicId}`;
  const docHref = `/docs/${encodeURIComponent(topicId)}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        disabled={disabled}
        aria-label={triggerLabel}
        aria-describedby={open ? summaryId : undefined}
        className="inline-flex items-center justify-center min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] rounded-[var(--radius-5)] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] p-[var(--space-8)] cursor-pointer touch-manipulation transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent-wash)] active:scale-[0.99] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Info aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)]" />
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-50 max-w-xs rounded-[var(--radius-6)] border border-[var(--border-strong)] bg-[var(--surface)] p-[var(--space-16)] shadow-[var(--shadow-md)] font-[family-name:var(--font-sans)] text-[var(--text)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)]"
        >
          <div className="flex flex-col gap-[var(--space-12)]">
            <div className="flex items-start justify-between gap-[var(--space-12)]">
              <p
                id={summaryId}
                className="m-0 text-[length:var(--text-14)] leading-[var(--leading-body)] text-[var(--text)]"
              >
                {summary}
              </p>
              <PopoverClose
                type="button"
                aria-label="Close help popover"
                className="inline-flex items-center justify-center min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] shrink-0 rounded-[var(--radius-5)] border border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--accent-wash)] cursor-pointer focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)]"
              >
                <X aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)]" />
              </PopoverClose>
            </div>

            <a
              href={docHref}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-[var(--space-8)] text-[length:var(--text-14)] font-medium text-[var(--accent)] underline underline-offset-[var(--space-4)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)]"
            >
              <span>Open full guide</span>
              <ExternalLink
                aria-hidden="true"
                className="w-[var(--space-16)] h-[var(--space-16)]"
              />
            </a>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
