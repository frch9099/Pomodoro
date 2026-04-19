import { db } from '../db/DexieDB';
import { addChecksum, verifyChecksum, sanitizeTask, sanitizeStats, sanitizeSettings } from '../db/migrationUtils';

const EXPORT_VERSION = 1;

export async function exportData() {
  try {
    const [settings, tasks, templates, statsData] = await Promise.all([
      db.settings.get('settings'),
      db.tasks.toArray(),
      db.templates.toArray(),
      db.stats.get('main')
    ]);

    const exportData = {
      version: EXPORT_VERSION,
      exportedAt: Date.now(),
      data: {
        settings: settings?.value || null,
        tasks: tasks,
        templates: templates,
        stats: statsData || null,
        achievements: await db.achievements.toArray()
      }
    };

    const dataWithChecksum = addChecksum(exportData);

    const jsonString = JSON.stringify(dataWithChecksum, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `pomodoro-backup-${timestamp}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, filename, recordCount: tasks.length + templates.length };
  } catch (error) {
    console.error('Export failed:', error);
    return { success: false, error: error.message };
  }
}

export async function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        const imported = JSON.parse(content);

        if (!imported.version || !imported.data) {
          resolve({ success: false, error: 'Invalid backup file format' });
          return;
        }

        try {
          verifyChecksum(imported);
        } catch (e) {
          resolve({ success: false, error: 'Backup file checksum verification failed - file may be corrupted' });
          return;
        }

        const { data } = imported;

        if (data.settings) {
          const sanitizedSettings = sanitizeSettings(data.settings);
          await db.settings.put({ key: 'settings', value: sanitizedSettings });
          localStorage.setItem('pomodoro_settings', JSON.stringify(sanitizedSettings));
        }

        if (data.tasks && Array.isArray(data.tasks)) {
          await db.tasks.clear();
          const sanitizedTasks = data.tasks.map(sanitizeTask);
          await db.tasks.bulkAdd(sanitizedTasks);
        }

        if (data.templates && Array.isArray(data.templates)) {
          await db.templates.clear();
          const sanitizedTemplates = data.templates.map(t => ({
            id: t.id || crypto.randomUUID(),
            name: t.name || t.title || 'Untitled',
            estimatedPomodoros: Math.min(10, Math.max(1, parseInt(t.estimatedPomodoros) || 1)),
            createdAt: parseInt(t.createdAt) || Date.now()
          }));
          await db.templates.bulkAdd(sanitizedTemplates);
        }

        if (data.stats) {
          const sanitizedStats = sanitizeStats(data.stats);
          await db.stats.put({
            id: 'main',
            ...sanitizedStats,
            date: new Date().toISOString().split('T')[0],
            type: 'main'
          });
          localStorage.setItem('pomodoro_stats', JSON.stringify(sanitizedStats));
        }

        if (data.achievements && Array.isArray(data.achievements)) {
          await db.achievements.clear();
          for (const achievement of data.achievements) {
            if (typeof achievement === 'string') {
              await db.achievements.put({ id: achievement, unlockedAt: Date.now() });
            } else if (achievement.id) {
              await db.achievements.put({
                id: achievement.id,
                unlockedAt: achievement.unlockedAt || Date.now()
              });
            }
          }
        }

        resolve({
          success: true,
          recordCount: {
            tasks: data.tasks?.length || 0,
            templates: data.templates?.length || 0,
            achievements: data.achievements?.length || 0
          }
        });
      } catch (error) {
        console.error('Import processing failed:', error);
        resolve({ success: false, error: error.message });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file' });
    };

    reader.readAsText(file);
  });
}

export default { exportData, importData };