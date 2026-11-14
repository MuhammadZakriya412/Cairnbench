import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { Button } from './Button';

afterEach(() => {
  cleanup();
});

describe('Button (03 §5, Card 0.3a)', () => {
  it('renders idle state and activates via mouse click and keyboard Enter/Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button variant="primary" size="md" onClick={onClick}>
        {COPY['action.save']}
      </Button>,
    );

    const btn = screen.getByRole('button', { name: COPY['action.save'] });
    expect(btn).toBeEnabled();

    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);

    btn.focus();
    expect(btn).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);

    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('disables the button and shows progress while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button variant="secondary" loading={true} onClick={onClick}>
        {COPY['action.save']}
      </Button>,
    );

    const btn = screen.getByRole('button', { name: new RegExp(COPY['action.save'], 'i') });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toBeInTheDocument();

    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('respects the disabled prop and blocks activation', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button variant="danger" disabled={true} onClick={onClick}>
        {COPY['action.delete']}
      </Button>,
    );

    const btn = screen.getByRole('button', { name: COPY['action.delete'] });
    expect(btn).toBeDisabled();

    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders empty state with explanation and action button', async () => {
    const user = userEvent.setup();
    const onEmptyAction = vi.fn();

    render(
      <Button
        emptyMessage="No action configured for this slot."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );

    expect(screen.getByText('No action configured for this slot.')).toBeInTheDocument();
    const actionBtn = screen.getByRole('button', { name: COPY['action.open'] });
    await user.click(actionBtn);
    expect(onEmptyAction).toHaveBeenCalledTimes(1);
  });

  it('renders error state with explanation, code, and Try again action', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <Button
        errorMessage="Action failed to complete."
        errorCode="E-VAULT-LOAD"
        onRetry={onRetry}
      >
        {COPY['action.save']}
      </Button>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Action failed to complete.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-VAULT-LOAD');

    const retryBtn = screen.getByRole('button', { name: COPY['action.retry'] });
    await user.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
