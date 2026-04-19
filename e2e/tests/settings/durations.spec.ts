import { test, expect } from '../../setup';

test.describe('Settings Durations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should change work duration', async ({ settingsPage, timerPage }) => {
    await settingsPage.open();
    await settingsPage.setWorkDuration(30);
    await settingsPage.close();

    const time = await timerPage.getTimeDisplay();
    expect(time).toBe('30:00');
  });

  test('should change short break duration', async ({ settingsPage, timerPage }) => {
    await settingsPage.open();
    await settingsPage.setShortBreakDuration(10);
    await settingsPage.close();

    await timerPage.clickSkip();
    const time = await timerPage.getTimeDisplay();
    expect(time).toBe('10:00');
  });

  test('should change long break duration', async ({ settingsPage, timerPage }) => {
    await settingsPage.open();
    await settingsPage.setLongBreakDuration(20);
    await settingsPage.close();

    for (let i = 0; i < 4; i++) {
      await timerPage.clickSkip();
    }
    await timerPage.page.waitForTimeout(500);

    const phase = await timerPage.getPhase();
    if (phase === 'longBreak') {
      const time = await timerPage.getTimeDisplay();
      expect(time).toBe('20:00');
    }
  });

  test('should persist duration changes after reload', async ({ settingsPage, timerPage, page }) => {
    await settingsPage.open();
    await settingsPage.setWorkDuration(45);
    await settingsPage.close();
    await page.reload();

    const time = await timerPage.getTimeDisplay();
    expect(time).toBe('45:00');
  });
});