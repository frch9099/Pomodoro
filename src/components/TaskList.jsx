import { useState, useMemo, memo } from 'react';
import { Plus, Bookmark, X, ChevronDown, ChevronRight } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskList = memo(function TaskList({
  tasks,
  templates,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onSaveAsTemplate,
  onDeleteTemplate,
  onCreateFromTemplate,
  activeTaskId,
  onSelectTask,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  const activeTasks = useMemo(() => tasks.filter((t) => !t.isCompleted), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.isCompleted), [tasks]);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim(), newTaskPomodoros);
      setNewTaskTitle('');
      setNewTaskPomodoros(1);
      setIsAdding(false);
    }
  };

  const handleAddKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTaskTitle('');
      setNewTaskPomodoros(1);
    }
  };

  const handlePomodoroIncrement = () => {
    setNewTaskPomodoros((prev) => Math.min(10, prev + 1));
  };

  const handlePomodoroDecrement = () => {
    setNewTaskPomodoros((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-md)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Tasks</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={`
              p-2 rounded-[var(--radius-sm)] transition-colors
              ${
                showTemplates
                  ? 'bg-[var(--accent-blue)] text-white'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }
            `}
            title="Templates"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddClick}
            className="p-2 rounded-[var(--radius-sm)] bg-[var(--accent-green)] text-white hover:opacity-90 transition-opacity"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showTemplates && (
        <div className="mb-4 p-3 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Templates</h3>
            <button
              onClick={() => setShowTemplates(false)}
              className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--bg-secondary)]"
            >
              <X className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          </div>
          {templates.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No templates yet. Save a task as template to see it here.</p>
          ) : (
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-2 bg-[var(--bg-secondary)] rounded-[var(--radius-sm)]"
                >
                  <div>
                    <span className="text-sm text-[var(--text-primary)]">{template.title}</span>
                    <span className="ml-2 text-xs text-[var(--text-secondary)]">
                      {template.estimatedPomodoros} pomodoro{template.estimatedPomodoros > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onCreateFromTemplate(template.id)}
                      className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--accent-green)] hover:text-white text-[var(--text-secondary)]"
                      title="Use template"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTemplate(template.id)}
                      className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--accent-red)] hover:text-white text-[var(--text-secondary)]"
                      title="Delete template"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="mb-4 p-3 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)]">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleAddKeyDown}
            placeholder="Task title..."
            autoFocus
            className="w-full px-3 py-2 mb-2 bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-secondary)]">Estimated pomodoros:</span>
              <button
                type="button"
                onClick={handlePomodoroDecrement}
                className="w-6 h-6 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-green)] hover:text-white"
              >
                -
              </button>
              <span className="text-[var(--text-primary)] font-medium w-6 text-center">
                {newTaskPomodoros}
              </span>
              <button
                type="button"
                onClick={handlePomodoroIncrement}
                className="w-6 h-6 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-green)] hover:text-white"
              >
                +
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewTaskTitle('');
                  setNewTaskPomodoros(1);
                }}
                className="px-3 py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-[var(--accent-green)] text-white rounded-[var(--radius-sm)] hover:opacity-90"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {activeTasks.length === 0 && completedTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)]">No tasks yet. Add one to get started!</p>
          </div>
        ) : (
          <>
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                onSaveAsTemplate={onSaveAsTemplate}
                isActive={task.id === activeTaskId}
                onSelect={() => onSelectTask(task.id)}
              />
            ))}

            {completedTasks.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {showCompleted ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  Completed ({completedTasks.length})
                </button>
                {showCompleted && (
                  <div className="mt-2 space-y-2">
                    {completedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onUpdate={onUpdateTask}
                        onDelete={onDeleteTask}
                        onSaveAsTemplate={onSaveAsTemplate}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default TaskList;
