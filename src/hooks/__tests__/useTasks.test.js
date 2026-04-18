import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../useTasks';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useTasks', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('addTask', () => {
    it('should add a new task with default estimatedPomodoros', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Test task');
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].title).toBe('Test task');
      expect(result.current.tasks[0].estimatedPomodoros).toBe(1);
      expect(result.current.tasks[0].completedPomodoros).toBe(0);
      expect(result.current.tasks[0].isCompleted).toBe(false);
    });

    it('should add a new task with specified estimatedPomodoros', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Test task', 5);
      });

      expect(result.current.tasks[0].estimatedPomodoros).toBe(5);
    });

    it('should cap estimatedPomodoros at 10', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Test task', 15);
      });

      expect(result.current.tasks[0].estimatedPomodoros).toBe(10);
    });

    it('should enforce minimum estimatedPomodoros of 1', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Test task', 0);
      });

      expect(result.current.tasks[0].estimatedPomodoros).toBe(1);
    });

    it('should generate unique IDs for each task', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Task 1');
        result.current.addTask('Task 2');
      });

      expect(result.current.tasks[0].id).not.toBe(result.current.tasks[1].id);
    });
  });

  describe('updateTask', () => {
    it('should update task title', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Original title');
      });

      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.updateTask(taskId, { title: 'Updated title' });
      });

      expect(result.current.tasks[0].title).toBe('Updated title');
    });

    it('should update task notes', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Test task');
      });

      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.updateTask(taskId, { notes: 'Some notes' });
      });

      expect(result.current.tasks[0].notes).toBe('Some notes');
    });

    it('should update multiple fields at once', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Test task');
      });

      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.updateTask(taskId, {
          title: 'New title',
          notes: 'New notes',
          estimatedPomodoros: 3,
        });
      });

      expect(result.current.tasks[0].title).toBe('New title');
      expect(result.current.tasks[0].notes).toBe('New notes');
      expect(result.current.tasks[0].estimatedPomodoros).toBe(3);
    });
  });

  describe('deleteTask', () => {
    it('should remove a task by id', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Task to delete');
      });

      expect(result.current.tasks).toHaveLength(1);

      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.deleteTask(taskId);
      });

      expect(result.current.tasks).toHaveLength(0);
    });

    it('should only delete the specified task', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Task 1');
        result.current.addTask('Task 2');
      });

      const taskIdToDelete = result.current.tasks[0].id;

      act(() => {
        result.current.deleteTask(taskIdToDelete);
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].title).toBe('Task 1');
    });
  });

  describe('toggleComplete', () => {
    it('should mark an incomplete task as complete', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Test task');
      });

      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.toggleComplete(taskId);
      });

      expect(result.current.tasks[0].isCompleted).toBe(true);
      expect(result.current.tasks[0].completedAt).toBeDefined();
    });

    it('should mark a complete task as incomplete', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Test task');
      });

      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.toggleComplete(taskId);
      });

      act(() => {
        result.current.toggleComplete(taskId);
      });

      expect(result.current.tasks[0].isCompleted).toBe(false);
      expect(result.current.tasks[0].completedAt).toBeUndefined();
    });
  });

  describe('incrementPomodoro', () => {
    it('should increment completedPomodoros', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Test task', 5);
      });

      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.incrementPomodoro(taskId);
      });

      expect(result.current.tasks[0].completedPomodoros).toBe(1);
    });

    it('should not exceed estimatedPomodoros', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Test task', 2);
      });

      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.incrementPomodoro(taskId);
      });
      act(() => {
        result.current.incrementPomodoro(taskId);
      });
      act(() => {
        result.current.incrementPomodoro(taskId);
      });

      expect(result.current.tasks[0].completedPomodoros).toBe(2);
    });

    it('should mark task as complete when completedPomodoros equals estimated', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Test task', 2);
      });

      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.incrementPomodoro(taskId);
      });
      expect(result.current.tasks[0].isCompleted).toBe(false);

      act(() => {
        result.current.incrementPomodoro(taskId);
      });
      expect(result.current.tasks[0].isCompleted).toBe(true);
    });
  });

  describe('saveAsTemplate', () => {
    it('should create a template from a task', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Task to template', 3);
      });

      const task = result.current.tasks[0];

      act(() => {
        result.current.saveAsTemplate(task);
      });

      expect(result.current.templates).toHaveLength(1);
      expect(result.current.templates[0].title).toBe('Task to template');
      expect(result.current.templates[0].estimatedPomodoros).toBe(3);
    });

    it('should generate unique template IDs', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Task 1', 1);
        result.current.addTask('Task 2', 2);
      });

      const task1 = result.current.tasks[0];
      const task2 = result.current.tasks[1];

      act(() => {
        result.current.saveAsTemplate(task1);
        result.current.saveAsTemplate(task2);
      });

      expect(result.current.templates[0].id).not.toBe(result.current.templates[1].id);
    });
  });

  describe('createFromTemplate', () => {
    it('should create a new task from a template', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Template source', 4);
      });

      const task = result.current.tasks[0];
      act(() => {
        result.current.saveAsTemplate(task);
      });

      const templateId = result.current.templates[0].id;

      act(() => {
        result.current.createFromTemplate(templateId);
      });

      expect(result.current.tasks).toHaveLength(2);
      expect(result.current.tasks[0].title).toBe('Template source');
      expect(result.current.tasks[0].estimatedPomodoros).toBe(4);
      expect(result.current.tasks[0].templateId).toBe(templateId);
    });

    it('should return null if template not found', () => {
      const { result } = renderHook(() => useTasks());

      const newTask = result.current.createFromTemplate('non-existent-id');

      expect(newTask).toBeNull();
    });
  });

  describe('deleteTemplate', () => {
    it('should remove a template by id', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Task to template');
      });

      const task = result.current.tasks[0];
      act(() => {
        result.current.saveAsTemplate(task);
      });

      expect(result.current.templates).toHaveLength(1);

      const templateId = result.current.templates[0].id;

      act(() => {
        result.current.deleteTemplate(templateId);
      });

      expect(result.current.templates).toHaveLength(0);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist tasks to localStorage', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Persisted task');
      });

      const stored = JSON.parse(localStorageMock.getItem('pomodoro_tasks'));
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('Persisted task');
    });

    it('should persist templates to localStorage', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Task');
      });

      const task = result.current.tasks[0];
      act(() => {
        result.current.saveAsTemplate(task);
      });

      const stored = JSON.parse(localStorageMock.getItem('pomodoro_templates'));
      expect(stored).toHaveLength(1);
    });

    it('should restore tasks from localStorage on re-render', () => {
      const { result } = renderHook(() => useTasks());

      act(() => {
        result.current.addTask('Task 1');
        result.current.addTask('Task 2');
      });

      const { result: newResult } = renderHook(() => useTasks());

      expect(newResult.current.tasks).toHaveLength(2);
      expect(newResult.current.tasks[0].title).toBe('Task 2');
      expect(newResult.current.tasks[1].title).toBe('Task 1');
    });
  });
});
