import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { Toast, ToastRegion } from './Toast';

afterEach(() => {
  cleanup();
});

describe('Toast + ToastRegion (03 §5, §8, §9, Card 0.3b)', () => {
  it('announces message inside a polite live region and supports action and dismiss', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const onAction = vi.fn();

    render(
      <ToastRegion>
        <Toast
          variant="success"
          message={COPY['action.saved']}
          actionLabel={COPY['action.open']}
          onAction={onAction}
          onDismiss={onDismiss}
        />
      </ToastRegion>,
    );

    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText(COPY['action.saved'])).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onAction).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(<Toast message="" loading={true} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <Toast
        message=""
        emptyMessage="No active notifications."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );
    expect(screen.getByText('No active notifications.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <Toast
        message=""
        errorMessage={COPY['error.network']}
        errorCode="E-NET-TIMEOUT"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(COPY['error.network']);
    expect(screen.getByRole('alert')).toHaveTextContent('E-NET-TIMEOUT');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
