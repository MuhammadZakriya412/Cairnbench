import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { DiffView } from './DiffView';

afterEach(() => {
  cleanup();
});

const THREE_LINE_BEFORE = ['host = "localhost"', 'key = "raw_secret_value"', 'port = 5432'].join(
  '\n',
);
const THREE_LINE_AFTER = [
  'host = "localhost"',
  'key = "[REDACTED:generic-secret]"',
  'port = 5432',
].join('\n');

describe('DiffView (03 §5, Card 0.3c)', () => {
  it('renders a 3-line before/after diff in unified mode using diff', () => {
    const { container } = render(
      <DiffView before={THREE_LINE_BEFORE} after={THREE_LINE_AFTER} mode="unified" />,
    );

    expect(container.querySelector('[data-mode="unified"]')).toBeInTheDocument();
    expect(screen.getByText('host = "localhost"')).toBeInTheDocument();
    expect(screen.getByText('key = "raw_secret_value"')).toBeInTheDocument();
    expect(screen.getByText('key = "[REDACTED:generic-secret]"')).toBeInTheDocument();
    expect(screen.getByText('port = 5432')).toBeInTheDocument();

    const removedLine = container.querySelector('[data-diff-type="removed"]');
    const addedLine = container.querySelector('[data-diff-type="added"]');
    expect(removedLine).toHaveTextContent('key = "raw_secret_value"');
    expect(addedLine).toHaveTextContent('key = "[REDACTED:generic-secret]"');
  });

  it('renders a 3-line before/after diff in split (side-by-side) mode using diff', () => {
    const { container } = render(
      <DiffView before={THREE_LINE_BEFORE} after={THREE_LINE_AFTER} mode="split" />,
    );

    expect(container.querySelector('[data-mode="split"]')).toBeInTheDocument();
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
    expect(screen.getAllByText('host = "localhost"')).toHaveLength(2);
    expect(screen.getByText('key = "raw_secret_value"')).toBeInTheDocument();
    expect(screen.getByText('key = "[REDACTED:generic-secret]"')).toBeInTheDocument();
    expect(screen.getAllByText('port = 5432')).toHaveLength(2);
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(
      <DiffView before={THREE_LINE_BEFORE} after={THREE_LINE_AFTER} mode="unified" loading={true} />,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <DiffView
        before=""
        after=""
        mode="unified"
        emptyMessage="No changes to compare."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );

    expect(screen.getByText('No changes to compare.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <DiffView
        before={THREE_LINE_BEFORE}
        after={THREE_LINE_AFTER}
        mode="unified"
        errorMessage="Could not compute version diff."
        errorCode="E-DIFF-COMPUTE"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Could not compute version diff.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-DIFF-COMPUTE');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
