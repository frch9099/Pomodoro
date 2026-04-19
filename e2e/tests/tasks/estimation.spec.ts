import { test, expect } from '../../setup';

test.describe('Task Pomodoro Estimation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should show estimated pomodoros on task', async ({ taskPage, page }) => {
    await taskPage.addTaskButton.click();
    await taskPage.taskInput.fill('Estimated Task');

    const addForm = taskPage.taskInput.locator('..').locator('..');
    const incrementButton = addForm.locator('button:has-text("+")');
    for (let i = 0; i < 4; i++) {
      await incrementButton.click();
    }

    await taskPage.taskInput.press('Enter');

    const task = taskPage.getTaskByTitle('Estimated Task');
    const dots = task.locator('span.inline-block.w-2.h-2.rounded-full');
    await expect(dots).toHaveCount(5);
  });

  test('should link task to timer session', async ({ taskPage, timerPage, page }) => {
    await taskPage.addTask('Active Task');
    const task = taskPage.getTaskByTitle('Active Task');
    await task.click();

    await timerPage.clickPlay();
    await page.waitForTimeout(2000);
    await timerPage.clickPause();

    const dots = task.locator('span.inline-block.w-2.h-2.rounded-full');
    await expect(dots.first()).toBeVisible();
  });

  test('should increment completed pomodoros after session', async ({ taskPage, timerPage, settingsPage, page }) => {
    await taskPage.addTask('Progress Task');
    await settingsPage.open();
    await settingsPage.setWorkDuration(1);
    await settingsPage.close();

    await timerPage.clickPlay();
    await page.waitForTimeout(1000);
    await timerPage.clickPause();
  });

  test('should show pomodoro progress indicators', async ({ taskPage, page }) => {
    await taskPage.addTask('Indicators Task');
    const task = taskPage.getTaskByTitle('Indicators Task');
    await expect(task).toBeVisible();

    const indicators = task.locator('span.inline-block.w-2.h-2.rounded-full');
    await expect(indicators).toHaveCount(1);
  });
});