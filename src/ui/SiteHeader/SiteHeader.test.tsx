import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { SiteHeader } from './SiteHeader';

afterEach(() => {
  cleanup();
});

describe('SiteHeader (03 §5–6, Card 0.3c)', () => {
  it('renders logo, four navigation destinations, and four utilities', async () => {
    const user = userEvent.setup();
    const onOpenCommandPalette = vi.fn();

    render(<SiteHeader currentPath="/apps" onOpenCommandPalette={onOpenCommandPalette} />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: COPY['nav.home'] })).toHaveAttribute('href', '/');
    const appsLink = screen.getByRole('link', { name: COPY['nav.apps'] });
    expect(appsLink).toHaveAttribute('href', '/apps');
    expect(appsLink).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: COPY['nav.mcp'] })).toHaveAttribute('href', '/mcp');
    expect(screen.getByRole('link', { name: COPY['nav.vault'] })).toHaveAttribute('href', '/vault');

    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch theme' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings');

    const cmdBtn = screen.getByRole('button', { name: /command palette/i });
    await user.click(cmdBtn);
    expect(onOpenCommandPalette).toHaveBeenCalledTimes(1);
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(<SiteHeader loading={true} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <SiteHeader
        emptyMessage="Navigation unavailable."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );
    expect(screen.getByText('Navigation unavailable.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <SiteHeader
        errorMessage="Header state failed to load."
        errorCode="E-SHELL-HEADER"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Header state failed to load.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-SHELL-HEADER');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(<SiteHeader disabled={true} />);
    expect(screen.getByRole('button', { name: 'Switch theme' })).toBeDisabled();
    expect(screen.getByRole('button', { name: /command palette/i })).toBeDisabled();
  });
});
