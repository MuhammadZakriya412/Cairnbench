import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { SelectField } from './SelectField';

afterEach(() => {
  cleanup();
});

const SAMPLE_OPTIONS = [
  { value: 'markdown', label: 'Markdown block' },
  { value: 'xml', label: 'XML tags' },
  { value: 'plain', label: 'Plain text' },
] as const;

describe('SelectField (03 §5, Card 0.3a)', () => {
  it('associates visible label with native select and changes selection via user interaction', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [val, setVal] = React.useState('markdown');
      return (
        <SelectField
          label="Output format"
          hint="Choose how files are wrapped."
          options={SAMPLE_OPTIONS}
          value={val}
          onChange={(next) => setVal(next)}
        />
      );
    }

    render(<Harness />);

    const select = screen.getByLabelText('Output format');
    expect(select).toHaveValue('markdown');
    expect(select).toHaveAccessibleDescription('Choose how files are wrapped.');

    await user.tab();
    expect(select).toHaveFocus();
    await user.selectOptions(select, 'xml');
    expect(select).toHaveValue('xml');
  });

  it('links inline error via aria-describedby and triggers retry callback', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <SelectField
        label="Organization"
        options={SAMPLE_OPTIONS}
        value="markdown"
        error="Could not load organizations."
        errorCode="E-ORG-LIST"
        onRetry={onRetry}
        onChange={() => undefined}
      />,
    );

    const select = screen.getByLabelText('Organization');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAccessibleDescription(/Could not load organizations\./);
    expect(screen.getByRole('alert')).toHaveTextContent('E-ORG-LIST');

    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders loading skeleton, disabled state, and empty options state', async () => {
    const user = userEvent.setup();
    const onEmptyAction = vi.fn();

    const { rerender } = render(
      <SelectField
        label="Saved preset"
        options={SAMPLE_OPTIONS}
        value="markdown"
        loading={true}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('status', { name: 'Saved preset loading' })).toHaveAttribute(
      'aria-busy',
      'true',
    );

    rerender(
      <SelectField
        label="Saved preset"
        options={[]}
        value=""
        emptyMessage="No presets available yet."
        emptyActionLabel="Create preset"
        onEmptyAction={onEmptyAction}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByLabelText('Saved preset')).toBeDisabled();
    expect(screen.getByText('No presets available yet.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Create preset' }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);
  });
});
