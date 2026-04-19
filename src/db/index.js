export { db, default } from './DexieDB';
export { checkIndexedDBAvailability, default as storageChecker } from './storageChecker';
export { sanitizeTask, sanitizeStats, sanitizeSettings, addChecksum, verifyChecksum, validateSchema } from './migrationUtils';
export { default as MigrationManager } from './MigrationManager';
export {
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
} from './MigrationManager';
export { default as DataStore } from './DataStore';
export {
  checkNeedsMigration,
  runMigration,
  getSettings,
  saveSettings,
  getTasks,
  saveTask,
  updateTask,
  deleteTask,
  getTemplates,
  saveTemplate,
  deleteTemplate,
  getStats,
  saveStats,
  getMigrationStatus,
  markMigrationComplete,
  cleanupOldLocalStorage,
  hasDataInIndexedDB,
  hasDataInLocalStorage,
  defaultSettings
} from './DataStore';