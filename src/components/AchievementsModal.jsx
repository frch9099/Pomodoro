import { memo } from 'react';
import { X, Award, Flame, TreeDeciduous, Clock, Target } from 'lucide-react';
import { ACHIEVEMENTS, TREE_TYPES } from '../utils/achievements';

const CATEGORY_ICONS = {
  count: Target,
  streak: Flame,
  special: Award,
};

const AchievementCard = memo(function AchievementCard({ achievement, earned }) {
  const IconComponent = CATEGORY_ICONS[achievement.type] || Award;
  const isUnlocked = earned;

  return (
    <div
      className={`p-4 rounded-[var(--radius-md)] transition-all ${
        isUnlocked
          ? 'bg-gradient-to-br from-[var(--accent-gold)]/20 to-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30'
          : 'bg-[var(--bg-tertiary)] opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-[var(--radius-sm)] ${
            isUnlocked ? 'bg-[var(--accent-gold)]/20' : 'bg-[var(--bg-secondary)]'
          }`}
        >
          <IconComponent
            className={`w-6 h-6 ${isUnlocked ? 'text-[var(--accent-gold)]' : 'text-[var(--text-secondary)]'}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold ${
              isUnlocked ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            {achievement.title}
          </h4>
          <p
            className={`text-sm mt-0.5 ${
              isUnlocked ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            {achievement.description}
          </p>
          {!isUnlocked && (
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {achievement.requirement} {achievement.type === 'streak' ? 'day streak' : 'pomodoros'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

const AchievementsModal = memo(function AchievementsModal({ isOpen, onClose, stats }) {
  if (!isOpen) return null;

  const earnedIds = stats.achievements || [];
  const treeTypesUnlocked = stats.treeTypesUnlocked || ['oak'];

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl md:relative md:rounded-none md:max-h-none md:inset-0 md:mx-auto md:max-w-2xl w-full md:w-auto overflow-hidden bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)]">
        <div className="flex items-center justify-between p-6 border-b border-[var(--bg-tertiary)]">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[var(--accent-gold)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Achievements
            </h2>
            <span className="px-2 py-0.5 text-sm bg-[var(--accent-gold)]/20 text-[var(--text-primary)] rounded-full">
              {earnedIds.length}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-label="Close achievements"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Progress
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[var(--bg-secondary)] rounded-[var(--radius-md)]">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-[var(--accent-green)]" />
                  <span className="text-sm text-[var(--text-secondary)]">Total</span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats.totalPomodoros || 0}
                </p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] rounded-[var(--radius-md)]">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-[var(--accent-gold)]" />
                  <span className="text-sm text-[var(--text-secondary)]">Streak</span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats.currentStreak || 0} days
                </p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] rounded-[var(--radius-md)]">
                <div className="flex items-center gap-2 mb-2">
                  <TreeDeciduous className="w-5 h-5 text-[var(--accent-green)]" />
                  <span className="text-sm text-[var(--text-secondary)]">Trees</span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats.plantedTrees?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-[var(--bg-secondary)] rounded-[var(--radius-md)]">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-[var(--accent-blue)]" />
                  <span className="text-sm text-[var(--text-secondary)]">Best</span>
                </div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats.bestStreak || 0} days
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Tree Collection
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TREE_TYPES).map(([treeId, tree]) => {
                const unlocked = treeTypesUnlocked.includes(treeId);
                return (
                  <div
                    key={treeId}
                    className={`px-3 py-2 rounded-[var(--radius-sm)] flex items-center gap-2 ${
                      unlocked
                        ? 'bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30'
                        : 'bg-[var(--bg-tertiary)] opacity-50'
                    }`}
                  >
                    <span className="text-xl">{tree.icon}</span>
                    <span
                      className={`text-sm font-medium ${
                        unlocked ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {tree.name}
                    </span>
                    {!unlocked && (
                      <span className="text-xs text-[var(--text-secondary)]">
                        {tree.unlockAt} pomodoros
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              All Achievements
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {ACHIEVEMENTS.map((achievement) => {
                const earned = earnedIds.includes(achievement.id);
                return (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    earned={earned}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AchievementsModal;