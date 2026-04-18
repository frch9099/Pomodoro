import { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useStats } from '../hooks/useStats';
import { useAchievements } from '../hooks/useAchievements';
import { useNotifications } from '../hooks/useNotifications';
import { getTreeTypeForPomodoros } from '../utils/achievements';

const AppContext = createContext(null);

const defaultSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  soundEnabled: true,
  currentSound: null,
  soundVolume: 50,
  notificationsEnabled: true,
  autoStartBreaks: false,
  autoStartWork: false,
  continueSoundDuringBreak: false,
  darkMode: false,
  dailyGoal: 8,
  language: 'en',
};

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

const defaultTimerState = {
  status: 'idle',
  phase: 'work',
  timeRemaining: 25 * 60,
  sessionsCompleted: 0,
  lastUpdateTime: null,
};

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pomodoro_settings');
    if (!saved) return defaultSettings;
    try {
      return { ...defaultSettings, ...JSON.parse(saved) };
    } catch (error) {
      console.error('Failed to parse settings from localStorage:', error);
      return defaultSettings;
    }
  });

  const {
    tasks,
    templates,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    toggleComplete,
    incrementPomodoro,
    saveAsTemplate,
    deleteTemplate,
    createFromTemplate,
  } = useTasks();

  const {
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
  } = useStats();

  const { checkAchievements } = useAchievements(stats, templates, tasks, settings);
  const { requestPermission, notify, hasPermission } = useNotifications();

  const [sessionStartTime, setSessionStartTime] = useState(null);

  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false);
  const [breakSuggestion, setBreakSuggestion] = useState(null);
  const [currentView, setCurrentView] = useState('timer');
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [notificationPermissionDenied, setNotificationPermissionDenied] = useState(() => {
    try {
      const saved = localStorage.getItem('pomodoro_notificationPermissionDenied');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [timerState, setTimerState] = useState(() => {
    try {
      const saved = localStorage.getItem('pomodoro_timerState');
      if (!saved) return defaultTimerState;
      return { ...defaultTimerState, ...JSON.parse(saved) };
    } catch {
      return defaultTimerState;
    }
  });

  const handleDeleteTask = useCallback((id) => {
    deleteTask(id);
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  }, [deleteTask, activeTaskId]);

  useEffect(() => {
    try {
      localStorage.setItem('pomodoro_notificationPermissionDenied', notificationPermissionDenied.toString());
    } catch (error) {
      console.error('Failed to save notificationPermissionDenied to localStorage:', error);
    }
  }, [notificationPermissionDenied]);

  useEffect(() => {
    try {
      localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('pomodoro_timerState', JSON.stringify(timerState));
    } catch (error) {
      console.error('Failed to save timerState to localStorage:', error);
    }
  }, [timerState]);

  const updateTimerState = useCallback((updates) => {
    setTimerState((prev) => ({ ...prev, ...updates, lastUpdateTime: Date.now() }));
  }, []);

  const clearTimerState = useCallback(() => {
    setTimerState(defaultTimerState);
  }, []);

  useLayoutEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const toggleDarkMode = useCallback(() => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const startSession = useCallback(() => {
    if (settings.notificationsEnabled && !hasPermission() && !notificationPermissionDenied) {
      requestPermission().then((result) => {
        if (result === 'denied') {
          setNotificationPermissionDenied(true);
        }
      });
    }
    setSessionStartTime(Date.now());
  }, [settings.notificationsEnabled, hasPermission, requestPermission, notificationPermissionDenied]);

  const completeSession = useCallback((phase, sessionsCompleted) => {
    if (sessionStartTime && phase === 'work') {
      const newTotalPomodoros = stats.totalPomodoros + 1;
      const newTreeTypesUnlocked = [...stats.treeTypesUnlocked];
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

      const newSession = {
        id: crypto.randomUUID(),
        phase,
        duration: settings.workDuration * 60,
        startedAt: sessionStartTime,
        completedAt: Date.now(),
        wasInterrupted: false,
      };

      const newTree = {
        type: getTreeTypeForPomodoros(newTotalPomodoros),
        growth: 0,
      };

      const statsWithNewData = {
        ...stats,
        totalPomodoros: newTotalPomodoros,
        currentStreak: stats.currentStreak + 1,
        treeTypesUnlocked: newTreeTypesUnlocked,
        sessions: [...stats.sessions, newSession],
        plantedTrees: [...stats.plantedTrees, { ...newTree, plantedAt: Date.now() }],
      };

      recordSession(newSession);
      addPlantedTree(newTree);

      const newAchievements = checkAchievements(statsWithNewData);
      newAchievements.forEach((achievement) => {
        addAchievement(achievement.id);
        if (settings.notificationsEnabled) {
          notify('Achievement Unlocked!', `You earned: ${achievement.title}`);
        }
      });

      if (activeTaskId) {
        incrementPomodoro(activeTaskId);
      }

      if (settings.notificationsEnabled) {
        notify('Focus Session Complete!', 'Time for a break.');
      }

      setShowBreakSuggestion(true);
    } else if (phase !== 'work' && settings.notificationsEnabled) {
      notify("Break's Over!", 'Ready to focus?');
    }
    setSessionStartTime(null);
  }, [sessionStartTime, settings.workDuration, settings.notificationsEnabled, recordSession, addPlantedTree, checkAchievements, templates, tasks, addAchievement, notify, activeTaskId, incrementPomodoro]);

  const startBreakFromSuggestion = useCallback((suggestion) => {
    setBreakSuggestion(suggestion);
  }, []);

  const dismissBreakSuggestion = useCallback(() => {
    setShowBreakSuggestion(false);
    setBreakSuggestion(null);
  }, []);

  const value = useMemo(() => ({
    settings,
    updateSettings,
    toggleDarkMode,
    tasks,
    templates,
    addTask,
    updateTask,
    deleteTask: handleDeleteTask,
    completeTask,
    uncompleteTask,
    toggleComplete,
    incrementPomodoro,
    saveAsTemplate,
    deleteTemplate,
    createFromTemplate,
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
    sessionStartTime,
    startSession,
    completeSession,
    checkAchievements,
    showBreakSuggestion,
    setShowBreakSuggestion,
    breakSuggestion,
    startBreakFromSuggestion,
    dismissBreakSuggestion,
    currentView,
    setCurrentView,
    activeTaskId,
    setActiveTaskId,
    timerState,
    updateTimerState,
    clearTimerState,
  }), [settings, tasks, templates, stats, sessionStartTime, showBreakSuggestion, breakSuggestion, currentView, handleDeleteTask, timerState]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { defaultSettings, defaultStats };
