import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { Kbd } from './Kbd';

afterEach(() => {
  cleanup();
});

describe('Kbd (03 §4, §5, Card 0.3b)', () => {
  it('renders keyboard shortcut keys and supports interactive activation when onClick is provided', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Kbd keys={['Ctrl', 'K']} onClick={onClick} ariaLabel="Open command palette" />);

    const btn = screen.getByRole('button', { name: 'Open command palette' });
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(<Kbd keys={['Esc']} loading={true} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <Kbd
        keys={[]}
        emptyMessage="No shortcut bound."
        emptyActionLabel="Bind key"
        onEmptyAction={onEmptyAction}
      />,
    );
    expect(screen.getByText('No shortcut bound.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Bind key' }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <Kbd
        keys={['Ctrl', 'K']}
        errorMessage="Shortcut conflict detected."
        errorCode="E-KEY-CONFLICT"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Shortcut conflict detected.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-KEY-CONFLICT');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
