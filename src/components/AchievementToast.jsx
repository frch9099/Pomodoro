import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';

export default function AchievementToast({ achievement, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const haptics = useHaptics();

  useEffect(() => {
    haptics.achievementUnlock();
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss, haptics]);

  const handleClick = () => {
    setIsLeaving(true);
    setTimeout(onDismiss, 300);
  };

  const iconName = achievement?.icon || 'Award';

  return (
    <div
      onClick={handleClick}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 cursor-pointer transition-all duration-300 ${
        isLeaving ? 'opacity-0 -translate-y-4' : isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-md)] shadow-[var(--shadow-xl)] border border-[var(--bg-tertiary)] p-4 min-w-[280px] max-w-[320px]">
        <div className="flex items-start gap-3">
          <div className="bg-[var(--accent-gold)]/20 rounded-full p-2">
            <span className="text-2xl">
              {iconName === 'Rocket' && '🚀'}
              {iconName === 'Target' && '🎯'}
              {iconName === 'Award' && '🏆'}
              {iconName === 'Trophy' && '🏆'}
              {iconName === 'Flame' && '🔥'}
              {iconName === 'Sunrise' && '🌅'}
              {iconName === 'Moon' && '🌙'}
              {iconName === 'Bookmark' && '🔖'}
              {iconName === 'TreePine' && '🌲'}
              {iconName === 'Star' && '⭐'}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              Achievement Unlocked!
            </h4>
            <p className="text-sm font-medium text-[var(--accent-green)]">
              {achievement?.title}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {achievement?.description}
            </p>
          </div>
          <button
            onClick={handleClick}
            className="p-1 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
          >
            <X className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AchievementToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <AchievementToast
          key={toast.id}
          achievement={toast.achievement}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}
