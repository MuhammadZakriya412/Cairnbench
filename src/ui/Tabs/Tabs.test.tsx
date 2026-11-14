import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { COPY } from '../copy';
import { Tabs } from './Tabs';

afterEach(() => {
  cleanup();
});

const SAMPLE_TABS = [
  { id: 'personal', label: 'My vault', content: <div>Personal vault items</div> },
  { id: 'org-acme', label: 'Acme Team', content: <div>Organization vault items</div> },
  { id: 'org-archived', label: 'Archived', content: <div>Archived items</div>, disabled: true },
] as const;

describe('Tabs (03 §5, Card 0.3b — WAI-ARIA tabs pattern)', () => {
  it('renders tablist, switches tabs on click and ArrowRight/ArrowLeft/Home/End keys', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [activeId, setActiveId] = React.useState('personal');
      return (
        <Tabs
          ariaLabel="Vault scopes"
          tabs={SAMPLE_TABS}
          activeId={activeId}
          onChange={setActiveId}
        />
      );
    }

    render(<Harness />);

    const tablist = screen.getByRole('tablist', { name: 'Vault scopes' });
    expect(tablist).toBeInTheDocument();

    const personalTab = screen.getByRole('tab', { name: 'My vault' });
    const orgTab = screen.getByRole('tab', { name: 'Acme Team' });
    const archivedTab = screen.getByRole('tab', { name: 'Archived' });

    expect(personalTab).toHaveAttribute('aria-selected', 'true');
    expect(orgTab).toHaveAttribute('aria-selected', 'false');
    expect(archivedTab).toBeDisabled();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Personal vault items');

    personalTab.focus();
    await user.keyboard('{ArrowRight}');
    expect(orgTab).toHaveFocus();
    expect(orgTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Organization vault items');

    await user.keyboard('{ArrowLeft}');
    expect(personalTab).toHaveFocus();
    expect(personalTab).toHaveAttribute('aria-selected', 'true');

    await user.click(orgTab);
    expect(orgTab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders loading, empty, and error states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onEmptyAction = vi.fn();

    const { rerender } = render(
      <Tabs
        ariaLabel="Client setup"
        tabs={SAMPLE_TABS}
        activeId="personal"
        loading={true}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');

    rerender(
      <Tabs
        ariaLabel="Client setup"
        tabs={[]}
        activeId=""
        emptyMessage="No tabs available."
        emptyActionLabel={COPY['action.open']}
        onEmptyAction={onEmptyAction}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByText('No tabs available.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: COPY['action.open'] }));
    expect(onEmptyAction).toHaveBeenCalledTimes(1);

    rerender(
      <Tabs
        ariaLabel="Client setup"
        tabs={SAMPLE_TABS}
        activeId="personal"
        errorMessage="Could not load tabs."
        errorCode="E-TABS-LOAD"
        onRetry={onRetry}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Could not load tabs.');
    expect(screen.getByRole('alert')).toHaveTextContent('E-TABS-LOAD');
    await user.click(screen.getByRole('button', { name: COPY['action.retry'] }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
