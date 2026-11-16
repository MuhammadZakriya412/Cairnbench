import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { AppRoutes } from '../shell/routes';
import { getAppById, getApps, registerAppForTest, type AppManifest } from './registry';

afterEach(() => {
  cleanup();
});

describe('App Registry (01 §5.1, Card 0.4)', () => {
  it('exports the four launch app manifests with valid schemaVersion, migrate, and 2-line snippets <= 48 chars', () => {
    const apps = getApps();
    expect(apps.length).toBe(4);
    for (const app of apps) {
      expect(app.id).toMatch(/^[a-z0-9-]{3,32}$/);
      expect(app.tagline.split(/\s+/).length).toBeLessThanOrEqual(12);
      expect(app.snippet.length).toBe(2);
      expect(app.snippet[0].length).toBeLessThanOrEqual(48);
      expect(app.snippet[1].length).toBeLessThanOrEqual(48);
      expect(app.schemaVersion).toBe(1);
      const sample = { raw: 'sample' };
      expect(app.migrate(sample, 1)).toEqual(sample);
      expect(getAppById(app.id)?.name).toBe(app.name);
    }
  });

  it('registering a fake fifth app makes it appear in Home, Apps, and CommandPalette with no other file changed', async () => {
    const FakeWorkspace: React.FC = () => <div>Fake Fifth Workspace</div>;
    const fakeApp: AppManifest = {
      id: 'schema-inspector',
      name: 'Schema Inspector',
      tagline: 'Validate JSON payloads against strict schemas.',
      tags: ['json', 'schema'],
      icon: 'FileCode',
      workspace: React.lazy(async () => ({ default: FakeWorkspace })),
      contentSchema: z.object({ schema: z.string() }),
      schemaVersion: 1,
      migrate: (oldContent) => oldContent,
      presets: [],
      mcpTools: [],
      tutorial: null,
      searchText: 'schema inspector json validate',
      description: 'Inspect and check JSON payloads before passing structured output to tools.',
      snippet: ['schema: object (strict)', 'status: 0 validation errors'],
    };

    const unregister = registerAppForTest(fakeApp);
    try {
      const { unmount: unmountHome } = render(
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('Schema Inspector')).toBeInTheDocument();
      });
      unmountHome();

      const { unmount: unmountApps } = render(
        <MemoryRouter initialEntries={['/apps']}>
          <AppRoutes />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('Schema Inspector')).toBeInTheDocument();
      });
      expect(
        screen.getByText('Validate JSON payloads against strict schemas.'),
      ).toBeInTheDocument();
      unmountApps();

      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes initialPaletteOpen />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /Command palette/i })).toBeInTheDocument();
      });
      expect(screen.getAllByText(/Schema Inspector/i).length).toBeGreaterThanOrEqual(1);
    } finally {
      unregister();
    }
  });
});
