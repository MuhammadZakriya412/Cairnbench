import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';
import { restoreAppearance } from '../design/theme';
import { ErrorState } from '../ui/ErrorState';
import { Skeleton } from '../ui/Skeleton';
import { TopNav } from './TopNav';

const LazyCommandPalette = React.lazy(() => import('./CommandPalette'));

export interface AppShellProps {
  initialPaletteOpen?: boolean;
  disabled?: boolean;
  loading?: boolean;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

export function AppShell({
  initialPaletteOpen = false,
  disabled = false,
  loading = false,
  errorMessage,
  errorCode = 'E-SHELL',
  onRetry,
}: AppShellProps): React.ReactElement {
  const [searchParams] = useSearchParams();
  const [paletteOpen, setPaletteOpen] = useState(initialPaletteOpen);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const storage = typeof window !== 'undefined' ? window.localStorage : null;
      const settings = restoreAppearance(document.documentElement, storage);
      document.body.setAttribute('data-theme', settings.theme);
      document.body.setAttribute('data-density', settings.density);
      document.body.setAttribute('data-motion', settings.motion);

      const observer = new MutationObserver(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme) {
          document.body.setAttribute('data-theme', currentTheme);
        }
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
      return () => observer.disconnect();
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (disabled) {
      return undefined;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }
      if (!paletteOpen && event.key === '/' && !isEditableElement(event.target)) {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, paletteOpen]);

  const docsTopic = searchParams.get('docs');
  if (docsTopic && docsTopic.trim().length > 0) {
    return <Navigate to={`/docs/${encodeURIComponent(docsTopic.trim())}`} replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-[family-name:var(--font-sans)] flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-[var(--space-12)] focus:left-[var(--space-12)] focus:z-50 focus:px-[var(--space-16)] focus:py-[var(--space-8)] focus:rounded-[var(--radius-5)] focus:bg-[var(--accent)] focus:text-[var(--on-accent)] focus:outline-none"
      >
        Skip to main content
      </a>

      <TopNav
        onOpenCommandPalette={() => setPaletteOpen(true)}
        disabled={disabled}
        loading={loading}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 w-full max-w-[1120px] mx-auto px-[var(--space-16)] md:px-[var(--space-24)] py-[var(--space-24)] md:py-[var(--space-32)] focus:outline-none"
      >
        {loading ? (
          <Skeleton label="Loading page content" lines={4} variant="block" />
        ) : errorMessage ? (
          <ErrorState message={errorMessage} code={errorCode} onRetry={onRetry} />
        ) : (
          <Suspense fallback={<Skeleton label="Loading screen" lines={4} variant="block" />}>
            <Outlet />
          </Suspense>
        )}
      </main>

      {paletteOpen ? (
        <Suspense fallback={null}>
          <LazyCommandPalette
            open={paletteOpen}
            onOpenChange={setPaletteOpen}
            disabled={disabled}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
