import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { TextAreaField } from './TextAreaField';

afterEach(() => {
  cleanup();
});

describe('TextAreaField (03 §5, Card 0.3a)', () => {
  it('associates persistent visible label with textarea, sets rows, and accepts keyboard input', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [val, setVal] = React.useState('');
      return (
        <TextAreaField
          label="Source text"
          hint={COPY['scrub.disclaimer']}
          rows={6}
          value={val}
          onChange={(next) => setVal(next)}
        />
      );
    }

    render(<Harness />);

    const textarea = screen.getByLabelText('Source text');
    expect(textarea).toHaveAttribute('rows', '6');
    expect(textarea).toHaveAccessibleDescription(COPY['scrub.disclaimer']);

    await user.tab();
    expect(textarea).toHaveFocus();
    await user.keyboard('line one{Enter}line two');
    expect(textarea).toHaveValue('line one\nline two');
  });

  it('links inline error with aria-describedby and supports retry action', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <TextAreaField
        label="Raw log input"
        error={COPY['error.quota']}
        errorCode="E-VAULT-ITEM-TOO-LARGE"
        onRetry={onRetry}
        value="oversized"
        onChange={() => undefined}
      />,
    );

    const textarea = screen.getByLabelText('Raw log input');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleDescription(/This item is larger than 512 KB\./);
    expect(screen.getByRole('alert')).toHaveTextContent('E-VAULT-ITEM-TOO-LARGE');

    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders loading skeleton, disabled state, and empty state', async () => {
    const user = userEvent.setup();
    const onEmptyAction = vi.fn();

    const { rerender } = render(
      <TextAreaField
        label="Prompt body"
        value=""
        loading={true}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('status', { name: 'Prompt body loading' })).toHaveAttribute(
      'aria-busy',
      'true',
    );

    rerender(
      <TextAreaField
        label="Prompt body"
        value=""
        disabled={true}
        emptyMessage="Nothing pasted yet."
        emptyActionLabel="Load sample prompt"
        onEmptyAction={onEmptyAction}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByLabelText('Prompt body')).toBeDisabled();
    expect(screen.getByText('Nothing pasted yet.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Load sample prompt' }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);
  });
});
