import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { ModalDrawer } from './ModalDrawer';

afterEach(() => {
  cleanup();
});

describe('ModalDrawer (03 §5, Card 0.3b)', () => {
  it('opens from trigger, traps focus inside dialog, closes on Escape, and returns focus to trigger', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <ModalDrawer
          open={open}
          onOpenChange={setOpen}
          title="Share vault item"
          description="Create a scoped link with an expiration time."
          trigger={<button type="button">{COPY['action.share']}</button>}
        >
          <button type="button">Copy share link</button>
        </ModalDrawer>
      );
    }

    render(<Harness />);

    const trigger = screen.getByRole('button', { name: COPY['action.share'] });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Share vault item' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Create a scoped link with an expiration time.')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('renders loading, empty, and error states inside the modal container', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(
      <ModalDrawer
        open={true}
        onOpenChange={() => undefined}
        title="Version history"
        loading={true}
      />,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <ModalDrawer
        open={true}
        onOpenChange={() => undefined}
        title="Version history"
        emptyMessage="No previous versions saved yet."
        emptyActionLabel={COPY['action.save']}
        onEmptyAction={onEmptyAction}
      />,
    );

    expect(screen.getByText('No previous versions saved yet.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.save'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <ModalDrawer
        open={true}
        onOpenChange={() => undefined}
        title="Version history"
        errorMessage="Could not load version history."
        errorCode="E-VAULT-VERSIONS"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load version history.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-VAULT-VERSIONS');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
