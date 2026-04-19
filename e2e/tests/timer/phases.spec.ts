import { test, expect } from '../../setup';

test.describe('Timer Phase Transitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should transition from work to short break', async ({ timerPage, settingsPage }) => {
    test.setTimeout(120000);
    await settingsPage.open();
    await settingsPage.setWorkDuration(1);
    await settingsPage.close();

    await timerPage.clickPlay();
    await timerPage.page.waitForTimeout(75000);

    const phase = await timerPage.getPhase();
    expect(['shortBreak', 'longBreak']).toContain(phase);
  });

  test('should skip to next phase', async ({ timerPage }) => {
    const initialPhase = await timerPage.getPhase();
    await timerPage.clickSkip();
    const newPhase = await timerPage.getPhase();
    expect(newPhase).not.toBe(initialPhase);
  });

  test('should show session 1 of 4 initially', async ({ timerPage }) => {
    const count = await timerPage.getSessionCount();
    expect(count).toBe(1);
  });

  test('should increment session counter after completing work', async ({ timerPage, settingsPage }) => {
    test.setTimeout(120000);
    await settingsPage.open();
    await settingsPage.setWorkDuration(1);
    await settingsPage.close();

    await timerPage.clickPlay();
    await timerPage.page.waitForTimeout(72000);
    await timerPage.clickReset();

    const count = await timerPage.getSessionCount();
    expect(count).toBe(2);
  });

  test('should show long break after 4 work sessions', async ({ timerPage, settingsPage }) => {
    test.setTimeout(300000);
    await settingsPage.open();
    await settingsPage.setWorkDuration(1);
    await settingsPage.setShortBreakDuration(1);
    await settingsPage.close();

    for (let i = 0; i < 4; i++) {
      await timerPage.clickPlay();
      await timerPage.page.waitForTimeout(72000);
      if (i < 3) {
        await timerPage.clickSkip();
      }
    }

    const phase = await timerPage.getPhase();
    expect(phase).toBe('longBreak');
  });

});
