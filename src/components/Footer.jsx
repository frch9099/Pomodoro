import { Volume2, VolumeX, Award } from 'lucide-react';
import { SOUNDS, getSoundById } from '../utils/sounds';
import { useHaptics } from '../hooks/useHaptics';

export default function Footer({
  currentSound,
  volume,
  isPlaying,
  onPlaySound,
  onStopSound,
  onToggleSound,
  onOpenAchievements,
  soundPanel,
}) {
  const currentSoundInfo = currentSound ? getSoundById(currentSound) : null;
  const isMuted = volume === 0;
  const haptics = useHaptics();

  const handleSoundToggle = () => {
    haptics.buttonTap();
    if (currentSound && isPlaying) {
      onStopSound();
    } else if (currentSound) {
      onPlaySound(currentSound);
    } else {
      onToggleSound();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {soundPanel && (
        <div className="max-w-5xl mx-auto px-4 pb-2">
          {soundPanel}
        </div>
      )}
      <footer className="bg-[var(--bg-secondary)] border-t border-[var(--bg-tertiary)]">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSoundToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
              aria-label={isMuted ? 'Unmute' : 'Mute sound'}
            >
              {isMuted || !isPlaying ? (
                <VolumeX className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <Volume2 className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
              {currentSoundInfo && (
                <span className="text-sm text-[var(--text-secondary)] hidden sm:inline">
                  {currentSoundInfo.icon} {currentSoundInfo.label}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={onOpenAchievements}
            className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
            aria-label="View achievements"
          >
            <Award className="w-5 h-5 text-[var(--accent-gold)]" />
            <span className="text-sm text-[var(--text-secondary)] hidden sm:inline">
              Achievements
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}