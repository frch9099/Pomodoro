import { Page, Locator } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly settingsButton: Locator;
  readonly settingsModal: Locator;
  readonly workDurationSlider: Locator;
  readonly shortBreakSlider: Locator;
  readonly longBreakSlider: Locator;
  readonly sessionsBeforeLongBreakSlider: Locator;
  readonly volumeSlider: Locator;
  readonly darkModeToggle: Locator;
  readonly dailyGoalInput: Locator;
  readonly resetDefaultsButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.settingsButton = page.locator('button[aria-label*="settings" i]').first();
    this.settingsModal = page.locator('div.fixed.inset-0.z-\\[100\\]').first();

    this.workDurationSlider = this.settingsModal.locator('input[type="range"]').nth(0);
    this.shortBreakSlider = this.settingsModal.locator('input[type="range"]').nth(1);
    this.longBreakSlider = this.settingsModal.locator('input[type="range"]').nth(2);
    this.sessionsBeforeLongBreakSlider = this.settingsModal.locator('input[type="range"]').nth(3);
    this.volumeSlider = this.settingsModal.locator('input[type="range"]').nth(4);

    this.darkModeToggle = page.locator('button[aria-label="Toggle dark mode"]').first();
    this.dailyGoalInput = this.settingsModal.locator('input[type="number"]').first();
    this.resetDefaultsButton = this.settingsModal.locator('button').filter({ hasText: /Reset to Defaults/i }).first();
    this.closeButton = this.settingsModal.locator('button[aria-label="Close settings"]').first();
  }

  async open(): Promise<void> {
    await this.settingsButton.click();
    await this.settingsModal.waitFor({ state: 'visible' });
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await this.settingsModal.waitFor({ state: 'hidden' });
  }

  async setWorkDuration(minutes: number): Promise<void> {
    await this.workDurationSlider.evaluate((el, min) => {
      const input = el as HTMLInputElement;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(input, min.toString());
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, minutes);
    await this.page.waitForTimeout(700);
  }

  async setShortBreakDuration(minutes: number): Promise<void> {
    await this.shortBreakSlider.evaluate((el, min) => {
      const input = el as HTMLInputElement;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(input, min.toString());
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, minutes);
    await this.page.waitForTimeout(700);
  }

  async setLongBreakDuration(minutes: number): Promise<void> {
    await this.longBreakSlider.evaluate((el, min) => {
      const input = el as HTMLInputElement;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(input, min.toString());
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, minutes);
    await this.page.waitForTimeout(700);
  }

  async setSessionsBeforeLongBreak(sessions: number): Promise<void> {
    await this.sessionsBeforeLongBreakSlider.evaluate((el, val) => {
      const input = el as HTMLInputElement;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(input, val.toString());
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, sessions);
    await this.page.waitForTimeout(700);
  }

  async toggleDarkMode(): Promise<void> {
    await this.page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Toggle dark mode"]') as HTMLButtonElement;
      btn?.click();
    });
  }

  async setDarkModeToggle(): Promise<void> {
    await this.page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Toggle dark mode"]') as HTMLButtonElement;
      btn?.click();
    });
  }

  async toggleSound(): Promise<void> {
    await this.settingsModal.locator('label', { hasText: 'Sound Enabled' }).locator('..').locator('button').click();
    await this.page.waitForTimeout(600);
  }

  async toggleNotifications(): Promise<void> {
    await this.settingsModal.locator('label', { hasText: 'Notifications Enabled' }).locator('..').locator('button').click();
    await this.page.waitForTimeout(600);
  }

  async toggleAutoStartBreaks(): Promise<void> {
    await this.settingsModal.locator('label', { hasText: 'Auto-start Breaks' }).locator('..').locator('button').click();
    await this.page.waitForTimeout(600);
  }

  async toggleAutoStartWork(): Promise<void> {
    await this.settingsModal.locator('label', { hasText: 'Auto-start Work' }).locator('..').locator('button').click();
    await this.page.waitForTimeout(600);
  }

  async toggleContinueSoundDuringBreak(): Promise<void> {
    await this.settingsModal.locator('label', { hasText: 'Continue Sound During Break' }).locator('..').locator('button').click();
    await this.page.waitForTimeout(600);
  }

  async setVolume(volume: number): Promise<void> {
    await this.volumeSlider.evaluate((el, vol) => {
      const input = el as HTMLInputElement;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(input, vol.toString());
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, volume);
    await this.page.waitForTimeout(700);
  }

  async isDarkModeOn(): Promise<boolean> {
    return this.page.locator('html').evaluate(el => el.classList.contains('dark'));
  }

  async setDailyGoal(pomodoros: number): Promise<void> {
    await this.dailyGoalInput.evaluate((el, val) => {
      const input = el as HTMLInputElement;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(input, val.toString());
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, pomodoros);
    await this.page.waitForTimeout(700);
  }

  async resetToDefaults(): Promise<void> {
    await this.resetDefaultsButton.click();
  }

  async getSettingsFromStorage(): Promise<Record<string, unknown>> {
    return this.page.evaluate(() => {
      const data = localStorage.getItem('pomodoro_settings');
      return data ? JSON.parse(data) : {};
    });
  }
}
