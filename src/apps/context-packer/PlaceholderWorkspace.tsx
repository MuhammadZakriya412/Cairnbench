import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COPY } from '../../ui/copy';
import { EmptyState } from '../../ui/EmptyState';

export default function ContextPackerPlaceholder(): React.ReactElement {
  const navigate = useNavigate();
  return (
    <EmptyState
      title="Context Packer workspace"
      description={COPY['scrub.disclaimer']}
      actionLabel={COPY['hero.cta.primary']}
      onAction={() => navigate('/apps')}
    />
  );
}
