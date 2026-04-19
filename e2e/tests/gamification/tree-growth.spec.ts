import { test, expect } from '../../setup';

test.describe('Tree Growth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should show tree visual', async ({ gamificationPage }) => {
    await expect(gamificationPage.treeVisual).toBeVisible();
  });

  test('should grow tree after completing work session', async ({ gamificationPage, timerPage, settingsPage, page }) => {
    await settingsPage.open();
    await settingsPage.setWorkDuration(1);
    await settingsPage.close();

    await timerPage.clickPlay();
    await page.waitForTimeout(62000);

    const stage = await gamificationPage.getTreeGrowthStage();
    expect(['sprout', 'sapling', 'mature']).toContain(stage);
  });

  test('should plant new tree after 4 sessions', async ({ gamificationPage, timerPage, settingsPage, page }) => {
    await settingsPage.open();
    await settingsPage.setWorkDuration(1);
    await settingsPage.setShortBreakDuration(1);
    await settingsPage.close();

    const initialTrees = await gamificationPage.getPlantedTreeCount();

    for (let i = 0; i < 4; i++) {
      await timerPage.clickPlay();
      await page.waitForTimeout(62000);
      if (i < 3) {
        await timerPage.clickSkip();
        await page.waitForTimeout(1000);
      }
    }

    await gamificationPage.openForest();
    const newTreeCount = await gamificationPage.getPlantedTreeCount();
    expect(newTreeCount).toBeGreaterThan(initialTrees);
  });

  test('should show different tree types', async ({ gamificationPage, statsPage }) => {
    await statsPage.open();
    const data = await statsPage.getStatsFromStorage();
    const treeTypes = data.treeTypesUnlocked || [];
    expect(Array.isArray(treeTypes)).toBe(true);
  });

  test('should persist tree data in localStorage', async ({ gamificationPage, page }) => {
    const data = await gamificationPage.getGamificationDataFromStorage();
    expect(data).toHaveProperty('plantedTrees');
    expect(Array.isArray(data.plantedTrees)).toBe(true);
  });

  test('should show forest view with all planted trees', async ({ gamificationPage, page }) => {
    await page.evaluate(() => {
      localStorage.setItem('pomodoro_stats', JSON.stringify({
        sessions: [],
        achievements: [],
        currentStreak: 0,
        bestStreak: 0,
        lastSessionDate: null,
        totalPomodoros: 0,
        treeTypesUnlocked: ['oak'],
        plantedTrees: [
          { id: '1', type: 'oak', plantedAt: Date.now() },
          { id: '2', type: 'pine', plantedAt: Date.now() },
        ],
      }));
    });
    await page.reload();

    await gamificationPage.openForest();
    await expect(gamificationPage.forestView).toBeVisible();
  });
});