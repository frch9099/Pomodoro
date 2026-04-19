import { useState } from 'react';
import { Pencil, Trash2, Bookmark, Check } from 'lucide-react';

export default function TaskItem({
  task,
  onToggleComplete,
  onUpdate,
  onDelete,
  onSaveAsTemplate,
  onSelect,
  isActive,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState(task.notes || '');

  const handleTitleClick = () => {
    if (!task.isCompleted) {
      setIsEditing(true);
      setEditTitle(task.title);
    }
  };

  const handleTitleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  const handleToggleComplete = () => {
    if (task.isCompleted) {
      onToggleComplete(task.id);
    } else {
      setIsCompleting(true);
      setTimeout(() => {
        onToggleComplete(task.id);
        setIsCompleting(false);
      }, 300);
    }
  };

  const progressDots = () => {
    const completed = task.completedPomodoros;
    const total = task.estimatedPomodoros;
    return (
      <span className="text-xs text-[var(--text-secondary)]">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`inline-block w-2 h-2 rounded-full mx-0.5 ${
              i < completed
                ? 'bg-[var(--accent-green)]'
                : 'bg-[var(--bg-secondary)]'
            }`}
          />
        ))}
      </span>
    );
  };

  return (
    <div
      className={`
        group flex items-center gap-3 p-3 rounded-[var(--radius-md)]
        bg-[var(--bg-tertiary)] border border-transparent
        hover:border-[var(--bg-secondary)]
        transition-all duration-300
        ${task.isCompleted ? 'opacity-70' : ''}
        ${isCompleting ? 'scale-95 opacity-50' : ''}
        ${isActive ? 'ring-2 ring-[var(--accent-green)]' : ''}
      `}
    >
      <button
        onClick={handleToggleComplete}
        className={`
          flex-shrink-0 w-5 h-5 rounded-[var(--radius-sm)] border-2 flex items-center justify-center
          transition-all duration-300
          ${
            task.isCompleted
              ? 'bg-[var(--accent-green)] border-[var(--accent-green)]'
              : 'border-[var(--text-secondary)] hover:border-[var(--accent-green)]'
          }
        `}
      >
        {task.isCompleted && <Check className="w-3 h-3 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            className="w-full px-2 py-1 text-[var(--text-primary)] bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] border-none outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
          />
        ) : (
          <div
            onClick={handleTitleClick}
            className={`
              cursor-pointer truncate
              ${task.isCompleted ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}
            `}
          >
            {task.title}
          </div>
        )}

        <div className="flex items-center gap-2 mt-1">
          {progressDots()}
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded && task.notes) {
                setNotesInput(task.notes);
                setIsEditingNotes(false);
              } else if (!isExpanded) {
                setIsEditingNotes(true);
              }
            }}
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-green)]"
          >
            {isExpanded ? 'Hide notes' : (task.notes ? 'Show notes' : 'Add notes')}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-2">
            {isEditingNotes ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Add notes..."
                  rows={3}
                  className="w-full px-2 py-1 text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] border-none outline-none focus:ring-2 focus:ring-[var(--accent-green)] resize-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onUpdate(task.id, { notes: notesInput });
                      setIsEditingNotes(false);
                    }}
                    className="px-2 py-1 text-xs bg-[var(--accent-green)] text-white rounded-[var(--radius-sm)] hover:opacity-90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setNotesInput(task.notes || '');
                      setIsEditingNotes(false);
                    }}
                    className="px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)] p-2 bg-[var(--bg-secondary)] rounded-[var(--radius-sm)]">
                <span className="flex-1">{task.notes || 'No notes'}</span>
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--accent-green)]"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onSaveAsTemplate(task)}
          className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent-blue)]"
          title="Save as template"
        >
          <Bookmark className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent-red)]"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}