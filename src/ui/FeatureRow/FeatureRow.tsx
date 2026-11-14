import { CircleAlert } from 'lucide-react';
import React from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface FeatureRowProps {
  appId: string;
  name: string;
  description: string;
  snippet: readonly [string, string] | ReadonlyArray<string> | string;
  reverse?: boolean;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function FeatureRow({
  appId,
  name,
  description,
  snippet,
  reverse = false,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: FeatureRowProps): React.ReactElement {
  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={`${name} feature row loading`}
        className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-24)] border-b border-[var(--border)] py-[var(--space-24)] opacity-70"
      >
        <div
          aria-hidden="true"
          className="h-[var(--space-64)] rounded-[var(--radius-6)] bg-[var(--surface)]"
        />
        <div
          aria-hidden="true"
          className="h-[var(--space-64)] rounded-[var(--radius-6)] bg-[var(--surface)]"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-[var(--space-12)] border-b border-[var(--danger)] bg-[var(--surface)] p-[var(--space-16)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--danger)]"
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

  const lines = typeof snippet === 'string' ? snippet.split('\n') : snippet;

  if (emptyMessage || lines.length === 0) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-12)] border-b border-[var(--border)] bg-[var(--surface)] p-[var(--space-16)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        <span>{emptyMessage ?? 'No feature row content available.'}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  const toolHref = `/app/${encodeURIComponent(appId)}/workspace`;
  const tutorialHref = `/app/${encodeURIComponent(appId)}/overview`;

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
    }
  };

  return (
    <div
      data-reverse={reverse ? 'true' : 'false'}
      className={`flex flex-col ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      } items-start md:items-center justify-between gap-[var(--space-24)] border-b border-[var(--border)] py-[var(--space-24)] font-[family-name:var(--font-sans)] text-[var(--text)]`}
    >
      <div className="flex flex-col gap-[var(--space-12)] flex-1 min-w-0">
        <h3 className="m-0 font-[family-name:var(--font-serif)] text-[length:var(--text-24)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)]">
          {name}
        </h3>
        <p className="m-0 max-w-[var(--measure-reading-max)] text-[length:var(--text-16)] leading-[var(--leading-body)] text-[var(--text-muted)]">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-[var(--space-16)] pt-[var(--space-4)]">
          <a
            href={disabled ? undefined : toolHref}
            role={disabled ? 'link' : undefined}
            aria-disabled={disabled ? 'true' : undefined}
            tabIndex={disabled ? -1 : 0}
            onClick={handleLinkClick}
            className={`inline-flex items-center min-h-[var(--target-desktop)] px-[var(--space-12)] py-[var(--space-8)] rounded-[var(--radius-5)] border border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)] text-[length:var(--text-14)] font-medium no-underline transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:opacity-90 active:scale-[0.99] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] ${
              disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer touch-manipulation'
            }`}
          >
            {COPY['action.opentool']}
          </a>
          <a
            href={disabled ? undefined : tutorialHref}
            role={disabled ? 'link' : undefined}
            aria-disabled={disabled ? 'true' : undefined}
            tabIndex={disabled ? -1 : 0}
            onClick={handleLinkClick}
            className={`inline-flex items-center min-h-[var(--target-desktop)] px-[var(--space-12)] py-[var(--space-8)] rounded-[var(--radius-5)] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] text-[length:var(--text-14)] font-medium no-underline transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent-wash)] active:scale-[0.99] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] ${
              disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer touch-manipulation'
            }`}
          >
            {COPY['action.watchtutorial']}
          </a>
        </div>
      </div>

      <pre className="m-0 flex flex-col gap-[var(--space-8)] w-full md:w-auto md:min-w-[var(--measure-reading-min)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-16)] font-[family-name:var(--font-mono)] text-[length:var(--text-12)] text-[var(--text)] overflow-x-auto">
        {lines.slice(0, 2).map((line, idx) => (
          <code key={`${appId}-snippet-${String(idx)}`} className="block whitespace-pre">
            {line}
          </code>
        ))}
      </pre>
    </div>
  );
}
