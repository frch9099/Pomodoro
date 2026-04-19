import { Flame } from 'lucide-react';

export default function StreakDisplay({ currentStreak, bestStreak }) {
  const isActive = currentStreak > 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Flame
          className={`w-10 h-10 ${
            isActive
              ? 'text-[var(--accent-gold)] fill-[var(--accent-gold)] animate-pulse'
              : 'text-[var(--text-secondary)]'
          }`}
        />
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
          {currentStreak}
        </span>
      </div>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">
        {isActive ? 'day streak' : 'Start a new streak!'}
      </p>
      <p className="text-xs text-[var(--text-secondary)]">
        Best: {bestStreak} days
      </p>
    </div>
  );
}
