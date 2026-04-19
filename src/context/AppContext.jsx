import { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback, useMemo, useRef } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useStats, getStartOfDay } from '../hooks/useStats';
import { useAchievements } from '../hooks/useAchievements';
import { useNotifications } from '../hooks/useNotifications';
import { getTreeTypeForPomodoros } from '../utils/achievements';
import DataStore from '../db/DataStore';

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

const defaultTimerState = {
  status: 'idle',
  phase: 'work',
  timeRemaining: 25 * 60,
  sessionsCompleted: 0,
  lastUpdateTime: null,
};

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const localSettings = localStorage.getItem('pomodoro_settings');
    if (localSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(localSettings) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
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
  const activeTaskIdRef = useRef(activeTaskId);
  activeTaskIdRef.current = activeTaskId;
  const [notificationPermissionDenied, setNotificationPermissionDenied] = useState(() => {
    try {
      return localStorage.getItem('pomodoro_notificationPermissionDenied') === 'true';
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
    if (activeTaskIdRef.current === id) {
      setActiveTaskId(null);
    }
  }, [deleteTask]);

  useEffect(() => {
    try {
      localStorage.setItem('pomodoro_notificationPermissionDenied', notificationPermissionDenied.toString());
    } catch (error) {
      console.error('Failed to save notificationPermissionDenied to localStorage:', error);
    }
  }, [notificationPermissionDenied]);

  useEffect(() => {
    DataStore.saveSettings(settings).catch(() => {});
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

  useEffect(() => {
    const newAchievements = checkAchievements();
    newAchievements.forEach((achievement) => {
      addAchievement(achievement.id);
      if (settings.notificationsEnabled) {
        notify('Achievement Unlocked!', `You earned: ${achievement.title}`);
      }
    });
  }, [checkAchievements, addAchievement, settings.notificationsEnabled, notify, stats.sessions.length, stats.currentStreak, stats.totalPomodoros, stats.plantedTrees.length]);

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
      const newSession = {
        id: crypto.randomUUID(),
        phase,
        duration: settings.workDuration * 60,
        startedAt: sessionStartTime,
        completedAt: Date.now(),
        wasInterrupted: false,
      };

      const newTree = {
        type: getTreeTypeForPomodoros((stats.totalPomodoros ?? 0) + 1),
        growth: 0,
      };

      recordSession(newSession);
      addPlantedTree(newTree);

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
  }, [sessionStartTime, settings, stats, recordSession, addPlantedTree, activeTaskId, incrementPomodoro, notify]);

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
  }), [settings, stats, tasks, templates, sessionStartTime, showBreakSuggestion, breakSuggestion, currentView, handleDeleteTask, timerState, addTask, updateTask, completeTask, uncompleteTask, toggleComplete, incrementPomodoro, saveAsTemplate, deleteTemplate, createFromTemplate, recordSession, getTodayStats, getWeekStats, getMonthStats, getAllTimeStats, updateStreak, getDailyGoalProgress, addAchievement, addPlantedTree, updateSettings, toggleDarkMode, checkAchievements]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

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

export { defaultSettings, defaultStats };