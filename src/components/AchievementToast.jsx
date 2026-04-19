import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ACHIEVEMENTS } from '../utils/achievements';

export default function AchievementToast({ achievement, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleClick = () => {
    setIsLeaving(true);
    setTimeout(onDismiss, 300);
  };

  const iconName = achievement?.icon || 'Award';

  return (
    <div
      onClick={handleClick}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 cursor-pointer transition-all duration-300 ${
        isLeaving ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-white dark:bg-[#252B27] rounded-xl shadow-xl border border-[#E0E0E0] dark:border-[#3D4643] p-4 min-w-[280px] max-w-[320px]">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-2">
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
            <h4 className="text-sm font-semibold text-[#2D3830] dark:text-[#E8EBE4]">
              Achievement Unlocked!
            </h4>
            <p className="text-sm font-medium text-[#4CAF50] dark:text-[#66BB6A]">
              {achievement?.title}
            </p>
            <p className="text-xs text-[#5C6B60] dark:text-[#9CA89F]">
              {achievement?.description}
            </p>
          </div>
          <button
            onClick={handleClick}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 text-[#5C6B60] dark:text-[#9CA89F]" />
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
