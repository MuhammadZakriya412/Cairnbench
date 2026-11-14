import { CircleAlert } from 'lucide-react';
import React from 'react';
import { Group, type Layout, Panel, Separator } from 'react-resizable-panels';
import { Button } from '../Button';
import { COPY } from '../copy';

export type SplitPaneOrientation = 'horizontal' | 'vertical';

export interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  orientation?: SplitPaneOrientation;
  defaultLeftSize?: number | string;
  defaultRightSize?: number | string;
  minSize?: number | string;
  separatorLabel?: string;
  onLayoutChanged?: (layout: Layout) => void;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function SplitPane({
  left,
  right,
  leftTitle,
  rightTitle,
  orientation = 'horizontal',
  defaultLeftSize = '50%',
  defaultRightSize = '50%',
  minSize = '20%',
  separatorLabel = 'Resize panes',
  onLayoutChanged,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: SplitPaneProps): React.ReactElement {
  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Workspace split pane loading"
        className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-16)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-16)] opacity-70"
      >
        <div
          aria-hidden="true"
          className="h-[var(--space-64)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--bg)] opacity-60"
        />
        <div
          aria-hidden="true"
          className="h-[var(--space-64)] rounded-[var(--radius-5)] border border-[var(--border)] bg-[var(--bg)] opacity-60"
        />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--danger)] bg-[var(--surface)] p-[var(--space-16)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--danger)]"
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

  if (emptyMessage || (left === null && right === null)) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-16)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        <span>{emptyMessage ?? 'No workspace panes available.'}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  const isHorizontal = orientation === 'horizontal';

  return (
    <Group
      orientation={orientation}
      disabled={disabled}
      onLayoutChanged={
        onLayoutChanged
          ? (layout) => {
              onLayoutChanged(layout);
            }
          : undefined
      }
      className="w-full rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] font-[family-name:var(--font-sans)] text-[var(--text)]"
    >
      <Panel
        id="left"
        defaultSize={defaultLeftSize}
        minSize={minSize}
        disabled={disabled}
        className="p-[var(--space-16)]"
      >
        <div className="flex flex-col gap-[var(--space-8)] h-full">
          {leftTitle ? (
            <div className="text-[length:var(--text-12)] font-medium text-[var(--text-muted)] border-b border-[var(--border)] pb-[var(--space-8)]">
              {leftTitle}
            </div>
          ) : null}
          <div className="flex-1 min-w-0">{left}</div>
        </div>
      </Panel>

      <Separator
        id="separator"
        aria-label={separatorLabel}
        disabled={disabled}
        className={`flex items-center justify-center bg-[var(--border)] transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent)] active:bg-[var(--accent)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] ${
          isHorizontal ? 'w-[var(--space-4)] cursor-col-resize' : 'h-[var(--space-4)] cursor-row-resize'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`.trim()}
      />

      <Panel
        id="right"
        defaultSize={defaultRightSize}
        minSize={minSize}
        disabled={disabled}
        className="p-[var(--space-16)]"
      >
        <div className="flex flex-col gap-[var(--space-8)] h-full">
          {rightTitle ? (
            <div className="text-[length:var(--text-12)] font-medium text-[var(--text-muted)] border-b border-[var(--border)] pb-[var(--space-8)]">
              {rightTitle}
            </div>
          ) : null}
          <div className="flex-1 min-w-0">{right}</div>
        </div>
      </Panel>
    </Group>
  );
}
