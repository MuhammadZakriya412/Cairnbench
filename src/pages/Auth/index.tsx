import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function AuthPage(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[var(--space-24)]">
      <header className="border-b border-[var(--border)] pb-[var(--space-16)]">
        <h1 className="font-[family-name:var(--font-serif)] text-[length:var(--text-28)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)] m-0">
          {COPY['action.signin']}
        </h1>
      </header>

      <EmptyState
        title={COPY['action.signin']}
        description={COPY['cloud.off']}
        actionLabel={COPY['hero.cta.primary']}
        onAction={() => navigate('/apps')}
      />
    </div>
  );
}
