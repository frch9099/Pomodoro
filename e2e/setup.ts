import { test as base } from '@playwright/test';
import type { Page } from 'playwright';
import { TimerPage } from './pages/TimerPage';
import { TaskPage } from './pages/TaskPage';
import { SettingsPage } from './pages/SettingsPage';
import { StatsPage } from './pages/StatsPage';
import { GamificationPage } from './pages/GamificationPage';

type CustomFixtures = {
  timerPage: TimerPage;
  taskPage: TaskPage;
  settingsPage: SettingsPage;
  statsPage: StatsPage;
  gamificationPage: GamificationPage;
  clearLocalStorage: () => Promise<void>;
};

export const test = base.extend<CustomFixtures>({
  timerPage: async ({ page }, use) => {
    await use(new TimerPage(page));
  },
  taskPage: async ({ page }, use) => {
    await use(new TaskPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  statsPage: async ({ page }, use) => {
    await use(new StatsPage(page));
  },
  gamificationPage: async ({ page }, use) => {
    await use(new GamificationPage(page));
  },
  clearLocalStorage: async ({ page }, use) => {
    const clear = async () => {
      await page.evaluate(() => {
        localStorage.clear();
      });
    };
    await use(clear);
  },
});

export { expect } from '@playwright/test';

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  soundEnabled: boolean;
  currentSound: string | null;
  soundVolume: number;
  notificationsEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  continueSoundDuringBreak: boolean;
  darkMode: boolean;
  dailyGoal: number;
}

export interface Task {
  id: string;
  title: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  isTemplate: boolean;
  templateId?: string;
  createdAt: number;
  completedAt?: number;
  notes?: string;
  tags?: string[];
}