import { useCallback } from 'react';
import { ACHIEVEMENTS, TREE_TYPES, getTreeTypeForPomodoros } from '../utils/achievements';

export function useAchievements(stats, templates, tasks, settings) {
  const checkAchievements = useCallback(() => {
    const earned = [];
    const hour = new Date().getHours();

    for (const achievement of ACHIEVEMENTS) {
      if (stats.achievements.includes(achievement.id)) continue;

      let unlocked = false;

      switch (achievement.type) {
        case 'count':
          if (achievement.id === 'first-pomodoro' && stats.totalPomodoros >= 1) unlocked = true;
          if (achievement.id === 'pom-10' && stats.totalPomodoros >= 10) unlocked = true;
          if (achievement.id === 'pom-50' && stats.totalPomodoros >= 50) unlocked = true;
          if (achievement.id === 'pom-100' && stats.totalPomodoros >= 100) unlocked = true;
          if (achievement.id === 'forest-grower' && stats.plantedTrees.length >= 10) unlocked = true;
          break;
        case 'streak':
          if (achievement.id === 'streak-3' && stats.currentStreak >= 3) unlocked = true;
          if (achievement.id === 'streak-7' && stats.currentStreak >= 7) unlocked = true;
          if (achievement.id === 'streak-30' && stats.currentStreak >= 30) unlocked = true;
          break;
        case 'special':
          if (achievement.id === 'early-bird' && hour < 8) unlocked = true;
          if (achievement.id === 'night-owl' && hour >= 22) unlocked = true;
          if (achievement.id === 'template-creator' && templates.length > 0) unlocked = true;
          if (achievement.id === 'perfect-day') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todaySessions = stats.sessions.filter(s => {
              const sessionDate = new Date(s.completedAt);
              sessionDate.setHours(0, 0, 0, 0);
              return s.phase === 'work' && !s.wasInterrupted && sessionDate.getTime() === today.getTime();
            });
            if (todaySessions.length >= settings.dailyGoal) unlocked = true;
          }
          break;
      }

      if (unlocked) earned.push(achievement);
    }

    return earned;
  }, [stats, templates, settings]);

  const getEarnedAchievements = useCallback(() => {
    return ACHIEVEMENTS.filter(a => stats.achievements.includes(a.id));
  }, [stats.achievements]);

  const getUnlockedTreeTypes = useCallback(() => {
    return stats.treeTypesUnlocked;
  }, [stats.treeTypesUnlocked]);

  return {
    checkAchievements,
    getEarnedAchievements,
    getUnlockedTreeTypes,
  };
}
