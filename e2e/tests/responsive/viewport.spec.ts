import { test, expect } from '../../setup';

test.describe('Responsive Design', () => {
  test('should show mobile layout on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const mobileTabs = page.locator('div.md\\:hidden button');
    await expect(mobileTabs.first()).toBeVisible();
  });

  test('should show task/tree tabs on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const mobileTabs = page.locator('div.md\\:hidden button');
    const tasksTab = mobileTabs.filter({ hasText: /^Tasks$/ });
    const treeTab = mobileTabs.filter({ hasText: /^Tree$/ });

    await expect(tasksTab).toBeVisible();
    await expect(treeTab).toBeVisible();
  });

  test('should hide task/tree tabs on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');

    const mobileTabs = page.locator('div.md\\:hidden button');
    const tasksTab = mobileTabs.filter({ hasText: /^Tasks$/ });
    const treeTab = mobileTabs.filter({ hasText: /^Tree$/ });

    await expect(tasksTab).not.toBeVisible();
    await expect(treeTab).not.toBeVisible();
  });

  test('should show two-column layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');

    const grid = page.locator('.grid.grid-cols-2').first();
    const gamificationPanel = grid.locator('text=Current Tree').first();
    const taskList = grid.locator('text=Tasks').first();

    await expect(gamificationPanel).toBeVisible();
    await expect(taskList).toBeVisible();
  });

  test('should have no horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const body = page.locator('body');
    const overflow = await body.evaluate((el) => getComputedStyle(el).overflowX);
    expect(overflow).toBe('hidden');
  });

  test('should scale timer for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const timer = page.locator('svg').first();
    const box = await timer.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(320);
  });

  test('should show full forest view on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const forestView = page.locator('[class*="forest" i]').first();
    await expect(forestView).toBeVisible();
  });

  test('should be usable on tablet portrait', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const timer = page.locator('text=/\\d{2}:\\d{2}/').first();
    await expect(timer).toBeVisible();

    const playButton = page.getByRole('button', { name: /start/i });
    await expect(playButton).toBeVisible();
  });

  test('should be usable on tablet landscape', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');

    const timer = page.locator('text=/\\d{2}:\\d{2}/').first();
    await expect(timer).toBeVisible();

    const playButton = page.getByRole('button', { name: /start/i });
    await expect(playButton).toBeVisible();
  });
});