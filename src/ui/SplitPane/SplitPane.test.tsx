import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { SplitPane } from './SplitPane';

class MockResizeObserver {
  private readonly callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element): void {
    const entry = {
      target,
      contentRect: {
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        bottom: 600,
        right: 800,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      },
      borderBoxSize: [{ inlineSize: 800, blockSize: 600 }],
      contentBoxSize: [{ inlineSize: 800, blockSize: 600 }],
      devicePixelContentBoxSize: [{ inlineSize: 800, blockSize: 600 }],
    } satisfies ResizeObserverEntry;
    this.callback([entry], this);
  }
  unobserve(): void {}
  disconnect(): void {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(400);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(300);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => new DOMRect(0, 0, 400, 300),
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('SplitPane (03 §5, Card 0.3c)', () => {
  it('renders left and right panes and resizes via keyboard on the separator', () => {
    const onLayoutChanged = vi.fn();

    render(
      <SplitPane
        left={<div>Input pane content</div>}
        right={<div>Result pane content</div>}
        leftTitle="Input"
        rightTitle="Result"
        onLayoutChanged={onLayoutChanged}
      />,
    );

    expect(screen.getByText('Input pane content')).toBeInTheDocument();
    expect(screen.getByText('Result pane content')).toBeInTheDocument();

    const separator = screen.getByRole('separator', { name: 'Resize panes' });
    expect(separator).toHaveAttribute('aria-valuenow', '50');

    separator.focus();
    expect(separator).toHaveFocus();

    fireEvent.keyDown(separator, { key: 'ArrowRight' });
    expect(separator).toHaveAttribute('aria-valuenow', '55');
    expect(onLayoutChanged).toHaveBeenCalled();

    fireEvent.keyDown(separator, { key: 'ArrowLeft' });
    expect(separator).toHaveAttribute('aria-valuenow', '50');
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        loading={true}
      />,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <SplitPane
        left={null}
        right={null}
        emptyMessage="No workspace panes loaded."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );

    expect(screen.getByText('No workspace panes loaded.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        errorMessage="Workspace layout failed to initialize."
        errorCode="E-WORKSPACE-LAYOUT"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Workspace layout failed to initialize.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-WORKSPACE-LAYOUT');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
        disabled={true}
      />,
    );

    const separator = screen.getByRole('separator', { name: 'Resize panes' });
    expect(separator).toHaveAttribute('aria-disabled', 'true');
  });
});
