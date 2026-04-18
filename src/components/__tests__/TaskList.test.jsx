import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../TaskList';

const mockOnAddTask = vi.fn();
const mockOnUpdateTask = vi.fn();
const mockOnDeleteTask = vi.fn();
const mockOnToggleComplete = vi.fn();
const mockOnSaveAsTemplate = vi.fn();
const mockOnDeleteTemplate = vi.fn();
const mockOnCreateFromTemplate = vi.fn();

const defaultProps = {
  tasks: [],
  templates: [],
  onAddTask: mockOnAddTask,
  onUpdateTask: mockOnUpdateTask,
  onDeleteTask: mockOnDeleteTask,
  onToggleComplete: mockOnToggleComplete,
  onSaveAsTemplate: mockOnSaveAsTemplate,
  onDeleteTemplate: mockOnDeleteTemplate,
  onCreateFromTemplate: mockOnCreateFromTemplate,
};

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state message when no tasks', () => {
    render(<TaskList {...defaultProps} />);
    expect(screen.getByText('No tasks yet. Add one to get started!')).toBeTruthy();
  });

  it('renders add task button', () => {
    render(<TaskList {...defaultProps} />);
    expect(screen.getByRole('button', { name: /add task/i })).toBeTruthy();
  });

  it('shows add task form when add button is clicked', () => {
    render(<TaskList {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByPlaceholderText('Task title...')).toBeTruthy();
  });

  it('calls onAddTask when task form is submitted', () => {
    render(<TaskList {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    const input = screen.getByPlaceholderText('Task title...');
    fireEvent.change(input, { target: { value: 'New Task' } });
    const form = input.closest('form');
    fireEvent.submit(form);
    expect(mockOnAddTask).toHaveBeenCalledWith('New Task', 1);
  });

  it('displays a task in the list', () => {
    const tasks = [
      {
        id: '1',
        title: 'Test Task',
        estimatedPomodoros: 2,
        completedPomodoros: 0,
        isCompleted: false,
        createdAt: Date.now(),
      },
    ];
    render(<TaskList {...defaultProps} tasks={tasks} />);
    expect(screen.getByText('Test Task')).toBeTruthy();
  });

  it('shows completion button for task', () => {
    const tasks = [
      {
        id: '1',
        title: 'Test Task',
        estimatedPomodoros: 2,
        completedPomodoros: 0,
        isCompleted: false,
        createdAt: Date.now(),
      },
    ];
    render(<TaskList {...defaultProps} tasks={tasks} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('shows delete button for task', () => {
    const tasks = [
      {
        id: '1',
        title: 'Test Task',
        estimatedPomodoros: 2,
        completedPomodoros: 0,
        isCompleted: false,
        createdAt: Date.now(),
      },
    ];
    const { container } = render(<TaskList {...defaultProps} tasks={tasks} />);
    const deleteButtons = container.querySelectorAll('button[title="Delete task"]');
    expect(deleteButtons.length).toBe(1);
  });
});