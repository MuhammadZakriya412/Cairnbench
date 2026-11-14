import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { Checkbox } from './Checkbox';

afterEach(() => {
  cleanup();
});

describe('Checkbox (03 §5, Card 0.3a)', () => {
  it('associates visible label with checkbox and toggles via click and Space key', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [checked, setChecked] = React.useState(false);
      return (
        <Checkbox
          label={COPY['encrypt.confirm']}
          hint="Required before enabling client-side encryption."
          checked={checked}
          onChange={(next) => setChecked(next)}
        />
      );
    }

    render(<Harness />);

    const checkbox = screen.getByRole('checkbox', { name: COPY['encrypt.confirm'] });
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAccessibleDescription('Required before enabling client-side encryption.');

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    checkbox.focus();
    await user.keyboard(' ');
    expect(checkbox).not.toBeChecked();
  });

  it('links inline error via aria-describedby and supports retry and disabled states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onChange = vi.fn();

    const { rerender } = render(
      <Checkbox
        label="Confirm passphrase backup"
        checked={false}
        error="You must confirm before saving."
        errorCode="E-ENCRYPT-CONFIRM"
        onRetry={onRetry}
        onChange={onChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Confirm passphrase backup' });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription(/You must confirm before saving\./);
    expect(screen.getByRole('alert')).toHaveTextContent('E-ENCRYPT-CONFIRM');

    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <Checkbox
        label="Confirm passphrase backup"
        checked={true}
        disabled={true}
        onChange={onChange}
      />,
    );

    const disabledCheckbox = screen.getByRole('checkbox', { name: 'Confirm passphrase backup' });
    expect(disabledCheckbox).toBeDisabled();
    await user.click(disabledCheckbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders loading skeleton and empty state', async () => {
    const user = userEvent.setup();
    const onEmptyAction = vi.fn();

    const { rerender } = render(
      <Checkbox
        label="Include gitignore rules"
        checked={false}
        loading={true}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('status', { name: 'Include gitignore rules loading' })).toHaveAttribute(
      'aria-busy',
      'true',
    );

    rerender(
      <Checkbox
        label="Include gitignore rules"
        checked={false}
        emptyMessage="No .gitignore file found in selection."
        emptyActionLabel="Add default ignore list"
        onEmptyAction={onEmptyAction}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByText('No .gitignore file found in selection.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add default ignore list' }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);
  });
});
