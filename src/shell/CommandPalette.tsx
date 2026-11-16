import React, { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApps } from '../apps/registry';
import { getTheme, updateThemePreference } from '../design/theme';
import { COPY } from '../ui/copy';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { ModalDrawer } from '../ui/ModalDrawer';
import { Skeleton } from '../ui/Skeleton';

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

interface PaletteItem {
  id: string;
  label: string;
  category: 'Pages' | 'Tools' | 'Actions' | 'Vault';
  keywords: string;
  onSelect: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  disabled = false,
  loading = false,
  errorMessage,
  errorCode = 'E-PALETTE',
  onRetry,
}: CommandPaletteProps): React.ReactElement {
  const navigate = useNavigate();
  const baseId = useId();
  const comboboxId = `command-palette-input-${baseId}`;
  const listboxId = `command-palette-listbox-${baseId}`;
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const apps = getApps();

  const items: readonly PaletteItem[] = useMemo(() => {
    const closeAndGo = (path: string) => () => {
      onOpenChange(false);
      setQuery('');
      navigate(path);
    };

    const pageItems: PaletteItem[] = [
      { id: 'page-home', label: COPY['nav.home'], category: 'Pages', keywords: 'home landing', onSelect: closeAndGo('/') },
      { id: 'page-apps', label: COPY['nav.apps'], category: 'Pages', keywords: 'apps workbench tools', onSelect: closeAndGo('/apps') },
      { id: 'page-mcp', label: COPY['nav.mcp'], category: 'Pages', keywords: 'connect ai mcp hub tokens', onSelect: closeAndGo('/mcp') },
      { id: 'page-vault', label: COPY['nav.vault'], category: 'Pages', keywords: 'vault saved items', onSelect: closeAndGo('/vault') },
      { id: 'page-settings', label: 'Settings', category: 'Pages', keywords: 'settings profile appearance security storage', onSelect: closeAndGo('/settings') },
      { id: 'page-auth', label: COPY['action.signin'], category: 'Pages', keywords: 'sign in auth account', onSelect: closeAndGo('/auth') },
    ];

    const appItems: PaletteItem[] = apps.map((app) => ({
      id: `app-${app.id}`,
      label: app.name,
      category: 'Tools',
      keywords: `${app.name} ${app.tagline} ${app.searchText} ${app.tags.join(' ')}`,
      onSelect: closeAndGo(`/app/${app.id}/workspace`),
    }));

    const actionItems: PaletteItem[] = [
      {
        id: 'action-new-vault',
        label: 'New vault item',
        category: 'Actions',
        keywords: 'new vault item create save',
        onSelect: closeAndGo('/apps'),
      },
      {
        id: 'action-switch-theme',
        label: 'Switch theme',
        category: 'Actions',
        keywords: 'switch theme dark light dusk daylight appearance',
        onSelect: () => {
          if (typeof document !== 'undefined') {
            const root = document.documentElement;
            const current = getTheme(root);
            const nextTheme = current === 'cairn-dusk' ? 'cairn-daylight' : 'cairn-dusk';
            const storage = typeof window !== 'undefined' ? window.localStorage : null;
            updateThemePreference(root, storage, nextTheme);
          }
          onOpenChange(false);
          setQuery('');
        },
      },
      {
        id: 'action-switch-org',
        label: 'Switch organization',
        category: 'Actions',
        keywords: 'switch organization personal team',
        onSelect: closeAndGo('/settings'),
      },
      {
        id: 'vault-search',
        label: 'Search vault titles',
        category: 'Vault',
        keywords: 'search vault titles saved items',
        onSelect: closeAndGo('/vault'),
      },
    ];

    return [...pageItems, ...appItems, ...actionItems];
  }, [apps, navigate, onOpenChange]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return items;
    }
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(normalized) ||
        item.keywords.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized),
    );
  }, [items, query]);

  const safeActiveIndex =
    filteredItems.length === 0 ? 0 : Math.min(activeIndex, filteredItems.length - 1);
  const activeItem = filteredItems[safeActiveIndex];
  const activeOptionId = activeItem ? `${listboxId}-opt-${activeItem.id}` : undefined;

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredItems.length === 0) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (event.key === 'Enter' && activeItem) {
      event.preventDefault();
      activeItem.onSelect();
    }
  };

  return (
    <ModalDrawer
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          setQuery('');
          setActiveIndex(0);
        }
      }}
      title="Command palette"
      description="Jump to any page, tool, or action."
      disabled={disabled}
    >
      {loading ? (
        <Skeleton label="Loading command palette" lines={4} variant="line" />
      ) : errorMessage ? (
        <ErrorState message={errorMessage} code={errorCode} onRetry={onRetry} />
      ) : (
        <div className="flex flex-col gap-[var(--space-16)]">
          <div className="flex flex-col gap-[var(--space-8)] font-[family-name:var(--font-sans)]">
            <label
              htmlFor={comboboxId}
              className="text-[length:var(--text-14)] font-medium text-[var(--text)]"
            >
              Search commands and tools
            </label>
            <input
              id={comboboxId}
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={filteredItems.length > 0 ? 'true' : 'false'}
              aria-controls={listboxId}
              aria-activedescendant={activeOptionId}
              value={query}
              disabled={disabled}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              className="min-h-[var(--control-height)] w-full rounded-[var(--radius-6)] border border-[var(--border-strong)] px-[var(--space-12)] py-[var(--space-8)] bg-[var(--surface)] text-[length:var(--text-16)] text-[var(--text)] leading-[var(--leading-body)] transition-[opacity,transform] duration-[var(--duration-fast)] ease-[var(--ease-calm)] focus-visible:outline focus-visible:outline-[length:var(--focus-ring-width)] focus-visible:outline-[var(--accent)] focus-visible:outline-offset-[var(--focus-ring-offset)] disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {filteredItems.length === 0 ? (
            <EmptyState
              title="No matching commands"
              description="Try searching for a tool name, page, or vault item."
              actionLabel={COPY['nav.apps']}
              onAction={() => {
                setQuery('');
                onOpenChange(false);
                navigate('/apps');
              }}
            />
          ) : (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Available commands"
              className="m-0 p-0 list-none flex flex-col gap-[var(--space-4)] max-h-[320px] overflow-y-auto"
            >
              {filteredItems.map((item, idx) => {
                const isSelected = idx === safeActiveIndex;
                const optionId = `${listboxId}-opt-${item.id}`;
                return (
                  <li
                    key={item.id}
                    id={optionId}
                    role="option"
                    aria-selected={isSelected ? 'true' : 'false'}
                    onClick={item.onSelect}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full flex items-center justify-between gap-[var(--space-12)] min-h-[var(--target-desktop)] px-[var(--space-12)] py-[var(--space-8)] rounded-[var(--radius-5)] text-left font-[family-name:var(--font-sans)] text-[length:var(--text-14)] transition-[transform,opacity] duration-[var(--duration-fast)] ease-[var(--ease-calm)] hover:bg-[var(--accent-wash)] cursor-pointer ${
                      isSelected ? 'bg-[var(--accent-wash)] text-[var(--text)]' : 'bg-transparent text-[var(--text)]'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-12)] text-[var(--text-muted)]">
                      {item.category}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </ModalDrawer>
  );
}

export default CommandPalette;
