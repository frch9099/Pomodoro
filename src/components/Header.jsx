import { useState, lazy, Suspense } from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SettingsModal = lazy(() => import('./SettingsModal'));

export default function Header() {
  const { settings, toggleDarkMode, currentView, setCurrentView } = useApp();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1A1F1C]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍅</span>
            <h1 className="text-xl font-bold text-[#2D3830] dark:text-[#E8EBE4]">
              Pomodoro
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('timer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'timer'
                  ? 'bg-[#4CAF50] text-white'
                  : 'text-[#5C6B60] dark:text-[#9CA89F] hover:bg-[#F0EFEB] dark:hover:bg-[#2D3530]'
              }`}
            >
              Timer
            </button>
            <button
              onClick={() => setCurrentView('tasks')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'tasks'
                  ? 'bg-[#4CAF50] text-white'
                  : 'text-[#5C6B60] dark:text-[#9CA89F] hover:bg-[#F0EFEB] dark:hover:bg-[#2D3530]'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setCurrentView('stats')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'stats'
                  ? 'bg-[#4CAF50] text-white'
                  : 'text-[#5C6B60] dark:text-[#9CA89F] hover:bg-[#F0EFEB] dark:hover:bg-[#2D3530]'
              }`}
            >
              Stats
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-[#5C6B60] dark:text-[#9CA89F] hover:bg-[#F0EFEB] dark:hover:bg-[#2D3530] transition-colors"
              aria-label="Toggle dark mode"
            >
              {settings.darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-[#5C6B60] dark:text-[#9CA89F] hover:bg-[#F0EFEB] dark:hover:bg-[#2D3530] transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <Suspense fallback={null}>
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </Suspense>
    </>
  );
}
