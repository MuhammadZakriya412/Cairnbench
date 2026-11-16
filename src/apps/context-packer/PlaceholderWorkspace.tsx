import React from 'react';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function ContextPackerPlaceholder(): React.ReactElement {
  return (
    <EmptyState
      title="Context Packer workspace"
      description={COPY['scrub.disclaimer']}
      actionLabel={COPY['action.save']}
      onAction={() => undefined}
    />
  );
}
