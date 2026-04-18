import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Controls from '../Controls';

describe('Controls', () => {
  const defaultProps = {
    status: 'idle',
    onStart: vi.fn(),
    onPause: vi.fn(),
    onReset: vi.fn(),
    onSkip: vi.fn(),
  };

  it('renders reset button', () => {
    render(<Controls {...defaultProps} />);
    expect(screen.getByRole('button', { name: /reset timer/i })).toBeTruthy();
  });

  it('renders skip button', () => {
    render(<Controls {...defaultProps} />);
    expect(screen.getByRole('button', { name: /skip to next phase/i })).toBeTruthy();
  });

  it('shows play button when not running', () => {
    render(<Controls {...defaultProps} status="idle" />);
    expect(screen.getByRole('button', { name: /start timer/i })).toBeTruthy();
  });

  it('shows pause button when running', () => {
    render(<Controls {...defaultProps} status="running" />);
    expect(screen.getByRole('button', { name: /pause timer/i })).toBeTruthy();
  });

  it('calls onStart when play button is clicked', () => {
    const onStart = vi.fn();
    render(<Controls {...defaultProps} onStart={onStart} status="idle" />);
    fireEvent.click(screen.getByRole('button', { name: /start timer/i }));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('calls onPause when pause button is clicked', () => {
    const onPause = vi.fn();
    render(<Controls {...defaultProps} onPause={onPause} status="running" />);
    fireEvent.click(screen.getByRole('button', { name: /pause timer/i }));
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it('calls onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    render(<Controls {...defaultProps} onReset={onReset} />);
    fireEvent.click(screen.getByRole('button', { name: /reset timer/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('calls onSkip when skip button is clicked', () => {
    const onSkip = vi.fn();
    render(<Controls {...defaultProps} onSkip={onSkip} />);
    fireEvent.click(screen.getByRole('button', { name: /skip to next phase/i }));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});