import React, { useState } from 'react';
import { BRAND_NAME } from './config/brand';
import './design/fonts';
import type { ThemeId } from './design/theme';
import './design/themes.css';
import './design/tokens.css';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { CopyButton } from './ui/CopyButton';
import { COPY } from './ui/copy';
import { EmptyState } from './ui/EmptyState';
import { ErrorState } from './ui/ErrorState';
import { InfoPopover } from './ui/InfoPopover';
import { InputField } from './ui/InputField';
import { Kbd } from './ui/Kbd';
import { ModalDrawer } from './ui/ModalDrawer';
import { SelectField } from './ui/SelectField';
import { Skeleton } from './ui/Skeleton';
import { Switch } from './ui/Switch';
import { Tabs } from './ui/Tabs';
import { TextAreaField } from './ui/TextAreaField';
import { Toast, ToastRegion } from './ui/Toast';

function FormKitView(): React.ReactElement {
  const initialTheme: ThemeId =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('theme') === 'cairn-daylight'
      ? 'cairn-daylight'
      : 'cairn-dusk';
  const [theme, setKitTheme] = useState<ThemeId>(initialTheme);
  const [textValue, setTextValue] = useState('Sample title');
  const [areaValue, setAreaValue] = useState('Sample content line');
  const [selectValue, setSelectValue] = useState('markdown');
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [activeTab, setActiveTab] = useState('my-vault');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main
      id="kit-root"
      data-theme={theme}
      className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-[var(--space-24)] font-[family-name:var(--font-sans)]"
    >
      <div className="flex flex-col gap-[var(--space-24)]">
        <header className="flex items-center justify-between gap-[var(--space-16)] border-b border-[var(--border)] pb-[var(--space-16)]">
          <h1 className="font-[family-name:var(--font-serif)] text-[length:var(--text-28)] font-normal m-0">
            {BRAND_NAME} UI Kit
          </h1>
          <div className="flex items-center gap-[var(--space-8)]">
            <Button variant="secondary" size="sm" onClick={() => setKitTheme('cairn-dusk')}>
              Dusk
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setKitTheme('cairn-daylight')}>
              Daylight
            </Button>
          </div>
        </header>

        <section aria-labelledby="kit-buttons" className="flex flex-col gap-[var(--space-12)]">
          <h2 id="kit-buttons" className="text-[length:var(--text-20)] font-medium m-0">
            Buttons & Copy
          </h2>
          <div className="flex flex-wrap items-center gap-[var(--space-12)]">
            <Button variant="primary">{COPY['action.save']}</Button>
            <Button variant="secondary">{COPY['action.copy']}</Button>
            <Button variant="ghost">{COPY['action.open']}</Button>
            <Button variant="danger">{COPY['action.delete']}</Button>
            <CopyButton value="cb_YOUR_TOKEN" />
            <Kbd keys={['Ctrl', 'K']} ariaLabel="Command palette shortcut" />
          </div>
        </section>

        <section aria-labelledby="kit-inputs" className="flex flex-col gap-[var(--space-16)]">
          <h2 id="kit-inputs" className="text-[length:var(--text-20)] font-medium m-0">
            Form Controls
          </h2>
          <InputField
            label="Vault item title"
            hint="Visible label and helper text."
            value={textValue}
            onChange={(val) => setTextValue(val)}
          />
          <TextAreaField
            label="Source text"
            hint={COPY['scrub.disclaimer']}
            rows={3}
            value={areaValue}
            onChange={(val) => setAreaValue(val)}
          />
          <SelectField
            label="Output format"
            options={[
              { value: 'markdown', label: 'Markdown block' },
              { value: 'xml', label: 'XML tags' },
            ]}
            value={selectValue}
            onChange={(val) => setSelectValue(val)}
          />
          <Switch
            label="Redact AWS access keys"
            checked={switchChecked}
            onChange={setSwitchChecked}
          />
          <Checkbox
            label={COPY['encrypt.confirm']}
            checked={checkboxChecked}
            onChange={(val) => setCheckboxChecked(val)}
          />
        </section>

        <section aria-labelledby="kit-overlays" className="flex flex-col gap-[var(--space-16)]">
          <h2 id="kit-overlays" className="text-[length:var(--text-20)] font-medium m-0">
            Overlays & Feedback
          </h2>
          <div className="flex flex-wrap items-center gap-[var(--space-12)]">
            <InfoPopover
              topicId="context-packer-redaction"
              summary="Redaction masks secret formats locally in your browser."
            />
            <ModalDrawer
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
              title="Share vault item"
              description="Scoped share link settings."
              trigger={<Button variant="secondary">{COPY['action.share']}</Button>}
            >
              <p className="m-0 text-[length:var(--text-14)]">Share dialog body</p>
            </ModalDrawer>
            <Badge variant="neutral">context-packer</Badge>
            <Badge variant="accent">MCP</Badge>
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">80% quota</Badge>
            <Badge variant="danger">Revoked</Badge>
          </div>

          <Tabs
            ariaLabel="Vault sections"
            activeId={activeTab}
            onChange={setActiveTab}
            tabs={[
              { id: 'my-vault', label: 'My vault', content: <p className="m-0">Personal items</p> },
              { id: 'team-vault', label: 'Team', content: <p className="m-0">Shared items</p> },
            ]}
          />

          <ToastRegion>
            <Toast
              variant="success"
              message={COPY['action.saved']}
              actionLabel={COPY['action.open']}
              onAction={() => undefined}
            />
          </ToastRegion>

          <Skeleton label="Loading preview lines" lines={2} variant="line" />

          <EmptyState
            title="Vault is empty"
            description={COPY['empty.vault']}
            actionLabel={COPY['action.open']}
            onAction={() => undefined}
          />

          <ErrorState
            message={COPY['error.network']}
            code="E-VAULT-LOAD"
            onRetry={() => undefined}
          />
        </section>
      </div>
    </main>
  );
}

export default function App(): React.ReactElement {
  if (import.meta.env.DEV && typeof window !== 'undefined' && window.location.pathname === '/__kit') {
    return <FormKitView />;
  }
  return (
    <main>
      <h1>{BRAND_NAME}</h1>
    </main>
  );
}
