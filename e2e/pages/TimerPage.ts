import { Page, Locator } from '@playwright/test';

export class TimerPage {
  readonly page: Page;
  readonly timerDisplay: Locator;
  readonly playPauseButton: Locator;
  readonly resetButton: Locator;
  readonly skipButton: Locator;
  readonly phaseLabel: Locator;
  readonly sessionIndicator: Locator;
  readonly progressRing: Locator;

  constructor(page: Page) {
    this.page = page;
    this.timerDisplay = page.locator('span.text-5xl.font-mono').first();
    this.playPauseButton = page.getByRole('button', { name: /start|pause/i });
    this.resetButton = page.getByRole('button', { name: /reset/i });
    this.skipButton = page.getByRole('button', { name: /skip/i });
    this.phaseLabel = page.locator('p:has-text("Focus Time"), p:has-text("Short Break"), p:has-text("Long Break")');
    this.sessionIndicator = page.getByText(/Session \d+ of 4/);
    this.progressRing = page.locator('svg circle[stroke-linecap="round"]');
  }

  async getTimeDisplay(): Promise<string> {
    return this.timerDisplay.textContent() ?? '';
  }

  async isRunning(): Promise<boolean> {
    const btn = this.page.locator('button[aria-label*="pause"]');
    return (await btn.count()) > 0;
  }

  async clickPlay(): Promise<void> {
    await this.playPauseButton.click();
  }

  async clickPause(): Promise<void> {
    await this.playPauseButton.click();
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  async clickSkip(): Promise<void> {
    await this.skipButton.click();
  }

  async getPhase(): Promise<string> {
    const text = await this.phaseLabel.textContent();
    if (text?.includes('Focus')) return 'work';
    if (text?.includes('Short')) return 'shortBreak';
    return 'longBreak';
  }

  async waitForPhaseChange(initialPhase: string, timeout = 30000): Promise<string> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const currentPhase = await this.getPhase();
      if (currentPhase !== initialPhase) {
        return currentPhase;
      }
      await this.page.waitForTimeout(500);
    }
    throw new Error(`Phase did not change from ${initialPhase} within ${timeout}ms`);
  }

  async getSessionCount(): Promise<number> {
    const text = await this.sessionIndicator.textContent();
    const match = text?.match(/Session (\d) of 4/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getProgress(): Promise<number> {
    return 0;
  }
}