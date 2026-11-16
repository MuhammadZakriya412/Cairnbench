import React from 'react';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function ApiRunnerPlaceholder(): React.ReactElement {
  return (
    <EmptyState
      title="API Runner workspace"
      description="Chain HTTP requests, inspect response timings, and save repeatable checks."
      actionLabel={COPY['action.save']}
      onAction={() => undefined}
    />
  );
}
