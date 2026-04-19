import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../db/DexieDB';

const TASKS_KEY = 'pomodoro_tasks';
const TEMPLATES_KEY = 'pomodoro_templates';

const generateId = () => crypto.randomUUID();

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(TASKS_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem(TEMPLATES_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    async function initialSync() {
      if (!window.indexedDB) return;
      try {
        const existingTasks = await db.tasks.count();
        if (existingTasks === 0 && tasks.length > 0) {
          await db.tasks.bulkPut(tasks);
        }
        const existingTemplates = await db.templates.count();
        if (existingTemplates === 0 && templates.length > 0) {
          await db.templates.bulkPut(templates.map(t => ({
            id: t.id,
            name: t.title || t.name,
            estimatedPomodoros: t.estimatedPomodoros,
            createdAt: t.createdAt
          })));
        }
      } catch (e) {
        console.warn('Initial IndexedDB sync skipped:', e.message);
      }
    }
    initialSync();
  }, []);

  const addTask = useCallback((title, estimatedPomodoros = 1) => {
    const newTask = {
      id: generateId(),
      title,
      estimatedPomodoros: Math.min(10, Math.max(1, estimatedPomodoros)),
      completedPomodoros: 0,
      isCompleted: false,
      isTemplate: false,
      templateId: null,
      createdAt: Date.now(),
      completedAt: null,
      notes: '',
      tags: []
    };

    setTasks((prev) => {
      const updated = [newTask, ...prev];
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
      }
      return updated;
    });

    if (window.indexedDB) {
      db.tasks.put(newTask).catch(() => {});
    }

    return newTask;
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      );
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
      }
      return updated;
    });

    if (window.indexedDB) {
      db.tasks.update(id, updates).catch(() => {});
    }
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => {
      const updated = prev.filter((task) => task.id !== id);
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
      }
      return updated;
    });

    if (window.indexedDB) {
      db.tasks.delete(id).catch(() => {});
    }
  }, []);

  const completeTask = useCallback((id) => {
    const completedAt = Date.now();
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, isCompleted: true, completedAt } : task
      );
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
      }
      return updated;
    });

    if (window.indexedDB) {
      db.tasks.update(id, { isCompleted: true, completedAt }).catch(() => {});
    }
  }, []);

  const uncompleteTask = useCallback((id) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, isCompleted: false, completedAt: undefined } : task
      );
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
      }
      return updated;
    });

    if (window.indexedDB) {
      db.tasks.update(id, { isCompleted: false, completedAt: undefined }).catch(() => {});
    }
  }, []);

  const toggleComplete = useCallback((id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updates = task.isCompleted
      ? { isCompleted: false, completedAt: undefined }
      : { isCompleted: true, completedAt: Date.now() };

    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
      }
      return updated;
    });

    if (window.indexedDB) {
      db.tasks.update(id, { isCompleted: updates.isCompleted, completedAt: updates.completedAt }).catch(() => {});
    }
  }, [tasks]);

  const incrementPomodoro = useCallback((id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newCompleted = Math.min(
      task.estimatedPomodoros,
      task.completedPomodoros + 1
    );
    const isNowCompleted = newCompleted >= task.estimatedPomodoros;
    const updates = {
      completedPomodoros: newCompleted,
      isCompleted: isNowCompleted,
      completedAt: isNowCompleted ? Date.now() : null
    };

    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
      }
      return updated;
    });

    if (window.indexedDB) {
      db.tasks.update(id, updates).catch(() => {});
    }
  }, [tasks]);

  const saveAsTemplate = useCallback((task) => {
    const newTemplate = {
      id: generateId(),
      title: task.title,
      name: task.title,
      estimatedPomodoros: task.estimatedPomodoros,
      createdAt: Date.now()
    };

    setTemplates((prev) => {
      const updated = [...prev, newTemplate];
      try {
        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save templates to localStorage:', error);
      }
      return updated;
    });

    if (window.indexedDB) {
      db.templates.put({
        id: newTemplate.id,
        name: task.title,
        estimatedPomodoros: task.estimatedPomodoros,
        createdAt: newTemplate.createdAt
      }).catch(() => {});
    }

    return newTemplate;
  }, []);

  const deleteTemplate = useCallback((templateId) => {
    setTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== templateId);
      try {
        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save templates to localStorage:', error);
      }
      return updated;
    });

    if (window.indexedDB) {
      db.templates.delete(templateId).catch(() => {});
    }
  }, []);

  const createFromTemplate = useCallback((templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return null;

    const newTask = {
      id: generateId(),
      title: template.name || template.title,
      estimatedPomodoros: template.estimatedPomodoros,
      completedPomodoros: 0,
      isCompleted: false,
      isTemplate: false,
      templateId: template.id,
      createdAt: Date.now(),
      completedAt: null,
      notes: '',
      tags: []
    };

    setTasks((prev) => {
      const updated = [newTask, ...prev];
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
      }
      return updated;
    });

    if (window.indexedDB) {
      db.tasks.put(newTask).catch(() => {});
    }

    return newTask;
  }, [templates]);

  return {
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
  };
}