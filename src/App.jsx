import { useState, lazy, Suspense, Component } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Timer from './components/Timer';
import TaskList from './components/TaskList';
import Stats from './components/Stats';
import GamificationPanel from './components/GamificationPanel';
import ForestView from './components/ForestView';
import Footer from './components/Footer';
import AmbientSoundPanel from './components/AmbientSoundPanel';
import AchievementsModal from './components/AchievementsModal';
import { useSounds } from './hooks/useSounds';

const BreakSuggestionModal = lazy(() => import('./components/BreakSuggestionModal'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-[var(--text-secondary)] mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-[var(--accent-green)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const {
    tasks,
    templates,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    saveAsTemplate,
    deleteTemplate,
    createFromTemplate,
    stats,
    settings,
    updateSettings,
    showBreakSuggestion,
    setShowBreakSuggestion,
    breakSuggestion,
    startBreakFromSuggestion,
    dismissBreakSuggestion,
    currentView,
    activeTaskId,
    setActiveTaskId,
  } = useApp();

  const {
    playSound,
    stopSound,
    setVolume,
    currentSound,
    volume,
    isPlayingState,
  } = useSounds();

  const [mobileTab, setMobileTab] = useState('tasks');
  const [achievementsOpen, setAchievementsOpen] = useState(false);

  const handlePlaySound = (soundId) => {
    playSound(soundId);
    updateSettings({ currentSound: soundId, soundEnabled: true });
  };

  const handleStopSound = () => {
    stopSound();
    updateSettings({ currentSound: null });
  };

  const handleSetVolume = (level) => {
    setVolume(level);
    updateSettings({ soundVolume: level });
  };

  const handleToggleSound = () => {
    if (currentSound) {
      if (isPlayingState) {
        stopSound();
      } else {
        playSound(currentSound);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors pb-32">
      <Header />
<main className="pt-20 px-4">        <div className="max-w-5xl mx-auto">
          <div className={currentView === 'timer' ? 'block' : 'hidden'}>
            <Timer />

            <div className="mt-6 md:mt-8">
              <div className="md:hidden">
                <div className="flex border-b border-[var(--bg-tertiary)]">
                  <button
                    onClick={() => setMobileTab('tasks')}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                      mobileTab === 'tasks'
                        ? 'text-[var(--accent-green)] border-b-2 border-[var(--accent-green)]'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setMobileTab('tree')}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                      mobileTab === 'tree'
                        ? 'text-[var(--accent-green)] border-b-2 border-[var(--accent-green)]'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    Tree
                  </button>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="grid grid-cols-2 gap-6">
                  <GamificationPanel
                    totalPomodoros={stats.totalPomodoros}
                    plantedTrees={stats.plantedTrees}
                    currentStreak={stats.currentStreak}
                    bestStreak={stats.bestStreak}
                  />
                  <TaskList
                    tasks={tasks}
                    templates={templates}
                    onAddTask={addTask}
                    onUpdateTask={updateTask}
                    onDeleteTask={deleteTask}
                    onToggleComplete={toggleComplete}
                    onSaveAsTemplate={saveAsTemplate}
                    onDeleteTemplate={deleteTemplate}
                    onCreateFromTemplate={createFromTemplate}
                    activeTaskId={activeTaskId}
                    onSelectTask={setActiveTaskId}
                  />
                </div>
              </div>

              <div className="md:hidden">
                {mobileTab === 'tasks' ? (
                  <div className="mt-4">
                    <TaskList
                      tasks={tasks}
                      templates={templates}
                      onAddTask={addTask}
                      onUpdateTask={updateTask}
                      onDeleteTask={deleteTask}
                      onToggleComplete={toggleComplete}
                      onSaveAsTemplate={saveAsTemplate}
                      onDeleteTemplate={deleteTemplate}
                      onCreateFromTemplate={createFromTemplate}
                      activeTaskId={activeTaskId}
                      onSelectTask={setActiveTaskId}
                    />
                  </div>
                ) : (
                  <div className="mt-4">
                    <GamificationPanel
                      totalPomodoros={stats.totalPomodoros}
                      plantedTrees={stats.plantedTrees}
                      currentStreak={stats.currentStreak}
                      bestStreak={stats.bestStreak}
                    />
                    <div className="mt-4">
                      <ForestView
                        plantedTrees={stats.plantedTrees}
                        totalPomodoros={stats.totalPomodoros}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:block mt-6">
              <ForestView
                plantedTrees={stats.plantedTrees}
                totalPomodoros={stats.totalPomodoros}
              />
            </div>
          </div>

          {currentView === 'tasks' && (
            <div className="mt-8">
              <TaskList
                tasks={tasks}
                templates={templates}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onToggleComplete={toggleComplete}
                onSaveAsTemplate={saveAsTemplate}
                onDeleteTemplate={deleteTemplate}
                onCreateFromTemplate={createFromTemplate}
                activeTaskId={activeTaskId}
                onSelectTask={setActiveTaskId}
              />
            </div>
          )}

          {currentView === 'stats' && (
            <div className="mt-8">
              <Stats />
            </div>
          )}
        </div>
      </main>

      <Footer
        currentSound={settings.currentSound}
        volume={settings.soundVolume}
        isPlaying={isPlayingState}
        onPlaySound={handlePlaySound}
        onStopSound={handleStopSound}
        onToggleSound={handleToggleSound}
        onOpenAchievements={() => setAchievementsOpen(true)}
        soundPanel={
          <AmbientSoundPanel
            currentSound={settings.currentSound}
            volume={settings.soundVolume}
            isPlaying={isPlayingState}
            onPlaySound={handlePlaySound}
            onStopSound={handleStopSound}
            onSetVolume={handleSetVolume}
          />
        }
      />

      <Suspense fallback={null}>
        <BreakSuggestionModal
          isOpen={showBreakSuggestion}
          onClose={dismissBreakSuggestion}
          onStartBreak={startBreakFromSuggestion}
          suggestion={breakSuggestion}
        />
      </Suspense>

      <AchievementsModal
        isOpen={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        stats={stats}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;