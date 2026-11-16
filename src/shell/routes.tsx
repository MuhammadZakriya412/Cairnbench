import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Skeleton } from '../ui/Skeleton';
import { AppShell } from './AppShell';

const HomePage = React.lazy(() => import('../pages/Home'));
const AppsPage = React.lazy(() => import('../pages/Apps'));
const AppPreviewPage = React.lazy(() => import('../pages/AppPreview'));
const WorkspacePage = React.lazy(() => import('../pages/Workspace'));
const VaultPage = React.lazy(() => import('../pages/Vault'));
const McpHubPage = React.lazy(() => import('../pages/McpHub'));
const SettingsPage = React.lazy(() => import('../pages/Settings'));
const AuthPage = React.lazy(() => import('../pages/Auth'));
const JoinOrgPage = React.lazy(() => import('../pages/JoinOrg'));
const OpenSharePage = React.lazy(() => import('../pages/OpenShare'));
const DocsPage = React.lazy(() => import('../pages/Docs'));
const NotFoundPage = React.lazy(() => import('../pages/NotFound'));
const KitPreviewPage = import.meta.env.DEV
  ? React.lazy(() => import('../pages/KitPreview'))
  : null;

export interface AppRoutesProps {
  initialPaletteOpen?: boolean;
}

export function AppRoutes({ initialPaletteOpen = false }: AppRoutesProps): React.ReactElement {
  return (
    <Routes>
      {KitPreviewPage ? (
        <Route
          path="/__kit"
          element={
            <Suspense fallback={<Skeleton label="Loading UI kit" lines={4} variant="block" />}>
              <KitPreviewPage />
            </Suspense>
          }
        />
      ) : null}
      <Route element={<AppShell initialPaletteOpen={initialPaletteOpen} />}>
        <Route index element={<HomePage />} />
        <Route path="apps" element={<AppsPage />} />
        <Route path="app/:appId/overview" element={<AppPreviewPage />} />
        <Route path="app/:appId/workspace" element={<WorkspacePage />} />
        <Route path="vault" element={<VaultPage />} />
        <Route path="mcp" element={<McpHubPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="join/:token" element={<JoinOrgPage />} />
        <Route path="share/:token" element={<OpenSharePage />} />
        <Route path="docs/:topicId" element={<DocsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
