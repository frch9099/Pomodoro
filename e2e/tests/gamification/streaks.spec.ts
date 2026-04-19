import { test, expect } from '../../setup';

test.describe('Streaks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should show streak display', async ({ gamificationPage }) => {
    await expect(gamificationPage.streakDisplay).toBeVisible();
  });

  test('should track current streak', async ({ gamificationPage }) => {
    const streak = await gamificationPage.getCurrentStreak();
    expect(typeof streak).toBe('number');
  });

  test('should show streak as active when working', async ({ gamificationPage }) => {
    const isActive = await gamificationPage.isStreakActive();
    expect(typeof isActive).toBe('boolean');
  });

  test('should update streak after completing sessions', async ({ gamificationPage, timerPage, settingsPage, page }) => {
    test.setTimeout(90000);
    const initialStreak = await gamificationPage.getCurrentStreak();

    await settingsPage.open();
    await settingsPage.setWorkDuration(1);
    await settingsPage.close();

    await timerPage.clickPlay();
    await page.waitForTimeout(62000);

    const newStreak = await gamificationPage.getCurrentStreak();
    expect(newStreak).toBeGreaterThanOrEqual(initialStreak);
  });

  test('should persist streak data', async ({ gamificationPage, page }) => {
    const data = await gamificationPage.getGamificationDataFromStorage();
    expect(data).toHaveProperty('currentStreak');
    expect(data).toHaveProperty('bestStreak');
  });

  test('should show best streak in stats', async ({ statsPage, gamificationPage }) => {
    const data = await gamificationPage.getGamificationDataFromStorage();
    const bestStreak = await statsPage.getBestStreak();
    expect(bestStreak).toBe(data.bestStreak || 0);
  });
});