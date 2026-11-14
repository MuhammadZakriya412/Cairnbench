import { diffLines } from 'diff';
import { CircleAlert } from 'lucide-react';
import React from 'react';
import { Button } from '../Button';
import { COPY } from '../copy';

export type DiffViewMode = 'unified' | 'split' | 'side-by-side';

export interface DiffViewProps {
  before: string;
  after: string;
  mode?: DiffViewMode;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

interface ParsedDiffLine {
  readonly kind: 'added' | 'removed' | 'context';
  readonly text: string;
  readonly beforeLineNumber?: number;
  readonly afterLineNumber?: number;
}

function splitChangeLines(value: string): ReadonlyArray<string> {
  if (value === '') {
    return [];
  }
  const normalized = value.endsWith('\n') ? value.slice(0, -1) : value;
  return normalized.split('\n');
}

function parseUnifiedDiff(before: string, after: string): ReadonlyArray<ParsedDiffLine> {
  const changes = diffLines(before, after);
  const result: ParsedDiffLine[] = [];
  let beforeLine = 1;
  let afterLine = 1;

  for (const change of changes) {
    for (const line of splitChangeLines(change.value)) {
      if (change.added) {
        result.push({ kind: 'added', text: line, afterLineNumber: afterLine });
        afterLine += 1;
      } else if (change.removed) {
        result.push({ kind: 'removed', text: line, beforeLineNumber: beforeLine });
        beforeLine += 1;
      } else {
        result.push({
          kind: 'context',
          text: line,
          beforeLineNumber: beforeLine,
          afterLineNumber: afterLine,
        });
        beforeLine += 1;
        afterLine += 1;
      }
    }
  }
  return result;
}

export function DiffView({
  before,
  after,
  mode = 'unified',
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel = COPY['action.open'],
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: DiffViewProps): React.ReactElement {
  if (loading) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Diff view loading"
        className="flex flex-col gap-[var(--space-8)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-16)] opacity-70"
      >
        <div aria-hidden="true" className="h-[var(--space-16)] w-full rounded-[var(--radius-5)] bg-[var(--border)] opacity-60" />
        <div aria-hidden="true" className="h-[var(--space-16)] w-5/6 rounded-[var(--radius-5)] bg-[var(--border)] opacity-60" />
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
      </div>
    );
  }

  if (emptyMessage || (before === '' && after === '')) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-12)] rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-16)] font-[family-name:var(--font-sans)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        <span>{emptyMessage ?? 'No diff lines to display.'}</span>
        {onEmptyAction ? (
          <Button variant="secondary" size="sm" onClick={onEmptyAction}>
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  const parsedLines = parseUnifiedDiff(before, after);
  const isSplit = mode === 'split' || mode === 'side-by-side';

  if (isSplit) {
    const beforeLines = parsedLines.filter((l) => l.kind !== 'added');
    const afterLines = parsedLines.filter((l) => l.kind !== 'removed');

    return (
      <div
        data-mode={mode}
        aria-disabled={disabled ? 'true' : undefined}
        className={`grid grid-cols-1 md:grid-cols-2 rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] font-[family-name:var(--font-mono)] text-[length:var(--text-12)] text-[var(--text)] overflow-hidden ${
          disabled ? 'opacity-60' : ''
        }`.trim()}
      >
        <div className="flex flex-col border-b md:border-b-0 md:border-r border-[var(--border)]">
          <div className="border-b border-[var(--border)] px-[var(--space-12)] py-[var(--space-8)] font-[family-name:var(--font-sans)] text-[length:var(--text-12)] font-medium text-[var(--text-muted)]">
            Before
          </div>
          <div className="flex flex-col py-[var(--space-8)]">
            {beforeLines.map((line, index) => (
              <div
                key={`before-${String(index)}`}
                data-diff-type={line.kind}
                className={`flex items-baseline gap-[var(--space-8)] px-[var(--space-12)] py-[var(--space-4)] ${
                  line.kind === 'removed' ? 'bg-[var(--accent-wash)] text-[var(--text)] border-l-2 border-[var(--danger)]' : 'text-[var(--text)]'
                }`}
              >
                <span className="w-[var(--space-24)] shrink-0 text-right tabular-nums select-none">{line.beforeLineNumber ?? ''}</span>
                <span aria-hidden="true" className="w-[var(--space-12)] shrink-0 select-none">{line.kind === 'removed' ? '-' : ' '}</span>
                <span className="whitespace-pre-wrap break-all">{line.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="border-b border-[var(--border)] px-[var(--space-12)] py-[var(--space-8)] font-[family-name:var(--font-sans)] text-[length:var(--text-12)] font-medium text-[var(--text-muted)]">
            After
          </div>
          <div className="flex flex-col py-[var(--space-8)]">
            {afterLines.map((line, index) => (
              <div
                key={`after-${String(index)}`}
                data-diff-type={line.kind}
                className={`flex items-baseline gap-[var(--space-8)] px-[var(--space-12)] py-[var(--space-4)] ${
                  line.kind === 'added' ? 'bg-[var(--accent-wash)] text-[var(--text)] border-l-2 border-[var(--success)]' : 'text-[var(--text)]'
                }`}
              >
                <span className="w-[var(--space-24)] shrink-0 text-right tabular-nums select-none">{line.afterLineNumber ?? ''}</span>
                <span aria-hidden="true" className="w-[var(--space-12)] shrink-0 select-none">{line.kind === 'added' ? '+' : ' '}</span>
                <span className="whitespace-pre-wrap break-all">{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-mode="unified"
      aria-disabled={disabled ? 'true' : undefined}
      className={`flex flex-col rounded-[var(--radius-6)] border border-[var(--border)] bg-[var(--surface)] py-[var(--space-8)] font-[family-name:var(--font-mono)] text-[length:var(--text-12)] text-[var(--text)] overflow-x-auto ${
        disabled ? 'opacity-60' : ''
      }`.trim()}
    >
      {parsedLines.map((line, index) => {
        const prefix = line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : ' ';
        const rowStyle =
          line.kind === 'added'
            ? 'bg-[var(--accent-wash)] text-[var(--text)] border-l-2 border-[var(--success)]'
            : line.kind === 'removed'
              ? 'bg-[var(--accent-wash)] text-[var(--text)] border-l-2 border-[var(--danger)]'
              : 'text-[var(--text)]';

        return (
          <div
            key={`unified-${String(index)}`}
            data-diff-type={line.kind}
            className={`flex items-baseline gap-[var(--space-8)] px-[var(--space-12)] py-[var(--space-4)] ${rowStyle}`}
          >
            <span className="w-[var(--space-24)] shrink-0 text-right tabular-nums select-none">{line.beforeLineNumber ?? ''}</span>
            <span className="w-[var(--space-24)] shrink-0 text-right tabular-nums select-none">{line.afterLineNumber ?? ''}</span>
            <span aria-hidden="true" className="w-[var(--space-12)] shrink-0 select-none">{prefix}</span>
            <span className="whitespace-pre-wrap break-all">{line.text}</span>
          </div>
        );
      })}
    </div>
  );
}
