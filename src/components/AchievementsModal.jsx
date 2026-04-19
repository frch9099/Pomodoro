import { memo } from 'react';
import { X, Award, Flame, TreeDeciduous, Clock, Target } from 'lucide-react';
import { ACHIEVEMENTS, TREE_TYPES } from '../utils/achievements';

const CATEGORY_ICONS = {
  count: Target,
  streak: Flame,
  special: Award,
};

const AchievementCard = memo(function AchievementCard({ achievement, earned, earnedAt }) {
  const IconComponent = CATEGORY_ICONS[achievement.type] || Award;
  const isUnlocked = earned;

  return (
    <div
      className={`p-4 rounded-xl transition-all ${
        isUnlocked
          ? 'bg-gradient-to-br from-[#FFD54F]/20 to-[#FFE082]/10 border border-[#FFD54F]/30'
          : 'bg-[#F0EFEB] dark:bg-[#2D3530] opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${
            isUnlocked ? 'bg-[#FFD54F]/20' : 'bg-[#E8EBE4] dark:bg-[#1A1F1C]'
          }`}
        >
          <IconComponent
            className={`w-6 h-6 ${isUnlocked ? 'text-[#FFD54F]' : 'text-[#9CA89F]'}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold ${
              isUnlocked ? 'text-[#2D3830] dark:text-[#E8EBE4]' : 'text-[#5C6B60] dark:text-[#9CA89F]'
            }`}
          >
            {achievement.title}
          </h4>
          <p
            className={`text-sm mt-0.5 ${
              isUnlocked ? 'text-[#5C6B60] dark:text-[#9CA89F]' : 'text-[#9CA89F]'
            }`}
          >
            {achievement.description}
          </p>
          {isUnlocked && earnedAt && (
            <p className="text-xs text-[#9CA89F] mt-1">
              Earned: {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}
          {!isUnlocked && (
            <p className="text-xs text-[#9CA89F] mt-1">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden bg-[#FAF9F7] dark:bg-[#1A1F1C] rounded-2xl shadow-xl animate-modal-in">
        <div className="flex items-center justify-between p-6 border-b border-[#E8EBE4] dark:border-[#2D3530]">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#FFD54F]" />
            <h2 className="text-xl font-bold text-[#2D3830] dark:text-[#E8EBE4]">
              Achievements
            </h2>
            <span className="px-2 py-0.5 text-sm bg-[#FFD54F]/20 text-[#2D3830] dark:text-[#E8EBE4] rounded-full">
              {earnedIds.length}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#F0EFEB] dark:hover:bg-[#2D3530] transition-colors"
            aria-label="Close achievements"
          >
            <X className="w-5 h-5 text-[#5C6B60] dark:text-[#9CA89F]" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#5C6B60] dark:text-[#9CA89F] uppercase tracking-wider mb-3">
              Progress
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#FFFFFF] dark:bg-[#252B27] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-[#4CAF50]" />
                  <span className="text-sm text-[#5C6B60] dark:text-[#9CA89F]">Total</span>
                </div>
                <p className="text-2xl font-bold text-[#2D3830] dark:text-[#E8EBE4]">
                  {stats.totalPomodoros || 0}
                </p>
              </div>
              <div className="p-4 bg-[#FFFFFF] dark:bg-[#252B27] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-[#FFD54F]" />
                  <span className="text-sm text-[#5C6B60] dark:text-[#9CA89F]">Streak</span>
                </div>
                <p className="text-2xl font-bold text-[#2D3830] dark:text-[#E8EBE4]">
                  {stats.currentStreak || 0} days
                </p>
              </div>
              <div className="p-4 bg-[#FFFFFF] dark:bg-[#252B27] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TreeDeciduous className="w-5 h-5 text-[#4CAF50]" />
                  <span className="text-sm text-[#5C6B60] dark:text-[#9CA89F]">Trees</span>
                </div>
                <p className="text-2xl font-bold text-[#2D3830] dark:text-[#E8EBE4]">
                  {stats.plantedTrees?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-[#FFFFFF] dark:bg-[#252B27] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-[#64B5F6]" />
                  <span className="text-sm text-[#5C6B60] dark:text-[#9CA89F]">Best</span>
                </div>
                <p className="text-2xl font-bold text-[#2D3830] dark:text-[#E8EBE4]">
                  {stats.bestStreak || 0} days
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#5C6B60] dark:text-[#9CA89F] uppercase tracking-wider mb-3">
              Tree Collection
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TREE_TYPES).map(([treeId, tree]) => {
                const unlocked = treeTypesUnlocked.includes(treeId);
                return (
                  <div
                    key={treeId}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                      unlocked
                        ? 'bg-[#4CAF50]/10 border border-[#4CAF50]/30'
                        : 'bg-[#F0EFEB] dark:bg-[#2D3530] opacity-50'
                    }`}
                  >
                    <span className="text-xl">{tree.icon}</span>
                    <span
                      className={`text-sm font-medium ${
                        unlocked ? 'text-[#2D3830] dark:text-[#E8EBE4]' : 'text-[#9CA89F]'
                      }`}
                    >
                      {tree.name}
                    </span>
                    {!unlocked && (
                      <span className="text-xs text-[#9CA89F]">
                        {tree.unlockAt} pomodoros
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#5C6B60] dark:text-[#9CA89F] uppercase tracking-wider mb-3">
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
                    earnedAt={stats.achievements?.find((a) => a === achievement.id) ? new Date().toISOString() : null}
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