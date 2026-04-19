import { memo } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

const Controls = memo(function Controls({ status, onStart, onPause, onReset, onSkip }) {
  const isRunning = status === 'running';

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onReset}
        className="p-3 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Reset timer"
      >
        <RotateCcw className="w-6 h-6" />
      </button>

      <button
        onClick={isRunning ? onPause : onStart}
        className="p-5 rounded-full bg-[var(--accent-green)] hover:opacity-90 text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-[var(--shadow-lg)]"
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
      </button>

      <button
        onClick={onSkip}
        className="p-3 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Skip to next phase"
      >
        <SkipForward className="w-6 h-6" />
      </button>
    </div>
  );
});

export default Controls;