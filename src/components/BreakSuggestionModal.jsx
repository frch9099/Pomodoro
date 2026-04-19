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
      return `${seconds / 60} min`;
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
        className={`relative bg-white dark:bg-[#252B27] rounded-2xl shadow-xl p-6 max-w-sm w-full transform transition-all duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-[#5C6B60] dark:text-[#9CA89F]" />
        </button>

        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">
            {displaySuggestion.icon}
          </div>
          <h2
            id="break-suggestion-title"
            className="text-xl font-bold text-[#2D3830] dark:text-[#E8EBE4] mb-2"
          >
            {displaySuggestion.label}
          </h2>
          <p className="text-sm text-[#5C6B60] dark:text-[#9CA89F] mb-6">
            {formatDuration(displaySuggestion.duration)} • {displaySuggestion.category}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleStart}
              className="w-full py-3 px-6 bg-[#4CAF50] hover:bg-[#43A047] active:scale-95 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              aria-label={`Start ${displaySuggestion.label} break`}
            >
              <Play className="w-5 h-5" />
              Start Break
            </button>
            <button
              onClick={onClose}
              className="text-sm text-[#5C6B60] dark:text-[#9CA89F] hover:text-[#2D3830] dark:hover:text-[#E8EBE4] transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
