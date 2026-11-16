import React from 'react';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function LogRegexExplorerPlaceholder(): React.ReactElement {
  return (
    <EmptyState
      title="Log, Regex & Cron Explorer workspace"
      description="Filter large log streams, test regular expressions, and inspect cron schedules."
      actionLabel={COPY['action.save']}
      onAction={() => undefined}
    />
  );
}
