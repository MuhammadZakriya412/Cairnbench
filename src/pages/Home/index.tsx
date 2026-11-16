import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getApps } from '../../apps/registry';
import { Button } from '../../ui/Button';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';
import { FeatureRow } from '../../ui/FeatureRow';

export default function HomePage(): React.ReactElement {
  const navigate = useNavigate();
  const apps = getApps();

  return (
    <div className="flex flex-col gap-[var(--space-48)]">
      <section aria-labelledby="home-hero-heading" className="flex flex-col gap-[var(--space-24)] border-b border-[var(--border)] pb-[var(--space-48)]">
        <h1
          id="home-hero-heading"
          className="font-[family-name:var(--font-serif)] text-[length:var(--text-32)] md:text-[length:var(--text-44)] font-normal leading-[var(--leading-hero)] tracking-[var(--tracking-heading)] text-[var(--text)] m-0 max-w-[var(--measure-reading)]"
        >
          {COPY['hero.title']}
        </h1>
        <p className="text-[length:var(--text-16)] leading-[var(--leading-body)] text-[var(--text-muted)] m-0 max-w-[var(--measure-reading)]">
          {COPY['hero.lead']}
        </p>
        <div className="flex flex-wrap items-center gap-[var(--space-12)]">
          <Button variant="primary" onClick={() => navigate('/apps')}>
            {COPY['hero.cta.primary']}
          </Button>
        </div>
      </section>

      <section aria-labelledby="home-tutorials-heading" className="flex flex-col gap-[var(--space-24)] border-b border-[var(--border)] pb-[var(--space-48)]">
        <div className="flex flex-col gap-[var(--space-8)]">
          <h2
            id="home-tutorials-heading"
            className="font-[family-name:var(--font-serif)] text-[length:var(--text-28)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)] m-0"
          >
            {COPY['tutorials.title']}
          </h2>
          <p className="text-[length:var(--text-16)] text-[var(--text-muted)] m-0">
            {COPY['tutorials.sub']}
          </p>
        </div>
        <EmptyState
          title={COPY['tutorials.title']}
          description={COPY['tutorials.sub']}
          actionLabel={COPY['hero.cta.primary']}
          onAction={() => navigate('/apps')}
        />
      </section>

      <section aria-labelledby="home-tools-heading" className="flex flex-col gap-[var(--space-16)]">
        <div className="flex flex-col gap-[var(--space-8)] pb-[var(--space-8)] border-b border-[var(--border)]">
          <h2
            id="home-tools-heading"
            className="font-[family-name:var(--font-serif)] text-[length:var(--text-28)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)] m-0"
          >
            {COPY['tools.title']}
          </h2>
          <p className="text-[length:var(--text-16)] text-[var(--text-muted)] m-0">
            {COPY['tools.sub']}
          </p>
        </div>
        <div className="flex flex-col">
          {apps.map((app, index) => (
            <FeatureRow
              key={app.id}
              appId={app.id}
              name={app.name}
              description={app.description}
              snippet={app.snippet}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
