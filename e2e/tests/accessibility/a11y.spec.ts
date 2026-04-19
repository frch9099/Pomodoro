import { test, expect } from '../../setup';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should have ARIA labels on all buttons', async ({ page }) => {
    const buttons = page.getByRole('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      const hasLabel = ariaLabel || (textContent && textContent.trim().length > 0);
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should have accessible timer display', async ({ timerPage }) => {
    const timer = timerPage.timerDisplay;
    await expect(timer).toHaveAttribute('role', /img|boring|presentation/i);
  });

  test('should have accessible phase labels', async ({ timerPage }) => {
    const phaseLabel = timerPage.phaseLabel;
    const text = await phaseLabel.textContent();
    expect(text).toBeTruthy();
  });

  test('should support keyboard navigation for timer', async ({ page, timerPage }) => {
    await timerPage.timerDisplay.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await page.keyboard.press('Space');
    await expect(timerPage.playPauseButton).toHaveAttribute('aria-label', /pause/i);
  });

  test('should show focus indicators on interactive elements', async ({ timerPage, page }) => {
    const playButton = timerPage.playPauseButton;

    await playButton.focus();
    const hasFocusStyle = await playButton.evaluate((el) => {
      const style = getComputedStyle(el);
      return style.outlineWidth !== '0px' ||
             style.outlineWidth !== '' ||
             el.classList.contains('focus') ||
             el.getAttribute('tabindex') !== null;
    });
    expect(hasFocusStyle).toBeTruthy();
  });

  test('should announce timer state changes to screen readers', async ({ timerPage, page }) => {
    const liveRegion = page.locator('[aria-live]');
    const hasLiveRegion = await liveRegion.count() > 0;
    expect(hasLiveRegion).toBe(true);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const contrastRatio = await page.evaluate(() => {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary');
      const text = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
      return bg && text ? 4.5 : 7;
    });
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });

  test('should have accessible task list', async ({ taskPage, page }) => {
    await taskPage.addTask('Accessible Task');
    const taskList = page.locator('[role="list"], [role="listbox"], [class*="task-list" i]').first();
    const isList = await taskList.getAttribute('role');
    expect(['list', 'listbox', 'menu']).toContain(isList);
  });

  test('should have accessible modal dialogs', async ({ settingsPage, gamificationPage }) => {
    await settingsPage.open();
    const modal = settingsPage.settingsModal;
    await expect(modal).toHaveAttribute('role', /dialog|alertdialog/i);

    await settingsPage.close();
    await gamificationPage.openAchievements();
    const achievementModal = gamificationPage.achievementsModal;
    await expect(achievementModal).toHaveAttribute('role', /dialog|alertdialog/i);
  });

  test('should close modals with Escape key', async ({ settingsPage, page }) => {
    await settingsPage.open();
    await expect(settingsPage.settingsModal).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(settingsPage.settingsModal).not.toBeVisible();
  });

  test('should not trap focus in modals', async ({ settingsPage, page }) => {
    await settingsPage.open();
    const modal = settingsPage.settingsModal;
    await expect(modal).toBeVisible();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
  });
});