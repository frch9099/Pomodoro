import { test, expect } from '../../setup';

test.describe('Timer Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should start timer and show running state', async ({ timerPage }) => {
    await expect(timerPage.timerDisplay).toBeVisible();
    const initialTime = await timerPage.getTimeDisplay();
    expect(initialTime).toMatch(/\d{2}:\d{2}/);

    await timerPage.clickPlay();

    await expect(timerPage.playPauseButton).toHaveAttribute('aria-label', /pause/i);
  });

  test('should pause timer and show paused state', async ({ timerPage }) => {
    await timerPage.clickPlay();
    await expect(timerPage.playPauseButton).toHaveAttribute('aria-label', /pause/i);

    await timerPage.clickPause();
    await expect(timerPage.playPauseButton).toHaveAttribute('aria-label', /start/i);
  });

  test('should resume timer from paused state', async ({ timerPage }) => {
    await timerPage.clickPlay();
    await timerPage.clickPause();
    await expect(timerPage.playPauseButton).toHaveAttribute('aria-label', /start/i);

    await timerPage.clickPlay();
    await expect(timerPage.playPauseButton).toHaveAttribute('aria-label', /pause/i);
  });

  test('should reset timer to initial duration', async ({ timerPage }) => {
    await timerPage.clickPlay();
    await timerPage.page.waitForTimeout(2000);
    await timerPage.clickReset();

    const timeAfterReset = await timerPage.getTimeDisplay();
    expect(timeAfterReset).toBe('25:00');
  });

  test('should update tab title during countdown', async ({ page, timerPage }) => {
    await timerPage.clickPlay();
    const title = await page.title();
    expect(title).toMatch(/🍅\s*\d{2}:\d{2}/);
  });

  test('should show correct phase label during work', async ({ timerPage }) => {
    const phase = await timerPage.getPhase();
    expect(phase).toBe('work');
    await expect(timerPage.phaseLabel).toHaveText('Focus Time');
  });

  test('should show session counter', async ({ timerPage }) => {
    await expect(timerPage.sessionIndicator).toBeVisible();
    const count = await timerPage.getSessionCount();
    expect(count).toBe(1);
  });

  test('should display circular progress ring', async ({ timerPage }) => {
    await expect(timerPage.progressRing).toBeVisible();
    await timerPage.clickPlay();
    await timerPage.page.waitForTimeout(1000);
  });
});