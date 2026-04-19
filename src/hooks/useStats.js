import { useState, useEffect, useCallback, useMemo } from 'react';

const STATS_KEY = 'pomodoro_stats';

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

const generateId = () => crypto.randomUUID();

const isSameDay = (timestamp1, timestamp2) => {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isConsecutiveDay = (timestamp1, timestamp2) => {
  const date1 = new Date(timestamp1);
  date1.setHours(0, 0, 0, 0);
  const date2 = new Date(timestamp2);
  date2.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
  return Math.abs(diffDays) === 1;
};

const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export function useStats() {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(STATS_KEY);
    if (!saved) return defaultStats;
    try {
      return { ...defaultStats, ...JSON.parse(saved) };
    } catch {
      return defaultStats;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save stats to localStorage:', error);
    }
  }, [stats]);

  const recordSession = useCallback((session) => {
    const newSession = {
      id: generateId(),
      phase: session.phase || 'work',
      duration: session.duration || 0,
      startedAt: session.startedAt || Date.now(),
      completedAt: session.completedAt || Date.now(),
      wasInterrupted: session.wasInterrupted || false,
      taskId: session.taskId,
    };

    setStats((prev) => {
      const isWorkSession = newSession.phase === 'work';
      const todayStart = getStartOfDay();
      const sessionDate = getStartOfDay(newSession.completedAt);
      const isToday = sessionDate === todayStart;

      const newTotalPomodoros = isWorkSession
        ? prev.totalPomodoros + 1
        : prev.totalPomodoros;

      let newCurrentStreak = prev.currentStreak;
      let newBestStreak = prev.bestStreak;

      if (isWorkSession) {
        if (prev.lastSessionDate === null) {
          newCurrentStreak = 1;
          newBestStreak = Math.max(1, prev.bestStreak);
        } else {
          const lastDate = getStartOfDay(prev.lastSessionDate);
          if (sessionDate === lastDate) {
          } else if (isConsecutiveDay(sessionDate, prev.lastSessionDate)) {
            newCurrentStreak = prev.currentStreak + 1;
            newBestStreak = Math.max(newCurrentStreak, prev.bestStreak);
          } else {
            newCurrentStreak = 1;
          }
        }
      }

      const newTreeTypesUnlocked = [...prev.treeTypesUnlocked];
      if (newTotalPomodoros >= 10 && !newTreeTypesUnlocked.includes('pine')) {
        newTreeTypesUnlocked.push('pine');
      }
      if (newTotalPomodoros >= 25 && !newTreeTypesUnlocked.includes('cherry')) {
        newTreeTypesUnlocked.push('cherry');
      }
      if (newTotalPomodoros >= 50 && !newTreeTypesUnlocked.includes('maple')) {
        newTreeTypesUnlocked.push('maple');
      }
      if (newTotalPomodoros >= 100 && !newTreeTypesUnlocked.includes('bonsai')) {
        newTreeTypesUnlocked.push('bonsai');
      }

      return {
        ...prev,
        sessions: [...prev.sessions, newSession],
        totalPomodoros: newTotalPomodoros,
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        lastSessionDate: newSession.completedAt,
        treeTypesUnlocked: newTreeTypesUnlocked,
      };
    });

    return newSession;
  }, []);

  const todayStats = useMemo(() => {
    const todayStart = getStartOfDay();
    const todaySessions = stats.sessions.filter(
      (s) => s.phase === 'work' && s.completedAt >= todayStart && !s.wasInterrupted
    );

    return {
      pomodoros: todaySessions.length,
      sessions: todaySessions,
    };
  }, [stats.sessions]);

  const weekStats = useMemo(() => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = getStartOfDay(date);
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const daySessions = stats.sessions.filter(
        (s) =>
          s.phase === 'work' &&
          s.completedAt >= dayStart &&
          s.completedAt < dayEnd &&
          !s.wasInterrupted
      );

      const dateForDay = new Date(date);
      days.push({
        label: dayNames[dateForDay.getDay()],
        pomodoros: daySessions.length,
        isToday: i === 0,
      });
    }

    return days;
  }, [stats.sessions]);

  const monthStats = useMemo(() => {
    const days = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = getStartOfDay(date);
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const daySessions = stats.sessions.filter(
        (s) =>
          s.phase === 'work' &&
          s.completedAt >= dayStart &&
          s.completedAt < dayEnd &&
          !s.wasInterrupted
      );

      days.push({
        date: dayStart,
        pomodoros: daySessions.length,
        isToday: i === 0,
      });
    }

    return days;
  }, [stats.sessions]);

  const getTodayStats = useCallback(() => todayStats, [todayStats]);

  const getWeekStats = useCallback(() => weekStats, [weekStats]);

  const getMonthStats = useCallback(() => monthStats, [monthStats]);

  const getAllTimeStats = useCallback(() => {
    const workSessions = stats.sessions.filter(
      (s) => s.phase === 'work' && !s.wasInterrupted
    );

    const totalSeconds = workSessions.reduce((sum, s) => sum + (s.duration || 25 * 60), 0);
    const focusHours = Math.round(totalSeconds / 3600 * 10) / 10;

    return {
      totalPomodoros: stats.totalPomodoros,
      focusHours,
      totalSessions: workSessions.length,
      achievementsEarned: stats.achievements.length,
      treesPlanted: stats.plantedTrees.length,
      currentStreak: stats.currentStreak,
      bestStreak: stats.bestStreak,
    };
  }, [stats]);

  const updateStreak = useCallback(() => {
    setStats((prev) => {
      if (prev.lastSessionDate === null) {
        return prev;
      }

      const todayStart = getStartOfDay();
      const lastDate = getStartOfDay(prev.lastSessionDate);
      const daysDiff = Math.round((todayStart - lastDate) / (1000 * 60 * 60 * 24));

      if (daysDiff > 1) {
        return {
          ...prev,
          currentStreak: 0,
        };
      }

      return prev;
    });
  }, []);

  const getDailyGoalProgress = useCallback((dailyGoal = 8) => {
    const todayStats = getTodayStats();
    return Math.min(1, todayStats.pomodoros / dailyGoal);
  }, [getTodayStats]);

  const addAchievement = useCallback((achievementId) => {
    setStats((prev) => {
      if (prev.achievements.includes(achievementId)) {
        return prev;
      }
      return {
        ...prev,
        achievements: [...prev.achievements, achievementId],
      };
    });
  }, []);

  const addPlantedTree = useCallback((tree) => {
    setStats((prev) => ({
      ...prev,
      plantedTrees: [...prev.plantedTrees, { ...tree, plantedAt: Date.now() }],
    }));
  }, []);

  return {
    stats,
    recordSession,
    getTodayStats,
    getWeekStats,
    getMonthStats,
    getAllTimeStats,
    updateStreak,
    getDailyGoalProgress,
    addAchievement,
    addPlantedTree,
  };
}

export { defaultStats, getStartOfDay, getDaysAgo, isSameDay, isConsecutiveDay };
