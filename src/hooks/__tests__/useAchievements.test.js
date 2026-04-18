import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAchievements } from '../useAchievements';

describe('useAchievements', () => {
  const defaultStats = {
    sessions: [],
    achievements: [],
    currentStreak: 0,
    bestStreak: 0,
    lastSessionDate: null,
    totalPomodoros: 0,
    treeTypesUnlocked: ['oak'],
    plantedTrees: [],
  };

  const defaultSettings = {
    dailyGoal: 8,
  };

  const createMockStats = (overrides) => ({ ...defaultStats, ...overrides });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkAchievements - count type', () => {
    it('should unlock first-pomodoro when totalPomodoros >= 1', () => {
      const stats = createMockStats({ totalPomodoros: 1 });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'first-pomodoro')).toBe(true);
    });

    it('should unlock pom-10 when totalPomodoros >= 10', () => {
      const stats = createMockStats({ totalPomodoros: 10 });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'pom-10')).toBe(true);
    });

    it('should unlock pom-50 when totalPomodoros >= 50', () => {
      const stats = createMockStats({ totalPomodoros: 50 });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'pom-50')).toBe(true);
    });

    it('should unlock pom-100 when totalPomodoros >= 100', () => {
      const stats = createMockStats({ totalPomodoros: 100 });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'pom-100')).toBe(true);
    });

    it('should unlock forest-grower when plantedTrees >= 10', () => {
      const plantedTrees = Array(10).fill({ type: 'oak', plantedAt: Date.now() });
      const stats = createMockStats({ plantedTrees });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'forest-grower')).toBe(true);
    });
  });

  describe('checkAchievements - streak type', () => {
    it('should unlock streak-3 when currentStreak >= 3', () => {
      const stats = createMockStats({ currentStreak: 3 });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'streak-3')).toBe(true);
    });

    it('should unlock streak-7 when currentStreak >= 7', () => {
      const stats = createMockStats({ currentStreak: 7 });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'streak-7')).toBe(true);
    });

    it('should unlock streak-30 when currentStreak >= 30', () => {
      const stats = createMockStats({ currentStreak: 30 });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'streak-30')).toBe(true);
    });
  });

  describe('checkAchievements - special type', () => {
    it('should unlock template-creator when templates exist', () => {
      const templates = [{ id: '1', title: 'Test Template' }];
      const stats = createMockStats();
      const { result } = renderHook(() => useAchievements(stats, templates, [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'template-creator')).toBe(true);
    });

    it('should unlock perfect-day when daily goal is met', () => {
      const today = new Date();
      const sessions = Array(8).fill(null).map((_, i) => ({
        phase: 'work',
        completedAt: today.getTime() + i * 1000,
      }));
      const stats = createMockStats({ sessions });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'perfect-day')).toBe(true);
    });

    it('should use settings.dailyGoal for perfect-day achievement', () => {
      const today = new Date();
      const sessions = Array(5).fill(null).map((_, i) => ({
        phase: 'work',
        completedAt: today.getTime() + i * 1000,
      }));
      const stats = createMockStats({ sessions });
      const settings = { dailyGoal: 5 };
      const { result } = renderHook(() => useAchievements(stats, [], [], settings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'perfect-day')).toBe(true);
    });
  });

  describe('checkAchievements - already earned', () => {
    it('should not re-unlock already earned achievements', () => {
      const stats = createMockStats({
        totalPomodoros: 1,
        achievements: ['first-pomodoro'],
      });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.filter(a => a.id === 'first-pomodoro').length).toBe(0);
    });

    it('should not unlock pom-10 when already earned', () => {
      const stats = createMockStats({
        totalPomodoros: 50,
        achievements: ['first-pomodoro', 'pom-10'],
      });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.some(a => a.id === 'pom-10')).toBe(false);
    });
  });

  describe('checkAchievements - multiple', () => {
    it('should unlock multiple count achievements at once', () => {
      const stats = createMockStats({ totalPomodoros: 100 });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const newAchievements = result.current.checkAchievements();
      expect(newAchievements.filter(a => a.type === 'count').length).toBeGreaterThan(1);
    });
  });

  describe('getEarnedAchievements', () => {
    it('should return list of earned achievements', () => {
      const stats = createMockStats({
        achievements: ['first-pomodoro', 'pom-10'],
      });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const earned = result.current.getEarnedAchievements();
      expect(earned.length).toBe(2);
      expect(earned.map(a => a.id)).toContain('first-pomodoro');
      expect(earned.map(a => a.id)).toContain('pom-10');
    });

    it('should return empty when no achievements earned', () => {
      const stats = createMockStats();
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const earned = result.current.getEarnedAchievements();
      expect(earned.length).toBe(0);
    });
  });

  describe('getUnlockedTreeTypes', () => {
    it('should return unlocked tree types from stats', () => {
      const stats = createMockStats({
        treeTypesUnlocked: ['oak', 'pine', 'cherry'],
      });
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const treeTypes = result.current.getUnlockedTreeTypes();
      expect(treeTypes).toEqual(['oak', 'pine', 'cherry']);
    });

    it('should return default oak when only default unlocked', () => {
      const stats = createMockStats();
      const { result } = renderHook(() => useAchievements(stats, [], [], defaultSettings));

      const treeTypes = result.current.getUnlockedTreeTypes();
      expect(treeTypes).toEqual(['oak']);
    });
  });

  });
