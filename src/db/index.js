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