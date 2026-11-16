import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function OpenSharePage(): React.ReactElement {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[var(--space-24)]">
      <header className="border-b border-[var(--border)] pb-[var(--space-16)]">
        <h1 className="font-[family-name:var(--font-serif)] text-[length:var(--text-28)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)] m-0">
          Shared item
        </h1>
      </header>

      <EmptyState
        title={token ? `Shared vault item (${token})` : 'Shared vault item'}
        description={COPY['cloud.off']}
        actionLabel={COPY['nav.vault']}
        onAction={() => navigate('/vault')}
      />
    </div>
  );
}
