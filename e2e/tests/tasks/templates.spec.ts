import { test, expect } from '../../setup';

test.describe('Task Templates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should save task as template', async ({ taskPage }) => {
    await taskPage.addTask('Template Source Task');
    await taskPage.saveAsTemplate('Template Source Task');
    await taskPage.openTemplates();

    await expect(taskPage.getTemplateItem('Template Source Task')).toBeVisible();
  });

  test('should create task from template', async ({ taskPage }) => {
    await taskPage.addTask('Template Task');
    await taskPage.saveAsTemplate('Template Task');
    await taskPage.createFromTemplate('Template Task');

    await expect(taskPage.getTaskByTitle('Template Task')).toBeVisible();
  });

  test('should delete template', async ({ taskPage }) => {
    await taskPage.addTask('Deletable Template');
    await taskPage.saveAsTemplate('Deletable Template');
    await taskPage.deleteTemplate('Deletable Template');

    await expect(taskPage.getTemplateItem('Deletable Template')).not.toBeVisible();
  });

  test('should persist templates in localStorage', async ({ taskPage, page }) => {
    await taskPage.addTask('Persisted Template');
    await taskPage.saveAsTemplate('Persisted Template');
    await page.reload();
    await taskPage.openTemplates();

    await expect(taskPage.getTemplateItem('Persisted Template')).toBeVisible();
  });

  test('should create multiple tasks from same template', async ({ taskPage }) => {
    await taskPage.addTask('Multi Use Template');
    await taskPage.saveAsTemplate('Multi Use Template');

    await taskPage.createFromTemplate('Multi Use Template');
    await taskPage.addTaskButton.click();
    await taskPage.openTemplates();
    await taskPage.createFromTemplate('Multi Use Template');

    const count = await taskPage.getTaskCount();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});