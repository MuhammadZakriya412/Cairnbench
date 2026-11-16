import { Check, CircleAlert, SunMoon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
  readThemePreference,
  updateThemePreference,
  type ThemePreference,
} from '../design/theme';
import { Button } from '../ui/Button';
import { COPY } from '../ui/copy';

export interface ThemeMenuProps {
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

const THEME_OPTIONS: readonly { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'cairn-dusk', label: 'Dusk (dark)' },
  { value: 'cairn-daylight', label: 'Daylight (light)' },
];

function readInitialPreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }
  try {
    return readThemePreference(window.localStorage);
  } catch {
    return 'system';
  }
}

export function ThemeMenu({
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: ThemeMenuProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [preference, setPreference] = useState<ThemePreference>(readInitialPreference);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    setPreference(readInitialPreference());
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && event.target instanceof Node && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (loading) {
    return (
      <span
        role="status"
        aria-busy="true"
        aria-label="Theme menu loading"
        className="inline-flex items-center min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] px-[var(--space-8)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--surface)] opacity-70"
      >
        <span
          aria-hidden="true"
          className="inline-block h-[var(--space-16)] w-[var(--space-16)] rounded-[var(--radius-5)] bg-[var(--border)]"
        />
      </span>
    );
  }

  if (errorMessage) {
    return (
      <span
        role="alert"
        className="inline-flex items-center gap-[var(--space-8)] px-[var(--space-8)] py-[var(--space-4)] rounded-[var(--radius-5)] border border-[var(--danger)] bg-[var(--surface)] text-[length:var(--text-12)] text-[var(--danger)]"
      >
        <CircleAlert aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)] shrink-0" />
        <span>{errorMessage}</span>
        {errorCode ? (
          <code className="font-[family-name:var(--font-mono)] text-[length:var(--text-12)] text-[var(--text-muted)]">
            {errorCode}
          </code>
        ) : null}
        {onRetry ? (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {COPY['action.retry']}
          </Button>
        ) : null}
      </span>
    );
  }

  if (emptyMessage) {
    return (
      <span className="inline-flex items-center gap-[var(--space-8)] px-[var(--space-8)] py-[var(--space-4)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--surface)] text-[length:var(--text-12)] text-[var(--text-muted)]">
        <span>{emptyMessage}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </span>
    );
  }

  const handleSelectPreference = (nextPref: ThemePreference) => {
    setPreference(nextPref);
    if (typeof document !== 'undefined') {
      const storage = typeof window !== 'undefined' ? window.localStorage : null;
      updateThemePreference(document.documentElement, storage, nextPref);
    }
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        disabled={disabled}
        aria-label="Theme"
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-center gap-[var(--space-8)] min-h-[var(--target-desktop)] min-w-[var(--target-desktop)] px-[var(--space-8)] rounded-[var(--radius-5)] border border-[var(--border-strong)] bg-[var(--surface)] font-[family-name:var(--font-sans)] text-[length:var(--text-12)] font-medium text-[var(--text)] transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent-wash)] active:scale-[0.99] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        <SunMoon aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)] shrink-0" />
        <span className="sr-only">Theme</span>
      </button>

      {open ? (
        <div
          role="group"
          aria-label="Theme options"
          className="absolute right-0 top-full mt-[var(--space-8)] z-50 min-w-[160px] rounded-[var(--radius-6)] border border-[var(--border-strong)] bg-[var(--surface)] p-[var(--space-8)] shadow-[var(--shadow-md)] font-[family-name:var(--font-sans)] text-[var(--text)] flex flex-col gap-[var(--space-4)]"
        >
          {THEME_OPTIONS.map((option) => {
            const isSelected = preference === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected ? 'true' : 'false'}
                onClick={() => handleSelectPreference(option.value)}
                className={`inline-flex items-center justify-between gap-[var(--space-12)] min-h-[var(--target-desktop)] w-full px-[var(--space-12)] py-[var(--space-8)] rounded-[var(--radius-5)] text-left text-[length:var(--text-14)] font-medium transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent-wash)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] cursor-pointer ${
                  isSelected ? 'bg-[var(--accent-wash)] text-[var(--text)]' : 'text-[var(--text)]'
                }`}
              >
                <span>{option.label}</span>
                {isSelected ? (
                  <Check aria-hidden="true" className="w-[var(--space-16)] h-[var(--space-16)] text-[var(--accent)]" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
