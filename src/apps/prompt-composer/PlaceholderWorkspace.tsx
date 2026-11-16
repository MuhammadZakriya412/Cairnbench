import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function PromptComposerPlaceholder(): React.ReactElement {
  const navigate = useNavigate();
  return (
    <EmptyState
      title="Prompt Composer workspace"
      description="Author reusable prompt templates with typed variables and live preview."
      actionLabel={COPY['hero.cta.primary']}
      onAction={() => navigate('/apps')}
    />
  );
}
