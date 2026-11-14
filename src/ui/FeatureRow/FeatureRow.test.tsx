import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { FeatureRow } from './FeatureRow';

afterEach(() => {
  cleanup();
});

describe('FeatureRow (03 §5, Card 0.3c)', () => {
  it('renders name, description, 2 mono snippet lines, reverse attribute, and Open tool / Watch tutorial links', () => {
    const { container, rerender } = render(
      <FeatureRow
        appId="context-packer"
        name="Context Packer"
        description="Pack files into one clean block and redact common secret patterns before sharing."
        snippet={['AWS_KEY=[REDACTED:aws-access-key]', 'tokens: 1,420 (budget: 8,000)']}
        reverse={false}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Context Packer' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Pack files into one clean block and redact common secret patterns before sharing.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('AWS_KEY=[REDACTED:aws-access-key]')).toBeInTheDocument();
    expect(screen.getByText('tokens: 1,420 (budget: 8,000)')).toBeInTheDocument();

    const openLink = screen.getByRole('link', { name: COPY['action.opentool'] });
    expect(openLink).toHaveAttribute('href', '/app/context-packer/workspace');

    const watchLink = screen.getByRole('link', { name: COPY['action.watchtutorial'] });
    expect(watchLink).toHaveAttribute('href', '/app/context-packer/overview');

    expect(container.querySelector('[data-reverse="false"]')).toBeInTheDocument();

    rerender(
      <FeatureRow
        appId="context-packer"
        name="Context Packer"
        description="Pack files into one clean block and redact common secret patterns before sharing."
        snippet={['AWS_KEY=[REDACTED:aws-access-key]', 'tokens: 1,420 (budget: 8,000)']}
        reverse={true}
      />,
    );

    expect(container.querySelector('[data-reverse="true"]')).toBeInTheDocument();
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(
      <FeatureRow
        appId="log-regex-explorer"
        name="Log, Regex & Cron Explorer"
        description="Filter big logs, test regexes, and explain cron schedules."
        snippet={['2026-11-14T10:00:00Z ERROR timeout', 'cron: */5 * * * * -> Every 5 minutes']}
        loading={true}
      />,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <FeatureRow
        appId="log-regex-explorer"
        name="Log, Regex & Cron Explorer"
        description=""
        snippet={[]}
        emptyMessage="No tool details available."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );

    expect(screen.getByText('No tool details available.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <FeatureRow
        appId="log-regex-explorer"
        name="Log, Regex & Cron Explorer"
        description="Filter big logs."
        snippet={['line 1', 'line 2']}
        errorMessage="Could not load feature preview."
        errorCode="E-PREVIEW-LOAD"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load feature preview.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-PREVIEW-LOAD');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <FeatureRow
        appId="log-regex-explorer"
        name="Log, Regex & Cron Explorer"
        description="Filter big logs."
        snippet={['line 1', 'line 2']}
        disabled={true}
      />,
    );

    expect(screen.getByRole('link', { name: COPY['action.opentool'] })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('link', { name: COPY['action.watchtutorial'] })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });
});
