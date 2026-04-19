export async function checkIndexedDBAvailability() {
  const result = {
    available: false,
    warnings: [],
    canProceed: false,
    storageEstimate: null,
    localStorageSize: 0
  };

  if (!window.indexedDB) {
    result.warnings.push('IndexedDB is not supported in this browser');
    return result;
  }

  try {
    const estimate = await navigator.storage.estimate();
    result.storageEstimate = {
      usage: estimate.usage,
      quota: estimate.quota,
      usagePercent: ((estimate.usage / estimate.quota) * 100).toFixed(2)
    };

    if (estimate.quota < 10 * 1024 * 1024) {
      result.warnings.push('Low storage quota detected (< 10MB)');
    }

    if (estimate.usage && estimate.quota) {
      const projectedUsage = estimate.usage + (10 * 1024 * 1024);
      if (projectedUsage > estimate.quota) {
        result.warnings.push('May run out of storage with migration');
      }
    }
  } catch (e) {
    result.warnings.push('Could not estimate storage: ' + e.message);
  }

  try {
    const testDB = await new Promise((resolve, reject) => {
      const request = indexedDB.open('PomodoroDBTest', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        db.close();
        indexedDB.deleteDatabase('PomodoroDBTest');
        resolve(true);
      };
      request.onupgradeneeded = (e) => {
        e.target.transaction.abort();
      };
    });
    result.available = true;
  } catch (e) {
    result.warnings.push('IndexedDB test failed: ' + e.message);
    result.available = false;
  }

  try {
    let totalSize = 0;
    const keys = [
      'pomodoro_settings',
      'pomodoro_tasks',
      'pomodoro_templates',
      'pomodoro_stats',
      'pomodoro_timerState',
      'pomodoro_notificationPermissionDenied'
    ];
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += (key.length + value.length) * 2;
      }
    }
    result.localStorageSize = totalSize;
    result.localStorageSizeFormatted = formatBytes(totalSize);
  } catch (e) {
    result.warnings.push('Could not measure localStorage size');
  }

  result.canProceed = result.available && result.warnings.filter(w => w.includes('Low storage') || w.includes('run out')).length === 0;

  return result;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default checkIndexedDBAvailability;