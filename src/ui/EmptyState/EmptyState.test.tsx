import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { EmptyState } from './EmptyState';

afterEach(() => {
  cleanup();
});

describe('EmptyState (03 §5, §8, Card 0.3b)', () => {
  it('renders reason why empty and one clear action button', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <EmptyState
        title="No saved items"
        description={COPY['empty.vault']}
        actionLabel={COPY['action.open']}
        onAction={onAction}
      />,
    );

    expect(screen.getByText('No saved items')).toBeInTheDocument();
    expect(screen.getByText(COPY['empty.vault'])).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: COPY['action.open'] });
    await user.click(btn);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('renders loading, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onAction = vi.fn();

    const { rerender } = render(
      <EmptyState
        title="No saved items"
        description={COPY['empty.vault']}
        loading={true}
      />,
    );
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <EmptyState
        title="No saved items"
        description={COPY['empty.vault']}
        errorMessage={COPY['error.network']}
        errorCode="E-VAULT-LOAD"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(COPY['error.network']);
    expect(screen.getByRole('alert')).toHaveTextContent('E-VAULT-LOAD');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <EmptyState
        title="No saved items"
        description={COPY['empty.vault']}
        actionLabel={COPY['action.open']}
        onAction={onAction}
        disabled={true}
      />,
    );
    const disabledBtn = screen.getByRole('button', { name: COPY['action.open'] });
    expect(disabledBtn).toBeDisabled();
    await user.click(disabledBtn);
    expect(onAction).not.toHaveBeenCalled();
  });
});
