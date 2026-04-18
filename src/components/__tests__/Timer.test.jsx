import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';
import Timer from '../Timer';

describe('Timer', () => {
  it('renders timer with 25:00 display', () => {
    render(
      <AppProvider>
        <Timer />
      </AppProvider>
    );
    expect(screen.getByText('25:00')).toBeTruthy();
  });

  it('renders circular progress SVG', () => {
    render(
      <AppProvider>
        <Timer />
      </AppProvider>
    );
    expect(document.querySelector('svg')).toBeTruthy();
  });

  it('displays Focus Time label for work phase', () => {
    render(
      <AppProvider>
        <Timer />
      </AppProvider>
    );
    expect(screen.getByText('Focus Time')).toBeTruthy();
  });

  it('shows session number', () => {
    render(
      <AppProvider>
        <Timer />
      </AppProvider>
    );
    expect(screen.getByText('Session 1 of 4')).toBeTruthy();
  });

  it('renders Controls component with start button', () => {
    render(
      <AppProvider>
        <Timer />
      </AppProvider>
    );
    expect(screen.getByRole('button', { name: /start timer/i })).toBeTruthy();
  });

  it('renders reset button', () => {
    render(
      <AppProvider>
        <Timer />
      </AppProvider>
    );
    expect(screen.getByRole('button', { name: /reset timer/i })).toBeTruthy();
  });

  it('renders skip button', () => {
    render(
      <AppProvider>
        <Timer />
      </AppProvider>
    );
    expect(screen.getByRole('button', { name: /skip to next phase/i })).toBeTruthy();
  });
});