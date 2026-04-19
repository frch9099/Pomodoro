import Dexie from 'dexie';

export const db = new Dexie('PomodoroDB');

db.version(1).stores({
  settings: 'key',
  tasks: '++id, createdAt, completedAt, estimatedPomodoros',
  templates: '++id, name',
  stats: '++id, date, type',
  achievements: 'id, unlockedAt'
});

export default db;