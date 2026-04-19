# Pomodoro App - Complete Specification

## 1. Concept & Vision

A focus companion that transforms work sessions into a meditative, rewarding experience. The app combines the proven Pomodoro Technique with forest-style gamification - your focus sessions grow virtual trees, building a forest over time. The aesthetic is calm yet motivating: earthy greens and warm wood tones in light mode, deep forest shadows in dark mode.

**Personality:** Calm, encouraging, non-judgmental. No guilt if you break a streak - just plant again.

---

## 2. Design Language

### Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--bg-primary` | `#FAF9F7` (warm white) | `#1A1F1C` (forest night) | Main background |
| `--bg-secondary` | `#FFFFFF` | `#252B27` | Cards, panels |
| `--bg-tertiary` | `#F0EFEB` | `#2D3530` | Input fields, subtle sections |
| `--text-primary` | `#2D3830` (dark forest) | `#E8EBE4` | Headlines, important text |
| `--text-secondary` | `#5C6B60` | `#9CA89F` | Body text, labels |
| `--accent-green` | `#4CAF50` (growth green) | `#66BB6A` | Active timer, success states |
| `--accent-red` | `#E57373` (tomato red) | `#EF9A9A` | Work phase indicator |
| `--accent-blue` | `#64B5F6` (calm blue) | `#81D4FA` | Break phase indicator |
| `--accent-gold` | `#FFD54F` (achievement gold) | `#FFE082` | Streaks, badges |

### Typography

- **Primary Font:** `Inter` (clean, readable, modern)
- **Fallback:** `system-ui, -apple-system, sans-serif`
- **Headings:** 700 weight, tracking -0.02em
- **Body:** 400 weight, line-height 1.6
- **Monospace (timer):** `JetBrains Mono`, monospace

### Font Scale

```
text-xs:   0.75rem (12px)
text-sm:   0.875rem (14px)
text-base: 1rem (16px)
text-lg:   1.125rem (18px)
text-xl:   1.25rem (20px)
text-2xl:  1.5rem (24px)
text-3xl:  1.875rem (30px)
text-4xl:  2.25rem (36px)
text-5xl:  3rem (48px) - Timer display
text-6xl:  3.75rem (60px) - Timer on mobile
```

### Spacing System

```
space-1:  4px
space-2:  8px
space-3:  12px
space-4:  16px
space-6:  24px
space-8:  32px
space-12: 48px
space-16: 64px
space-20: 80px
```

### Border Radius

```
radius-sm:  6px  - Buttons, inputs
radius-md:  12px - Cards, panels
radius-lg:  16px - Modal dialogs
radius-full: 9999px - Circular elements, pills
```

### Shadows

```
shadow-sm:  0 1px 2px rgba(0,0,0,0.05)
shadow-md:  0 4px 6px rgba(0,0,0,0.07)
shadow-lg:  0 10px 15px rgba(0,0,0,0.1)
shadow-xl:  0 20px 25px rgba(0,0,0,0.15)
```

### Motion Philosophy

- **Duration:** 150ms for micro-interactions (button hover), 300ms for state changes, 500ms for page transitions
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` for most, `cubic-bezier(0.68, -0.55, 0.265, 1.55)` for bouncy celebrations
- **Timer animation:** Smooth circular progress, pulse effect on completion
- **Tree growth:** Slow, satisfying scale transform (2s per growth stage)
- **Toast notifications:** Slide in from top, fade out after 3s

### Visual Assets

- **Icons:** Lucide React (clean, consistent line icons)
- **Tree illustrations:** Custom SVG trees (Oak, Pine, Cherry, Maple, Bonsai)
- **Achievement badges:** Circular badges with icon + label
- **Sound icons:** Custom SVG waveform visualizations

---

## 3. Layout & Structure

### Page Architecture

```
┌─────────────────────────────────────────────────┐
│  Header (fixed)                                 │
│  [Logo/Title]          [Nav] [Dark Mode Toggle] │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │         Main Timer Section              │   │
│  │    ┌─────────────────────────────┐      │   │
│  │    │                             │      │   │
│  │    │     Circular Timer          │      │   │
│  │    │     (large, centered)      │      │   │
│  │    │                             │      │   │
│  │    └─────────────────────────────┘      │   │
│  │         [Session Label]                 │   │
│  │         [Controls: ▶ ⏸ ↺]               │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Tree       │  │   Task Panel         │   │
│  │   Visual     │  │   (collapsible)      │   │
│  │   + Streak   │  │                      │   │
│  └──────────────┘  └──────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │   Stats Summary / Full Stats Modal       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │   Settings Modal (accessible via gear)  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│  Footer (minimal)                              │
│  [Sound Toggle]          [Achievements]        │
└─────────────────────────────────────────────────┘
```

### Responsive Breakpoints

```
sm:  640px   (Mobile landscape)
md:  768px   (Tablet)
lg:  1024px  (Desktop)
xl:  1280px  (Large desktop)
```

### Mobile Layout (< 768px)

```
┌─────────────────────┐
│ Header              │
├─────────────────────┤
│ Timer (full width)  │
│ ─────────────────── │
│ Controls            │
├─────────────────────┤
│ [Tasks] [Tree]      │
│ (tab navigation)    │
├─────────────────────┤
│ Stats Summary       │
└─────────────────────┘
```

---

## 4. Features & Interactions

### 4.1 Timer Engine

**States:** `idle` → `running` → `paused` → `completed` → `idle`

**Phases:**
- `work` (default 25 min)
- `shortBreak` (default 5 min)
- `longBreak` (default 15 min, after 4 work sessions)

**Behavior:**
- Click start → timer begins countdown, button changes to pause
- Click pause → timer freezes, button changes to resume
- Click reset → timer resets to current phase's duration, state → idle
- Timer reaches 0 → phase completes, notification fires, auto-advance to next phase

**Tab Title:** Shows `🍅 24:59` format during countdown, `Pomodoro Timer` when paused/idle

**Keyboard shortcuts:**
- `Space` - Play/Pause
- `R` - Reset
- `S` - Skip to next phase

### 4.2 Task Management

**Task Object Structure:**
```typescript
{
  id: string,           // UUID
  title: string,        // Task name (required)
  estimatedPomodoros: number,  // 1-10, default 1
  completedPomodoros: number,   // 0 to estimatedPomodoros
  isCompleted: boolean,
  isTemplate: boolean,  // If saved as template
  templateId?: string,  // Reference to template if cloned
  createdAt: timestamp,
  completedAt?: timestamp,
  notes?: string,       // Optional notes
  tags?: string[],      // Optional tags
}
```

**Interactions:**
- Click "Add Task" → inline input appears, auto-focus
- Enter → save task, move focus to next empty input
- Click task → expand to show notes/tags
- Drag handle (left) → reorder tasks
- Checkbox → mark complete (strike-through animation, moves to completed section)
- Delete button (hover reveal) → confirm dialog → remove

**Pomodoro Estimation:**
- User sets estimated number of pomodoros per task
- During work session, can click "Start Pomodoro" on a task to link it
- Each completed work session increments `completedPomodoros` for active task
- Task shows progress bar: `●●●○○` (3/5 completed)

**Task Templates:**
- Long-press or right-click task → "Save as Template"
- Templates panel accessible via button in task panel header
- Click template → create new task with same `estimatedPomodoros`
- Templates stored in localStorage with `pomodoro_templates` key

### 4.3 Statistics Dashboard

**Stats Object Structure:**
```typescript
{
  sessions: [
    {
      id: string,
      taskId?: string,
      phase: 'work' | 'shortBreak' | 'longBreak',
      duration: number,        // Actual duration in seconds
      startedAt: timestamp,
      completedAt: timestamp,
      wasInterrupted: boolean,
    }
  ],
  achievements: string[],      // Achievement IDs earned
  currentStreak: number,
  bestStreak: number,
  lastSessionDate: timestamp,
  totalPomodoros: number,
  treeTypesUnlocked: string[],
  plantedTrees: Tree[],
}
```

**Dashboard Views:**
- **Today:** Pomodoros completed today, current streak, today's tree
- **This Week:** Bar chart of daily pomodoros (Mon-Sun)
- **This Month:** Calendar heatmap or line chart
- **All Time:** Total pomodoros, total focus hours, achievements

**Visualizations:**
- Circular progress for daily goal (configurable, default 8)
- Bar chart for weekly (using CSS or lightweight SVG)
- Streak flame icon with number

### 4.4 Gamification - Tree Growth

**Tree Types:**
| Tree | Unlock Requirement | Visual |
|------|-------------------|--------|
| Oak | Default (start) | Broad green tree |
| Pine | 10 total pomodoros | Tall evergreen |
| Cherry | 25 total pomodoros | Pink blossoms |
| Maple | 50 total pomodoros | Orange/red leaves |
| Bonsai | 100 total pomodoros | Small potted tree |

**Tree Growth Stages (per work session):**
1. **Seed** (0-25%): Small mound with seed
2. **Sprout** (25-50%): Small green sprout
3. **Sapling** (50-75%): Young tree with trunk and branches
4. **Mature** (75-100%): Full tree with detailed foliage

**Visual Behavior:**
- Timer running → tree slowly grows (CSS transform scale)
- Session complete → tree "plants" with celebration animation (bounce + particles)
- Session interrupted → tree withers (opacity fade + shake)
- Forest view shows all planted trees in a grid

### 4.5 Achievement System

**Achievement Definition:**
```typescript
{
  id: string,
  title: string,
  description: string,
  icon: string,              // Lucide icon name
  requirement: number,       // e.g., 10 pomodoros
  type: 'count' | 'streak' | 'special',
  earnedAt?: timestamp,
}
```

**Achievement List:**
| ID | Title | Description | Requirement | Type |
|----|-------|-------------|-------------|------|
| `first-pomodoro` | First Step | Complete your first pomodoro | 1 | count |
| `pom-10` | Getting Started | Complete 10 pomodoros | 10 | count |
| `pom-50` | Focus Master | Complete 50 pomodoros | 50 | count |
| `pom-100` | Century | Complete 100 pomodoros | 100 | count |
| `streak-3` | Three Days | Maintain a 3-day streak | 3 | streak |
| `streak-7` | Weekly Warrior | Maintain a 7-day streak | 7 | streak |
| `streak-30` | Monthly Champion | Maintain a 30-day streak | 30 | streak |
| `early-bird` | Early Bird | Complete a pomodoro before 8am | 1 | special |
| `night-owl` | Night Owl | Complete a pomodoro after 10pm | 1 | special |
| `template-creator` | Planner | Create your first task template | 1 | special |
| `forest-grower` | Forest | Plant 10 trees in your forest | 10 | count |
| `perfect-day` | Perfect Day | Complete your daily goal in one day | 1 | special |

**Toast Notification:**
- Achievement earned → toast slides in from top
- Shows achievement icon + title + description
- Auto-dismiss after 4 seconds
- Click to view achievement details

### 4.6 Ambient Sounds

**Sound Options:**
| Sound | Icon | Description |
|-------|------|-------------|
| Rain | 🌧️ | Gentle rainfall |
| Forest | 🌲 | Birds, leaves rustling |
| Coffee Shop | ☕ | Murmured conversation, clinking |
| White Noise | 📻 | Static/white noise |
| Ocean | 🌊 | Waves crashing |
| Fireplace | 🔥 | Crackling fire |

**Implementation:**
- Web Audio API with looping AudioBuffers
- Free sounds from public domain sources (will use placeholder URLs initially)
- Volume slider (0-100%, stored in settings)
- Sounds stop automatically when timer pauses (optional setting)
- Sounds continue during break (optional setting)

**UI:**
- Sound panel in footer (expandable)
- Current sound shown with icon + name
- Click to open sound picker modal
- Volume slider with mute button

### 4.7 Break Suggestions

**Break Activity Structure:**
```typescript
{
  id: string,
  label: string,
  icon: string,
  duration: number,  // seconds, default 30
  category: 'movement' | 'hydration' | 'eyes' | 'mind',
}
```

**Default Break Suggestions:**
| Label | Icon | Duration | Category |
|-------|------|----------|----------|
| Stand & Stretch | 🧘 | 60s | movement |
| Drink Water | 💧 | 30s | hydration |
| Rest Your Eyes | 👀 | 20s | eyes |
| Deep Breaths | 🌬️ | 45s | mind |
| Walk Around | 🚶 | 60s | movement |
| Look Out Window | 🪟 | 30s | eyes |

**Behavior:**
- Work session completes → break suggestion modal appears
- Shows random suggestion from appropriate category
- Timer shows break countdown
- Skip button to dismiss suggestion

### 4.8 Settings

**Settings Object:**
```typescript
{
  // Durations (in minutes)
  workDuration: number,       // Default 25, range 1-60
  shortBreakDuration: number, // Default 5, range 1-30
  longBreakDuration: number,  // Default 15, range 1-60
  sessionsBeforeLongBreak: number, // Default 4, range 2-8

  // Sound
  soundEnabled: boolean,
  currentSound: string | null,
  soundVolume: number,       // 0-100

  // Notifications
  notificationsEnabled: boolean,

  // Auto-behavior
  autoStartBreaks: boolean,   // Auto-start break timer
  autoStartWork: boolean,     // Auto-start work timer
  continueSoundDuringBreak: boolean,

  // Display
  darkMode: boolean,
  dailyGoal: number,          // Default 8 pomodoros

  // Language
  language: string,           // Default 'en'
}
```

**Settings UI:**
- Modal accessible via gear icon in header
- Grouped sections: Timer, Sound, Notifications, Display
- Changes save automatically on change (debounced 500ms)
- Reset to defaults button at bottom

### 4.9 Browser Notifications

**Notification Triggers:**
- Work session complete → "Focus session complete! Time for a break."
- Break complete → "Break's over! Ready to focus?"
- Achievement earned → "Achievement unlocked: [title]"

**Permission Flow:**
- On first timer start, request notification permission
- If denied, show in-app notification instead (banner at top)

---

## 5. Component Inventory

### Timer Component
**States:** idle (gray ring), running (green ring animating), paused (yellow ring, pulsing), completed (gold ring, celebration)
**Variants:** Large (main view), Small (compact view for mobile)
**Props:** timeRemaining, totalTime, phase, state

### Controls Component
**Buttons:** Play/Pause (toggle icon), Reset (arrow icon), Skip (skip icon)
**States:** default, hover (scale 1.05), active (scale 0.95), disabled (opacity 0.5)
**Spacing:** 12px gap between buttons

### TaskList Component
**Header:** "Tasks" title + Add button + Templates button
**Sections:** Active tasks (top), Completed tasks (collapsible, bottom)
**Empty state:** "No tasks yet. Add one to get started!" with illustration

### TaskItem Component
**Layout:** Drag handle | Checkbox | Title + Progress | Actions
**States:** default, hover (show actions), expanded (show notes), completing (strikethrough animation)
**Actions:** Edit (pencil), Delete (trash), Save as Template (bookmark)

### Stats Component
**Tabs:** Today | Week | Month | All Time
**Today view:** Large number + circular progress + streak
**Charts:** Bar chart (week), Calendar heatmap (month)

### TreeVisual Component
**Display:** Current tree SVG with growth stage + tree count
**Animation:** CSS transform on growth, particle effect on complete
**Hover:** Shows tree name + pomodoros to next type

### StreakDisplay Component
**Display:** Flame icon + number + "day streak" label
**States:** Active (orange flame), Broken (gray flame, "Start a new streak!")
**Animation:** Pulse on increment

### AchievementToast Component
**Layout:** Icon | Title + Description | Close button
**Animation:** Slide in from top, fade out
**Position:** Top center, stacked if multiple

### SoundButton (Footer) Component
**Layout:** Floating bottom-right, tap to mute, long press for panel
**Sound Panel:** Slides up from button, 6 sound options, volume slider, achievements link
**States:** collapsed, expanded, muted

### SettingsModal Component
**Layout:** Grouped sections with form controls
**Controls:** Sliders (durations), toggles (boolean), number inputs
**Footer:** Reset to defaults button

### BreakSuggestionModal Component
**Layout:** Activity icon + label + duration + Start button + Skip link
**Animation:** Fade in, pulse gently
**Auto-dismiss:** After break duration or when break ends

---

## 6. Technical Approach

### Framework & Build
- React 18 with Vite
- Tailwind CSS for styling
- No additional UI libraries

### State Management
- React Context for global state (AppContext)
- Custom hooks for encapsulated logic
- localStorage for persistence

### localStorage Schema

```
pomodoro_settings: {
  workDuration: number,
  shortBreakDuration: number,
  longBreakDuration: number,
  sessionsBeforeLongBreak: number,
  soundEnabled: boolean,
  currentSound: string | null,
  soundVolume: number,
  notificationsEnabled: boolean,
  autoStartBreaks: boolean,
  autoStartWork: boolean,
  continueSoundDuringBreak: boolean,
  darkMode: boolean,
  dailyGoal: number,
  language: string,
}

pomodoro_tasks: Task[]

pomodoro_templates: Template[]

pomodoro_stats: {
  sessions: Session[],
  achievements: Achievement[],
  currentStreak: number,
  bestStreak: number,
  lastSessionDate: timestamp,
  totalPomodoros: number,
  treeTypesUnlocked: string[],
  plantedTrees: Tree[],
}
```

### Key Implementation Details

1. **Timer accuracy:** Use `setInterval` with 1s tick, store start timestamp for accuracy
2. **Background tab handling:** Use `document.visibilityState` to pause/resume
3. **Sound loading:** Lazy load AudioBuffers only when sound selected
4. **Notifications:** Request permission on first interaction, cache permission state
5. **Tree animation:** CSS keyframes for growth, requestAnimationFrame for smooth
6. **Charts:** Pure SVG or CSS-based (no chart library needed)
7. **Responsive:** Mobile-first, use Tailwind breakpoints
8. **Accessibility:** ARIA labels, keyboard navigation, focus management

### Testing

**Stack:** Vitest + React Testing Library + jsdom

**Commands:**
```bash
npm test              # Run tests once
npm test -- --watch  # Run tests in watch mode
npm test -- --coverage  # Run with coverage report
```

**Test Files:**
```
src/hooks/__tests__/
├── useTimer.test.js
├── useTasks.test.js
└── useAchievements.test.js

src/components/__tests__/
├── Timer.test.jsx
├── Controls.test.jsx
└── TaskList.test.jsx
```

**Coverage Targets:**
- Hooks: 80%+ coverage
- Components: Key interactions tested

### File Structure
```
src/
├── components/
│   ├── Timer.jsx
│   ├── Controls.jsx
│   ├── TaskList.jsx
│   ├── TaskItem.jsx
│   ├── Stats.jsx
│   ├── TreeVisual.jsx
│   ├── StreakDisplay.jsx
│   ├── AchievementToast.jsx
│   ├── Footer.jsx
│   ├── SettingsModal.jsx
│   ├── BreakSuggestionModal.jsx
│   └── Header.jsx
├── hooks/
│   ├── useTimer.js
│   ├── useTasks.js
│   ├── useStats.js
│   ├── useAchievements.js
│   ├── useSounds.js
│   └── useNotifications.js
├── context/
│   └── AppContext.jsx
├── utils/
│   ├── sounds.js
│   ├── constants.js
│   ├── achievements.js
│   ├── breakSuggestions.js
│   └── helpers.js
├── styles/
│   └── animations.css
├── App.jsx
├── main.jsx
└── index.css
```

---

## 7. Implementation Phases

### Phase 1: Foundation
- [ ] AppContext setup with all state
- [ ] Header component (logo, nav, dark mode toggle)
- [ ] Basic layout (main area)
- [ ] Dark mode toggle (working)

### Phase 2: Timer Core
- [ ] useTimer hook with full state machine
- [ ] Timer component (circular progress)
- [ ] Controls component
- [ ] Tab title timer
- [ ] Keyboard shortcuts (Space: play/pause, R: reset, S: skip)

### Phase 3: Task Management
- [ ] useTasks hook
- [ ] TaskList + TaskItem components
- [ ] Add/edit/delete functionality
- [ ] Pomodoro estimation display
- [ ] localStorage persistence

### Phase 4: Statistics
- [ ] useStats hook
- [ ] Stats component with tabs
- [ ] Session tracking
- [ ] Daily/weekly/monthly views

### Phase 5: Settings
- [ ] Settings modal
- [ ] Duration customization
- [ ] All settings persist to localStorage

### Phase 6: Gamification
- [ ] Tree visual component
- [ ] Tree growth stages
- [ ] Streak tracking
- [ ] Achievement system
- [ ] Achievement toast

### Phase 7: Polish
- [ ] Break suggestions
- [ ] Ambient sounds (Web Audio API)
- [ ] Browser notifications
- [ ] Animations and transitions
- [ ] Responsive design

### Phase 8: Testing
- [ ] Set up Vitest + React Testing Library
- [ ] Unit tests for useTimer hook
- [ ] Unit tests for useTasks hook
- [ ] Unit tests for useAchievements hook
- [ ] Component tests for Timer
- [ ] Component tests for Controls
- [ ] Component tests for TaskList