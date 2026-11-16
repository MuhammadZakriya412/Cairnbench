import { CircleAlert, Menu, Search, Settings, SunMoon, X } from 'lucide-react';
import React, { useState } from 'react';
import { BRAND_NAME } from '../../config/brand';
import { Button } from '../Button';
import { COPY } from '../copy';
import { Logo } from '../Logo';

export interface SiteHeaderProps {
  currentPath?: string;
  organizationName?: string;
  orgSlot?: React.ReactNode;
  themeSlot?: React.ReactNode;
  onToggleTheme?: () => void;
  onOpenCommandPalette?: () => void;
  onNavigate?: (path: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

const NAV_ITEMS = [
  { href: '/', label: COPY['nav.home'] },
  { href: '/apps', label: COPY['nav.apps'] },
  { href: '/mcp', label: COPY['nav.mcp'] },
  { href: '/vault', label: COPY['nav.vault'] },
] as const;

function isNavActive(itemHref: string, currentPath: string): boolean {
  return itemHref === '/'
    ? currentPath === '/'
    : currentPath === itemHref || currentPath.startsWith(`${itemHref}/`);
}

export function SiteHeader({
  currentPath = '/',
  organizationName = 'Personal',
  orgSlot,
  themeSlot,
  onToggleTheme,
  onOpenCommandPalette,
  onNavigate,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: SiteHeaderProps): React.ReactElement {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <header
        role="status"
        aria-busy="true"
        aria-label={`${BRAND_NAME} header loading`}
        className="flex items-center justify-between gap-[var(--space-16)] border-b border-[var(--border)] bg-[var(--surface)] px-[var(--space-24)] py-[var(--space-12)] opacity-70"
      >
        <span aria-hidden="true" className="inline-block h-[var(--space-24)] w-[var(--space-64)] rounded-[var(--radius-5)] bg-[var(--border)]" />
        <span aria-hidden="true" className="inline-block h-[var(--space-24)] w-[var(--space-64)] rounded-[var(--radius-5)] bg-[var(--border)]" />
      </header>
    );
  }

  if (errorMessage) {
    return (
      <header
        role="alert"
        className="flex flex-wrap items-center justify-between gap-[var(--space-12)] border-b border-[var(--danger)] bg-[var(--surface)] px-[var(--space-24)] py-[var(--space-12)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--danger)]"
      >
        <div className="flex items-center gap-[var(--space-8)]">
          <CircleAlert aria-hidden="true" className="shrink-0 w-[var(--space-16)] h-[var(--space-16)]" />
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
      </header>
    );
  }

  if (emptyMessage) {
    return (
      <header className="flex flex-wrap items-center justify-between gap-[var(--space-12)] border-b border-[var(--border)] bg-[var(--surface)] px-[var(--space-24)] py-[var(--space-12)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        <span>{emptyMessage}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </header>
    );
  }

  const handleLinkClick = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    setMobileMenuOpen(false);
    onNavigate?.(path, event);
  };

  return (
    <header className="w-full border-b border-[var(--border)] bg-[var(--bg)] font-[family-name:var(--font-sans)] text-[var(--text)]">
      <div className="flex items-center justify-between gap-[var(--space-8)] md:gap-[var(--space-16)] px-[var(--space-12)] md:px-[var(--space-24)] py-[var(--space-12)]">
        <div className="flex items-center gap-[var(--space-12)] md:gap-[var(--space-24)]">
          <a
            href={disabled ? undefined : '/'}
            role={disabled ? 'link' : undefined}
            aria-disabled={disabled ? 'true' : undefined}
            tabIndex={disabled ? -1 : 0}
            onClick={handleLinkClick('/')}
            className="inline-flex items-center no-underline focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)]"
          >
            <Logo showWordmark disabled={disabled} />
          </a>

          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-[var(--space-8)]">
            {NAV_ITEMS.map((item) => {
              const isActive = isNavActive(item.href, currentPath);
              return (
                <a
                  key={item.href}
                  href={disabled ? undefined : item.href}
                  role={disabled ? 'link' : undefined}
                  aria-disabled={disabled ? 'true' : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  tabIndex={disabled ? -1 : 0}
                  onClick={handleLinkClick(item.href)}
                  className={`inline-flex items-center min-h-[var(--target-desktop)] px-[var(--space-12)] py-[var(--space-8)] text-[length:var(--text-14)] font-medium no-underline border-b-2 transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:text-[var(--text)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] ${
                    isActive ? 'border-[var(--accent)] text-[var(--text)]' : 'border-transparent text-[var(--text-muted)]'
                  } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-[var(--space-4)] md:gap-[var(--space-8)]">
          <button
            type="button"
            disabled={disabled}
            aria-expanded={mobileMenuOpen ? 'true' : 'false'}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] rounded-[var(--radius-5)] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] p-[var(--space-8)] cursor-pointer focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {mobileMenuOpen ? (
              <X aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)]" />
            ) : (
              <Menu aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)]" />
            )}
          </button>

          {orgSlot ?? (
            <span
              aria-label="Active organization"
              className="inline-flex items-center min-h-[var(--target-desktop)] px-[var(--space-12)] py-[var(--space-4)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--surface)] text-[length:var(--text-12)] font-medium text-[var(--text-muted)]"
            >
              {organizationName}
            </span>
          )}

          {themeSlot ?? (
            <Button
              variant="secondary"
              size="sm"
              disabled={disabled}
              aria-label="Switch theme"
              onClick={onToggleTheme}
              icon={<SunMoon className="w-[var(--space-16)] h-[var(--space-16)]" />}
            />
          )}

          <a
            href={disabled ? undefined : '/settings'}
            role={disabled ? 'link' : undefined}
            aria-disabled={disabled ? 'true' : undefined}
            aria-label="Settings"
            tabIndex={disabled ? -1 : 0}
            onClick={handleLinkClick('/settings')}
            className={`inline-flex items-center justify-center min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] rounded-[var(--radius-5)] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] p-[var(--space-8)] no-underline transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent-wash)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] ${
              disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Settings aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)]" />
          </a>

          <button
            type="button"
            disabled={disabled}
            onClick={onOpenCommandPalette}
            className="inline-flex items-center justify-center gap-[var(--space-8)] min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] px-[var(--space-8)] md:px-[var(--space-12)] py-[var(--space-4)] rounded-[var(--radius-5)] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent-wash)] active:scale-[0.99] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <Search aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)] shrink-0" />
            <span className="sr-only">Open command palette </span>
            <span className="hidden md:inline font-[family-name:var(--font-mono)] text-[length:var(--text-12)]">Ctrl+K</span>
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <nav aria-label="Mobile navigation" className="flex md:hidden flex-col border-t border-[var(--border)] bg-[var(--surface)] px-[var(--space-24)] py-[var(--space-12)] gap-[var(--space-8)]">
          {NAV_ITEMS.map((item) => {
            const isActive = isNavActive(item.href, currentPath);
            return (
              <a
                key={`mobile-${item.href}`}
                href={disabled ? undefined : item.href}
                role={disabled ? 'link' : undefined}
                aria-disabled={disabled ? 'true' : undefined}
                aria-current={isActive ? 'page' : undefined}
                tabIndex={disabled ? -1 : 0}
                onClick={handleLinkClick(item.href)}
                className={`inline-flex items-center min-h-[var(--target-desktop)] px-[var(--space-12)] py-[var(--space-8)] rounded-[var(--radius-5)] text-[length:var(--text-14)] font-medium no-underline ${
                  isActive ? 'bg-[var(--accent-wash)] text-[var(--text)]' : 'text-[var(--text-muted)]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
