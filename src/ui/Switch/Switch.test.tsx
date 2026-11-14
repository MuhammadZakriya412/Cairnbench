import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { Switch } from './Switch';

afterEach(() => {
  cleanup();
});

describe('Switch (03 §5, Card 0.3a)', () => {
  it('associates visible label with role="switch" and toggles via click, Space, and Enter', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [checked, setChecked] = React.useState(false);
      return (
        <Switch
          label="Redact AWS access keys"
          hint="Masks AKIA key patterns before copying."
          checked={checked}
          onChange={setChecked}
        />
      );
    }

    render(<Harness />);

    const toggle = screen.getByRole('switch', { name: 'Redact AWS access keys' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).toHaveAccessibleDescription('Masks AKIA key patterns before copying.');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    toggle.focus();
    await user.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    await user.keyboard('{Enter}');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('links inline error via aria-describedby and supports retry and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onChange = vi.fn();

    const { rerender } = render(
      <Switch
        label="Sync rule to organization"
        checked={false}
        error="Could not save rule toggle."
        errorCode="E-RULE-SYNC"
        onRetry={onRetry}
        onChange={onChange}
      />,
    );

    const toggle = screen.getByRole('switch', { name: 'Sync rule to organization' });
    expect(toggle).toHaveAccessibleDescription(/Could not save rule toggle\./);
    expect(screen.getByRole('alert')).toHaveTextContent('E-RULE-SYNC');

    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <Switch
        label="Sync rule to organization"
        checked={true}
        disabled={true}
        onChange={onChange}
      />,
    );

    const disabledToggle = screen.getByRole('switch', { name: 'Sync rule to organization' });
    expect(disabledToggle).toBeDisabled();
    await user.click(disabledToggle);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders loading skeleton and empty state', async () => {
    const user = userEvent.setup();
    const onEmptyAction = vi.fn();

    const { rerender } = render(
      <Switch
        label="Compact HTML mode"
        checked={false}
        loading={true}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('status', { name: 'Compact HTML mode loading' })).toHaveAttribute(
      'aria-busy',
      'true',
    );

    rerender(
      <Switch
        label="Compact HTML mode"
        checked={false}
        emptyMessage="No HTML content detected."
        emptyActionLabel="Paste sample HTML"
        onEmptyAction={onEmptyAction}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByText('No HTML content detected.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Paste sample HTML' }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);
  });
});
