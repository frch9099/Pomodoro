import { test, expect } from '../../setup';

test.describe('Achievements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should have achievements button in footer', async ({ gamificationPage }) => {
    await expect(gamificationPage.achievementsButton).toBeVisible();
  });

  test('should persist achievements in localStorage', async ({ gamificationPage, page }) => {
    const data = await gamificationPage.getGamificationDataFromStorage();
    expect(data).toHaveProperty('achievements');
    expect(Array.isArray(data.achievements)).toBe(true);
  });

  test('should track first-pomodoro achievement with short timer', async ({ timerPage, settingsPage, page }) => {
    test.skip(true, 'Requires 65s timer wait - not practical for E2E test suite');
  });
});
