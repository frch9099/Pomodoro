import { useState, useEffect, useCallback } from 'react';
import DataStore from '../db/DataStore';

const generateId = () => crypto.randomUUID();

export function useTasks() {
  const [tasks, setTasks] = useState(() => DataStore.getTasksSync());
  const [templates, setTemplates] = useState(() => DataStore.getTemplatesSync());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTasks, loadedTemplates] = await Promise.all([
          DataStore.getTasks(),
          DataStore.getTemplates()
        ]);
        setTasks(loadedTasks);
        setTemplates(loadedTemplates);
      } catch (e) {
        console.warn('Failed to load tasks/templates:', e);
      }
    }
    loadData();
  }, []);

  const addTask = useCallback(async (title, estimatedPomodoros = 1) => {
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
      DataStore.saveTask(newTask).catch(() => {});
      return updated;
    });

    return newTask;
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      );
      DataStore.updateTask(id, updates).catch(() => {});
      return updated;
    });
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => {
      const updated = prev.filter((task) => task.id !== id);
      DataStore.deleteTask(id).catch(() => {});
      return updated;
    });
  }, []);

  const completeTask = useCallback((id) => {
    const completedAt = Date.now();
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, isCompleted: true, completedAt } : task
      );
      DataStore.updateTask(id, { isCompleted: true, completedAt }).catch(() => {});
      return updated;
    });
  }, []);

  const uncompleteTask = useCallback((id) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, isCompleted: false, completedAt: undefined } : task
      );
      DataStore.updateTask(id, { isCompleted: false, completedAt: undefined }).catch(() => {});
      return updated;
    });
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
      DataStore.updateTask(id, updates).catch(() => {});
      return updated;
    });
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
      DataStore.updateTask(id, updates).catch(() => {});
      return updated;
    });
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
      DataStore.saveTemplate(newTemplate).catch(() => {});
      return updated;
    });

    return newTemplate;
  }, []);

  const deleteTemplate = useCallback((templateId) => {
    setTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== templateId);
      DataStore.deleteTemplate(templateId).catch(() => {});
      return updated;
    });
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
      DataStore.saveTask(newTask).catch(() => {});
      return updated;
    });

    return newTask;
  }, [templates]);

  return {
    tasks,
    templates,
    isLoading,
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