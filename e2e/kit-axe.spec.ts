import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Card 0.3a /__kit axe accessibility in both themes', () => {
  for (const theme of ['cairn-dusk', 'cairn-daylight'] as const) {
    test(`0 serious or critical axe violations on /__kit in ${theme}`, async ({ page }) => {
      await page.goto(`http://localhost:3000/__kit?theme=${theme}`);

      const kitRoot = page.locator('#kit-root');
      await expect(kitRoot).toHaveAttribute('data-theme', theme);
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Form Components Kit');

      const results = await new AxeBuilder({ page }).include('#kit-root').analyze();
      const seriousOrCritical = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );

      expect(seriousOrCritical).toEqual([]);
    });
  }
});
