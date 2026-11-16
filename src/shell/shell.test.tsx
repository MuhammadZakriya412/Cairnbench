import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { AppRoutes } from './routes';

afterEach(() => {
  cleanup();
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
});
