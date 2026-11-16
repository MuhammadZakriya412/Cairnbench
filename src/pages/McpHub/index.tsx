import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function McpHubPage(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[var(--space-24)]">
      <header className="border-b border-[var(--border)] pb-[var(--space-16)] flex flex-col gap-[var(--space-8)]">
        <h1 className="font-[family-name:var(--font-serif)] text-[length:var(--text-28)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)] m-0">
          {COPY['mcp.title']}
        </h1>
        <p className="text-[length:var(--text-16)] text-[var(--text-muted)] m-0">
          {COPY['mcp.sub']}
        </p>
      </header>

      <EmptyState
        title={COPY['nav.mcp']}
        description={COPY['mcp.sub']}
        actionLabel={COPY['action.signin']}
        onAction={() => navigate('/auth')}
      />
    </div>
  );
}
