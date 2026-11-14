import {
  Close as DialogClose,
  Content as DialogContent,
  Description as DialogDescription,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Dialog,
  Title as DialogTitle,
  Trigger as DialogTrigger,
} from '@radix-ui/react-dialog';
import { CircleAlert, X } from 'lucide-react';
import React from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export type ModalDrawerVariant = 'dialog' | 'drawer';

export interface ModalDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: ModalDrawerVariant;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function ModalDrawer({
  open,
  onOpenChange,
  title,
  description,
  variant = 'dialog',
  trigger,
  children,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: ModalDrawerProps): React.ReactElement {
  const layoutClass =
    variant === 'drawer'
      ? 'fixed top-0 right-0 bottom-0 z-50 w-full max-w-md border-l border-[var(--border-strong)] bg-[var(--surface)] p-[var(--space-24)] shadow-[var(--shadow-lg)]'
      : 'fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-6)] border border-[var(--border-strong)] bg-[var(--surface)] p-[var(--space-24)] shadow-[var(--shadow-lg)]';

  return (
    <Dialog open={open} onOpenChange={disabled ? undefined : onOpenChange}>
      {trigger ? (
        <DialogTrigger asChild disabled={disabled}>
          {trigger}
        </DialogTrigger>
      ) : null}

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-40 bg-[var(--bg)] opacity-80 transition-opacity duration-[var(--duration-base)] ease-[var(--ease-calm)]" />

        <DialogContent
          aria-describedby={description ? undefined : undefined}
          className={`${layoutClass} font-[family-name:var(--font-sans)] text-[var(--text)] transition-[transform,opacity] duration-[var(--duration-base)] ease-[var(--ease-calm)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)]`}
        >
          <div className="flex flex-col gap-[var(--space-16)]">
            <div className="flex items-start justify-between gap-[var(--space-12)] border-b border-[var(--border)] pb-[var(--space-12)]">
              <div className="flex flex-col gap-[var(--space-4)]">
                <DialogTitle className="m-0 font-[family-name:var(--font-serif)] text-[length:var(--text-24)] font-normal leading-[var(--leading-heading)] text-[var(--text)]">
                  {title}
                </DialogTitle>
                {description ? (
                  <DialogDescription className="m-0 text-[length:var(--text-14)] leading-[var(--leading-body)] text-[var(--text-muted)]">
                    {description}
                  </DialogDescription>
                ) : (
                  <DialogDescription className="sr-only">{title}</DialogDescription>
                )}
              </div>

              <DialogClose
                type="button"
                aria-label="Close dialog"
                disabled={disabled}
                className="inline-flex items-center justify-center min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] shrink-0 rounded-[var(--radius-5)] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--accent-wash)] cursor-pointer focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <X aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)]" />
              </DialogClose>
            </div>

            {loading ? (
              <div
                role="status"
                aria-busy="true"
                aria-label={`${title} loading`}
                className="flex flex-col gap-[var(--space-12)]"
              >
                <div
                  aria-hidden="true"
                  className="h-[var(--space-24)] w-full rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--bg)] opacity-70"
                />
                <div
                  aria-hidden="true"
                  className="h-[var(--space-48)] w-full rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--bg)] opacity-70"
                />
              </div>
            ) : errorMessage ? (
              <div
                role="alert"
                className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--danger)] bg-[var(--surface)] p-[var(--space-12)] text-[length:var(--text-14)] text-[var(--danger)]"
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
            ) : emptyMessage ? (
              <div className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-12)] text-[length:var(--text-14)] text-[var(--text-muted)]">
                <span>{emptyMessage}</span>
                {onEmptyAction ? (
                  <Button variant="secondary" size="sm" onClick={onEmptyAction}>
                    {emptyActionLabel}
                  </Button>
                ) : null}
              </div>
            ) : (
              <div>{children}</div>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
