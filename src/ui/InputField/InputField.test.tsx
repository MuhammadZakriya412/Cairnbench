import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { InputField } from './InputField';

afterEach(() => {
  cleanup();
});

describe('InputField (03 §5, Card 0.3a)', () => {
  it('associates persistent visible label with input and updates value via keyboard', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [val, setVal] = React.useState('');
      return (
        <InputField
          label="Vault item title"
          hint="Use a short descriptive name."
          value={val}
          onChange={(next) => setVal(next)}
        />
      );
    }

    render(<Harness />);

    const input = screen.getByLabelText('Vault item title');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription('Use a short descriptive name.');

    await user.tab();
    expect(input).toHaveFocus();
    await user.keyboard('Production config');
    expect(input).toHaveValue('Production config');
  });

  it('links error message and error code via aria-describedby and supports Try again', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <InputField
        label="Handle"
        hint="Lowercase letters and numbers."
        error="Handle is already taken."
        errorCode="E-HANDLE-TAKEN"
        onRetry={onRetry}
        value="admin"
        onChange={() => undefined}
      />,
    );

    const input = screen.getByLabelText('Handle');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy.length).toBeGreaterThan(0);
    expect(input).toHaveAccessibleDescription(/Handle is already taken\./);
    expect(screen.getByRole('alert')).toHaveTextContent('E-HANDLE-TAKEN');

    const retryBtn = screen.getByRole('button', { name: COPY['action.retry'] });
    await user.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders loading skeleton state and disabled state', () => {
    const { rerender } = render(
      <InputField
        label="Search query"
        value=""
        loading={true}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('status', { name: 'Search query loading' })).toHaveAttribute(
      'aria-busy',
      'true',
    );

    rerender(
      <InputField
        label="Search query"
        value="locked"
        disabled={true}
        onChange={() => undefined}
      />,
    );

    const input = screen.getByLabelText('Search query');
    expect(input).toBeDisabled();
  });

  it('renders empty state with explanation and action when emptyMessage is set', async () => {
    const user = userEvent.setup();
    const onEmptyAction = vi.fn();

    render(
      <InputField
        label="Template variable"
        value=""
        emptyMessage="No default value set yet."
        emptyActionLabel="Fill sample value"
        onEmptyAction={onEmptyAction}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByText('No default value set yet.')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: 'Fill sample value' });
    await user.click(btn);
    expect(onEmptyAction).toHaveBeenCalledTimes(1);
  });
});
