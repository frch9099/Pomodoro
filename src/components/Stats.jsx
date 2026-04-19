import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useStats } from '../hooks/useStats';

function CircularProgress({ percentage, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage * circumference);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-[var(--bg-tertiary)]"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-[var(--accent-green)] transition-all duration-500"
      />
    </svg>
  );
}

function FlameIcon({ active }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={active ? 'var(--accent-gold)' : 'var(--text-secondary)'}
      className="inline-block"
    >
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.1.8-4.05 2.18-5.57.37-.41.92-.55 1.43-.38.55.19.95.67 1.01 1.24.12 1.1.52 2.14 1.14 3.02.28.39.78.57 1.24.45.46-.12.78-.55.78-1.03 0-.27-.07-.54-.21-.78-.47-.8-.76-1.67-.85-2.57-.06-.62.18-1.22.63-1.58.45-.36 1.02-.5 1.57-.38 1.09.25 2.22.83 3.12 1.62.38.33.97.31 1.32-.05.35-.36.35-.91 0-1.27C14.67 8.67 12.5 6.5 12.5 3.5c0-1.5.5-2.5 1.5-3.5 0 0 1.5 1.5 1.5 3.5 0 1.5-1 2.5-2 3.5 1-.5 2-1 3-2.5 0 0 1.5 1.5 1.5 3 0 4-3 8-7 8z" />
    </svg>
  );
}

function TodayView({ todayStats, currentStreak, bestStreak, dailyGoal }) {
  const progress = Math.min(1, todayStats.pomodoros / dailyGoal);
  const remaining = Math.max(0, dailyGoal - todayStats.pomodoros);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-6xl font-bold text-[var(--text-primary)]">
        {todayStats.pomodoros}
      </div>
      <div className="text-[var(--text-secondary)]">
        {todayStats.pomodoros === 1 ? 'pomodoro' : 'pomodoros'} today
      </div>

      <div className="relative">
        <CircularProgress percentage={progress} size={140} strokeWidth={10} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[var(--accent-green)]">
            {Math.round(progress * 100)}%
          </span>
          <span className="text-xs text-[var(--text-secondary)]">
            of goal
          </span>
        </div>
      </div>

      {remaining > 0 ? (
        <div className="text-sm text-[var(--text-secondary)]">
          {remaining} more to reach your daily goal
        </div>
      ) : (
        <div className="text-sm text-[var(--accent-green)] font-medium">
          Daily goal achieved!
        </div>
      )}

      <div className="flex gap-8 mt-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <FlameIcon active={currentStreak > 0} />
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {currentStreak}
            </span>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">
            current streak
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <FlameIcon active={bestStreak > 0} />
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {bestStreak}
            </span>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">
            best streak
          </span>
        </div>
      </div>
    </div>
  );
}

function WeekView({ weekStats }) {
  const maxPomodoros = Math.max(...weekStats.map((d) => d.pomodoros), 1);

  return (
    <div className="py-4">
      <div className="flex items-end justify-between gap-2 h-40 px-2">
        {weekStats.map((day, index) => {
          const height = (day.pomodoros / maxPomodoros) * 100;
          return (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-full rounded-t transition-all duration-300 ${
                  day.isToday
                    ? 'bg-[var(--accent-green)]'
                    : 'bg-[var(--accent-green)]/40'
                }`}
                style={{ height: day.pomodoros === 0 ? 0 : `${Math.max(height, 4)}%` }}
              />
              <span
                className={`text-xs ${
                  day.isToday
                    ? 'text-[var(--accent-green)] font-bold'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {day.label}
              </span>
              <span className="text-xs font-medium text-[var(--text-primary)]">
                {day.pomodoros}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthView({ monthStats }) {
  const maxPomodoros = Math.max(...monthStats.map((d) => d.pomodoros), 1);

  const getIntensity = (pomodoros) => {
    if (pomodoros === 0) return 'bg-[var(--bg-tertiary)]';
    const ratio = pomodoros / maxPomodoros;
    if (ratio < 0.25) return 'bg-[var(--accent-green)]/20';
    if (ratio < 0.5) return 'bg-[var(--accent-green)]/40';
    if (ratio < 0.75) return 'bg-[var(--accent-green)]/60';
    return 'bg-[var(--accent-green)]';
  };

  return (
    <div className="py-4">
      <div className="grid grid-cols-10 gap-1">
        {monthStats.map((day, index) => {
          const date = new Date(day.date);
          const dayOfMonth = date.getDate();
          return (
            <div
              key={index}
              className={`aspect-square rounded-sm flex items-center justify-center text-xs
                ${getIntensity(day.pomodoros)}
                ${day.isToday ? 'ring-2 ring-[var(--accent-green)]' : ''}
              `}
              title={`${dayOfMonth}: ${day.pomodoros} pomodoros`}
            >
              {dayOfMonth}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-3 mt-4 text-xs text-[var(--text-secondary)]">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-[var(--bg-tertiary)]" />
          <div className="w-4 h-4 rounded-sm bg-[var(--accent-green)]/20" />
          <div className="w-4 h-4 rounded-sm bg-[var(--accent-green)]/40" />
          <div className="w-4 h-4 rounded-sm bg-[var(--accent-green)]/60" />
          <div className="w-4 h-4 rounded-sm bg-[var(--accent-green)]" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

function AllTimeView({ allTimeStats }) {
  return (
    <div className="py-4 grid grid-cols-2 gap-4">
      <div className="bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] p-4 text-center">
        <div className="text-3xl font-bold text-[var(--text-primary)]">
          {allTimeStats.totalPomodoros}
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          Total Pomodoros
        </div>
      </div>

      <div className="bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] p-4 text-center">
        <div className="text-3xl font-bold text-[var(--text-primary)]">
          {allTimeStats.focusHours}h
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          Focus Hours
        </div>
      </div>

      <div className="bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] p-4 text-center">
        <div className="text-3xl font-bold text-[var(--text-primary)]">
          {allTimeStats.treesPlanted}
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          Trees Planted
        </div>
      </div>

      <div className="bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] p-4 text-center">
        <div className="text-3xl font-bold text-[var(--text-primary)]">
          {allTimeStats.achievementsEarned}
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          Achievements
        </div>
      </div>

      <div className="col-span-2 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] p-4 text-center">
        <div className="text-3xl font-bold text-[var(--accent-gold)]">
          {allTimeStats.bestStreak} days
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          Best Streak Ever
        </div>
      </div>
    </div>
  );
}

export default function Stats() {
  const { settings, stats, getTodayStats, getWeekStats, getMonthStats, getAllTimeStats } = useApp();

  const [activeTab, setActiveTab] = useState('today');

  const todayStats = useMemo(() => getTodayStats(), [getTodayStats]);
  const weekStats = useMemo(() => getWeekStats(), [getWeekStats]);
  const monthStats = useMemo(() => getMonthStats(), [getMonthStats]);
  const allTimeStats = useMemo(() => getAllTimeStats(), [getAllTimeStats]);

  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'allTime', label: 'All Time' },
  ];

  return (
    <div className="bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-4 mt-8">
      <div className="flex border-b border-[var(--bg-tertiary)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative
              ${
                activeTab === tab.id
                  ? 'text-[var(--accent-green)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-green)]" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === 'today' && (
          <TodayView
            todayStats={todayStats}
            currentStreak={stats.currentStreak}
            bestStreak={stats.bestStreak}
            dailyGoal={settings.dailyGoal}
          />
        )}
        {activeTab === 'week' && <WeekView weekStats={weekStats} />}
        {activeTab === 'month' && <MonthView monthStats={monthStats} />}
        {activeTab === 'allTime' && <AllTimeView allTimeStats={allTimeStats} />}
      </div>
    </div>
  );
}
