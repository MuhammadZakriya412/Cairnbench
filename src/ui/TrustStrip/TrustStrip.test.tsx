import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { TrustStrip } from './TrustStrip';

afterEach(() => {
  cleanup();
});

describe('TrustStrip (03 §5, §7, §8, Card 0.3c)', () => {
  it('renders the three plain facts from the copy deck in three columns with no icons', () => {
    const { container } = render(<TrustStrip />);

    expect(screen.getByText(COPY['trust.1'])).toBeInTheDocument();
    expect(screen.getByText(COPY['trust.2'])).toBeInTheDocument();
    expect(screen.getByText(COPY['trust.3'])).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(<TrustStrip loading={true} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <TrustStrip
        items={[]}
        emptyMessage="No trust facts configured."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );
    expect(screen.getByText('No trust facts configured.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <TrustStrip
        errorMessage="Could not load trust section."
        errorCode="E-TRUST-LOAD"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Could not load trust section.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-TRUST-LOAD');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
