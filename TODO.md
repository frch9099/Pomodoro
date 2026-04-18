# Pomodoro App - Implementation TODO

## Phase 1: Foundation
- [x] AppContext setup with all state
- [x] Header component (logo, nav, dark mode toggle)
- [x] Basic layout (main area)
- [x] Dark mode toggle (working)

## Phase 2: Timer Core
- [x] useTimer hook with full state machine
- [x] Timer component (circular progress)
- [x] Controls component
- [x] Tab title timer
- [x] Keyboard shortcuts (Space, R, S)

## Phase 3: Task Management
- [x] useTasks hook
- [x] TaskList + TaskItem components
- [x] Add/edit/delete functionality
- [x] Pomodoro estimation display
- [x] Task templates

## Phase 4: Statistics
- [x] useStats hook
- [x] Stats component with tabs (Today/Week/Month/All Time)
- [x] Session tracking
- [x] Bar chart for weekly
- [x] Calendar heatmap for monthly

## Phase 5: Settings
- [x] Settings modal
- [x] Duration customization
- [x] All settings persist to localStorage
- [x] Reset to defaults

## Phase 6: Gamification
- [x] Tree visual component (5 tree types: Oak, Pine, Cherry, Maple, Bonsai)
- [x] Tree growth stages (Seed/Sprout/Sapling/Mature)
- [x] Forest view (all planted trees)
- [x] Streak tracking (current + best)
- [x] Achievement system (12 achievements)
- [x] Achievement toast notifications

## Phase 7: Polish
- [x] Break suggestions (6 activities)
- [x] Ambient sounds (6 sounds via Web Audio API)
- [x] Browser notifications
- [x] Animations and transitions
- [x] Responsive design (mobile-first)
- [x] Accessibility (ARIA, keyboard nav)

## Phase 8: Testing
- [x] Set up Vitest + React Testing Library + jsdom
- [x] Unit tests for useTimer hook (state machine, phase transitions)
- [x] Unit tests for useTasks hook (add, complete, delete, templates)
- [x] Unit tests for useAchievements hook (unlock conditions)
- [x] Component tests for Timer (render, states)
- [x] Component tests for Controls (play, pause, reset, skip)
- [x] Component tests for TaskList (add task, complete task, delete task)

## Bug Fixes (See BUGS.md)
**Priority:** See BUGS.md for full details

### Critical (4)
- [ ] Bug #1: Add activeTaskId to completeSession dependencies (AppContext.jsx:121-181)
- [ ] Bug #2: Resolve Timer dual state management - use context OR hook (Timer.jsx:19-29)
- [ ] Bug #3: Add externalStatus to useTimer sync effect dependencies (useTimer.js:123-127)
- [ ] Bug #4: Wrap JSON.parse in try-catch for settings (AppContext.jsx:39-42)

### High (5)
- [ ] Bug #5: Fix tab visibility handler stale closure (useTimer.js:240-249)
- [ ] Bug #6: Fix AudioContext memory leak in useSounds (useSounds.js:125-147)
- [ ] Bug #7: Fix stale permission state in useNotifications (useNotifications.js:27-52)
- [ ] Bug #8: Fix ForestView key collision potential (ForestView.jsx:79-87)
- [ ] Bug #9: Persist notificationPermissionDenied to localStorage (AppContext.jsx:110-119)

### Medium (8)
- [ ] Bug #10: Use ref for onComplete in useTimer tick function (useTimer.js:57-91)
- [ ] Bug #11: WeekView bar display - verify logic (Stats.jsx:121-130)
- [ ] Bug #12: Fix session counter display after long break (Timer.jsx:91-93)
- [ ] Bug #13: Ensure stats object is properly updated before checkAchievements
- [ ] Bug #14: BreakSuggestionModal random suggestion memoization
- [ ] Bug #15: Optimize dark mode toggle to avoid unnecessary re-renders
- [ ] Bug #16: hasPermission function in useNotifications is correct
- [ ] Bug #17: SettingsModal debounce cleanup is correct

### Low (13)
- [ ] Bug #18: Use ref for updateSettings in SettingsModal debounce
- [ ] Bug #19: Fix tab title update timing on completion (useTimer.js:199-214)
- [ ] Bug #20: Only show session number during work phase
- [ ] Bug #21: Fix AudioContext LFO cleanup order (useSounds.js:104-116)
- [ ] Bug #22: Add error boundary component to App
- [ ] Bug #23: Remove non-standard badge property from notifications
- [ ] Bug #24: Add notes input field to TaskItem or remove notes button
- [ ] Bug #25: Clear activeTaskId when selected task is deleted
- [ ] Bug #26: Ensure localSettings syncs when settings changes externally
- [ ] Bug #27: Store LFO separately in useSounds instead of oscillator._lfO

---

## Design System Compliance (v0.15.0)
- [x] CSS custom properties for all design tokens (colors, spacing, shadows, border-radius)
- [x] 2-column layout per SPEC (GamificationPanel + TaskList)
- [x] Combined TreeVisual + StreakDisplay into GamificationPanel
- [x] Footer with sound toggle and achievements per SPEC
- [x] Mobile tab navigation [Tasks] [Tree] per SPEC
- [x] Gold color (#FFD54F) for streak display per SPEC

---

## Top 5 Priority Fixes
1. Bug #1: Add `activeTaskId` to `completeSession` dependencies
2. Bug #2: Resolve Timer dual state management
3. Bug #3: Add `externalStatus` to useTimer sync effect dependencies
4. Bug #4: Wrap JSON.parse in try-catch for settings
5. Bug #5: Fix tab visibility handler stale closure

(End of file - total 102 lines)