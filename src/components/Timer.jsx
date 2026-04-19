import { useCallback, memo, useEffect, useRef } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useApp } from '../context/AppContext';
import Controls from './Controls';

const PHASE_COLORS = {
  work: 'var(--accent-green)',
  shortBreak: 'var(--accent-blue)',
  longBreak: 'var(--accent-blue)',
};

const STATUS_COLORS = {
  idle: 'var(--text-secondary)',
  running: 'var(--accent-green)',
  paused: 'var(--accent-gold)',
  completed: 'var(--accent-gold)',
};

const Timer = memo(function Timer() {
  const { completeSession, startSession, settings, timerState, updateTimerState, clearTimerState } = useApp();

  const hasRestoredRef = useRef(false);

  const handleComplete = useCallback((phase, sessionsCompleted) => {
    clearTimerState();
    setTimeout(() => {
      completeSession(phase, sessionsCompleted);
    }, 0);
  }, [completeSession, clearTimerState]);

  const { status, phase, timeRemaining, sessionsCompleted, progress, start, pause, reset, skip, setTimeRemaining } = useTimer({
    onComplete: handleComplete,
    settings,
    externalStatus: timerState.status,
    externalPhase: timerState.phase,
    externalTimeRemaining: timerState.timeRemaining,
    externalSessionsCompleted: timerState.sessionsCompleted,
    onStatusChange: (newStatus) => updateTimerState({ status: newStatus }),
    onPhaseChange: (newPhase) => updateTimerState({ phase: newPhase }),
    onTimeRemainingChange: (newTime) => updateTimerState({ timeRemaining: newTime }),
    onSessionsCompletedChange: (newSessions) => updateTimerState({ sessionsCompleted: newSessions }),
  });

  useEffect(() => {
    if (timerState.status === 'running' && timerState.lastUpdateTime) {
      const elapsed = Math.floor((Date.now() - timerState.lastUpdateTime) / 1000);
      const newTimeRemaining = Math.max(0, timerState.timeRemaining - elapsed);

      if (newTimeRemaining <= 0) {
        clearTimerState();
        return;
      }

      setTimeRemaining(newTimeRemaining);
      start();
    } else if (timerState.status === 'idle') {
      hasRestoredRef.current = false;
    }
  }, [timerState.status, timerState.lastUpdateTime]);

  const handleStart = useCallback(() => {
    startSession();
    start();
    updateTimerState({
      status: 'running',
      phase,
      timeRemaining,
      sessionsCompleted,
    });
  }, [startSession, start, updateTimerState, phase, timeRemaining, sessionsCompleted]);

  const handlePause = useCallback(() => {
    pause();
    updateTimerState({ status: 'paused' });
  }, [pause, updateTimerState]);

  const handleReset = useCallback(() => {
    reset();
    updateTimerState({
      status: 'idle',
      timeRemaining: phase === 'work'
        ? settings.workDuration * 60
        : phase === 'shortBreak'
          ? settings.shortBreakDuration * 60
          : settings.longBreakDuration * 60,
    });
  }, [reset, updateTimerState, phase, settings]);

  const handleSkip = useCallback(() => {
    const result = skip();
    if (result) {
      updateTimerState({
        status: 'idle',
        phase: result.nextPhase,
        timeRemaining: result.nextDuration,
        sessionsCompleted: result.newSessions,
      });
    }
  }, [skip, updateTimerState]);

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
            stroke="var(--bg-tertiary)"
            strokeWidth="8"
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
          <span className="text-5xl font-mono font-bold text-[var(--text-primary)]">
            {timeDisplay}
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-medium text-[var(--text-secondary)]">
          {phaseLabel}
        </p>
        {phase === 'work' && (
          <p className="text-sm text-[var(--text-secondary)] opacity-75 mt-1">
            Session {(sessionsCompleted % 4) + 1} of 4
          </p>
        )}
      </div>

      <Controls
        status={status}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onSkip={handleSkip}
      />
    </div>
  );
});

export default Timer;