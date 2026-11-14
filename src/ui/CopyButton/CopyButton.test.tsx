import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { CopyButton } from './CopyButton';

afterEach(() => {
  cleanup();
});

describe('CopyButton (03 §5, §8, §9, Card 0.3b)', () => {
  it('copies text on click/keyboard and announces Copied in polite live region', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();

    render(<CopyButton value="cb_YOUR_TOKEN" onCopy={onCopy} />);

    const btn = screen.getByRole('button', { name: COPY['action.copy'] });
    await user.click(btn);

    expect(onCopy).toHaveBeenCalledWith('cb_YOUR_TOKEN');
    expect(screen.getByRole('button', { name: COPY['action.copied'] })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(COPY['action.copied']);
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(<CopyButton value="sample" loading={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <CopyButton
        value=""
        emptyMessage="Nothing to copy yet."
        emptyActionLabel="Generate output"
        onEmptyAction={onEmptyAction}
      />,
    );
    expect(screen.getByText('Nothing to copy yet.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Generate output' }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <CopyButton
        value="sample"
        errorMessage="Clipboard access denied."
        errorCode="E-CLIPBOARD"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Clipboard access denied.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-CLIPBOARD');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
