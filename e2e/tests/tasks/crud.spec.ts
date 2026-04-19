import { test, expect } from '../../setup';

test.describe('Task CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should add a new task', async ({ taskPage }) => {
    const initialCount = await taskPage.getTaskCount();
    await taskPage.addTask('Test Task');
    const newCount = await taskPage.getTaskCount();
    expect(newCount).toBe(initialCount + 1);
    await expect(taskPage.getTaskByTitle('Test Task')).toBeVisible();
  });

  test('should edit task title', async ({ taskPage, page }) => {
    await taskPage.addTask('Original Title');
    const task = taskPage.getTaskByTitle('Original Title');
    await task.click();

    const editInput = page.locator('input[type="text"]').last();
    await editInput.fill('Edited Title');
    await editInput.press('Enter');

    await expect(taskPage.getTaskByTitle('Edited Title')).toBeVisible();
  });

  test('should delete a task', async ({ taskPage, page }) => {
    await taskPage.addTask('Task to Delete');
    const initialCount = await taskPage.getTaskCount();

    await taskPage.deleteTask('Task to Delete');
    await page.waitForTimeout(500);

    const newCount = await taskPage.getTaskCount();
    expect(newCount).toBe(initialCount - 1);
  });

  test('should complete a task', async ({ taskPage }) => {
    await taskPage.addTask('Completed Task');
    await taskPage.completeTask('Completed Task');

    const task = taskPage.getTaskByTitle('Completed Task');
    await expect(task).toHaveClass(/opacity-70/);
  });

  test('should add task with different estimated pomodoros', async ({ taskPage }) => {
    await taskPage.addTaskWithEstimatedPomodoros('Big Task', 5);
    await expect(taskPage.getTaskByTitle('Big Task')).toBeVisible();
  });

  test('should persist tasks after page reload', async ({ taskPage, page }) => {
    await taskPage.addTask('Persisted Task');
    await page.reload();

    await expect(taskPage.getTaskByTitle('Persisted Task')).toBeVisible();
  });

  test('should expand task to show details', async ({ taskPage, page }) => {
    await taskPage.addTask('Expandable Task');
    await taskPage.expandTask('Expandable Task');
    await page.waitForTimeout(300);
  });

  test('should show empty state when no tasks', async ({ taskPage, page }) => {
    await page.evaluate(() => localStorage.setItem('pomodoro_tasks', '[]'));
    await page.reload();

    await expect(taskPage.emptyState).toBeVisible();
  });
});