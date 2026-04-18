import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const PHASE_LABELS = {
  work: 'Focus Time',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export function useTimer({ onComplete, settings, externalStatus, externalPhase, externalTimeRemaining, externalSessionsCompleted, onStatusChange, onPhaseChange, onTimeRemainingChange, onSessionsCompletedChange } = {}) {
  const [status, setStatus] = useState(externalStatus || 'idle');
  const [phase, setPhase] = useState(externalPhase || 'work');
  const [timeRemaining, setTimeRemaining] = useState(externalTimeRemaining ?? (settings?.workDuration || 25) * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(externalSessionsCompleted || 0);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(null);
  const lastMinuteRef = useRef(null);
  const phaseRef = useRef(phase);
  const sessionsCompletedRef = useRef(sessionsCompleted);
  const statusRef = useRef(status);
  const onCompleteRef = useRef(onComplete);

  phaseRef.current = phase;
  sessionsCompletedRef.current = sessionsCompleted;
  statusRef.current = status;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (externalStatus !== undefined && externalStatus !== status) {
      setStatus(externalStatus);
    }
  }, [externalStatus]);

  const getPhaseDuration = useCallback((p, sessionsBeforeLongBreak = 4) => {
    const workDuration = settings?.workDuration || 25;
    const shortBreakDuration = settings?.shortBreakDuration || 5;
    const longBreakDuration = settings?.longBreakDuration || 15;
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
  }, [settings]);

  const getNextPhase = useCallback((currentPhase, completedSessions) => {
    if (currentPhase === 'work') {
      if (completedSessions % 4 === 0 && completedSessions > 0) {
        return 'longBreak';
      }
      return 'shortBreak';
    }
    return 'work';
  }, []);

  const tick = useCallback(() => {
    if (startTimeRef.current) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const total = getPhaseDuration(phaseRef.current);
      const remaining = Math.max(0, total - elapsed);
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (phaseRef.current === 'work') {
          const newSessions = sessionsCompletedRef.current + 1;
          setSessionsCompleted(newSessions);
          if (onCompleteRef.current) onCompleteRef.current(phaseRef.current, newSessions);

          const next = getNextPhase(phaseRef.current, newSessions);
          setTimeout(() => {
            setPhase(next);
            setTimeRemaining(getPhaseDuration(next));
            setStatus('idle');
          }, 0);
        } else {
          const next = getNextPhase(phaseRef.current, sessionsCompletedRef.current);
          setTimeout(() => {
            setPhase(next);
            setTimeRemaining(getPhaseDuration(next));
            setStatus('idle');
          }, 0);
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
    if (onStatusChange && status !== externalStatus) {
      onStatusChange(status);
    }
  }, [status, onStatusChange, externalStatus]);

  useEffect(() => {
    if (onPhaseChange && phase !== externalPhase) {
      onPhaseChange(phase);
    }
  }, [phase, onPhaseChange, externalPhase, externalStatus]);

  useEffect(() => {
    if (onTimeRemainingChange && timeRemaining !== externalTimeRemaining) {
      onTimeRemainingChange(timeRemaining);
    }
  }, [timeRemaining, onTimeRemainingChange, externalTimeRemaining, externalStatus]);

  useEffect(() => {
    if (onSessionsCompletedChange && sessionsCompleted !== externalSessionsCompleted) {
      onSessionsCompletedChange(sessionsCompleted);
    }
  }, [sessionsCompleted, onSessionsCompletedChange, externalSessionsCompleted, externalStatus]);

  const start = useCallback(() => {
    if (status === 'running') return;
    
    startTimeRef.current = Date.now() - ((getPhaseDuration(phase) - timeRemaining) * 1000);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(tick, 1000);
    setStatus('running');
  }, [status, phase, timeRemaining, getPhaseDuration, tick]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    pausedTimeRef.current = Date.now();
    setStatus('paused');
  }, [status]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startTimeRef.current = null;
    setTimeRemaining(getPhaseDuration(phase));
    setStatus('idle');
  }, [phase, getPhaseDuration]);

  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    let newSessions = sessionsCompleted;
    if (phase === 'work') {
      newSessions = sessionsCompleted + 1;
    }
    setSessionsCompleted(newSessions);
    
    const nextPhase = getNextPhase(phase, newSessions);
    setPhase(nextPhase);
    setTimeRemaining(getPhaseDuration(nextPhase));
    setStatus('idle');
  }, [phase, sessionsCompleted, getPhaseDuration, getNextPhase]);

  useEffect(() => {
    if (status === 'running') {
      const currentMinute = Math.floor(timeRemaining / 60);
      if (lastMinuteRef.current !== currentMinute) {
        lastMinuteRef.current = currentMinute;
        document.title = `🍅 ${Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:${(timeRemaining % 60).toString().padStart(2, '0')}`;
      }
    } else {
      lastMinuteRef.current = null;
      document.title = 'Pomodoro Timer';
    }
  }, [status, timeRemaining, phase]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        if (status === 'running') {
          pause();
        } else {
          start();
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        reset();
      } else if (e.code === 'KeyS') {
        e.preventDefault();
        skip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, start, pause, reset, skip]);

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