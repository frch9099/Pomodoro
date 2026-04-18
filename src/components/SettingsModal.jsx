import { useState, useEffect, useCallback, useRef } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useApp, defaultSettings } from '../context/AppContext';

export default function SettingsModal({ isOpen, onClose }) {
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const debounceTimerRef = useRef(null);
  const updateSettingsRef = useRef(updateSettings);

  useEffect(() => {
    updateSettingsRef.current = updateSettings;
  }, [updateSettings]);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const debouncedSave = useCallback((updates) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      updateSettingsRef.current(updates);
    }, 500);
  }, []);

  const handleChange = (key, value) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    debouncedSave({ [key]: value });
  };

  const handleReset = () => {
    setLocalSettings(defaultSettings);
    updateSettings(defaultSettings);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-[#252B27] rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-[#252B27] border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#2D3830] dark:text-[#E8EBE4]">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#5C6B60] dark:text-[#9CA89F] hover:bg-[#F0EFEB] dark:hover:bg-[#2D3530] transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-[#5C6B60] dark:text-[#9CA89F] uppercase tracking-wide mb-4">
              Timer
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
                    Work Duration
                  </label>
                  <span className="text-sm font-mono text-[#4CAF50] dark:text-[#66BB6A]">
                    {localSettings.workDuration} min
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={localSettings.workDuration}
                  onChange={(e) => handleChange('workDuration', parseInt(e.target.value))}
                  className="w-full h-2 bg-[#F0EFEB] dark:bg-[#2D3530] rounded-full appearance-none cursor-pointer accent-[#4CAF50]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
                    Short Break Duration
                  </label>
                  <span className="text-sm font-mono text-[#64B5F6] dark:text-[#81D4FA]">
                    {localSettings.shortBreakDuration} min
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={localSettings.shortBreakDuration}
                  onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value))}
                  className="w-full h-2 bg-[#F0EFEB] dark:bg-[#2D3530] rounded-full appearance-none cursor-pointer accent-[#64B5F6]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
                    Long Break Duration
                  </label>
                  <span className="text-sm font-mono text-[#64B5F6] dark:text-[#81D4FA]">
                    {localSettings.longBreakDuration} min
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={localSettings.longBreakDuration}
                  onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value))}
                  className="w-full h-2 bg-[#F0EFEB] dark:bg-[#2D3530] rounded-full appearance-none cursor-pointer accent-[#64B5F6]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
                    Sessions Before Long Break
                  </label>
                  <span className="text-sm font-mono text-[#4CAF50] dark:text-[#66BB6A]">
                    {localSettings.sessionsBeforeLongBreak}
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={localSettings.sessionsBeforeLongBreak}
                  onChange={(e) => handleChange('sessionsBeforeLongBreak', parseInt(e.target.value))}
                  className="w-full h-2 bg-[#F0EFEB] dark:bg-[#2D3530] rounded-full appearance-none cursor-pointer accent-[#4CAF50]"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[#5C6B60] dark:text-[#9CA89F] uppercase tracking-wide mb-4">
              Sound
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
                  Sound Enabled
                </label>
                <button
                  onClick={() => handleChange('soundEnabled', !localSettings.soundEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    localSettings.soundEnabled
                      ? 'bg-[#4CAF50] dark:bg-[#66BB6A]'
                      : 'bg-[#F0EFEB] dark:bg-[#2D3530]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      localSettings.soundEnabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
                    Volume
                  </label>
                  <span className="text-sm font-mono text-[#5C6B60] dark:text-[#9CA89F]">
                    {localSettings.soundVolume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.soundVolume}
                  onChange={(e) => handleChange('soundVolume', parseInt(e.target.value))}
                  className="w-full h-2 bg-[#F0EFEB] dark:bg-[#2D3530] rounded-full appearance-none cursor-pointer accent-[#4CAF50]"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[#5C6B60] dark:text-[#9CA89F] uppercase tracking-wide mb-4">
              Notifications
            </h3>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
                Notifications Enabled
              </label>
              <button
                onClick={() => handleChange('notificationsEnabled', !localSettings.notificationsEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  localSettings.notificationsEnabled
                    ? 'bg-[#4CAF50] dark:bg-[#66BB6A]'
                    : 'bg-[#F0EFEB] dark:bg-[#2D3530]'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    localSettings.notificationsEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[#5C6B60] dark:text-[#9CA89F] uppercase tracking-wide mb-4">
              Auto-behavior
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
                  Auto-start Breaks
                </label>
                <button
                  onClick={() => handleChange('autoStartBreaks', !localSettings.autoStartBreaks)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    localSettings.autoStartBreaks
                      ? 'bg-[#4CAF50] dark:bg-[#66BB6A]'
                      : 'bg-[#F0EFEB] dark:bg-[#2D3530]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      localSettings.autoStartBreaks ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
                  Auto-start Work
                </label>
                <button
                  onClick={() => handleChange('autoStartWork', !localSettings.autoStartWork)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    localSettings.autoStartWork
                      ? 'bg-[#4CAF50] dark:bg-[#66BB6A]'
                      : 'bg-[#F0EFEB] dark:bg-[#2D3530]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      localSettings.autoStartWork ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
                  Continue Sound During Break
                </label>
                <button
                  onClick={() => handleChange('continueSoundDuringBreak', !localSettings.continueSoundDuringBreak)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    localSettings.continueSoundDuringBreak
                      ? 'bg-[#4CAF50] dark:bg-[#66BB6A]'
                      : 'bg-[#F0EFEB] dark:bg-[#2D3530]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      localSettings.continueSoundDuringBreak ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[#5C6B60] dark:text-[#9CA89F] uppercase tracking-wide mb-4">
              Display
            </h3>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-[#2D3830] dark:text-[#E8EBE4]">
                  Daily Goal (pomodoros)
                </label>
                <span className="text-sm font-mono text-[#FFD54F] dark:text-[#FFE082]">
                  {localSettings.dailyGoal}
                </span>
              </div>
              <input
                type="number"
                min="1"
                max="20"
                value={localSettings.dailyGoal}
                onChange={(e) => handleChange('dailyGoal', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 rounded-lg bg-[#F0EFEB] dark:bg-[#2D3530] border-0 text-[#2D3830] dark:text-[#E8EBE4] font-mono focus:ring-2 focus:ring-[#4CAF50] dark:focus:ring-[#66BB6A]"
              />
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-[#252B27] border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F0EFEB] dark:bg-[#2D3530] text-[#5C6B60] dark:text-[#9CA89F] font-medium hover:bg-[#E5E4DF] dark:hover:bg-[#363D38] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}