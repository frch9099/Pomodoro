import { Page, Locator } from '@playwright/test';

export class TaskPage {
  readonly page: Page;
  readonly addTaskButton: Locator;
  readonly taskInput: Locator;
  readonly templateButton: Locator;
  readonly emptyState: Locator;

  private readonly taskListContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskListContainer = page.locator('h2:has-text("Tasks")').first().locator('..').locator('..');
    this.addTaskButton = this.taskListContainer.locator('button[title="Add task"]');
    this.taskInput = this.taskListContainer.locator('input[placeholder="Task title..."]');
    this.templateButton = this.taskListContainer.locator('button[title="Templates"]');
    this.emptyState = this.taskListContainer.locator('p:has-text("No tasks yet")');
  }

  async addTask(title: string, estimatedPomodoros = 1): Promise<void> {
    await this.addTaskButton.click();
    await this.taskInput.fill(title);
    await this.taskInput.press('Enter');
  }

  async addTaskWithEstimatedPomodoros(title: string, pomodoros: number): Promise<void> {
    await this.addTaskButton.click();
    await this.taskInput.fill(title);
    for (let i = 1; i < pomodoros; i++) {
      await this.taskInput.press('Tab');
    }
    await this.taskInput.press('Enter');
  }

  async getTaskCount(): Promise<number> {
    return this.taskListContainer.locator('[class*="group flex items-center gap-3"]').count();
  }

  private getTaskItem(title: string): Locator {
    return this.taskListContainer.locator(`[class*="group flex items-center gap-3"]:has-text("${title}")`).first();
  }

  getTaskByTitle(title: string): Locator {
    return this.getTaskItem(title);
  }

  async completeTask(title: string): Promise<void> {
    const task = this.getTaskItem(title);
    const checkbox = task.locator('button').first();
    await checkbox.click();
  }

  async deleteTask(title: string): Promise<void> {
    const task = this.getTaskItem(title);
    await task.hover();
    const deleteButton = task.locator('button[title="Delete task"]');
    await deleteButton.click();
  }

  async saveAsTemplate(title: string): Promise<void> {
    const task = this.getTaskItem(title);
    await task.hover();
    const saveButton = task.locator('button[title="Save as template"]');
    await saveButton.click();
  }

  async openTemplates(): Promise<void> {
    await this.templateButton.click();
  }

  private getTemplatePanel(): Locator {
    return this.taskListContainer.locator('text="Templates"').locator('..').locator('..').locator('.space-y-2');
  }

  getTemplateItem(templateName: string): Locator {
    return this.getTemplatePanel().locator(`text="${templateName}"`).first();
  }

  async deleteTemplate(templateName: string): Promise<void> {
    await this.openTemplates();
    const template = this.getTemplateItem(templateName);
    const parent = template.locator('..').locator('..');
    const deleteBtn = parent.locator('button[title="Delete template"]');
    await deleteBtn.click();
  }

  async createFromTemplate(templateName: string): Promise<void> {
    await this.openTemplates();
    const template = this.getTemplateItem(templateName);
    const parent = template.locator('..').locator('..');
    const useBtn = parent.locator('button[title="Use template"]');
    await useBtn.click();
  }

  async getTemplateCount(): Promise<number> {
    return this.getTemplatePanel().count();
  }

  async expandTask(title: string): Promise<void> {
    const task = this.getTaskItem(title);
    await task.click();
  }
}