import React, { useState } from 'react';
import { BRAND_NAME } from './config/brand';
import './design/fonts';
import type { ThemeId } from './design/theme';
import './design/themes.css';
import './design/tokens.css';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';
import { COPY } from './ui/copy';
import { InputField } from './ui/InputField';
import { SelectField } from './ui/SelectField';
import { Switch } from './ui/Switch';
import { TextAreaField } from './ui/TextAreaField';

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

  return (
    <main
      id="kit-root"
      data-theme={theme}
      className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-[var(--space-24)] font-[family-name:var(--font-sans)]"
    >
      <div className="flex flex-col gap-[var(--space-24)]">
        <header className="flex items-center justify-between gap-[var(--space-16)] border-b border-[var(--border)] pb-[var(--space-16)]">
          <h1 className="font-[family-name:var(--font-serif)] text-[length:var(--text-28)] font-normal m-0">
            {BRAND_NAME} Form Components Kit
          </h1>
          <div className="flex items-center gap-[var(--space-8)]">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setKitTheme('cairn-dusk')}
            >
              Dusk
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setKitTheme('cairn-daylight')}
            >
              Daylight
            </Button>
          </div>
        </header>

        <section aria-labelledby="kit-buttons" className="flex flex-col gap-[var(--space-12)]">
          <h2 id="kit-buttons" className="text-[length:var(--text-20)] font-medium m-0">
            Buttons
          </h2>
          <div className="flex flex-wrap items-center gap-[var(--space-12)]">
            <Button variant="primary">{COPY['action.save']}</Button>
            <Button variant="secondary">{COPY['action.copy']}</Button>
            <Button variant="ghost">{COPY['action.open']}</Button>
            <Button variant="danger">{COPY['action.delete']}</Button>
            <Button variant="primary" loading={true}>
              {COPY['action.save']}
            </Button>
            <Button variant="secondary" disabled={true}>
              {COPY['action.share']}
            </Button>
          </div>
          <Button
            emptyMessage="No action configured."
            emptyActionLabel={COPY['action.open']}
            onEmptyAction={() => undefined}
          />
          <Button
            errorMessage={COPY['error.network']}
            errorCode="E-VAULT-LOAD"
            onRetry={() => undefined}
          />
        </section>

        <section aria-labelledby="kit-inputs" className="flex flex-col gap-[var(--space-16)]">
          <h2 id="kit-inputs" className="text-[length:var(--text-20)] font-medium m-0">
            Inputs & TextAreas
          </h2>
          <InputField
            label="Vault item title"
            hint="Visible label and helper text."
            value={textValue}
            onChange={(val) => setTextValue(val)}
          />
          <InputField
            label="Invalid title"
            error={COPY['error.quota']}
            errorCode="E-VAULT-ITEM-TOO-LARGE"
            onRetry={() => undefined}
            value="Oversized item"
            onChange={() => undefined}
          />
          <InputField
            label="Loading input"
            loading={true}
            value=""
            onChange={() => undefined}
          />
          <TextAreaField
            label="Source text"
            hint={COPY['scrub.disclaimer']}
            rows={3}
            value={areaValue}
            onChange={(val) => setAreaValue(val)}
          />
        </section>

        <section aria-labelledby="kit-selects" className="flex flex-col gap-[var(--space-16)]">
          <h2 id="kit-selects" className="text-[length:var(--text-20)] font-medium m-0">
            Select, Switch, Checkbox
          </h2>
          <SelectField
            label="Output format"
            hint="Select output wrapper."
            options={[
              { value: 'markdown', label: 'Markdown block' },
              { value: 'xml', label: 'XML tags' },
            ]}
            value={selectValue}
            onChange={(val) => setSelectValue(val)}
          />
          <Switch
            label="Redact AWS access keys"
            hint="Masks AKIA keys."
            checked={switchChecked}
            onChange={setSwitchChecked}
          />
          <Checkbox
            label={COPY['encrypt.confirm']}
            hint="Required before encrypting."
            checked={checkboxChecked}
            onChange={(val) => setCheckboxChecked(val)}
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
