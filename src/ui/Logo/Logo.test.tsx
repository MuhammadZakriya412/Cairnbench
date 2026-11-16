import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Logo } from './Logo';

afterEach(() => {
  cleanup();
});

describe('Logo (03 §1, Card 0.4)', () => {
  it('renders the three-stone cairn SVG and wordmark in idle state', () => {
    const { container } = render(<Logo showWordmark />);
    expect(screen.getByText('Cairnbench')).toBeInTheDocument();
    const rects = container.querySelectorAll('svg rect');
    expect(rects.length).toBe(3);
  });

  it('supports loading, empty, error, and interactive states', () => {
    const onRetry = vi.fn();
    const { rerender } = render(<Logo loading />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(<Logo emptyMessage="Logo unavailable" />);
    expect(screen.getByText('Logo unavailable')).toBeInTheDocument();

    rerender(<Logo errorMessage="Logo render error" errorCode="E-LOGO" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Logo render error');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
