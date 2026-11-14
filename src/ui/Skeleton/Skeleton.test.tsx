import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { Skeleton } from './Skeleton';

afterEach(() => {
  cleanup();
});

describe('Skeleton (03 §4, §5, Card 0.3b)', () => {
  it('renders structural placeholder lines with accessible status label', () => {
    render(<Skeleton label="Loading vault rows" lines={3} variant="row" />);

    const status = screen.getByRole('status', { name: 'Loading vault rows' });
    expect(status).toHaveAttribute('aria-busy', 'true');
  });

  it('renders idle, empty, error, and interactive states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();
    const onClick = vi.fn();

    const { rerender } = render(
      <Skeleton
        loading={false}
        label="Ready placeholder"
        onClick={onClick}
      />,
    );

    const btn = screen.getByRole('button', { name: 'Ready placeholder' });
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Skeleton
        loading={false}
        emptyMessage="Nothing to preview."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );
    expect(screen.getByText('Nothing to preview.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <Skeleton
        loading={false}
        errorMessage="Preview failed to load."
        errorCode="E-PREVIEW-LOAD"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Preview failed to load.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-PREVIEW-LOAD');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
