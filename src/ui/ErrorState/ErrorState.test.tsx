import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { ErrorState } from './ErrorState';

afterEach(() => {
  cleanup();
});

describe('ErrorState (03 §5, §8, Card 0.3b)', () => {
  it('renders plain explanation, diagnostic error code, and Try again action', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ErrorState
        message={COPY['error.network']}
        code="E-VAULT-LOAD"
        onRetry={onRetry}
      />,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(COPY['error.network']);
    expect(alert).toHaveTextContent('E-VAULT-LOAD');

    const retryBtn = screen.getByRole('button', { name: COPY['action.retry'] });
    await user.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders loading, empty, and disabled states', async () => {
    const user = userEvent.setup();
    const onEmptyAction = vi.fn();
    const onRetry = vi.fn();

    const { rerender } = render(
      <ErrorState
        message={COPY['error.network']}
        code="E-VAULT-LOAD"
        loading={true}
      />,
    );
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <ErrorState
        message=""
        code="E-NONE"
        emptyMessage="No errors recorded."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );
    expect(screen.getByText('No errors recorded.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <ErrorState
        message={COPY['error.network']}
        code="E-VAULT-LOAD"
        disabled={true}
        onRetry={onRetry}
      />,
    );
    const disabledRetry = screen.getByRole('button', { name: COPY['action.retry'] });
    expect(disabledRetry).toBeDisabled();
    await user.click(disabledRetry);
    expect(onRetry).not.toHaveBeenCalled();
  });
});
