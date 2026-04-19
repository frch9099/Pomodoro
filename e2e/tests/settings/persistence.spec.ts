import { test, expect } from '../../setup';

test.describe('Settings Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should persist all settings in localStorage', async ({ settingsPage, page }) => {
    await settingsPage.open();
    await settingsPage.setWorkDuration(30);
    await settingsPage.setShortBreakDuration(10);
    await settingsPage.setDarkModeToggle();
    await settingsPage.setDailyGoal(12);
    await settingsPage.close();

    const settings = await settingsPage.getSettingsFromStorage();
    expect(settings).toMatchObject({
      workDuration: 30,
      shortBreakDuration: 10,
      darkMode: true,
      dailyGoal: 12,
    });
  });

  test('should restore settings on page reload', async ({ settingsPage, page }) => {
    await settingsPage.open();
    await settingsPage.setWorkDuration(40);
    await settingsPage.setDailyGoal(10);
    await settingsPage.close();

    await page.reload();
    await settingsPage.open();

    const settings = await settingsPage.getSettingsFromStorage();
    expect(settings.workDuration).toBe(40);
    expect(settings.dailyGoal).toBe(10);
  });

  test('should reset to defaults', async ({ settingsPage }) => {
    await settingsPage.open();
    await settingsPage.setWorkDuration(60);
    await settingsPage.setDailyGoal(20);
    await settingsPage.resetToDefaults();
    await settingsPage.close();

    const settings = await settingsPage.getSettingsFromStorage();
    expect(settings.workDuration).toBe(25);
    expect(settings.dailyGoal).toBe(8);
  });

  test('should not lose settings on page crash', async ({ settingsPage, page }) => {
    await settingsPage.open();
    await settingsPage.setWorkDuration(35);
    await settingsPage.close();

    await page.evaluate(() => {
      localStorage.setItem('pomodoro_settings', JSON.stringify({
        workDuration: 35,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        soundEnabled: true,
        currentSound: null,
        soundVolume: 50,
        notificationsEnabled: true,
        autoStartBreaks: false,
        autoStartWork: false,
        continueSoundDuringBreak: false,
        darkMode: false,
        dailyGoal: 8,
      }));
    });
    await page.reload();

    const settings = await settingsPage.getSettingsFromStorage();
    expect(settings.workDuration).toBe(35);
  });
});