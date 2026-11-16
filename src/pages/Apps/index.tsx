import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getApps } from '../../apps/registry';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';
import { ToolRow } from '../../ui/ToolRow';

export default function AppsPage(): React.ReactElement {
  const navigate = useNavigate();
  const apps = getApps();

  return (
    <div className="flex flex-col gap-[var(--space-32)]">
      <header className="border-b border-[var(--border)] pb-[var(--space-16)]">
        <h1 className="font-[family-name:var(--font-serif)] text-[length:var(--text-28)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)] m-0">
          {COPY['nav.apps']}
        </h1>
      </header>

      <section aria-labelledby="apps-recent-heading" className="flex flex-col gap-[var(--space-16)]">
        <h2
          id="apps-recent-heading"
          className="font-[family-name:var(--font-serif)] text-[length:var(--text-20)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)] m-0"
        >
          {COPY['apps.recent']}
        </h2>
        <EmptyState
          title={COPY['apps.recent']}
          description={COPY['apps.recent.empty']}
          actionLabel={COPY['paste.cta']}
          onAction={() => {
            const firstApp = apps[0];
            if (firstApp) {
              navigate(`/app/${firstApp.id}/workspace`);
            }
          }}
        />
      </section>

      <section aria-labelledby="apps-tools-heading" className="flex flex-col gap-[var(--space-12)]">
        <h2
          id="apps-tools-heading"
          className="font-[family-name:var(--font-serif)] text-[length:var(--text-20)] font-normal tracking-[var(--tracking-heading)] text-[var(--text)] m-0 pb-[var(--space-8)] border-b border-[var(--border)]"
        >
          {COPY['apps.tools']}
        </h2>
        <div className="flex flex-col">
          {apps.map((app, index) => (
            <ToolRow
              key={app.id}
              index={index + 1}
              appId={app.id}
              name={app.name}
              tagline={app.tagline}
              savedCount={0}
              onClick={(event) => {
                event.preventDefault();
                navigate(`/app/${app.id}/workspace`);
              }}
            />
          ))}
        </div>
      </section>

      <p className="m-0 pt-[var(--space-16)] border-t border-[var(--border)] text-[length:var(--text-14)] text-[var(--text-muted)]">
        {COPY['guest.banner']}
      </p>
    </div>
  );
}
