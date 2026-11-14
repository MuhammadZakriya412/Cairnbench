import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { Badge } from './Badge';

afterEach(() => {
  cleanup();
});

describe('Badge (03 §3, §5, Card 0.3b)', () => {
  it('renders idle and interactive states with icon + text signal', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Badge variant="success" onClick={onClick}>
        Verified
      </Badge>,
    );

    const button = screen.getByRole('button', { name: 'Verified' });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();
    const onClick = vi.fn();

    const { rerender } = render(<Badge loading={true}>Loading badge</Badge>);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <Badge
        emptyMessage="No tag assigned."
        emptyActionLabel="Add tag"
        onEmptyAction={onEmptyAction}
      />,
    );
    expect(screen.getByText('No tag assigned.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add tag' }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <Badge
        errorMessage="Tag invalid"
        errorCode="E-TAG-INVALID"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Tag invalid');
    expect(screen.getByRole('alert')).toHaveTextContent('E-TAG-INVALID');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <Badge disabled={true} onClick={onClick}>
        Locked tag
      </Badge>,
    );
    const disabledBtn = screen.getByRole('button', { name: 'Locked tag' });
    expect(disabledBtn).toBeDisabled();
    await user.click(disabledBtn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
