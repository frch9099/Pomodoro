import { Page, Locator } from '@playwright/test';

export class StatsPage {
  readonly page: Page;
  readonly statsContent: Locator;
  readonly todayTab: Locator;
  readonly weekTab: Locator;
  readonly monthTab: Locator;
  readonly allTimeTab: Locator;
  readonly totalPomodoros: Locator;
  readonly currentStreak: Locator;
  readonly bestStreak: Locator;
  readonly todayProgress: Locator;

  constructor(page: Page) {
    this.page = page;
    this.statsContent = page.locator('.rounded-2xl.shadow-md.p-4.mt-8').first();
    this.todayTab = this.statsContent.locator('button', { hasText: /today/i }).first();
    this.weekTab = this.statsContent.locator('button', { hasText: /week/i }).first();
    this.monthTab = this.statsContent.locator('button', { hasText: /month/i }).first();
    this.allTimeTab = this.statsContent.locator('button', { hasText: /all time/i }).first();
    this.totalPomodoros = page.locator('text=/\\d+.*pomodoros/i').first();
    this.currentStreak = page.locator('text=/\\d+.*day.*streak/i').first();
    this.bestStreak = page.locator('text=/best.*\\d+/i').first();
    this.todayProgress = page.locator('[class*="progress" i], [class*="circle" i]').first();
  }

  async open(): Promise<void> {
    // Stats is not a modal - it's an inline component always visible in stats view
  }

  async switchToToday(): Promise<void> {
    await this.todayTab.click();
  }

  async switchToWeek(): Promise<void> {
    await this.weekTab.click();
  }

  async switchToMonth(): Promise<void> {
    await this.monthTab.click();
  }

  async switchToAllTime(): Promise<void> {
    await this.allTimeTab.click();
  }

  async getTotalPomodoros(): Promise<number> {
    const text = await this.totalPomodoros.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getCurrentStreak(): Promise<number> {
    const text = await this.currentStreak.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getBestStreak(): Promise<number> {
    const text = await this.bestStreak.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getStatsFromStorage(): Promise<Record<string, unknown>> {
    return this.page.evaluate(() => {
      const data = localStorage.getItem('pomodoro_stats');
      return data ? JSON.parse(data) : {};
    });
  }
}