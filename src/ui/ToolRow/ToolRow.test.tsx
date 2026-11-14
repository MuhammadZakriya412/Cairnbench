import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { ToolRow } from './ToolRow';

afterEach(() => {
  cleanup();
});

describe('ToolRow (03 §5, Card 0.3c)', () => {
  it('renders numbered index, name, tagline, savedCount, and whole-row link with Open label at the end', () => {
    render(
      <ToolRow
        index={1}
        appId="context-packer"
        name="Context Packer"
        tagline="Turn files or pasted text into one AI-ready block and redact secrets."
        savedCount={4}
      />,
    );

    const link = screen.getByRole('link', { name: /Context Packer/i });
    expect(link).toHaveAttribute('href', '/app/context-packer/workspace');
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('Context Packer')).toBeInTheDocument();
    expect(
      screen.getByText('Turn files or pasted text into one AI-ready block and redact secrets.'),
    ).toBeInTheDocument();
    expect(screen.getByText('4 saved')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('renders loading, empty, error, and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();
    const onClick = vi.fn();

    const { rerender } = render(
      <ToolRow
        index={2}
        appId="api-runner"
        name="API Runner"
        tagline="Chain HTTP requests and inspect timing."
        savedCount={0}
        loading={true}
      />,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <ToolRow
        index={2}
        appId="api-runner"
        name="API Runner"
        tagline="Chain HTTP requests and inspect timing."
        savedCount={0}
        emptyMessage="No tool registered for this row."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
      />,
    );

    expect(screen.getByText('No tool registered for this row.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <ToolRow
        index={2}
        appId="api-runner"
        name="API Runner"
        tagline="Chain HTTP requests and inspect timing."
        savedCount={0}
        errorMessage="Could not load saved count."
        errorCode="E-VAULT-LOAD"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load saved count.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-VAULT-LOAD');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <ToolRow
        index={2}
        appId="api-runner"
        name="API Runner"
        tagline="Chain HTTP requests and inspect timing."
        savedCount={0}
        disabled={true}
        onClick={onClick}
      />,
    );

    const disabledRow = screen.getByRole('link', { name: /API Runner/i });
    expect(disabledRow).toHaveAttribute('aria-disabled', 'true');
    await user.click(disabledRow);
    expect(onClick).not.toHaveBeenCalled();
  });
});
