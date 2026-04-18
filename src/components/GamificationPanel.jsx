import { TreePine } from 'lucide-react';
import TreeVisual from './TreeVisual';
import StreakDisplay from './StreakDisplay';

export default function GamificationPanel({ totalPomodoros, plantedTrees, currentStreak, bestStreak }) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-md)]">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <TreePine className="w-4 h-4 text-[var(--accent-green)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Current Tree
            </h3>
          </div>
          <TreeVisual
            totalPomodoros={totalPomodoros}
            plantedTrees={plantedTrees}
          />
        </div>

        <div className="w-px h-32 bg-[var(--bg-tertiary)]" />

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Streak
            </span>
          </div>
          <StreakDisplay
            currentStreak={currentStreak}
            bestStreak={bestStreak}
          />
        </div>
      </div>
    </div>
  );
}