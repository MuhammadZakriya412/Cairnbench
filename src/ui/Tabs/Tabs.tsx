import { CircleAlert } from 'lucide-react';
import React, { useId, useRef } from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export interface TabItem {
  readonly id: string;
  readonly label: string;
  readonly content: React.ReactNode;
  readonly disabled?: boolean;
}

export interface TabsProps {
  ariaLabel: string;
  tabs: ReadonlyArray<TabItem>;
  activeId: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function Tabs({
  ariaLabel,
  tabs,
  activeId,
  onChange,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: TabsProps): React.ReactElement {
  const baseId = useId();
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label={`${ariaLabel} loading`}
        className="flex flex-col gap-[var(--space-12)] font-[family-name:var(--font-sans)]"
      >
        <div
          aria-hidden="true"
          className="flex items-center gap-[var(--space-8)] border-b border-[var(--border)] pb-[var(--space-8)]"
        >
          <span className="inline-block h-[var(--control-height)] w-[var(--space-64)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--surface)] opacity-70" />
          <span className="inline-block h-[var(--control-height)] w-[var(--space-64)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--surface)] opacity-70" />
        </div>
        <div
          aria-hidden="true"
          className="h-[var(--space-64)] w-full rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] opacity-70"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--danger)] bg-[var(--surface)] p-[var(--space-12)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--danger)]"
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

  if (tabs.length === 0 || emptyMessage) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-12)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        <span>{emptyMessage ?? 'No tabs available.'}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  const enabledTabs = tabs.filter((t) => !t.disabled && !disabled);
  const currentTab = tabs.find((t) => t.id === activeId) ?? tabs[0];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (enabledTabs.length === 0) {
      return;
    }
    const currentIndex = enabledTabs.findIndex((t) => t.id === currentTab?.id);
    let nextTab: TabItem | undefined;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % enabledTabs.length : 0;
      nextTab = enabledTabs[nextIndex];
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex =
        currentIndex >= 0
          ? (currentIndex - 1 + enabledTabs.length) % enabledTabs.length
          : 0;
      nextTab = enabledTabs[prevIndex];
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextTab = enabledTabs[0];
    } else if (event.key === 'End') {
      event.preventDefault();
      nextTab = enabledTabs[enabledTabs.length - 1];
    }

    if (nextTab) {
      onChange(nextTab.id);
      const btn = tabRefs.current.get(nextTab.id);
      btn?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-[var(--space-16)] font-[family-name:var(--font-sans)]">
      <div
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className="flex flex-wrap items-center gap-[var(--space-8)] border-b border-[var(--border)]"
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === currentTab?.id;
          const isTabDisabled = Boolean(disabled || tab.disabled);
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) {
                  tabRefs.current.set(tab.id, el);
                } else {
                  tabRefs.current.delete(tab.id);
                }
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isSelected ? 'true' : 'false'}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              disabled={isTabDisabled}
              onClick={() => {
                if (!isTabDisabled) {
                  onChange(tab.id);
                }
              }}
              className={`min-h-[var(--control-height)] min-w-[var(--target-desktop)] px-[var(--space-16)] py-[var(--space-8)] text-[length:var(--text-14)] font-medium border-b-2 cursor-pointer touch-manipulation transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed ${
                isSelected
                  ? 'border-[var(--accent)] text-[var(--text)] bg-[var(--surface)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {currentTab ? (
        <div
          id={`${baseId}-panel-${currentTab.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${currentTab.id}`}
          tabIndex={0}
          className="rounded-[var(--radius-6)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)]"
        >
          {currentTab.content}
        </div>
      ) : null}
    </div>
  );
}
