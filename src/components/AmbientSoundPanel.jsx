import { useState } from 'react';
import { Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { SOUNDS, getSoundById } from '../utils/sounds';

export default function AmbientSoundPanel({
  currentSound,
  volume,
  isPlaying,
  onPlaySound,
  onStopSound,
  onSetVolume,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const handleToggleSound = (soundId) => {
    if (currentSound === soundId && isPlaying) {
      onStopSound();
    } else {
      onPlaySound(soundId);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      onSetVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      onSetVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    onSetVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const currentSoundInfo = currentSound ? getSoundById(currentSound) : null;

  return (
    <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-md)] shadow-[var(--shadow-md)] overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentSoundInfo ? (
              <>
                <span className="text-2xl" role="img" aria-label={currentSoundInfo.label}>
                  {currentSoundInfo.icon}
                </span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {currentSoundInfo.label}
                </span>
              </>
            ) : (
              <span className="text-sm text-[var(--text-secondary)]">
                No sound
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMuteToggle}
              className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <Volume2 className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
            </button>

            <div className="w-24 hidden sm:block">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-green)]"
                aria-label="Volume"
              />
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label={isExpanded ? 'Collapse sound panel' : 'Expand sound panel'}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-[var(--text-secondary)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />
              )}
            </button>
          </div>
        </div>

        <div className="sm:hidden mt-2">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-green)]"
            aria-label="Volume"
          />
        </div>
      </div>

      <div
        className={`transition-all duration-300 ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 pt-0 grid grid-cols-3 gap-2">
          {SOUNDS.map((sound) => (
            <button
              key={sound.id}
              onClick={() => handleToggleSound(sound.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-[var(--radius-md)] transition-all ${
                currentSound === sound.id && isPlaying
                  ? 'bg-[var(--accent-green)]/20 ring-2 ring-[var(--accent-green)]'
                  : 'bg-[var(--bg-tertiary)] hover:ring-2 hover:ring-[var(--accent-green)]/50'
              }`}
              aria-label={`${sound.label}${currentSound === sound.id && isPlaying ? ' (playing)' : ''}`}
              aria-pressed={currentSound === sound.id && isPlaying}
            >
              <span className="text-2xl" role="img" aria-hidden="true">
                {sound.icon}
              </span>
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                {sound.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
