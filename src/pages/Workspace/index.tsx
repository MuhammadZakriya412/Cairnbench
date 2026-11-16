import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { getAppById } from '../../apps/registry';
import { Skeleton } from '../../ui/Skeleton';
import NotFoundPage from '../NotFound';

export default function WorkspacePage(): React.ReactElement {
  const { appId } = useParams<{ appId: string }>();
  const app = getAppById(appId);

  if (!app) {
    return <NotFoundPage />;
  }

  const AppWorkspace = app.workspace;

  return (
    <div className="flex flex-col gap-[var(--space-24)]">
      <header className="border-b border-[var(--border)] pb-[var(--space-16)] flex flex-col gap-[var(--space-4)]">
        <h1 className="font-[family-name:var(--font-serif)] text-[length:var(--text-24)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)] m-0">
          {app.name}
        </h1>
        <p className="text-[length:var(--text-14)] text-[var(--text-muted)] m-0">
          {app.tagline}
        </p>
      </header>

      <Suspense fallback={<Skeleton label={`Loading ${app.name}`} lines={4} variant="block" />}>
        <AppWorkspace />
      </Suspense>
    </div>
  );
}
