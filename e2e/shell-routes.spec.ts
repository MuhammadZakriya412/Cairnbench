import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Card 0.4 Application shell and routing', () => {
  test('keyboard navigation across routes, Ctrl+K opens and Esc closes CommandPalette', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Get your code ready for AI, without leaking secrets.',
    );

    // Open CommandPalette with Ctrl+K and close with Escape
    await page.keyboard.press('Control+k');
    const paletteDialog = page.getByRole('dialog', { name: 'Command palette' });
    await expect(paletteDialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(paletteDialog).toBeHidden();

    // Navigate top-level destinations by keyboard (Tab + Enter)
    const appsLink = page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Apps' });
    await appsLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('http://localhost:3000/apps');
    await expect(page.getByRole('heading', { level: 1, name: 'Apps' })).toBeVisible();

    const mcpLink = page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Connect AI' });
    await mcpLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('http://localhost:3000/mcp');
    await expect(page.getByRole('heading', { level: 1, name: 'Let your AI agent use it too' })).toBeVisible();

    const vaultLink = page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Vault' });
    await vaultLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('http://localhost:3000/vault');
    await expect(page.getByRole('heading', { level: 1, name: 'Vault' })).toBeVisible();

    const settingsLink = page.getByRole('link', { name: 'Settings' });
    await settingsLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('http://localhost:3000/settings');
    await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();

    // Navigate to Sign in (/auth) via CommandPalette keyboard interaction
    await page.keyboard.press('Control+k');
    await expect(paletteDialog).toBeVisible();
    await page.getByLabel('Search commands and tools').fill('Sign in');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('http://localhost:3000/auth');
    await expect(page.getByRole('heading', { level: 1, name: 'Sign in' })).toBeVisible();

    // Navigate to Context Packer workspace via CommandPalette keyboard interaction
    await page.keyboard.press('Control+k');
    await expect(paletteDialog).toBeVisible();
    await page.getByLabel('Search commands and tools').fill('Context Packer');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('http://localhost:3000/app/context-packer/workspace');
    await expect(page.getByRole('heading', { level: 1, name: 'Context Packer' })).toBeVisible();

    // Check remaining routes from 01 §7 (/app/:appId/overview, /?docs=x redirect, /join/:token, /share/:token, 404)
    await page.goto('http://localhost:3000/app/context-packer/overview');
    await expect(page.getByRole('heading', { level: 1, name: 'Context Packer' })).toBeVisible();
    const openAppButton = page.getByRole('button', { name: 'Open app' });
    await openAppButton.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('http://localhost:3000/app/context-packer/workspace');

    await page.goto('http://localhost:3000/?docs=context-packer-tour');
    await expect(page).toHaveURL('http://localhost:3000/docs/context-packer-tour');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Documentation: context-packer-tour' }),
    ).toBeVisible();

    await page.goto('http://localhost:3000/join/invite-token-1');
    await expect(page.getByRole('heading', { level: 1, name: 'Join organization' })).toBeVisible();

    await page.goto('http://localhost:3000/share/share-token-1');
    await expect(page.getByRole('heading', { level: 1, name: 'Shared item' })).toBeVisible();

    await page.goto('http://localhost:3000/app/unknown-tool/workspace');
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  });

  test('0 serious or critical axe violations on / in both themes and screenshots at 375px and 1280px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Get your code ready for AI, without leaking secrets.',
    );

    // Select Dusk (dark) via ThemeMenu
    await page.getByRole('button', { name: 'Theme' }).click();
    await page.getByRole('button', { name: 'Dusk (dark)' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'cairn-dusk');

    const duskAxe = await new AxeBuilder({ page }).analyze();
    const duskSerious = duskAxe.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(duskSerious).toEqual([]);

    await page.screenshot({ path: 'test-results/card-0.4-home-1280.png', fullPage: true });

    // Select Daylight (light) via ThemeMenu
    await page.getByRole('button', { name: 'Theme' }).click();
    await page.getByRole('button', { name: 'Daylight (light)' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'cairn-daylight');

    const daylightAxe = await new AxeBuilder({ page }).analyze();
    const daylightSerious = daylightAxe.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(daylightSerious).toEqual([]);

    // Resize to 375px mobile viewport, verify mobile menu button and no horizontal overflow, and capture screenshot
    await page.setViewportSize({ width: 375, height: 812 });
    const mobileMenuBtn = page.getByRole('button', { name: 'Toggle navigation menu' });
    await expect(mobileMenuBtn).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);

    await page.screenshot({ path: 'test-results/card-0.4-home-375.png', fullPage: true });

    await mobileMenuBtn.click();
    const mobileNav = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(mobileNav).toBeVisible();
    await mobileNav.getByRole('link', { name: 'Vault' }).click();
    await expect(page).toHaveURL('http://localhost:3000/vault');
    await expect(page.getByRole('heading', { level: 1, name: 'Vault' })).toBeVisible();
  });
});
