import { useCallback, memo } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useApp } from '../context/AppContext';
import Controls from './Controls';

const PHASE_COLORS = {
  work: '#4CAF50',
  shortBreak: '#64B5F6',
  longBreak: '#64B5F6',
};

const STATUS_COLORS = {
  idle: '#9CA89F',
  running: '#4CAF50',
  paused: '#FFD54F',
  completed: '#FFD54F',
};

const Timer = memo(function Timer() {
  const { completeSession, startSession, settings } = useApp();

  const handleComplete = useCallback((phase, sessionsCompleted) => {
    completeSession(phase, sessionsCompleted);
  }, [completeSession]);

  const { status, phase, timeRemaining, sessionsCompleted, progress, start, pause, reset, skip } = useTimer({
    onComplete: handleComplete,
    settings,
  });

  const handleStart = useCallback(() => {
    startSession();
    start();
  }, [startSession, start]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const phaseLabel = {
    work: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  }[phase];

  const strokeColor = status === 'idle' ? STATUS_COLORS.idle :
                     status === 'completed' ? STATUS_COLORS.completed :
                     phase === 'work' ? PHASE_COLORS.work : PHASE_COLORS.shortBreak;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke="#E8EBE4"
            strokeWidth="8"
            className="dark:stroke-[#2D3530]"
          />
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono font-bold text-[#2D3830] dark:text-[#E8EBE4]">
            {timeDisplay}
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-medium text-[#5C6B60] dark:text-[#9CA89F]">
          {phaseLabel}
        </p>
        {phase === 'work' && (
          <p className="text-sm text-[#9CA89F] dark:text-[#6B7B70] mt-1">
            Session {(sessionsCompleted % 4) + 1} of 4
          </p>
        )}
      </div>

      <Controls
        status={status}
        onStart={handleStart}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
      />
    </div>
  );
});

export default Timer;