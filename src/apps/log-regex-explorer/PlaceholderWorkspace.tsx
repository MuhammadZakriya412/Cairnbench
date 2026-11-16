import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function LogRegexExplorerPlaceholder(): React.ReactElement {
  const navigate = useNavigate();
  return (
    <EmptyState
      title="Log, Regex & Cron Explorer workspace"
      description="Filter large log streams, test regular expressions, and inspect cron schedules."
      actionLabel={COPY['hero.cta.primary']}
      onAction={() => navigate('/apps')}
    />
  );
}
