# Changelog

## v0.16.0 - Critical Bug Fix - Timer Completion
**Date:** 2026-04-19

### Fixed
- **BreakSuggestionModal hooks violation** - The component had a conditional early return (`if (!isOpen && !isVisible) return null`) BEFORE the `useState(randomSuggestion)` call on line 19. This violated React's Rules of Hooks (hooks must always be called in the same order), causing "Rendered more hooks than during the previous render" errors when the timer completed.
- Moved `const [randomSuggestion] = useState(() => getRandomSuggestion())` BEFORE the early return statement to ensure hooks are called consistently on every render.

### Files Modified
- `src/components/BreakSuggestionModal.jsx` - Moved useState hook before conditional return

### Verification
- Build: Passed
- Tests: 99 passed
- Manual testing: Timer completes successfully, tree is planted, streak updates, break suggestion modal appears correctly

---

## v0.15.0 - Design System Compliance
**Date:** 2026-04-18

### Added
- CSS custom properties for design tokens in `index.css` (colors, spacing, shadows, border-radius per SPEC)
- `GamificationPanel.jsx` - Combined TreeVisual + StreakDisplay in single card per SPEC layout
- `Footer.jsx` - Footer component with sound toggle and achievements button per SPEC

### Fixed
- StreakDisplay now uses gold color (`#FFD54F`) instead of `orange-500` per SPEC color palette
- Timer page restructured to follow SPEC 2-column layout (GamificationPanel left, TaskList right)
- Added mobile tab navigation `[Tasks] [Tree]` per SPEC mobile layout
- All components now use CSS custom properties for consistent theming

### Files Created
- `src/components/Footer.jsx` - Footer with sound toggle and achievements
- `src/components/GamificationPanel.jsx` - Combined tree and streak display

### Files Modified
- `src/index.css` - Added CSS custom properties (--bg-primary, --bg-secondary, --bg-tertiary, --text-primary, --text-secondary, --accent-green, --accent-red, --accent-blue, --accent-gold, --radius-sm/md/lg/full, --shadow-sm/md/lg/xl)
- `src/components/StreakDisplay.jsx` - Uses gold color from CSS variables
- `src/App.jsx` - 2-column layout, mobile tabs, Footer integration

### Verification
- Build: Passed
- Tests: 98 passed

---

## v0.14.0 - Bug Fixes
**Date:** 2026-04-18

### Fixed
- **Bug 1: Nav buttons non-functional** - Added `currentView` state to AppContext, updated Header nav buttons to use `setCurrentView` with proper active/inactive styling, App.jsx now conditionally renders Timer/TaskList/Stats views
- **Bug 2: Stats don't update after timer completes** - Fixed stale closure issue in `completeSession` by computing `updatedStats` before passing to `checkAchievements`
- **Bug 3: Dark mode visibility issues** - Replaced all `var(--...)` CSS variables in TaskList.jsx with Tailwind classes (bg-[#FFFFFF] dark:bg-[#252B27], text-[#2D3830] dark:text-[#E8EBE4], etc.)

### Files Modified
- `src/context/AppContext.jsx` - Added currentView state, fixed completeSession stale closure
- `src/components/Header.jsx` - Nav buttons with active state styling
- `src/App.jsx` - Conditional view rendering
- `src/components/TaskList.jsx` - Replaced CSS variables with Tailwind classes

### Verification
- Build: Passed
- Tests: 98 passed

---

## v0.13.0 - Phase 8 Testing Complete
**Date:** 2026-04-18

### Added
- Component tests for Timer (8 tests: time display, SVG ring, phase labels, session number, control buttons)
- Component tests for Controls (8 tests: play/pause, reset, skip buttons, disabled state)
- Component tests for TaskList (7 tests: empty state, add task, task list, completion checkbox, delete button)
- Total test count increased from 76 to 98 tests

### Test Files Created
- `src/components/__tests__/Timer.test.jsx` - 8 tests for Timer component
- `src/components/__tests__/Controls.test.jsx` - 8 tests for Controls component
- `src/components/__tests__/TaskList.test.jsx` - 7 tests for TaskList component

### Configuration
- Updated `vite.config.js` with Vitest configuration (jsdom environment, jest-dom globals)
- All 98 tests passing
- Build passes

---

## v0.12.0 - Phase 7 Polish Complete
**Date:** 2026-04-18

### Added
- BreakSuggestionModal component with 6 break activities (Stand & Stretch, Drink Water, Rest Your Eyes, Deep Breaths, Walk Around, Look Out Window)
- AmbientSoundPanel component with 6 sounds (Rain, Forest, Coffee Shop, White Noise, Ocean, Fireplace)
- useSounds hook with Web Audio API implementation (oscillator-based demo sounds)
- useNotifications hook for browser notifications with permission handling
- BREAK_SUGGESTIONS utility module with 6 suggestions
- SOUNDS utility module with 6 sound definitions
- animations.css with button hover/active scale, toast slide-in, task strikethrough, tree growth, pulse flame animations

### Break Suggestion Modal
- Appears after work session completes with random activity
- Shows activity icon, label, duration, and category
- "Start Break" button to begin break timer
- "Skip" link to dismiss
- Fade-in animation with bounce effect on icon

### Ambient Sounds
- Web Audio API with oscillators for tone-based sounds
- Buffer-based noise generation for Rain, White Noise, Ocean
- Volume slider with mute toggle
- Collapsed/expanded panel states
- Grid of sound options when expanded
- Playing indicator with ring highlight

### Browser Notifications
- Permission request on first timer start (if enabled)
- Work session complete notification: "Focus Session Complete! Time for a break."
- Break complete notification: "Break's Over! Ready to focus?"
- Achievement notification: "Achievement Unlocked! You earned: [title]"

### Animations & Transitions
- Button hover: scale 1.05 (btn-hover-scale class)
- Button active: scale 0.95 (btn-active-scale class)
- Toast slide-in from top animation
- Task completion strikethrough animation
- Tree growth scale transform animation
- Streak flame pulse animation
- Modal fade-in/scale-in animations
- Break suggestion icon bounce animation

### Files Created
- `src/utils/sounds.js` - Sound definitions
- `src/utils/breakSuggestions.js` - Break suggestion definitions
- `src/hooks/useSounds.js` - Web Audio API sound hook
- `src/hooks/useNotifications.js` - Browser notifications hook
- `src/components/BreakSuggestionModal.jsx` - Break suggestion modal
- `src/components/AmbientSoundPanel.jsx` - Sound panel UI
- `src/styles/animations.css` - CSS animation keyframes

### Files Modified
- `src/index.css` - Added animations.css import
- `src/context/AppContext.jsx` - Integrated notifications, break suggestions, sound settings
- `src/App.jsx` - Added AmbientSoundPanel and BreakSuggestionModal

### Test Results
- Build: Passed
- Tests: 76 passed

---

## v0.11.0 - Phase 6 Gamification Complete
**Date:** 2026-04-18

### Added
- TreeVisual component with 5 tree types (Oak, Pine, Cherry, Maple, Bonsai)
- Tree growth stages (Seed/Sprout/Sapling/Mature) with CSS/SVG illustrations
- StreakDisplay component with flame icon, active/broken states, pulse animation
- AchievementToast component with slide-in animation, auto-dismiss after 4s
- ForestView component showing grid of all planted trees
- useAchievements hook with checkAchievements, unlockAchievement, getEarnedAchievements, getUnlockedTreeTypes
- 12 achievements from SPEC.md (first-pomodoro, pom-10/50/100, streak-3/7/30, early-bird, night-owl, template-creator, forest-grower, perfect-day)
- Achievement utility module (src/utils/achievements.js) with ACHIEVEMENTS array, TREE_TYPES, and helper functions

### Integration
- Work session completion adds tree to planted forest
- Tree type changes based on total pomodoros (Oak→Pine at 10, Cherry at 25, Maple at 50, Bonsai at 100)
- Achievement checks run on session completion
- TreeVisual and StreakDisplay integrated into main app layout
- ForestView shows planted trees below task panel

### Files Created
- `src/utils/achievements.js` - Achievement definitions and tree type constants
- `src/hooks/useAchievements.js` - Achievement checking and management hook
- `src/components/TreeVisual.jsx` - Tree growth visualization with SVG illustrations
- `src/components/StreakDisplay.jsx` - Streak flame display with animation
- `src/components/AchievementToast.jsx` - Toast notification for achievements
- `src/components/ForestView.jsx` - Grid view of planted trees
- `src/hooks/__tests__/useAchievements.test.js` - 17 unit tests

### Files Modified
- `src/context/AppContext.jsx` - Added useAchievements integration, tree planting on completion
- `src/App.jsx` - Integrated TreeVisual, StreakDisplay, and ForestView components

### Test Results
- Build: Passed
- Tests: 76 passed

---

## v0.10.0 - Phase 5 Settings Complete
**Date:** 2026-04-18

### Added
- SettingsModal component with grouped sections
- Timer settings: work duration (1-60 min), short break (1-30 min), long break (1-60 min), sessions before long break (2-8)
- Sound settings: enabled toggle, volume slider (0-100%)
- Notifications settings: enabled toggle
- Auto-behavior settings: auto-start breaks, auto-start work, continue sound during break
- Display settings: daily goal (1-20 pomodoros)
- Reset to defaults button with RotateCcw icon
- Debounced auto-save (500ms) for all setting changes
- Settings icon in Header opens modal, click outside or X to close

### Files Created
- `src/components/SettingsModal.jsx` - Full settings modal with sliders, toggles, and number inputs

### Files Modified
- `src/components/Header.jsx` - Integrated SettingsModal with open/close state
- `src/components/Timer.jsx` - Pass settings to useTimer, sync timeRemaining on settings change when idle
- `src/hooks/useTimer.js` - Accept settings parameter, use settings for durations, expose setTimeRemaining/setPhase

### Test Results
- Build: Passed

---

## v0.9.0 - Phase 4 Statistics Complete
**Date:** 2026-04-18

### Added
- useStats hook with session recording and streak tracking
- Stats component with tab navigation (Today/Week/Month/All Time)
- Today view: pomodoros count, circular progress, current/best streak
- Week view: CSS bar chart showing daily pomodoros (Mon-Sun)
- Month view: calendar heatmap (last 30 days) with color intensity
- All Time view: total pomodoros, focus hours, trees planted, achievements
- Tree unlock tracking (Oak→Pine→Cherry→Maple→Bonsai at 10/25/50/100 pomodoros)
- Timer integration: work sessions automatically recorded on completion

### Files Created
- `src/hooks/useStats.js` - Statistics hook with session tracking
- `src/components/Stats.jsx` - Statistics dashboard component
- `src/hooks/__tests__/useStats.test.js` - 24 unit tests

### Files Modified
- `src/context/AppContext.jsx` - Integrated useStats hook, added session callbacks
- `src/components/Timer.jsx` - Calls completeSession on work phase completion
- `src/App.jsx` - Added Stats component to layout

### Test Results
- Build: Passed
- Tests: 59 passed (3 test files)

---

## v0.8.0 - Phase 3 Task Management Complete
**Date:** 2026-04-18

### Added
- useTasks hook with full CRUD operations
- TaskList component with active/completed sections
- TaskItem component with inline editing, progress dots, actions
- Templates feature (save as template, create from template)
- Task persistence to localStorage (pomodoro_tasks)
- Template persistence to localStorage (pomodoro_templates)
- Progress indicator showing completed/estimated pomodoros (●●●○○)

### Files Created
- `src/hooks/useTasks.js` - Task management hook
- `src/components/TaskList.jsx` - Task list container with templates panel
- `src/components/TaskItem.jsx` - Individual task display with edit/delete/template actions
- `src/hooks/__tests__/useTasks.test.js` - 23 unit tests

### Files Modified
- `src/context/AppContext.jsx` - Integrated useTasks hook
- `src/App.jsx` - Added TaskList component to layout

---

## v0.7.0 - Phase 2 Timer Core Complete
**Date:** 2026-04-18

### Added
- useTimer hook with full state machine (idle/running/paused/completed)
- Timer component with SVG circular progress ring
- Controls component with Play/Pause/Reset/Skip buttons
- Tab title updates during countdown (🍅 MM:SS format)
- Keyboard shortcuts (Space: play/pause, R: reset, S: skip)
- Phase transitions: work → shortBreak → work ... → longBreak (after 4 sessions)
- Date.now() based drift correction for accurate timing

### Files Created
- `src/hooks/useTimer.js` - Timer logic with state machine
- `src/components/Timer.jsx` - Circular timer display
- `src/components/Controls.jsx` - Timer control buttons
- `src/hooks/__tests__/useTimer.test.js` - 11 unit tests

### Files Modified
- `src/App.jsx` - Integrated Timer component

---

## v0.6.0 - Phase 1 Foundation Complete
**Date:** 2026-04-18

### Added
- AppContext with settings, tasks, stats state management
- Header component with logo, navigation tabs, dark mode toggle
- Settings icon button in header
- Dark mode persistence via localStorage
- `dark` class toggle on `<html>` element

### Files Created
- `src/context/AppContext.jsx` - Global state management
- `src/components/Header.jsx` - Fixed header with nav and controls

### Files Modified
- `src/App.jsx` - Wrapped with AppProvider, included Header
- `src/main.jsx` - Ready for AppContext (no changes needed)

---

## v0.5.0 - Testing Setup Added
**Date:** 2026-04-18

### Added
- Phase 8: Testing to TODO.md (7 testing tasks)
- Testing section to SPEC.md (Vitest + RTL stack, commands, coverage targets)
- Testing commands to AGENTS.md (npm test, --watch, --coverage)

### Testing Stack
- Vitest (test runner)
- React Testing Library (component tests)
- jsdom (DOM environment)

### Notes
- Testing infrastructure to be set up during Phase 8
- See SPEC.md Section 8 for full testing details

---

## v0.4.0 - Inconsistencies Fixed
**Date:** 2026-04-18

### Fixed
- Added `lucide-react` to package.json (was missing)
- Added `perfect-day` achievement to make 12 total (was 11)
- Added Header component to Phase 1 in SPEC.md
- Added keyboard shortcuts to Phase 2 in SPEC.md
- Added `totalPomodoros`, `treeTypesUnlocked`, `plantedTrees` to stats schema
- Added `lucide-react` dependency via npm install

---

## v0.3.0 - Complete Specification Created
**Date:** 2026-04-18

### Created
- SPEC.md - Complete project specification (~650 lines)

---

## v0.2.0 - Project Scaffold Complete
**Date:** 2026-04-18

### Created
- package.json, vite.config.js, tailwind.config.js, postcss.config.js
- index.html, src/main.jsx, src/App.jsx, src/index.css
- public/favicon.svg, .gitignore

### Verified
- `npm install` ✓
- `npm run build` ✓

---

## v0.1.0 - Initial Setup
**Date:** 2026-04-18

### Created
- AGENTS.md, CHANGELOG.md, TODO.md
