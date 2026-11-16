import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { APPEARANCE_STORAGE_KEY } from '../design/theme';
import { InfoPopover } from '../ui/InfoPopover';
import { ModalDrawer } from '../ui/ModalDrawer';
import { AppRoutes } from './routes';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.body.removeAttribute('data-theme');
});

describe('Application Shell & Routing (01 §7, 03 §6, Card 0.4)', () => {
  it('renders top bar with 4 destinations, Personal org switcher, theme menu, and no footer in AppShell', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Get your code ready for AI, without leaking secrets.',
      );
    });

    const primaryNav = screen.getByRole('navigation', { name: 'Primary navigation' });
    const links = primaryNav.querySelectorAll('a');
    expect(links.length).toBe(4);
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('redirects /?docs=topic-slug to /docs/topic-slug', async () => {
    render(
      <MemoryRouter initialEntries={['/?docs=getting-started-guide']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Documentation: getting-started-guide',
      );
    });
  });

  it('opens CommandPalette on Ctrl+K and closes on Escape', async () => {
    render(
      <MemoryRouter initialEntries={['/apps']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Apps' })).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const dialog = await screen.findByRole('dialog', { name: /Command palette/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('New vault item')).toBeInTheDocument();
    expect(screen.getByText('Switch theme')).toBeInTheDocument();
    expect(screen.getByText('Switch organization')).toBeInTheDocument();

    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /Command palette/i })).not.toBeInTheDocument();
    });
  });

  it('switches theme between System, Dusk (dark), and Daylight (light) via ThemeMenu', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    const themeButton = screen.getByRole('button', { name: /Theme/i });
    fireEvent.click(themeButton);

    const daylightOption = await screen.findByRole('button', { name: /Daylight \(light\)/i });
    fireEvent.click(daylightOption);
    expect(document.documentElement.getAttribute('data-theme')).toBe('cairn-daylight');

    fireEvent.click(screen.getByRole('button', { name: /Theme/i }));
    const duskOption = await screen.findByRole('button', { name: /Dusk \(dark\)/i });
    fireEvent.click(duskOption);
    expect(document.documentElement.getAttribute('data-theme')).toBe('cairn-dusk');
  });

  it('renders NotFound page for unknown routes and unknown appId', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/app/unknown-app-id/workspace']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    });
    unmount();

    render(
      <MemoryRouter initialEntries={['/non-existent-route']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    });
  });

  it('sets data-theme only on html without copying onto body while Radix portals stay themed', async () => {
    function PortalHarness() {
      const [open, setOpen] = React.useState(false);
      return (
        <ModalDrawer
          open={open}
          onOpenChange={setOpen}
          title="Portal Theme Check"
          trigger={<button type="button">Open portal check</button>}
        >
          <InfoPopover topicId="sample-topic" summary="Theme inheritance check." />
        </ModalDrawer>
      );
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
        <PortalHarness />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    expect(document.body.hasAttribute('data-theme')).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: /Theme/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Daylight \(light\)/i }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('cairn-daylight');
    expect(document.body.hasAttribute('data-theme')).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Open portal check' }));
    const dialog = await screen.findByRole('dialog', { name: 'Portal Theme Check' });
    expect(document.documentElement.contains(dialog)).toBe(true);

    const infoTrigger = screen.getByRole('button', { name: 'Help for sample-topic' });
    fireEvent.click(infoTrigger);
    const guideLink = await screen.findByRole('link', { name: 'Open full guide' });
    expect(document.documentElement.contains(guideLink)).toBe(true);
  });

  it('stores System in the single appearance key and follows OS matchMedia changes after reload', async () => {
    let isLight = false;
    const listeners = new Set<() => void>();
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: query === '(prefers-color-scheme: light)' ? isLight : false,
        media: query,
        onchange: null,
        addEventListener: (type: string, listener: () => void) => {
          if (type === 'change' && query === '(prefers-color-scheme: light)') {
            listeners.add(listener);
          }
        },
        removeEventListener: (type: string, listener: () => void) => {
          if (type === 'change' && query === '(prefers-color-scheme: light)') {
            listeners.delete(listener);
          }
        },
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => true,
      }),
    });

    try {
      const firstMount = render(
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /Theme/i }));
      fireEvent.click(await screen.findByRole('button', { name: 'System' }));

      expect(window.localStorage.getItem('cairnbench:theme-preference')).toBeNull();
      const stored = JSON.parse(window.localStorage.getItem(APPEARANCE_STORAGE_KEY) ?? '{}');
      expect(stored.theme).toBe('system');
      expect(document.documentElement.getAttribute('data-theme')).toBe('cairn-dusk');

      firstMount.unmount();

      // Simulate OS switching to light and remounting AppShell
      isLight = true;
      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('cairn-daylight');
      });

      // Simulate OS switching back to dark while mounted
      act(() => {
        isLight = false;
        for (const listener of listeners) {
          listener();
        }
      });
      expect(document.documentElement.getAttribute('data-theme')).toBe('cairn-dusk');
    } finally {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: originalMatchMedia,
      });
    }
  });
});

