import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAppById } from '../../apps/registry';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';
import NotFoundPage from '../NotFound';

export default function AppPreviewPage(): React.ReactElement {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const app = getAppById(appId);

  if (!app) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex flex-col gap-[var(--space-24)]">
      <header className="border-b border-[var(--border)] pb-[var(--space-16)] flex flex-col gap-[var(--space-8)]">
        <h1 className="font-[family-name:var(--font-serif)] text-[length:var(--text-28)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)] m-0">
          {app.name}
        </h1>
        <p className="text-[length:var(--text-16)] text-[var(--text-muted)] m-0 max-w-[var(--measure-reading)]">
          {app.description}
        </p>
      </header>

      <EmptyState
        title={`${app.name} overview`}
        description={COPY['tutorials.sub']}
        actionLabel={COPY['action.open']}
        onAction={() => navigate(`/app/${app.id}/workspace`)}
      />
    </div>
  );
}
