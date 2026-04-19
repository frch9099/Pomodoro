import { db } from './DexieDB';
import { sanitizeTask, sanitizeStats, sanitizeSettings } from './migrationUtils';

const MIGRATION_STATE_KEY = 'pomodoro_migration_state';

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
  language: 'en'
};

function getState() {
  try {
    const saved = sessionStorage.getItem(MIGRATION_STATE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function setState(state) {
  try {
    sessionStorage.setItem(MIGRATION_STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save migration state:', e);
  }
}

function clearState() {
  try {
    sessionStorage.removeItem(MIGRATION_STATE_KEY);
  } catch (e) {
    console.error('Failed to clear migration state:', e);
  }
}

function backupTolocalStorage(key, data) {
  try {
    sessionStorage.setItem(`backup_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to backup to sessionStorage:', e);
  }
}

function restoreFromBackup(key) {
  try {
    const backup = sessionStorage.getItem(`backup_${key}`);
    if (backup) {
      const data = JSON.parse(backup);
      localStorage.setItem(key, JSON.stringify(data));
      sessionStorage.removeItem(`backup_${key}`);
      return data;
    }
  } catch (e) {
    console.error('Failed to restore from backup:', e);
  }
  return null;
}

function clearBackup(key) {
  try {
    sessionStorage.removeItem(`backup_${key}`);
  } catch (e) {
    console.error('Failed to clear backup:', e);
  }
}

export async function getMigrationProgress() {
  const state = getState();
  if (!state) return { migrated: 0, total: 0, percent: 100 };

  const totalTasks = state.totalTasks || 0;
  const totalStats = state.totalStats || 0;
  const total = 6 + totalTasks + totalStats;
  const migrated = state.migratedTasks + state.migratedStats + (state.settingsMigrated ? 1 : 0) + (state.templatesMigrated ? 1 : 0) + (state.achievementsMigrated ? 1 : 0) + (state.statsSessionsMigrated ? 1 : 0);

  return {
    migrated,
    total,
    percent: total > 0 ? Math.round((migrated / total) * 100) : 100
  };
}

export async function migrateSettings() {
  try {
    const localData = localStorage.getItem('pomodoro_settings');
    if (!localData) {
      await db.settings.put({ key: 'settings', value: defaultSettings });
      return { success: true, migrated: true };
    }

    const parsed = JSON.parse(localData);
    const sanitized = sanitizeSettings(parsed);
    await db.settings.put({ key: 'settings', value: sanitized });
    return { success: true, migrated: true };
  } catch (e) {
    console.error('Settings migration failed:', e);
    return { success: false, error: e.message };
  }
}

export async function migrateTasks(offset = 0, batchSize = 50) {
  const state = getState();
  if (!state || !state.settingsMigrated) {
    return { success: false, error: 'Settings must be migrated first' };
  }

  try {
    let tasks;
    const localData = localStorage.getItem('pomodoro_tasks');

    if (!localData) {
      return { success: true, migrated: 0, total: 0, complete: true };
    }

    tasks = JSON.parse(localData);

    if (!Array.isArray(tasks)) {
      return { success: true, migrated: 0, total: 0, complete: true };
    }

    const total = tasks.length;
    const endIndex = Math.min(offset + batchSize, total);
    const batch = tasks.slice(offset, endIndex);

    if (batch.length === 0) {
      return { success: true, migrated: 0, total, complete: true };
    }

    const sanitizedTasks = batch.map(sanitizeTask);

    await db.tasks.bulkPut(sanitizedTasks);

    const newState = {
      ...state,
      migratedTasks: offset + batch.length,
      totalTasks: total,
      currentOffset: offset + batch.length
    };
    setState(newState);

    return {
      success: true,
      migrated: batch.length,
      total,
      offset: offset + batch.length,
      complete: offset + batch.length >= total
    };
  } catch (e) {
    console.error('Tasks migration failed:', e);
    return { success: false, error: e.message };
  }
}

export async function migrateTemplates(offset = 0, batchSize = 50) {
  const state = getState();
  if (!state) {
    return { success: false, error: 'No migration state' };
  }

  try {
    const localData = localStorage.getItem('pomodoro_templates');
    if (!localData) {
      return { success: true, migrated: 0, total: 0, complete: true };
    }

    let templates = JSON.parse(localData);
    if (!Array.isArray(templates)) {
      return { success: true, migrated: 0, total: 0, complete: true };
    }

    const total = templates.length;
    const endIndex = Math.min(offset + batchSize, total);
    const batch = templates.slice(offset, endIndex);

    if (batch.length === 0) {
      return { success: true, migrated: 0, total, complete: true };
    }

    const sanitizedTemplates = batch.map(t => ({
      id: t.id || crypto.randomUUID(),
      name: typeof t.title === 'string' ? t.title : 'Untitled Template',
      estimatedPomodoros: Math.min(10, Math.max(1, parseInt(t.estimatedPomodoros) || 1)),
      createdAt: parseInt(t.createdAt) || Date.now()
    }));

    await db.templates.bulkPut(sanitizedTemplates);

    const newState = {
      ...state,
      migratedTemplates: offset + batch.length,
      totalTemplates: total,
      currentOffset: offset + batch.length
    };
    setState(newState);

    return {
      success: true,
      migrated: batch.length,
      total,
      offset: offset + batch.length,
      complete: offset + batch.length >= total
    };
  } catch (e) {
    console.error('Templates migration failed:', e);
    return { success: false, error: e.message };
  }
}

export async function migrateStats(offset = 0, batchSize = 100) {
  const state = getState();
  if (!state) {
    return { success: false, error: 'No migration state' };
  }

  try {
    const localData = localStorage.getItem('pomodoro_stats');
    if (!localData) {
      return { success: true, migrated: 0, total: 0, complete: true };
    }

    const statsData = JSON.parse(localData);
    const sanitized = sanitizeStats(statsData);

    await db.stats.put({
      id: 'main',
      sessions: sanitized.sessions,
      achievements: sanitized.achievements,
      currentStreak: sanitized.currentStreak,
      bestStreak: sanitized.bestStreak,
      lastSessionDate: sanitized.lastSessionDate,
      totalPomodoros: sanitized.totalPomodoros,
      treeTypesUnlocked: sanitized.treeTypesUnlocked,
      plantedTrees: sanitized.plantedTrees,
      date: new Date().toISOString().split('T')[0],
      type: 'main'
    });

    const newState = {
      ...state,
      statsMigrated: true,
      migratedStats: sanitized.sessions.length,
      totalStats: sanitized.sessions.length
    };
    setState(newState);

    return { success: true, migrated: sanitized.sessions.length, total: sanitized.sessions.length, complete: true };
  } catch (e) {
    console.error('Stats migration failed:', e);
    return { success: false, error: e.message };
  }
}

export async function migrateAchievements() {
  const state = getState();
  if (!state) {
    return { success: false, error: 'No migration state' };
  }

  try {
    const localData = localStorage.getItem('pomodoro_stats');
    if (!localData) {
      return { success: true };
    }

    const statsData = JSON.parse(localData);
    const achievements = Array.isArray(statsData.achievements) ? statsData.achievements : [];

    for (const achievementId of achievements) {
      await db.achievements.put({
        id: achievementId,
        unlockedAt: Date.now()
      });
    }

    const newState = { ...state, achievementsMigrated: true };
    setState(newState);

    return { success: true };
  } catch (e) {
    console.error('Achievements migration failed:', e);
    return { success: false, error: e.message };
  }
}

export async function initializeMigration() {
  const existingState = getState();

  if (existingState && existingState.inProgress) {
    return { resume: true, state: existingState };
  }

  const tasksData = localStorage.getItem('pomodoro_tasks');
  const tasks = tasksData ? JSON.parse(tasksData) : [];
  const totalTasks = Array.isArray(tasks) ? tasks.length : 0;

  const templatesData = localStorage.getItem('pomodoro_templates');
  const templates = templatesData ? JSON.parse(templatesData) : [];
  const totalTemplates = Array.isArray(templates) ? templates.length : 0;

  const statsData = localStorage.getItem('pomodoro_stats');
  const stats = statsData ? JSON.parse(statsData) : { sessions: [] };
  const totalStats = Array.isArray(stats.sessions) ? stats.sessions.length : 0;

  const state = {
    inProgress: true,
    startedAt: Date.now(),
    settingsMigrated: false,
    templatesMigrated: false,
    tasksMigrated: false,
    achievementsMigrated: false,
    statsMigrated: false,
    migratedTasks: 0,
    migratedStats: 0,
    totalTasks,
    totalTemplates,
    currentOffset: 0,
    totalStats
  };

  setState(state);
  return { resume: false, state };
}

export async function completeMigration() {
  const state = getState();

  if (!state) {
    return { success: false, error: 'No migration in progress' };
  }

  try {
    const allTasks = await db.tasks.toArray();
    const allStats = await db.stats.get('main');
    const allSettings = await db.settings.get('settings');

    if (!allTasks.length && !allStats) {
      console.warn('Migration produced no data - possible failure');
    }

    const newState = {
      ...state,
      inProgress: false,
      completedAt: Date.now(),
      verified: true
    };
    setState(newState);

    return { success: true };
  } catch (e) {
    console.error('Migration verification failed:', e);
    return { success: false, error: e.message };
  }
}

export async function cleanup() {
  const state = getState();
  if (!state || !state.verified) {
    console.warn('Cannot cleanup - migration not verified');
    return { success: false };
  }

  try {
    sessionStorage.removeItem(MIGRATION_STATE_KEY);
    const backupKeys = ['pomodoro_settings', 'pomodoro_tasks', 'pomodoro_templates', 'pomodoro_stats'];
    for (const key of backupKeys) {
      sessionStorage.removeItem(`backup_${key}`);
    }

    return { success: true };
  } catch (e) {
    console.error('Cleanup failed:', e);
    return { success: false, error: e.message };
  }
}

export async function rollback() {
  try {
    const backupKeys = ['pomodoro_settings', 'pomodoro_tasks', 'pomodoro_templates', 'pomodoro_stats'];
    for (const key of backupKeys) {
      restoreFromBackup(key);
    }

    await db.delete();
    clearState();

    return { success: true };
  } catch (e) {
    console.error('Rollback failed:', e);
    return { success: false, error: e.message };
  }
}

export async function isMigrationComplete() {
  try {
    const state = getState();
    if (!state) return true;

    if (state.inProgress) return false;

    const settingsCount = await db.settings.count();
    const tasksCount = await db.tasks.count();

    return state.verified && settingsCount > 0;
  } catch {
    return false;
  }
}

export async function resumeMigration() {
  const state = getState();
  if (!state || !state.inProgress) {
    return { error: 'No migration to resume' };
  }

  return { state, offset: state.currentOffset || 0 };
}

export default {
  initializeMigration,
  migrateSettings,
  migrateTasks,
  migrateTemplates,
  migrateStats,
  migrateAchievements,
  completeMigration,
  cleanup,
  rollback,
  isMigrationComplete,
  resumeMigration,
  getMigrationProgress
};