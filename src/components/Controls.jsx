import { memo } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

const Controls = memo(function Controls({ status, onStart, onPause, onReset, onSkip }) {
  const isRunning = status === 'running';

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onReset}
        className="p-3 rounded-full bg-[#F0EFEB] dark:bg-[#2D3530] text-[#5C6B60] dark:text-[#9CA89F] hover:bg-[#E8EBE4] dark:hover:bg-[#3D4540] hover:scale-105 active:scale-95 transition-all duration-150"
        aria-label="Reset timer"
      >
        <RotateCcw className="w-6 h-6" />
      </button>

      <button
        onClick={isRunning ? onPause : onStart}
        className="p-5 rounded-full bg-[#4CAF50] hover:bg-[#43A047] text-white hover:scale-105 active:scale-95 transition-all duration-150 shadow-lg"
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
        className="p-3 rounded-full bg-[#F0EFEB] dark:bg-[#2D3530] text-[#5C6B60] dark:text-[#9CA89F] hover:bg-[#E8EBE4] dark:hover:bg-[#3D4540] hover:scale-105 active:scale-95 transition-all duration-150"
        aria-label="Skip to next phase"
      >
        <SkipForward className="w-6 h-6" />
      </button>
    </div>
  );
});

export default Controls;