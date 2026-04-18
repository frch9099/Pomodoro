import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with idle status and work phase', () => {
    const { result } = renderHook(() => useTimer());
    
    expect(result.current.status).toBe('idle');
    expect(result.current.phase).toBe('work');
    expect(result.current.timeRemaining).toBe(25 * 60);
    expect(result.current.sessionsCompleted).toBe(0);
  });

  it('should start the timer', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    expect(result.current.status).toBe('running');
  });

  it('should pause the timer', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      result.current.pause();
    });
    
    expect(result.current.status).toBe('paused');
  });

  it('should reset the timer', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.status).toBe('idle');
    expect(result.current.timeRemaining).toBe(25 * 60);
  });

  it('should skip to next phase', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.skip();
    });
    
    expect(result.current.phase).toBe('shortBreak');
    expect(result.current.status).toBe('idle');
  });

  it('should advance to longBreak after completing 4 work sessions', () => {
    const { result } = renderHook(() => useTimer());
    
    expect(result.current.phase).toBe('work');
    
    act(() => { result.current.skip(); }); // work->shortBreak, sessions=1
    expect(result.current.phase).toBe('shortBreak');
    expect(result.current.sessionsCompleted).toBe(1);
    
    act(() => { result.current.skip(); }); // shortBreak->work, no increment
    expect(result.current.phase).toBe('work');
    
    act(() => { result.current.skip(); }); // work->shortBreak, sessions=2
    expect(result.current.phase).toBe('shortBreak');
    expect(result.current.sessionsCompleted).toBe(2);
    
    act(() => { result.current.skip(); }); // shortBreak->work, no increment
    expect(result.current.phase).toBe('work');
    
    act(() => { result.current.skip(); }); // work->shortBreak, sessions=3
    expect(result.current.phase).toBe('shortBreak');
    expect(result.current.sessionsCompleted).toBe(3);
    
    act(() => { result.current.skip(); }); // shortBreak->work, no increment
    
    act(() => { result.current.skip(); }); // work->longBreak, sessions=4
    expect(result.current.phase).toBe('longBreak');
    expect(result.current.sessionsCompleted).toBe(4);
  });

  it('should update tab title when running', () => {
    const { result } = renderHook(() => useTimer());
    
    expect(document.title).toBe('Pomodoro Timer');
    
    act(() => {
      result.current.start();
    });
    
    expect(document.title).toBe('🍅 25:00');
  });

  it('should return progress as percentage', () => {
    const { result } = renderHook(() => useTimer());
    
    expect(result.current.progress).toBe(0);
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current.progress).toBeGreaterThan(0);
  });

  it('should handle space key for play/pause', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    expect(result.current.status).toBe('running');
    
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
    });
    expect(result.current.status).toBe('paused');
    
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
    });
    expect(result.current.status).toBe('running');
  });

  it('should handle R key for reset', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR', bubbles: true }));
    });
    
    expect(result.current.status).toBe('idle');
  });

  it('should handle S key for skip', () => {
    const { result } = renderHook(() => useTimer());
    
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyS', bubbles: true }));
    });
    
    expect(result.current.phase).toBe('shortBreak');
  });
});