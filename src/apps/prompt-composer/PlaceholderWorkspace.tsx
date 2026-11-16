import React from 'react';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function PromptComposerPlaceholder(): React.ReactElement {
  return (
    <EmptyState
      title="Prompt Composer workspace"
      description="Author reusable prompt templates with typed variables and live preview."
      actionLabel={COPY['action.save']}
      onAction={() => undefined}
    />
  );
}
