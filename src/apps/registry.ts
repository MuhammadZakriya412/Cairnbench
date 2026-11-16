import React from 'react';
import { z } from 'zod';

export interface AppPresetSummary {
  id: string;
  label: string;
  description: string;
}

export interface AppMcpToolSummary {
  name: string;
  description: string;
}

export interface AppManifest {
  id: string;
  name: string;
  tagline: string;
  tags: readonly string[];
  icon: string;
  workspace: React.LazyExoticComponent<React.ComponentType>;
  contentSchema: z.ZodType;
  schemaVersion: number;
  migrate: (oldContent: unknown, fromVersion: number) => unknown;
  presets: readonly AppPresetSummary[];
  mcpTools: readonly AppMcpToolSummary[];
  tutorial: string | null;
  searchText: string;
  description: string;
  snippet: readonly [string, string];
}

const LAUNCH_APPS: readonly AppManifest[] = [
  {
    id: 'context-packer',
    name: 'Context Packer',
    tagline: 'Turn files or pasted text into one AI-ready block.',
    tags: ['context', 'redaction', 'tokens'],
    icon: 'Package',
    workspace: React.lazy(() => import('./context-packer/PlaceholderWorkspace')),
    contentSchema: z.object({
      format: z.enum(['markdown', 'xml', 'plain']).default('markdown'),
      output: z.string().default(''),
    }),
    schemaVersion: 1,
    migrate: (oldContent) => oldContent,
    presets: [
      {
        id: 'repo-slice',
        label: 'Pack source files',
        description: 'Combine selected files into one block with secret redaction.',
      },
    ],
    mcpTools: [
      {
        name: 'scrub_secrets',
        description: 'Redact detected secret patterns from text before sharing.',
      },
    ],
    tutorial: 'context-packer-tour',
    searchText: 'context packer files redact secrets tokens markdown xml',
    description:
      'Combine source files or pasted text into one block while redacting common secret patterns. Check token counts before you copy.',
    snippet: ['AWS_KEY=[REDACTED:aws-access-key]', 'tokens: 1,420 / budget: 8,000'],
  },
  {
    id: 'api-runner',
    name: 'API Runner',
    tagline: 'Chain HTTP requests, see timing, and debug failures.',
    tags: ['http', 'api', 'assertions'],
    icon: 'Send',
    workspace: React.lazy(() => import('./api-runner/PlaceholderWorkspace')),
    contentSchema: z.object({
      steps: z.array(z.unknown()).default([]),
    }),
    schemaVersion: 1,
    migrate: (oldContent) => oldContent,
    presets: [
      {
        id: 'health-check',
        label: 'Status and JSON check',
        description: 'Send a GET request and assert status 200 with JSON fields.',
      },
    ],
    mcpTools: [],
    tutorial: 'api-runner-tour',
    searchText: 'api runner http request chain timing assertions curl',
    description:
      'Build multi-step HTTP request chains with variable extraction and status assertions. Inspect timing breakdowns directly in your browser.',
    snippet: ['GET /v1/health -> 200 OK (42 ms)', 'assert $.status == "ready" -> PASS'],
  },
  {
    id: 'log-regex-explorer',
    name: 'Log, Regex & Cron Explorer',
    tagline: 'Filter big logs, test regexes, and explain cron schedules.',
    tags: ['logs', 'regex', 'cron'],
    icon: 'ScrollText',
    workspace: React.lazy(() => import('./log-regex-explorer/PlaceholderWorkspace')),
    contentSchema: z.object({
      pattern: z.string().default(''),
      cronExpression: z.string().default(''),
    }),
    schemaVersion: 1,
    migrate: (oldContent) => oldContent,
    presets: [
      {
        id: 'jsonl-errors',
        label: 'Filter error lines',
        description: 'Inspect structured log lines and test extraction regexes.',
      },
    ],
    mcpTools: [
      {
        name: 'explain_cron',
        description: 'Explain a cron schedule in plain English and list next runs.',
      },
    ],
    tutorial: 'log-regex-explorer-tour',
    searchText: 'log regex cron explorer filter jsonl schedule pattern',
    description:
      'Stream and filter multi-megabyte log files, test regular expressions with timeout guards, and translate cron expressions into plain English.',
    snippet: ['filter: level="error" (14 matches)', 'cron: "0 9 * * 1-5" -> Weekdays 09:00'],
  },
  {
    id: 'prompt-composer',
    name: 'Prompt Composer',
    tagline: 'Reusable templates with fill-in forms and live preview.',
    tags: ['prompts', 'templates', 'variables'],
    icon: 'FileText',
    workspace: React.lazy(() => import('./prompt-composer/PlaceholderWorkspace')),
    contentSchema: z.object({
      template: z.string().default(''),
      variables: z.record(z.string(), z.string()).default({}),
    }),
    schemaVersion: 1,
    migrate: (oldContent) => oldContent,
    presets: [
      {
        id: 'bug-triage',
        label: 'Root-cause bug report',
        description: 'Structured template for reproduction steps and stack traces.',
      },
    ],
    mcpTools: [
      {
        name: 'render_template',
        description: 'Render a prompt template with validated variable values.',
      },
    ],
    tutorial: 'prompt-composer-tour',
    searchText: 'prompt composer template variables form live preview',
    description:
      'Write structured templates with typed variables, default values, and reusable includes. Preview the rendered output live as you fill the form.',
    snippet: ['{{role: "Reviewer"}} | {{diff}}', 'preview: 420 tokens (ready to copy)'],
  },
];

let extraTestApps: AppManifest[] = [];

export function getApps(): readonly AppManifest[] {
  return extraTestApps.length > 0 ? [...LAUNCH_APPS, ...extraTestApps] : LAUNCH_APPS;
}

export function getAppById(id: string | undefined): AppManifest | undefined {
  if (!id) {
    return undefined;
  }
  return getApps().find((app) => app.id === id);
}

export function registerAppForTest(manifest: AppManifest): () => void {
  extraTestApps = [...extraTestApps.filter((a) => a.id !== manifest.id), manifest];
  return () => {
    extraTestApps = extraTestApps.filter((a) => a.id !== manifest.id);
  };
}
