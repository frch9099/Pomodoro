import { useState, useEffect, useCallback, useRef } from 'react';
import { X, RotateCcw, Download, Upload } from 'lucide-react';
import { useApp, defaultSettings } from '../context/AppContext';
import { exportData, importData } from '../utils/exportImport';
import { useHaptics } from '../hooks/useHaptics';

export default function SettingsModal({ isOpen, onClose }) {
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState(null);
  const fileInputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const updateSettingsRef = useRef(updateSettings);
  const haptics = useHaptics();

  useEffect(() => {
    updateSettingsRef.current = updateSettings;
  }, [updateSettings]);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    } else {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

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

  const handleExport = async () => {
    haptics.buttonTap();
    setIsExporting(true);
    try {
      const result = await exportData();
      if (result.success) {
        setImportMessage({ type: 'success', text: `Exported ${result.recordCount} records to ${result.filename}` });
      } else {
        setImportMessage({ type: 'error', text: `Export failed: ${result.error}` });
      }
    } catch (error) {
      setImportMessage({ type: 'error', text: `Export failed: ${error.message}` });
    }
    setIsExporting(false);
    setTimeout(() => setImportMessage(null), 3000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportMessage(null);

    const result = await importData(file);

    if (result.success) {
      setImportMessage({
        type: 'success',
        text: `Imported ${result.recordCount.tasks} tasks, ${result.recordCount.templates} templates`
      });
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setImportMessage({ type: 'error', text: result.error || 'Import failed' });
    }

    setIsImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="fixed inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl md:relative md:rounded-none md:max-h-none md:inset-0 md:mx-auto bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)] w-full max-w-md mx-0 overflow-y-auto">
        <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--bg-tertiary)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
              Timer
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Work Duration
                  </label>
                  <span className="text-sm font-mono text-[var(--accent-green)]">
                    {localSettings.workDuration} min
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={localSettings.workDuration}
                  onChange={(e) => handleChange('workDuration', parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-green)]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Short Break Duration
                  </label>
                  <span className="text-sm font-mono text-[var(--accent-blue)]">
                    {localSettings.shortBreakDuration} min
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={localSettings.shortBreakDuration}
                  onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-blue)]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Long Break Duration
                  </label>
                  <span className="text-sm font-mono text-[var(--accent-blue)]">
                    {localSettings.longBreakDuration} min
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={localSettings.longBreakDuration}
                  onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-blue)]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Sessions Before Long Break
                  </label>
                  <span className="text-sm font-mono text-[var(--accent-green)]">
                    {localSettings.sessionsBeforeLongBreak}
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={localSettings.sessionsBeforeLongBreak}
                  onChange={(e) => handleChange('sessionsBeforeLongBreak', parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-green)]"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
              Sound
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Sound Enabled
                </label>
                <button
                  onClick={() => handleChange('soundEnabled', !localSettings.soundEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    localSettings.soundEnabled
                      ? 'bg-[var(--accent-green)]'
                      : 'bg-[var(--bg-tertiary)]'
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
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Volume
                  </label>
                  <span className="text-sm font-mono text-[var(--text-secondary)]">
                    {localSettings.soundVolume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.soundVolume}
                  onChange={(e) => handleChange('soundVolume', parseInt(e.target.value))}
                  className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-green)]"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
              Notifications
            </h3>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Notifications Enabled
              </label>
                <button
                  onClick={() => handleChange('notificationsEnabled', !localSettings.notificationsEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    localSettings.notificationsEnabled
                      ? 'bg-[var(--accent-green)]'
                      : 'bg-[var(--bg-tertiary)]'
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
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
              Auto-behavior
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Auto-start Breaks
                </label>
                <button
                  onClick={() => handleChange('autoStartBreaks', !localSettings.autoStartBreaks)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    localSettings.autoStartBreaks
                      ? 'bg-[var(--accent-green)]'
                      : 'bg-[var(--bg-tertiary)]'
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
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Auto-start Work
                </label>
                <button
                  onClick={() => handleChange('autoStartWork', !localSettings.autoStartWork)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    localSettings.autoStartWork
                      ? 'bg-[var(--accent-green)]'
                      : 'bg-[var(--bg-tertiary)]'
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
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Continue Sound During Break
                </label>
                <button
                  onClick={() => handleChange('continueSoundDuringBreak', !localSettings.continueSoundDuringBreak)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    localSettings.continueSoundDuringBreak
                      ? 'bg-[var(--accent-green)]'
                      : 'bg-[var(--bg-tertiary)]'
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
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-4">
              Display
            </h3>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Daily Goal (pomodoros)
                </label>
                <span className="text-sm font-mono text-[var(--accent-gold)]">
                  {localSettings.dailyGoal}
                </span>
              </div>
              <input
                type="number"
                min="1"
                max="20"
                value={localSettings.dailyGoal}
                onChange={(e) => handleChange('dailyGoal', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border-0 text-[var(--text-primary)] font-mono focus:ring-2 focus:ring-[var(--accent-green)]"
              />
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-[var(--bg-secondary)] border-t border-[var(--bg-tertiary)] px-6 py-4">
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-medium hover:opacity-80 transition-colors duration-300 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export Data'}
            </button>
            <button
              onClick={handleImportClick}
              disabled={isImporting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-medium hover:opacity-80 transition-colors duration-300 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {isImporting ? 'Importing...' : 'Import Data'}
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-medium hover:opacity-80 transition-colors duration-300"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}