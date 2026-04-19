import { test, expect } from '../../setup';

test.describe('Settings Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should toggle dark mode', async ({ settingsPage, page }) => {
    await settingsPage.open();
    await settingsPage.toggleDarkMode();
    await settingsPage.close();

    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should persist dark mode after reload', async ({ settingsPage, page }) => {
    await settingsPage.open();
    await settingsPage.toggleDarkMode();
    await settingsPage.close();
    await page.reload();

    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should set daily goal', async ({ settingsPage, page }) => {
    await settingsPage.open();
    await settingsPage.setDailyGoal(12);
    await settingsPage.close();

    const settings = await settingsPage.getSettingsFromStorage();
    expect(settings.dailyGoal).toBe(12);
  });

  test('should toggle auto-start breaks', async ({ settingsPage, page }) => {
    await settingsPage.open();
    await settingsPage.toggleAutoStartBreaks();
    await settingsPage.close();

    const settings = await settingsPage.getSettingsFromStorage();
    expect(settings.autoStartBreaks).toBe(true);
  });

  test('should toggle auto-start work', async ({ settingsPage, page }) => {
    await settingsPage.open();
    await settingsPage.toggleAutoStartWork();
    await settingsPage.close();

    const settings = await settingsPage.getSettingsFromStorage();
    expect(settings.autoStartWork).toBe(true);
  });

  test('should toggle sound settings', async ({ settingsPage, page }) => {
    await settingsPage.open();
    await settingsPage.toggleSound();
    await settingsPage.close();

    const settings = await settingsPage.getSettingsFromStorage();
    expect(settings.soundEnabled).toBe(false);
  });
});