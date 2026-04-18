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
    <div className="bg-[#FFFFFF] dark:bg-[#252B27] rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#2D3830] dark:text-[#E8EBE4]">Tasks</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={`
              p-2 rounded-lg transition-colors
              ${
                showTemplates
                  ? 'bg-[#64B5F6] dark:bg-[#81D4FA] text-white'
                  : 'bg-[#F0EFEB] dark:bg-[#2D3530] text-[#5C6B60] dark:text-[#9CA89F] hover:text-[#2D3830] dark:hover:text-[#E8EBE4]'
              }
            `}
            title="Templates"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddClick}
            className="p-2 rounded-lg bg-[#4CAF50] dark:bg-[#66BB6A] text-white hover:opacity-90 transition-opacity"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showTemplates && (
        <div className="mb-4 p-3 bg-[#F0EFEB] dark:bg-[#2D3530] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#2D3830] dark:text-[#E8EBE4]">Templates</h3>
            <button
              onClick={() => setShowTemplates(false)}
              className="p-1 rounded hover:bg-[#F0EFEB] dark:hover:bg-[#2D3530]"
            >
              <X className="w-4 h-4 text-[#5C6B60] dark:text-[#9CA89F]" />
            </button>
          </div>
          {templates.length === 0 ? (
            <p className="text-sm text-[#5C6B60] dark:text-[#9CA89F]">No templates yet. Save a task as template to see it here.</p>
          ) : (
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-2 bg-[#FFFFFF] dark:bg-[#252B27] rounded"
                >
                  <div>
                    <span className="text-sm text-[#2D3830] dark:text-[#E8EBE4]">{template.title}</span>
                    <span className="ml-2 text-xs text-[#5C6B60] dark:text-[#9CA89F]">
                      {template.estimatedPomodoros} pomodoro{template.estimatedPomodoros > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onCreateFromTemplate(template.id)}
                      className="p-1 rounded hover:bg-[#4CAF50] hover:text-white text-[#5C6B60] dark:text-[#9CA89F]"
                      title="Use template"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTemplate(template.id)}
                      className="p-1 rounded hover:bg-[#E57373] hover:text-white text-[#5C6B60] dark:text-[#9CA89F]"
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
        <form onSubmit={handleAddSubmit} className="mb-4 p-3 bg-[#F0EFEB] dark:bg-[#2D3530] rounded-lg">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleAddKeyDown}
            placeholder="Task title..."
            autoFocus
            className="w-full px-3 py-2 mb-2 bg-[#FFFFFF] dark:bg-[#252B27] rounded-lg text-[#2D3830] dark:text-[#E8EBE4] placeholder-[#5C6B60] dark:placeholder-[#9CA89F] outline-none focus:ring-2 focus:ring-[#4CAF50] dark:focus:ring-[#66BB6A]"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#5C6B60] dark:text-[#9CA89F]">Estimated pomodoros:</span>
              <button
                type="button"
                onClick={handlePomodoroDecrement}
                className="w-6 h-6 rounded bg-[#FFFFFF] dark:bg-[#252B27] text-[#2D3830] dark:text-[#E8EBE4] hover:bg-[#4CAF50] hover:text-white"
              >
                -
              </button>
              <span className="text-[#2D3830] dark:text-[#E8EBE4] font-medium w-6 text-center">
                {newTaskPomodoros}
              </span>
              <button
                type="button"
                onClick={handlePomodoroIncrement}
                className="w-6 h-6 rounded bg-[#FFFFFF] dark:bg-[#252B27] text-[#2D3830] dark:text-[#E8EBE4] hover:bg-[#4CAF50] hover:text-white"
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
                className="px-3 py-1 text-sm text-[#5C6B60] dark:text-[#9CA89F] hover:text-[#2D3830] dark:hover:text-[#E8EBE4]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-[#4CAF50] dark:bg-[#66BB6A] text-white rounded-lg hover:opacity-90"
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
            <p className="text-[#5C6B60] dark:text-[#9CA89F]">No tasks yet. Add one to get started!</p>
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
                  className="flex items-center gap-1 text-sm text-[#5C6B60] dark:text-[#9CA89F] hover:text-[#2D3830] dark:hover:text-[#E8EBE4]"
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
