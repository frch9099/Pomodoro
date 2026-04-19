import { db } from './DexieDB';
import { sanitizeTask, sanitizeStats, sanitizeSettings } from './migrationUtils';

const MIGRATION_KEY = 'pomodoro_migration_completed';
const MIGRATION_DATE_KEY = 'pomodoro_migration_date';
const LOCAL_STORAGE_CLEANUP_DAYS = 30;

export const defaultSettings = {
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

let indexedDBAvailable = null;

function isIndexedDBAvailable() {
  if (indexedDBAvailable !== null) return indexedDBAvailable;
  indexedDBAvailable = !!(window.indexedDB && window.IDBFactory);
  return indexedDBAvailable;
}

async function hasDataInIndexedDB() {
  if (!isIndexedDBAvailable()) return false;
  try {
    const settingsCount = await db.settings.count();
    const tasksCount = await db.tasks.count();
    return settingsCount > 0 || tasksCount > 0;
  } catch {
    return false;
  }
}

function hasDataInLocalStorage() {
  const keys = ['pomodoro_settings', 'pomodoro_tasks', 'pomodoro_templates', 'pomodoro_stats'];
  return keys.some(key => localStorage.getItem(key) !== null);
}

function shouldCleanuplocalStorage() {
  const migrationDate = localStorage.getItem(MIGRATION_DATE_KEY);
  if (!migrationDate) return false;
  
  const daysSinceMigration = (Date.now() - parseInt(migrationDate)) / (1000 * 60 * 60 * 24);
  return daysSinceMigration > LOCAL_STORAGE_CLEANUP_DAYS;
}

function markMigrationDate() {
  try {
    localStorage.setItem(MIGRATION_DATE_KEY, Date.now().toString());
  } catch (e) {
    console.warn('Could not save migration date:', e);
  }
}

export async function checkNeedsMigration() {
  const idbHasData = await hasDataInIndexedDB();
  if (idbHasData) return false;
  
  const localHasData = hasDataInLocalStorage();
  return localHasData;
}

export async function runMigration(progressCallback) {
  try {
    const idbHasData = await hasDataInIndexedDB();
    if (idbHasData) {
      return { success: true, migrated: false, message: 'Already migrated' };
    }

    if (progressCallback) progressCallback({ phase: 'settings', progress: 0 });
    
    const localSettings = localStorage.getItem('pomodoro_settings');
    if (localSettings) {
      try {
        const parsed = JSON.parse(localSettings);
        const sanitized = sanitizeSettings(parsed);
        await db.settings.put({ key: 'settings', value: sanitized });
      } catch (e) {
        console.warn('Settings migration failed, using defaults:', e);
        await db.settings.put({ key: 'settings', value: defaultSettings });
      }
    } else {
      await db.settings.put({ key: 'settings', value: defaultSettings });
    }
    if (progressCallback) progressCallback({ phase: 'settings', progress: 100 });

    if (progressCallback) progressCallback({ phase: 'tasks', progress: 0 });
    const localTasks = localStorage.getItem('pomodoro_tasks');
    if (localTasks) {
      try {
        const tasks = JSON.parse(localTasks);
        if (Array.isArray(tasks) && tasks.length > 0) {
          const sanitized = tasks.map(sanitizeTask);
          await db.tasks.bulkPut(sanitized);
        }
      } catch (e) {
        console.warn('Tasks migration failed:', e);
      }
    }
    if (progressCallback) progressCallback({ phase: 'tasks', progress: 100 });

    if (progressCallback) progressCallback({ phase: 'templates', progress: 0 });
    const localTemplates = localStorage.getItem('pomodoro_templates');
    if (localTemplates) {
      try {
        const templates = JSON.parse(localTemplates);
        if (Array.isArray(templates) && templates.length > 0) {
          const sanitized = templates.map(t => ({
            id: t.id || crypto.randomUUID(),
            name: typeof t.title === 'string' ? t.title : (typeof t.name === 'string' ? t.name : 'Untitled'),
            estimatedPomodoros: Math.min(10, Math.max(1, parseInt(t.estimatedPomodoros) || 1)),
            createdAt: parseInt(t.createdAt) || Date.now()
          }));
          await db.templates.bulkPut(sanitized);
        }
      } catch (e) {
        console.warn('Templates migration failed:', e);
      }
    }
    if (progressCallback) progressCallback({ phase: 'templates', progress: 100 });

    if (progressCallback) progressCallback({ phase: 'stats', progress: 0 });
    const localStats = localStorage.getItem('pomodoro_stats');
    if (localStats) {
      try {
        const statsData = JSON.parse(localStats);
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
      } catch (e) {
        console.warn('Stats migration failed:', e);
      }
    }
    if (progressCallback) progressCallback({ phase: 'stats', progress: 100 });

    markMigrationDate();
    
    if (progressCallback) progressCallback({ phase: 'complete', progress: 100 });
    
    return { success: true, migrated: true };
  } catch (e) {
    console.error('Migration failed:', e);
    return { success: false, error: e.message };
  }
}

export async function getSettings() {
  if (isIndexedDBAvailable()) {
    try {
      const idbData = await db.settings.get('settings');
      if (idbData?.value) {
        return idbData.value;
      }
    } catch (e) {
      console.warn('Error reading settings from IndexedDB:', e);
    }
  }

  const localSettings = localStorage.getItem('pomodoro_settings');
  if (localSettings) {
    try {
      return { ...defaultSettings, ...JSON.parse(localSettings) };
    } catch {
      return defaultSettings;
    }
  }
  
  return defaultSettings;
}

export async function saveSettings(settings) {
  if (isIndexedDBAvailable()) {
    try {
      await db.settings.put({ key: 'settings', value: settings });
    } catch (e) {
      console.warn('Failed to save settings to IndexedDB:', e);
    }
  }
  try {
    localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e);
    return false;
  }
}

export async function getTasks() {
  if (isIndexedDBAvailable()) {
    try {
      const idbTasks = await db.tasks.toArray();
      if (idbTasks.length > 0) {
        return idbTasks;
      }
    } catch (e) {
      console.warn('Error reading tasks from IndexedDB:', e);
    }
  }

  const localTasks = localStorage.getItem('pomodoro_tasks');
  if (localTasks) {
    try {
      return JSON.parse(localTasks);
    } catch {
      return [];
    }
  }
  
  return [];
}

export function getTasksSync() {
  const localTasks = localStorage.getItem('pomodoro_tasks');
  if (localTasks) {
    try {
      return JSON.parse(localTasks);
    } catch {
      return [];
    }
  }
  return [];
}

export async function saveTask(task) {
  if (isIndexedDBAvailable()) {
    try {
      await db.tasks.put(task);
      return true;
    } catch (e) {
      console.error('Failed to save task to IndexedDB:', e);
    }
  }
  try {
    const tasks = getTasksSync();
    const idx = tasks.findIndex(t => t.id === task.id);
    if (idx >= 0) {
      tasks[idx] = task;
    } else {
      tasks.unshift(task);
    }
    localStorage.setItem('pomodoro_tasks', JSON.stringify(tasks));
    return true;
  } catch (e) {
    console.error('Failed to save task to localStorage:', e);
    return false;
  }
}

export async function updateTask(id, updates) {
  if (isIndexedDBAvailable()) {
    try {
      await db.tasks.update(id, updates);
    } catch (e) {
      console.warn('Failed to update task in IndexedDB:', e);
    }
  }
  try {
    const tasks = getTasksSync();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx >= 0) {
      tasks[idx] = { ...tasks[idx], ...updates };
      localStorage.setItem('pomodoro_tasks', JSON.stringify(tasks));
    }
    return true;
  } catch (e) {
    console.error('Failed to update task in localStorage:', e);
    return false;
  }
}

export async function deleteTask(id) {
  if (isIndexedDBAvailable()) {
    try {
      await db.tasks.delete(id);
    } catch (e) {
      console.warn('Failed to delete task from IndexedDB:', e);
    }
  }
  try {
    const tasks = getTasksSync();
    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem('pomodoro_tasks', JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete task from localStorage:', e);
    return false;
  }
}

export async function getTemplates() {
  if (isIndexedDBAvailable()) {
    try {
      const idbTemplates = await db.templates.toArray();
      if (idbTemplates.length > 0) {
        return idbTemplates;
      }
    } catch (e) {
      console.warn('Error reading templates from IndexedDB:', e);
    }
  }

  const localTemplates = localStorage.getItem('pomodoro_templates');
  if (localTemplates) {
    try {
      return JSON.parse(localTemplates);
    } catch {
      return [];
    }
  }
  
  return [];
}

export function getTemplatesSync() {
  const localTemplates = localStorage.getItem('pomodoro_templates');
  if (localTemplates) {
    try {
      return JSON.parse(localTemplates);
    } catch {
      return [];
    }
  }
  return [];
}

export async function saveTemplate(template) {
  if (isIndexedDBAvailable()) {
    try {
      await db.templates.put(template);
    } catch (e) {
      console.warn('Failed to save template to IndexedDB:', e);
    }
  }
  try {
    const templates = getTemplatesSync();
    const idx = templates.findIndex(t => t.id === template.id);
    if (idx >= 0) {
      templates[idx] = template;
    } else {
      templates.push(template);
    }
    localStorage.setItem('pomodoro_templates', JSON.stringify(templates));
    return true;
  } catch (e) {
    console.error('Failed to save template to localStorage:', e);
    return false;
  }
}

export async function deleteTemplate(id) {
  if (isIndexedDBAvailable()) {
    try {
      await db.templates.delete(id);
    } catch (e) {
      console.warn('Failed to delete template from IndexedDB:', e);
    }
  }
  try {
    const templates = getTemplatesSync();
    const filtered = templates.filter(t => t.id !== id);
    localStorage.setItem('pomodoro_templates', JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete template from localStorage:', e);
    return false;
  }
}

export async function getStats() {
  if (isIndexedDBAvailable()) {
    try {
      const idbStats = await db.stats.get('main');
      if (idbStats) {
        return {
          sessions: idbStats.sessions || [],
          achievements: idbStats.achievements || [],
          currentStreak: idbStats.currentStreak || 0,
          bestStreak: idbStats.bestStreak || 0,
          lastSessionDate: idbStats.lastSessionDate || null,
          totalPomodoros: idbStats.totalPomodoros || 0,
          treeTypesUnlocked: idbStats.treeTypesUnlocked || ['oak'],
          plantedTrees: idbStats.plantedTrees || []
        };
      }
    } catch (e) {
      console.warn('Error reading stats from IndexedDB:', e);
    }
  }

  const localStats = localStorage.getItem('pomodoro_stats');
  if (localStats) {
    try {
      return { sessions: [], achievements: [], currentStreak: 0, bestStreak: 0, lastSessionDate: null, totalPomodoros: 0, treeTypesUnlocked: ['oak'], plantedTrees: [], ...JSON.parse(localStats) };
    } catch {
      return null;
    }
  }
  
  return null;
}

export function getStatsSync() {
  const localStats = localStorage.getItem('pomodoro_stats');
  if (localStats) {
    try {
      return { sessions: [], achievements: [], currentStreak: 0, bestStreak: 0, lastSessionDate: null, totalPomodoros: 0, treeTypesUnlocked: ['oak'], plantedTrees: [], ...JSON.parse(localStats) };
    } catch {
      return null;
    }
  }
  return null;
}

export async function saveStats(stats) {
  if (isIndexedDBAvailable()) {
    try {
      await db.stats.put({
        id: 'main',
        ...stats,
        date: new Date().toISOString().split('T')[0],
        type: 'main'
      });
    } catch (e) {
      console.warn('Failed to save stats to IndexedDB:', e);
    }
  }
  try {
    localStorage.setItem('pomodoro_stats', JSON.stringify(stats));
    return true;
  } catch (e) {
    console.error('Failed to save stats to localStorage:', e);
    return false;
  }
}

export async function getMigrationStatus() {
  return localStorage.getItem(MIGRATION_KEY) === 'true';
}

export async function markMigrationComplete() {
  try {
    localStorage.setItem(MIGRATION_KEY, 'true');
    return true;
  } catch {
    return false;
  }
}

export async function cleanupOldLocalStorage() {
  if (!shouldCleanuplocalStorage()) return { success: true, cleaned: false };
  
  try {
    localStorage.removeItem('pomodoro_settings');
    localStorage.removeItem('pomodoro_tasks');
    localStorage.removeItem('pomodoro_templates');
    localStorage.removeItem('pomodoro_stats');
    localStorage.removeItem('pomodoro_timerState');
    localStorage.removeItem('pomodoro_notificationPermissionDenied');
    localStorage.removeItem(MIGRATION_KEY);
    localStorage.removeItem(MIGRATION_DATE_KEY);
    return { success: true, cleaned: true };
  } catch (e) {
    console.error('Failed to cleanup localStorage:', e);
    return { success: false, error: e.message };
  }
}

export { hasDataInIndexedDB, hasDataInLocalStorage };
export default {
  checkNeedsMigration,
  runMigration,
  getSettings,
  saveSettings,
  getTasks,
  getTasksSync,
  saveTask,
  updateTask,
  deleteTask,
  getTemplates,
  getTemplatesSync,
  saveTemplate,
  deleteTemplate,
  getStats,
  getStatsSync,
  saveStats,
  getMigrationStatus,
  markMigrationComplete,
  cleanupOldLocalStorage,
  hasDataInIndexedDB,
  hasDataInLocalStorage,
  defaultSettings
};