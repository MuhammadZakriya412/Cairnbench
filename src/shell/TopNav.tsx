import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SiteHeader } from '../ui/SiteHeader';
import { OrgSwitcher } from './OrgSwitcher';
import { ThemeMenu } from './ThemeMenu';

export interface TopNavProps {
  onOpenCommandPalette: () => void;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorMessage?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function TopNav({
  onOpenCommandPalette,
  disabled = false,
  loading = false,
  emptyMessage,
  emptyActionLabel,
  onEmptyAction,
  errorMessage,
  errorCode,
  onRetry,
}: TopNavProps): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <SiteHeader
      currentPath={location.pathname}
      orgSlot={<OrgSwitcher disabled={disabled} />}
      themeSlot={<ThemeMenu disabled={disabled} />}
      onOpenCommandPalette={onOpenCommandPalette}
      onNavigate={handleNavigate}
      disabled={disabled}
      loading={loading}
      emptyMessage={emptyMessage}
      emptyActionLabel={emptyActionLabel}
      onEmptyAction={onEmptyAction}
      errorMessage={errorMessage}
      errorCode={errorCode}
      onRetry={onRetry}
    />
  );
}
