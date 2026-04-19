import { test, expect } from '../../setup';

test.describe('Timer Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Space should toggle play/pause', async ({ timerPage, page }) => {
    await expect(timerPage.playPauseButton).toHaveAttribute('aria-label', /start/i);

    await page.keyboard.press('Space');
    await expect(timerPage.playPauseButton).toHaveAttribute('aria-label', /pause/i);

    await page.keyboard.press('Space');
    await expect(timerPage.playPauseButton).toHaveAttribute('aria-label', /start/i);
  });

  test('R should reset timer', async ({ timerPage, page }) => {
    await timerPage.clickPlay();
    await page.waitForTimeout(2000);

    await page.keyboard.press('r');
    const time = await timerPage.getTimeDisplay();
    expect(time).toBe('25:00');
  });

  test('S should skip to next phase', async ({ timerPage, page }) => {
    const initialPhase = await timerPage.getPhase();

    await page.keyboard.press('s');
    const newPhase = await timerPage.getPhase();
    expect(newPhase).not.toBe(initialPhase);
  });

  test('shortcuts should work when timer is focused', async ({ timerPage, page }) => {
    await timerPage.timerDisplay.click();
    await page.keyboard.press('Space');
    await expect(timerPage.playPauseButton).toHaveAttribute('aria-label', /pause/i);
  });

  test('shortcuts should not trigger when typing in input', async ({ timerPage, taskPage, page }) => {
    await timerPage.clickPlay();
    await taskPage.addTaskButton.click();
    await taskPage.taskInput.fill('test task');

    await page.keyboard.press('Space');
    await expect(timerPage.playPauseButton).toHaveAttribute('aria-label', /pause/i);

    await taskPage.taskInput.press('Escape');
  });
});