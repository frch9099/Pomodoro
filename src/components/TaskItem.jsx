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
      <span className="text-xs text-[#5C6B60] dark:text-[#9CA89F]">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`inline-block w-2 h-2 rounded-full mx-0.5 ${
              i < completed
                ? 'bg-[#4CAF50] dark:bg-[#66BB6A]'
                : 'bg-[#E8EBE4] dark:bg-[#2D3530]'
            }`}
          />
        ))}
      </span>
    );
  };

  return (
    <div
      className={`
        group flex items-center gap-3 p-3 rounded-lg
        bg-[#F0EFEB] dark:bg-[#252B27] border border-transparent
        hover:border-[#E0E0E0] dark:hover:border-[#3D4643]
        transition-all duration-200
        ${task.isCompleted ? 'opacity-70' : ''}
        ${isCompleting ? 'scale-95 opacity-50' : ''}
        ${isActive ? 'ring-2 ring-[#4CAF50] dark:ring-[#66BB6A]' : ''}
      `}
    >
      <button
        onClick={handleToggleComplete}
        className={`
          flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
          transition-all duration-200
          ${
            task.isCompleted
              ? 'bg-[#4CAF50] dark:bg-[#66BB6A] border-[#4CAF50] dark:border-[#66BB6A]'
              : 'border-[#5C6B60] dark:border-[#9CA89F] hover:border-[#4CAF50] dark:hover:border-[#66BB6A]'
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
            className="w-full px-2 py-1 text-[#2D3830] dark:text-[#E8EBE4] bg-[#FFFFFF] dark:bg-[#252B27] rounded border-none outline-none focus:ring-2 focus:ring-[#4CAF50] dark:focus:ring-[#66BB6A]"
          />
        ) : (
          <div
            onClick={handleTitleClick}
            className={`
              cursor-pointer truncate
              ${task.isCompleted ? 'line-through text-[#9CA89F]' : 'text-[#2D3830] dark:text-[#E8EBE4]'}
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
            className="text-xs text-[#5C6B60] dark:text-[#9CA89F] hover:text-[#4CAF50] dark:hover:text-[#66BB6A]"
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
                  className="w-full px-2 py-1 text-sm text-[#2D3830] dark:text-[#E8EBE4] bg-[#FFFFFF] dark:bg-[#252B27] rounded border-none outline-none focus:ring-2 focus:ring-[#4CAF50] dark:focus:ring-[#66BB6A] resize-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onUpdate(task.id, { notes: notesInput });
                      setIsEditingNotes(false);
                    }}
                    className="px-2 py-1 text-xs bg-[#4CAF50] dark:bg-[#66BB6A] text-white rounded hover:opacity-90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setNotesInput(task.notes || '');
                      setIsEditingNotes(false);
                    }}
                    className="px-2 py-1 text-xs text-[#5C6B60] dark:text-[#9CA89F] hover:text-[#2D3830] dark:hover:text-[#E8EBE4]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-sm text-[#5C6B60] dark:text-[#9CA89F] p-2 bg-[#FFFFFF] dark:bg-[#252B27] rounded">
                <span className="flex-1">{task.notes || 'No notes'}</span>
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="p-1 rounded hover:bg-[#F0EFEB] dark:hover:bg-[#2D3530] text-[#5C6B60] dark:text-[#9CA89F] hover:text-[#4CAF50] dark:hover:text-[#66BB6A]"
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
          className="p-1.5 rounded hover:bg-[#E8EBE4] dark:hover:bg-[#2D3530] text-[#5C6B60] dark:text-[#9CA89F] hover:text-[#64B5F6] dark:hover:text-[#81D4FA]"
          title="Save as template"
        >
          <Bookmark className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded hover:bg-[#E8EBE4] dark:hover:bg-[#2D3530] text-[#5C6B60] dark:text-[#9CA89F] hover:text-[#E57373]"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}