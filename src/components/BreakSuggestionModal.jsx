import { useEffect, useState } from 'react';
import { X, Play } from 'lucide-react';
import { getRandomSuggestion } from '../utils/breakSuggestions';

export default function BreakSuggestionModal({ isOpen, onClose, onStartBreak, suggestion }) {
  const [isVisible, setIsVisible] = useState(false);
  const [randomSuggestion] = useState(() => getRandomSuggestion());

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;
  const displaySuggestion = suggestion || randomSuggestion;

  const formatDuration = (seconds) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins} min ${secs}s` : `${mins} min`;
    }
    return `${seconds}s`;
  };

  const handleStart = () => {
    onStartBreak(displaySuggestion);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="break-suggestion-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)] p-6 max-w-sm w-full transform transition-all duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>

        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">
            {displaySuggestion.icon}
          </div>
          <h2
            id="break-suggestion-title"
            className="text-xl font-bold text-[var(--text-primary)] mb-2"
          >
            {displaySuggestion.label}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {formatDuration(displaySuggestion.duration)} • {displaySuggestion.category}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleStart}
              className="w-full py-3 px-6 bg-[var(--accent-green)] hover:opacity-90 active:scale-95 text-white font-semibold rounded-[var(--radius-md)] transition-all flex items-center justify-center gap-2"
              aria-label={`Start ${displaySuggestion.label} break`}
            >
              <Play className="w-5 h-5" />
              Start Break
            </button>
            <button
              onClick={onClose}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
