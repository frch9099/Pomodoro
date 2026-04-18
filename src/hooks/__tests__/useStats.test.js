import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStats } from '../useStats';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useStats', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    localStorageMock.clear();
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with default stats', () => {
      const { result } = renderHook(() => useStats());

      expect(result.current.stats.sessions).toEqual([]);
      expect(result.current.stats.currentStreak).toBe(0);
      expect(result.current.stats.bestStreak).toBe(0);
      expect(result.current.stats.totalPomodoros).toBe(0);
      expect(result.current.stats.treeTypesUnlocked).toEqual(['oak']);
    });

    it('should restore stats from localStorage', () => {
      const savedStats = {
        sessions: [{ id: '1', phase: 'work', duration: 1500, startedAt: Date.now(), completedAt: Date.now(), wasInterrupted: false }],
        currentStreak: 5,
        bestStreak: 10,
        totalPomodoros: 25,
        achievements: [],
        lastSessionDate: Date.now(),
        treeTypesUnlocked: ['oak', 'pine'],
        plantedTrees: [],
      };
      localStorageMock.setItem('pomodoro_stats', JSON.stringify(savedStats));

      const { result } = renderHook(() => useStats());

      expect(result.current.stats.currentStreak).toBe(5);
      expect(result.current.stats.bestStreak).toBe(10);
      expect(result.current.stats.totalPomodoros).toBe(25);
      expect(result.current.stats.treeTypesUnlocked).toEqual(['oak', 'pine']);
    });
  });

  describe('recordSession', () => {
    it('should record a new work session', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordSession({
          phase: 'work',
          duration: 1500,
          startedAt: Date.now() - 1500000,
          completedAt: Date.now(),
          wasInterrupted: false,
        });
      });

      expect(result.current.stats.sessions).toHaveLength(1);
      expect(result.current.stats.totalPomodoros).toBe(1);
      expect(result.current.stats.sessions[0].phase).toBe('work');
    });

    it('should increment streak on first session', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordSession({
          phase: 'work',
          duration: 1500,
          startedAt: Date.now() - 1500000,
          completedAt: Date.now(),
          wasInterrupted: false,
        });
      });

      expect(result.current.stats.currentStreak).toBe(1);
      expect(result.current.stats.bestStreak).toBe(1);
    });

    it('should not increment totalPomodoros for break sessions', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordSession({
          phase: 'shortBreak',
          duration: 300,
          startedAt: Date.now() - 300000,
          completedAt: Date.now(),
          wasInterrupted: false,
        });
      });

      expect(result.current.stats.totalPomodoros).toBe(0);
      expect(result.current.stats.sessions).toHaveLength(1);
    });

    it('should unlock pine tree at 10 pomodoros', () => {
      const { result } = renderHook(() => useStats());

      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.recordSession({
            phase: 'work',
            duration: 1500,
            startedAt: Date.now() - 1500000,
            completedAt: Date.now(),
            wasInterrupted: false,
          });
        });
      }

      expect(result.current.stats.treeTypesUnlocked).toContain('pine');
      expect(result.current.stats.totalPomodoros).toBe(10);
    });

    it('should unlock cherry tree at 25 pomodoros', () => {
      const { result } = renderHook(() => useStats());

      for (let i = 0; i < 25; i++) {
        act(() => {
          result.current.recordSession({
            phase: 'work',
            duration: 1500,
            startedAt: Date.now() - 1500000,
            completedAt: Date.now(),
            wasInterrupted: false,
          });
        });
      }

      expect(result.current.stats.treeTypesUnlocked).toContain('cherry');
    });

    it('should unlock maple tree at 50 pomodoros', () => {
      const { result } = renderHook(() => useStats());

      for (let i = 0; i < 50; i++) {
        act(() => {
          result.current.recordSession({
            phase: 'work',
            duration: 1500,
            startedAt: Date.now() - 1500000,
            completedAt: Date.now(),
            wasInterrupted: false,
          });
        });
      }

      expect(result.current.stats.treeTypesUnlocked).toContain('maple');
    });

    it('should unlock bonsai tree at 100 pomodoros', () => {
      const { result } = renderHook(() => useStats());

      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.recordSession({
            phase: 'work',
            duration: 1500,
            startedAt: Date.now() - 1500000,
            completedAt: Date.now(),
            wasInterrupted: false,
          });
        });
      }

      expect(result.current.stats.treeTypesUnlocked).toContain('bonsai');
    });
  });

  describe('getTodayStats', () => {
    it('should return today pomodoros count', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordSession({
          phase: 'work',
          duration: 1500,
          startedAt: Date.now() - 1500000,
          completedAt: Date.now(),
          wasInterrupted: false,
        });
      });

      const todayStats = result.current.getTodayStats();
      expect(todayStats.pomodoros).toBe(1);
    });

    it('should return zero pomodoros for today with no sessions', () => {
      const { result } = renderHook(() => useStats());

      const todayStats = result.current.getTodayStats();
      expect(todayStats.pomodoros).toBe(0);
    });
  });

  describe('getWeekStats', () => {
    it('should return array of 7 days', () => {
      const { result } = renderHook(() => useStats());

      const weekStats = result.current.getWeekStats();
      expect(weekStats).toHaveLength(7);
    });

    it('should mark today correctly', () => {
      const { result } = renderHook(() => useStats());

      const weekStats = result.current.getWeekStats();
      const todayIndex = weekStats.findIndex((d) => d.isToday);
      expect(todayIndex).toBe(6);
    });

    it('should return correct pomodoros count per day', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordSession({
          phase: 'work',
          duration: 1500,
          startedAt: Date.now() - 1500000,
          completedAt: Date.now(),
          wasInterrupted: false,
        });
      });

      const weekStats = result.current.getWeekStats();
      const todayData = weekStats.find((d) => d.isToday);
      expect(todayData.pomodoros).toBe(1);
    });
  });

  describe('getMonthStats', () => {
    it('should return array of 30 days', () => {
      const { result } = renderHook(() => useStats());

      const monthStats = result.current.getMonthStats();
      expect(monthStats).toHaveLength(30);
    });

    it('should mark today correctly', () => {
      const { result } = renderHook(() => useStats());

      const monthStats = result.current.getMonthStats();
      const todayData = monthStats.find((d) => d.isToday);
      expect(todayData).toBeDefined();
      expect(todayData.pomodoros).toBe(0);
    });
  });

  describe('getAllTimeStats', () => {
    it('should return all time statistics', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordSession({
          phase: 'work',
          duration: 1500,
          startedAt: Date.now() - 1500000,
          completedAt: Date.now(),
          wasInterrupted: false,
        });
      });

      const allTimeStats = result.current.getAllTimeStats();
      expect(allTimeStats.totalPomodoros).toBe(1);
      expect(allTimeStats.focusHours).toBe(0.4);
    });

    it('should calculate focus hours correctly', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordSession({
          phase: 'work',
          duration: 1500,
          startedAt: Date.now() - 1500000,
          completedAt: Date.now(),
          wasInterrupted: false,
        });
        result.current.recordSession({
          phase: 'work',
          duration: 1500,
          startedAt: Date.now() - 1500000,
          completedAt: Date.now(),
          wasInterrupted: false,
        });
      });

      const allTimeStats = result.current.getAllTimeStats();
      expect(allTimeStats.focusHours).toBe(0.8);
    });
  });

  describe('getDailyGoalProgress', () => {
    it('should return progress towards daily goal', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordSession({
          phase: 'work',
          duration: 1500,
          startedAt: Date.now() - 1500000,
          completedAt: Date.now(),
          wasInterrupted: false,
        });
      });

      const progress = result.current.getDailyGoalProgress(8);
      expect(progress).toBe(0.125);
    });

    it('should cap progress at 1', () => {
      const { result } = renderHook(() => useStats());

      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.recordSession({
            phase: 'work',
            duration: 1500,
            startedAt: Date.now() - 1500000,
            completedAt: Date.now(),
            wasInterrupted: false,
          });
        });
      }

      const progress = result.current.getDailyGoalProgress(8);
      expect(progress).toBe(1);
    });
  });

  describe('addAchievement', () => {
    it('should add an achievement', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.addAchievement('first-pomodoro');
      });

      expect(result.current.stats.achievements).toContain('first-pomodoro');
    });

    it('should not add duplicate achievements', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.addAchievement('first-pomodoro');
        result.current.addAchievement('first-pomodoro');
      });

      expect(result.current.stats.achievements).toHaveLength(1);
    });
  });

  describe('addPlantedTree', () => {
    it('should add a planted tree', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.addPlantedTree({ type: 'oak', stage: 'mature' });
      });

      expect(result.current.stats.plantedTrees).toHaveLength(1);
      expect(result.current.stats.plantedTrees[0].type).toBe('oak');
    });
  });

  describe('localStorage persistence', () => {
    it('should persist stats to localStorage', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordSession({
          phase: 'work',
          duration: 1500,
          startedAt: Date.now() - 1500000,
          completedAt: Date.now(),
          wasInterrupted: false,
        });
      });

      const stored = JSON.parse(localStorageMock.getItem('pomodoro_stats'));
      expect(stored.totalPomodoros).toBe(1);
    });

    it('should restore stats on re-render', () => {
      const { result } = renderHook(() => useStats());

      act(() => {
        result.current.recordSession({
          phase: 'work',
          duration: 1500,
          startedAt: Date.now() - 1500000,
          completedAt: Date.now(),
          wasInterrupted: false,
        });
      });

      const { result: newResult } = renderHook(() => useStats());
      expect(newResult.current.stats.totalPomodoros).toBe(1);
    });
  });
});
