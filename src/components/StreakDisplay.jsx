import { Flame } from 'lucide-react';

export default function StreakDisplay({ currentStreak, bestStreak }) {
  const isActive = currentStreak > 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Flame
          className={`w-10 h-10 ${
            isActive
              ? 'text-[#FFD54F] dark:text-[#FFE082] fill-[#FFD54F] dark:fill-[#FFE082] animate-pulse'
              : 'text-gray-400'
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
