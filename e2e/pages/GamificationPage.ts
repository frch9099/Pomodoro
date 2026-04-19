import { Page, Locator } from '@playwright/test';

export class GamificationPage {
  readonly page: Page;
  readonly treeVisual: Locator;
  readonly streakDisplay: Locator;
  readonly forestView: Locator;
  readonly plantedTrees: Locator;
  readonly achievementsButton: Locator;
  readonly achievementsModal: Locator;
  readonly achievementToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.treeVisual = page.locator('.w-32.h-32 svg').first();
    this.streakDisplay = page.locator('[class*="text-gray-400"]').first();
    this.forestView = page.locator('[class*="grid grid-cols-"]').first();
    this.plantedTrees = page.locator('[class*="grid grid-cols-"] > div');
    this.achievementsButton = page.locator('button[aria-label="View achievements"]');
    this.achievementsModal = page.locator('h3:has-text("Achievements")').locator('..');
    this.achievementToast = page.locator('.fixed.top-4').filter({ hasText: /Achievement|Unlocked/ });
  }

  async getTreeGrowthStage(): Promise<string> {
    const classes = await this.treeVisual.getAttribute('class');
    if (classes?.includes('seed')) return 'seed';
    if (classes?.includes('sprout')) return 'sprout';
    if (classes?.includes('sapling')) return 'sapling';
    if (classes?.includes('mature')) return 'mature';
    return 'unknown';
  }

  async getCurrentStreak(): Promise<number> {
    const streakNumber = this.page.locator('span').filter({ hasText: /^\d+$/ }).first();
    const text = await streakNumber.textContent();
    return text ? parseInt(text, 10) : 0;
  }

  async isStreakActive(): Promise<boolean> {
    const streakText = this.page.locator('text="day streak"');
    const count = await streakText.count();
    return count > 0;
  }

  async getPlantedTreeCount(): Promise<number> {
    const treesText = this.page.locator('text="trees planted"');
    const text = await treesText.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async openForest(): Promise<void> {
    await this.forestView.waitFor({ state: 'visible' });
  }

  async openAchievements(): Promise<void> {
    await this.achievementsButton.click();
  }

  async getUnlockedAchievements(): Promise<string[]> {
    const unlocked = this.page.locator('[class*="bg-amber-100"], [class*="bg-amber-900"]');
    const count = await unlocked.count();
    const achievements = [];
    for (let i = 0; i < count; i++) {
      const text = await unlocked.nth(i).textContent();
      if (text) achievements.push(text);
    }
    return achievements;
  }

  async waitForAchievementToast(timeout = 5000): Promise<boolean> {
    try {
      await this.achievementToast.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async dismissAchievementToast(): Promise<void> {
    const closeButton = this.page.locator('.fixed.top-4 button').first();
    await closeButton.click();
  }

  async getGamificationDataFromStorage(): Promise<Record<string, unknown>> {
    return this.page.evaluate(() => {
      const data = localStorage.getItem('pomodoro_stats');
      return data ? JSON.parse(data) : {};
    });
  }
}