import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { SiteFooter } from './SiteFooter';

afterEach(() => {
  cleanup();
});

describe('SiteFooter (03 §5, Card 0.3c)', () => {
  it('renders Docs, Privacy, and GitHub links without newsletter or social icons', () => {
    render(<SiteFooter />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs/getting-started');
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/cairnbench/cairnbench');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(<SiteFooter loading={true} />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <SiteFooter
        emptyMessage="Footer links unavailable."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );
    expect(screen.getByText('Footer links unavailable.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <SiteFooter
        errorMessage="Could not render footer links."
        errorCode="E-SHELL-FOOTER"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Could not render footer links.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-SHELL-FOOTER');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(<SiteFooter disabled={true} />);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('aria-disabled', 'true');
  });
});
