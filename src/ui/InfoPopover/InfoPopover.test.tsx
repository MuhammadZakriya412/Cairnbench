import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { InfoPopover } from './InfoPopover';

afterEach(() => {
  cleanup();
});

describe('InfoPopover (03 §5, Card 0.3b)', () => {
  it('opens by click, closes by Escape, and returns focus to the trigger', async () => {
    const user = userEvent.setup();

    render(
      <InfoPopover
        topicId="context-packer-redaction"
        summary="Redaction masks common secret formats locally before packing."
      />,
    );

    const trigger = screen.getByRole('button', { name: /help|info/i });
    await user.click(trigger);

    expect(
      screen.getByText('Redaction masks common secret formats locally before packing.'),
    ).toBeInTheDocument();

    const guideLink = screen.getByRole('link', { name: 'Open full guide' });
    expect(guideLink).toHaveAttribute('href', '/docs/context-packer-redaction');
    expect(guideLink).toHaveAttribute('target', '_blank');
    expect(guideLink).toHaveAttribute('rel', 'noopener');

    await user.keyboard('{Escape}');
    expect(
      screen.queryByText('Redaction masks common secret formats locally before packing.'),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('opens by Enter and Space and closes on outside click', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button type="button">Outside element</button>
        <InfoPopover
          topicId="mcp-tokens"
          summary="Tokens are scoped to individual tools and can be revoked at any time."
        />
      </div>,
    );

    const trigger = screen.getByRole('button', { name: /help|info/i });
    trigger.focus();
    expect(trigger).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(
      screen.getByText('Tokens are scoped to individual tools and can be revoked at any time.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside element' }));
    expect(
      screen.queryByText('Tokens are scoped to individual tools and can be revoked at any time.'),
    ).not.toBeInTheDocument();

    trigger.focus();
    await user.keyboard(' ');
    expect(
      screen.getByText('Tokens are scoped to individual tools and can be revoked at any time.'),
    ).toBeInTheDocument();
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(
      <InfoPopover
        topicId="vault-quota"
        summary="Items are limited to 512 KB."
        loading={true}
      />,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <InfoPopover
        topicId="vault-quota"
        summary=""
        emptyMessage="No help summary available for this topic."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );

    expect(screen.getByText('No help summary available for this topic.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <InfoPopover
        topicId="vault-quota"
        summary="Items are limited to 512 KB."
        errorMessage="Could not load topic summary."
        errorCode="E-DOCS-LOAD"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load topic summary.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-DOCS-LOAD');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <InfoPopover
        topicId="vault-quota"
        summary="Items are limited to 512 KB."
        disabled={true}
      />,
    );

    expect(screen.getByRole('button', { name: /help|info/i })).toBeDisabled();
  });
});
