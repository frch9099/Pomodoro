function generateChecksum(data) {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function sanitizeTask(task) {
  return {
    id: typeof task.id === 'string' ? task.id : crypto.randomUUID(),
    title: typeof task.title === 'string' ? task.title : 'Untitled Task',
    estimatedPomodoros: Math.min(10, Math.max(1, parseInt(task.estimatedPomodoros) || 1)),
    completedPomodoros: Math.min(task.estimatedPomodoros, Math.max(0, parseInt(task.completedPomodoros) || 0)),
    isCompleted: Boolean(task.isCompleted),
    isTemplate: Boolean(task.isTemplate),
    templateId: task.templateId || null,
    createdAt: parseInt(task.createdAt) || Date.now(),
    completedAt: task.completedAt ? parseInt(task.completedAt) : null,
    notes: typeof task.notes === 'string' ? task.notes : '',
    tags: Array.isArray(task.tags) ? task.tags : []
  };
}

export function sanitizeStats(data) {
  if (!data || typeof data !== 'object') {
    return getDefaultStats();
  }

  return {
    sessions: Array.isArray(data.sessions) ? data.sessions.map(s => ({
      id: s.id || crypto.randomUUID(),
      taskId: s.taskId || null,
      phase: ['work', 'shortBreak', 'longBreak'].includes(s.phase) ? s.phase : 'work',
      duration: parseInt(s.duration) || 0,
      startedAt: parseInt(s.startedAt) || Date.now(),
      completedAt: parseInt(s.completedAt) || Date.now(),
      wasInterrupted: Boolean(s.wasInterrupted)
    })) : [],
    achievements: Array.isArray(data.achievements) ? data.achievements.filter(a => typeof a === 'string') : [],
    currentStreak: Math.max(0, parseInt(data.currentStreak) || 0),
    bestStreak: Math.max(0, parseInt(data.bestStreak) || 0),
    lastSessionDate: data.lastSessionDate ? parseInt(data.lastSessionDate) : null,
    totalPomodoros: Math.max(0, parseInt(data.totalPomodoros) || 0),
    treeTypesUnlocked: Array.isArray(data.treeTypesUnlocked) ? data.treeTypesUnlocked.filter(t => ['oak', 'pine', 'cherry', 'maple', 'bonsai'].includes(t)) : ['oak'],
    plantedTrees: Array.isArray(data.plantedTrees) ? data.plantedTrees.map(t => ({
      type: ['oak', 'pine', 'cherry', 'maple', 'bonsai'].includes(t.type) ? t.type : 'oak',
      growth: Math.min(100, Math.max(0, parseInt(t.growth) || 0)),
      plantedAt: parseInt(t.plantedAt) || Date.now()
    })) : []
  };
}

export function sanitizeSettings(data) {
  if (!data || typeof data !== 'object') {
    return getDefaultSettings();
  }

  return {
    workDuration: Math.min(60, Math.max(1, parseInt(data.workDuration) || 25)),
    shortBreakDuration: Math.min(30, Math.max(1, parseInt(data.shortBreakDuration) || 5)),
    longBreakDuration: Math.min(60, Math.max(1, parseInt(data.longBreakDuration) || 15)),
    sessionsBeforeLongBreak: Math.min(8, Math.max(2, parseInt(data.sessionsBeforeLongBreak) || 4)),
    soundEnabled: Boolean(data.soundEnabled),
    currentSound: data.currentSound || null,
    soundVolume: Math.min(100, Math.max(0, parseInt(data.soundVolume) || 50)),
    notificationsEnabled: Boolean(data.notificationsEnabled),
    autoStartBreaks: Boolean(data.autoStartBreaks),
    autoStartWork: Boolean(data.autoStartWork),
    continueSoundDuringBreak: Boolean(data.continueSoundDuringBreak),
    darkMode: Boolean(data.darkMode),
    dailyGoal: Math.min(20, Math.max(1, parseInt(data.dailyGoal) || 8)),
    language: typeof data.language === 'string' ? data.language : 'en'
  };
}

function getDefaultStats() {
  return {
    sessions: [],
    achievements: [],
    currentStreak: 0,
    bestStreak: 0,
    lastSessionDate: null,
    totalPomodoros: 0,
    treeTypesUnlocked: ['oak'],
    plantedTrees: []
  };
}

function getDefaultSettings() {
  return {
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
}

export function addChecksum(data) {
  const checksum = generateChecksum(data);
  return {
    ...data,
    _checksum: checksum,
    _checksumAlgorithm: 'simple',
    _exportedAt: Date.now()
  };
}

export function verifyChecksum(data) {
  if (!data._checksum || !data._checksumAlgorithm) {
    throw new Error('Missing checksum in data');
  }

  const { _checksum, _checksumAlgorithm, ...dataWithoutChecksum } = data;
  const computedChecksum = generateChecksum(dataWithoutChecksum);

  if (computedChecksum !== _checksum) {
    throw new Error('Checksum verification failed - data may be corrupted');
  }

  return true;
}

export function validateSchema(data, schema) {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data is not an object'] };
  }

  const errors = [];

  for (const [key, expectedType] of Object.entries(schema)) {
    if (key.startsWith('_')) continue;

    if (!(key in data)) {
      errors.push(`Missing required field: ${key}`);
      continue;
    }

    switch (expectedType) {
      case 'array':
        if (!Array.isArray(data[key])) {
          errors.push(`Field ${key} should be an array`);
        }
        break;
      case 'number':
        if (typeof data[key] !== 'number') {
          errors.push(`Field ${key} should be a number`);
        }
        break;
      case 'string':
        if (typeof data[key] !== 'string') {
          errors.push(`Field ${key} should be a string`);
        }
        break;
      case 'boolean':
        if (typeof data[key] !== 'boolean') {
          errors.push(`Field ${key} should be a boolean`);
        }
        break;
      case 'object':
        if (typeof data[key] !== 'object' || data[key] === null || Array.isArray(data[key])) {
          errors.push(`Field ${key} should be an object`);
        }
        break;
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export default { sanitizeTask, sanitizeStats, sanitizeSettings, addChecksum, verifyChecksum, validateSchema };