import { useState, useEffect, useCallback } from 'react';

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
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save templates to localStorage:', error);
    }
  }, [templates]);

  const addTask = useCallback((title, estimatedPomodoros = 1) => {
    const newTask = {
      id: generateId(),
      title,
      estimatedPomodoros: Math.min(10, Math.max(1, estimatedPomodoros)),
      completedPomodoros: 0,
      isCompleted: false,
      isTemplate: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const completeTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, isCompleted: true, completedAt: Date.now() }
          : task
      )
    );
  }, []);

  const uncompleteTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, isCompleted: false, completedAt: undefined }
          : task
      )
    );
  }, []);

  const toggleComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        if (task.isCompleted) {
          return { ...task, isCompleted: false, completedAt: undefined };
        } else {
          return { ...task, isCompleted: true, completedAt: Date.now() };
        }
      })
    );
  }, []);

  const incrementPomodoro = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const newCompleted = Math.min(
          task.estimatedPomodoros,
          task.completedPomodoros + 1
        );
        return {
          ...task,
          completedPomodoros: newCompleted,
          isCompleted: newCompleted >= task.estimatedPomodoros,
          completedAt: newCompleted >= task.estimatedPomodoros ? Date.now() : undefined,
        };
      })
    );
  }, []);

  const saveAsTemplate = useCallback((task) => {
    const newTemplate = {
      id: generateId(),
      title: task.title,
      estimatedPomodoros: task.estimatedPomodoros,
      createdAt: Date.now(),
    };
    setTemplates((prev) => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  const deleteTemplate = useCallback((templateId) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
  }, []);

  const createFromTemplate = useCallback((templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return null;

    const newTask = {
      id: generateId(),
      title: template.title,
      estimatedPomodoros: template.estimatedPomodoros,
      completedPomodoros: 0,
      isCompleted: false,
      isTemplate: false,
      templateId: template.id,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
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
