import { CircleAlert } from 'lucide-react';
import React from 'react';
import { BRAND_NAME } from '../../config/brand';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface SiteFooterProps {
  docsHref?: string;
  privacyHref?: string;
  githubHref?: string;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function SiteFooter({
  docsHref = '/docs/getting-started',
  privacyHref = '/privacy',
  githubHref = 'https://github.com/cairnbench/cairnbench',
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: SiteFooterProps): React.ReactElement {
  if (loading) {
    return (
      <footer
        role="status"
        aria-busy="true"
        aria-label={`${BRAND_NAME} footer loading`}
        className="flex items-center justify-between gap-[var(--space-16)] border-t border-[var(--border)] bg-[var(--bg)] px-[var(--space-24)] py-[var(--space-24)] opacity-70"
      >
        <span
          aria-hidden="true"
          className="inline-block h-[var(--space-16)] w-[var(--space-64)] rounded-[var(--radius-5)] bg-[var(--surface)]"
        />
        <span
          aria-hidden="true"
          className="inline-block h-[var(--space-16)] w-[var(--space-64)] rounded-[var(--radius-5)] bg-[var(--surface)]"
        />
      </footer>
    );
  }

  if (errorMessage) {
    return (
      <footer
        role="alert"
        className="flex flex-wrap items-center justify-between gap-[var(--space-12)] border-t border-[var(--danger)] bg-[var(--surface)] px-[var(--space-24)] py-[var(--space-16)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--danger)]"
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
      </footer>
    );
  }

  if (emptyMessage) {
    return (
      <footer className="flex flex-wrap items-center justify-between gap-[var(--space-12)] border-t border-[var(--border)] bg-[var(--surface)] px-[var(--space-24)] py-[var(--space-16)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        <span>{emptyMessage}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </footer>
    );
  }

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
    }
  };

  const linkClassName = `inline-flex items-center min-h-[var(--target-desktop)] px-[var(--space-8)] py-[var(--space-4)] rounded-[var(--radius-5)] text-[length:var(--text-14)] text-[var(--text-muted)] hover:text-[var(--text)] no-underline transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] ${
    disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
  }`;

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--bg)] px-[var(--space-24)] py-[var(--space-24)] font-[family-name:var(--font-sans)] text-[var(--text)]">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-16)]">
        <span className="font-[family-name:var(--font-serif)] text-[length:var(--text-16)] text-[var(--text)]">
          {BRAND_NAME}
        </span>

        <nav aria-label="Footer links" className="flex flex-wrap items-center gap-[var(--space-16)]">
          <a
            href={disabled ? undefined : docsHref}
            role={disabled ? 'link' : undefined}
            aria-disabled={disabled ? 'true' : undefined}
            tabIndex={disabled ? -1 : 0}
            onClick={handleLinkClick}
            className={linkClassName}
          >
            Docs
          </a>
          <a
            href={disabled ? undefined : privacyHref}
            role={disabled ? 'link' : undefined}
            aria-disabled={disabled ? 'true' : undefined}
            tabIndex={disabled ? -1 : 0}
            onClick={handleLinkClick}
            className={linkClassName}
          >
            Privacy
          </a>
          <a
            href={disabled ? undefined : githubHref}
            role={disabled ? 'link' : undefined}
            aria-disabled={disabled ? 'true' : undefined}
            tabIndex={disabled ? -1 : 0}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className={linkClassName}
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
