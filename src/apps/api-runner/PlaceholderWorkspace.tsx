import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function ApiRunnerPlaceholder(): React.ReactElement {
  const navigate = useNavigate();
  return (
    <EmptyState
      title="API Runner workspace"
      description="Chain HTTP requests, inspect response timings, and save repeatable checks."
      actionLabel={COPY['hero.cta.primary']}
      onAction={() => navigate('/apps')}
    />
  );
}
