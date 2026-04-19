import { useState, useRef, useEffect, memo } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { SOUNDS, getSoundById } from '../utils/sounds';
import { useHaptics } from '../hooks/useHaptics';

const SoundButton = memo(function SoundButton({
  currentSound,
  volume,
  isPlaying,
  onPlaySound,
  onStopSound,
  onSetVolume,
  onOpenAchievements
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const longPressTimer = useRef(null);
  const panelRef = useRef(null);
  const haptics = useHaptics();

  const currentSoundInfo = currentSound ? getSoundById(currentSound) : null;
  const isCurrentlyMuted = isMuted || volume === 0;

  useEffect(() => {
    setIsMuted(volume === 0);
  }, [volume]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  const handleMuteToggle = () => {
    haptics.buttonTap();
    if (isCurrentlyMuted) {
      onSetVolume(previousVolume || 50);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      onSetVolume(0);
      setIsMuted(true);
    }
  };

  const handleSoundSelect = (soundId) => {
    haptics.buttonTap();
    if (currentSound === soundId && isPlaying) {
      onStopSound();
    } else {
      onPlaySound(soundId);
    }
    setIsExpanded(false);
  };

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setIsExpanded(true);
    }, 300);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    handleMouseDown();
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <div
          ref={panelRef}
          className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ${
            isExpanded
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)] p-4 w-72 max-w-[calc(100vw-48px)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[var(--text-primary)]">Ambient Sounds</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SOUNDS.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => handleSoundSelect(sound.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-[var(--radius-md)] transition-all duration-200 ${
                    currentSound === sound.id && isPlaying
                      ? 'bg-[var(--accent-green)]/20 ring-2 ring-[var(--accent-green)]'
                      : 'bg-[var(--bg-tertiary)] hover:ring-2 hover:ring-[var(--accent-green)]/50'
                  }`}
                >
                  <span className="text-2xl">{sound.icon}</span>
                  <span className="text-xs font-medium text-[var(--text-secondary)]">
                    {sound.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--bg-tertiary)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMuteToggle}
                  className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  aria-label={isCurrentlyMuted ? 'Unmute' : 'Mute'}
                >
                  {isCurrentlyMuted ? (
                    <VolumeX className="w-5 h-5 text-[var(--text-secondary)]" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-[var(--text-secondary)]" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => {
                    const newVolume = parseInt(e.target.value, 10);
                    onSetVolume(newVolume);
                    setIsMuted(newVolume === 0);
                  }}
                  className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-green)]"
                  aria-label="Volume"
                />
              </div>
              <button
                onClick={() => {
                  setIsExpanded(false);
                  onOpenAchievements();
                }}
                className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)] transition-colors"
              >
                <span>🏆</span>
                <span>View Achievements</span>
              </button>
            </div>
          </div>
        </div>

        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => {
            if (!isExpanded) {
              if (currentSound && isPlaying) {
                handleMuteToggle();
              } else if (currentSound) {
                onPlaySound(currentSound);
                setIsExpanded(false);
              } else {
                setIsExpanded(true);
              }
            } else {
              setIsExpanded(false);
            }
          }}
          className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-secondary)]/80 backdrop-blur-sm rounded-full shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] hover:bg-[var(--bg-secondary)] transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Sound controls"
        >
          {isCurrentlyMuted || !isPlaying ? (
            <VolumeX className="w-5 h-5 text-[var(--text-secondary)]" />
          ) : (
            <Volume2 className="w-5 h-5 text-[var(--accent-green)]" />
          )}
          {currentSoundInfo && (
            <span className="text-sm text-[var(--text-secondary)] max-w-20 truncate">
              {currentSoundInfo.icon} {currentSoundInfo.label}
            </span>
          )}
        </button>
      </div>
    </>
  );
});

export default SoundButton;
