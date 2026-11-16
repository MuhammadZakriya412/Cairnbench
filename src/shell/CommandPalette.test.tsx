import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { APPEARANCE_STORAGE_KEY } from '../design/theme';
import { AppRoutes } from './routes';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.body.removeAttribute('data-theme');
});

describe('CommandPalette ARIA combobox and theme persistence (Card 0.4b)', () => {
  it('implements ARIA combobox pattern: ArrowDown/ArrowUp update aria-activedescendant, options have no focusable children, and Esc closes', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const dialog = await screen.findByRole('dialog', { name: /Command palette/i });
    expect(dialog).toBeInTheDocument();

    const combobox = within(dialog).getByRole('combobox', {
      name: 'Search commands and tools',
    });
    const listbox = within(dialog).getByRole('listbox', { name: 'Available commands' });

    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    expect(combobox).toHaveAttribute('aria-controls', listbox.getAttribute('id'));

    const options = within(listbox).getAllByRole('option');
    expect(options.length).toBeGreaterThan(2);

    for (const option of options) {
      expect(option.getAttribute('id')).toBeTruthy();
      expect(option.querySelectorAll('button, a, input, select, textarea, [tabindex]').length).toBe(
        0,
      );
    }

    const firstId = options[0]?.getAttribute('id');
    const secondId = options[1]?.getAttribute('id');
    const lastId = options[options.length - 1]?.getAttribute('id');

    expect(combobox).toHaveAttribute('aria-activedescendant', firstId);
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    expect(combobox).toHaveAttribute('aria-activedescendant', secondId);
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');

    fireEvent.keyDown(combobox, { key: 'ArrowUp' });
    expect(combobox).toHaveAttribute('aria-activedescendant', firstId);

    fireEvent.keyDown(combobox, { key: 'ArrowUp' });
    expect(combobox).toHaveAttribute('aria-activedescendant', lastId);

    fireEvent.keyDown(combobox, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Command palette/i })).not.toBeInTheDocument();
    });
  });

  it('runs the active item on Enter in the combobox input and runs an item when its option li is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    // 1. Enter in combobox runs active item (ArrowDown to "Apps" -> Enter navigates to /apps)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const dialog1 = await screen.findByRole('dialog', { name: /Command palette/i });
    const combobox1 = within(dialog1).getByRole('combobox', {
      name: 'Search commands and tools',
    });

    fireEvent.keyDown(combobox1, { key: 'ArrowDown' });
    fireEvent.keyDown(combobox1, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Apps' })).toBeInTheDocument();
    });

    // 2. Clicking an <li role="option"> runs that item ("Vault" -> navigates to /vault)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const dialog2 = await screen.findByRole('dialog', { name: /Command palette/i });
    const vaultOption = within(dialog2).getByRole('option', { name: /Vault.*Pages/i });
    fireEvent.click(vaultOption);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Vault' })).toBeInTheDocument();
    });
  });

  it('persists Switch theme from CommandPalette in cairnbench:appearance without body[data-theme] and survives reload', async () => {
    const firstMount = render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('cairn-dusk');

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const dialog = await screen.findByRole('dialog', { name: /Command palette/i });
    const switchThemeOption = within(dialog).getByRole('option', { name: /Switch theme/i });
    fireEvent.click(switchThemeOption);

    expect(document.documentElement.getAttribute('data-theme')).toBe('cairn-daylight');
    expect(document.body.hasAttribute('data-theme')).toBe(false);

    const rawStored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    expect(rawStored).not.toBeNull();
    expect(JSON.parse(rawStored ?? '{}')).toMatchObject({ theme: 'cairn-daylight' });

    // Unmount and remount to simulate reload
    firstMount.unmount();
    document.documentElement.setAttribute('data-theme', 'cairn-dusk');

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('cairn-daylight');
    });
    expect(document.body.hasAttribute('data-theme')).toBe(false);
  });
});
