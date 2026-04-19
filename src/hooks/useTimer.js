import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const PHASE_LABELS = {
  work: 'Focus Time',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export function useTimer({ onComplete, settings, externalStatus, externalPhase, externalTimeRemaining, externalSessionsCompleted, onStatusChange, onPhaseChange, onTimeRemainingChange, onSessionsCompletedChange } = {}) {
  const [status, setStatus] = useState(externalStatus || 'idle');
  const [phase, setPhase] = useState(externalPhase || 'work');
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const workDuration = settings?.workDuration ?? 25;
    return externalTimeRemaining ?? workDuration * 60;
  });
  const [sessionsCompleted, setSessionsCompleted] = useState(externalSessionsCompleted || 0);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(null);
  const phaseRef = useRef(phase);
  const sessionsCompletedRef = useRef(sessionsCompleted);
  const statusRef = useRef(status);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);
  const timeRemainingRef = useRef(timeRemaining);
  const settingsRef = useRef(settings);

  phaseRef.current = phase;
  sessionsCompletedRef.current = sessionsCompleted;
  statusRef.current = status;
  onCompleteRef.current = onComplete;
  timeRemainingRef.current = timeRemaining;
  settingsRef.current = settings;

  useEffect(() => {
    if (externalStatus !== undefined && externalStatus !== status) {
      setStatus(externalStatus);
    }
  }, [externalStatus]);

  const getPhaseDuration = useCallback((p, sessionsBeforeLongBreak = 4) => {
    const workDuration = settingsRef.current?.workDuration || 25;
    const shortBreakDuration = settingsRef.current?.shortBreakDuration || 5;
    const longBreakDuration = settingsRef.current?.longBreakDuration || 15;
    switch (p) {
      case 'work':
        return workDuration * 60;
      case 'shortBreak':
        return shortBreakDuration * 60;
      case 'longBreak':
        return longBreakDuration * 60;
      default:
        return workDuration * 60;
    }
  }, []);

  const getNextPhase = useCallback((currentPhase, completedSessions) => {
    const sessionsBeforeLongBreak = settingsRef.current?.sessionsBeforeLongBreak || 4;
    if (currentPhase === 'work') {
      if (completedSessions % sessionsBeforeLongBreak === 0 && completedSessions > 0) {
        return 'longBreak';
      }
      return 'shortBreak';
    }
    return 'work';
  }, []);

  const tick = useCallback(() => {
    if (hasCompletedRef.current) return;
    
    if (startTimeRef.current) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const total = getPhaseDuration(phaseRef.current);
      const remaining = Math.max(0, total - elapsed);
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        hasCompletedRef.current = true;
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (phaseRef.current === 'work') {
          const newSessions = sessionsCompletedRef.current + 1;
          setSessionsCompleted(newSessions);
          if (onCompleteRef.current) onCompleteRef.current(phaseRef.current, newSessions);

          const next = getNextPhase(phaseRef.current, newSessions);
          setPhase(next);
          setTimeRemaining(getPhaseDuration(next));
          setStatus('idle');
        } else {
          const next = getNextPhase(phaseRef.current, sessionsCompletedRef.current);
          setPhase(next);
          setTimeRemaining(getPhaseDuration(next));
          setStatus('idle');
        }
      }
    }
  }, [getPhaseDuration, getNextPhase]);

  const progress = useMemo(() => {
    const total = getPhaseDuration(phase);
    return ((total - timeRemaining) / total) * 100;
  }, [phase, timeRemaining, getPhaseDuration]);

  useEffect(() => {
    if (status === 'running' && !intervalRef.current) {
      startTimeRef.current = Date.now() - ((getPhaseDuration(phase) - timeRemaining) * 1000);
      intervalRef.current = setInterval(tick, 1000);
    }
  }, [status, phase, timeRemaining, getPhaseDuration, tick]);

  useEffect(() => {
    if (externalPhase !== undefined && externalPhase !== phase) {
      setPhase(externalPhase);
    }
  }, [externalPhase]);

  useEffect(() => {
    if (externalTimeRemaining !== undefined && externalTimeRemaining !== timeRemaining) {
      setTimeRemaining(externalTimeRemaining);
    }
  }, [externalTimeRemaining]);

  useEffect(() => {
    if (externalSessionsCompleted !== undefined && externalSessionsCompleted !== sessionsCompleted) {
      setSessionsCompleted(externalSessionsCompleted);
    }
  }, [externalSessionsCompleted]);

  useEffect(() => {
    if (status === 'idle' && settings) {
      const newDuration = getPhaseDuration(phase);
      setTimeRemaining(newDuration);
    }
  }, [settings?.workDuration, settings?.shortBreakDuration, settings?.longBreakDuration, status, phase, getPhaseDuration]);

  useEffect(() => {
    if (status === 'running' && settings) {
      const newDuration = getPhaseDuration(phase);
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, newDuration - elapsed);
      setTimeRemaining(remaining);
      startTimeRef.current = Date.now() - ((newDuration - remaining) * 1000);
    }
  }, [settings?.workDuration, settings?.shortBreakDuration, settings?.longBreakDuration, status, phase, getPhaseDuration]);

  useEffect(() => {
    if (onStatusChange && status !== externalStatus) {
      onStatusChange(status);
    }
  }, [status, onStatusChange, externalStatus]);

  useEffect(() => {
    if (onPhaseChange && phase !== externalPhase) {
      onPhaseChange(phase);
    }
  }, [phase, onPhaseChange, externalPhase]);

  useEffect(() => {
    if (onTimeRemainingChange && timeRemaining !== externalTimeRemaining) {
      onTimeRemainingChange(timeRemaining);
    }
  }, [timeRemaining, onTimeRemainingChange, externalTimeRemaining]);

  useEffect(() => {
    if (onSessionsCompletedChange && sessionsCompleted !== externalSessionsCompleted) {
      onSessionsCompletedChange(sessionsCompleted);
    }
  }, [sessionsCompleted, onSessionsCompletedChange, externalSessionsCompleted]);

  const start = useCallback((explicitTimeRemaining) => {
    if (statusRef.current === 'running') return;
    
    hasCompletedRef.current = false;
    const tr = explicitTimeRemaining !== undefined ? explicitTimeRemaining : timeRemainingRef.current;
    startTimeRef.current = Date.now() - ((getPhaseDuration(phaseRef.current) - tr) * 1000);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(tick, 1000);
    setStatus('running');
  }, [getPhaseDuration, tick]);

  const pause = useCallback(() => {
    if (statusRef.current !== 'running') return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    pausedTimeRef.current = Date.now();
    setStatus('paused');
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    hasCompletedRef.current = false;
    startTimeRef.current = null;
    setTimeRemaining(getPhaseDuration(phaseRef.current));
    setStatus('idle');
  }, [getPhaseDuration]);

  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    let newSessions = sessionsCompletedRef.current;
    if (phaseRef.current === 'work') {
      newSessions = sessionsCompletedRef.current + 1;
    }

    const nextPhase = getNextPhase(phaseRef.current, newSessions);
    const nextDuration = getPhaseDuration(nextPhase);

    setSessionsCompleted(newSessions);
    setPhase(nextPhase);
    setTimeRemaining(nextDuration);
    setStatus('idle');

    return { nextPhase, nextDuration, newSessions };
  }, [getPhaseDuration, getNextPhase]);

  useEffect(() => {
    if (status === 'running') {
      document.title = `🍅 ${Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:${(timeRemaining % 60).toString().padStart(2, '0')}`;
    } else {
      document.title = 'Pomodoro Timer';
    }
  }, [status, timeRemaining]);

  const startRef = useRef(null);
  const pauseRef = useRef(null);
  const resetRef = useRef(null);
  const skipRef = useRef(null);

  startRef.current = start;
  pauseRef.current = pause;
  resetRef.current = reset;
  skipRef.current = skip;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        if (statusRef.current === 'running') {
          pauseRef.current?.();
        } else {
          startRef.current?.();
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetRef.current?.();
      } else if (e.code === 'KeyS') {
        e.preventDefault();
        skipRef.current?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    status,
    phase,
    timeRemaining,
    setTimeRemaining,
    setPhase,
    sessionsCompleted,
    progress,
    start,
    pause,
    reset,
    skip,
  };
}