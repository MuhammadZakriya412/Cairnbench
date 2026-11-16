import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function DocsPage(): React.ReactElement {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[var(--space-24)]">
      <header className="border-b border-[var(--border)] pb-[var(--space-16)]">
        <h1 className="font-[family-name:var(--font-serif)] text-[length:var(--text-28)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)] m-0">
          Documentation: {topicId}
        </h1>
      </header>

      <EmptyState
        title="Guide reader"
        description={COPY['tutorials.sub']}
        actionLabel={COPY['hero.cta.primary']}
        onAction={() => navigate('/apps')}
      />
    </div>
  );
}
