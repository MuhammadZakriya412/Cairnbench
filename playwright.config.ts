import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

const containerExecutable = '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell';

export default defineConfig({
  testDir: './e2e',
  timeout: 20_000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    launchOptions: existsSync(containerExecutable)
      ? {
          executablePath: containerExecutable,
          chromiumSandbox: false,
          args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
        }
      : undefined,
  },
});
