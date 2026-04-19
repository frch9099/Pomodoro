# Pomodoro App - Agent Context

> **Source of Truth:** See `SPEC.md` for complete design specification.
> **Progress Tracking:** See `CHANGELOG.md` for session history.

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- localStorage (no backend)
- Web Audio API (ambient sounds)

## Developer Commands
```bash
npm install      # Install dependencies
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
npm test         # Run tests once
npm test -- --watch  # Watch mode
npm test -- --coverage  # With coverage
```

## Testing Stack
- Vitest (unit/component tests)
- React Testing Library (component tests)
- jsdom (DOM environment)
- Playwright (E2E tests)

## E2E Testing Commands
```bash
npm run test:e2e        # Run all E2E tests
npm run test:e2e:ui     # Run with Playwright UI
npm run test:e2e:headed # Run headed (browser visible)
npm run test:e2e:debug  # Debug mode
```

## E2E Test Structure
```
e2e/
├── playwright.config.js     # Test runner config
├── setup.ts                  # Custom fixtures & Page Objects
├── pages/                    # Page Object Models
│   ├── TimerPage.ts
│   ├── TaskPage.ts
│   ├── SettingsPage.ts
│   ├── StatsPage.ts
│   └── GamificationPage.ts
└── tests/                    # Test suites
    ├── timer/
    │   ├── workflow.spec.ts  # Start/pause/resume/complete
    │   ├── phases.spec.ts     # Phase transitions
    │   └── keyboard.spec.ts   # Space, R, S shortcuts
    ├── tasks/
    │   ├── crud.spec.ts       # Add/edit/delete/complete
    │   ├── templates.spec.ts  # Template workflows
    │   └── estimation.spec.ts # Pomodoro tracking
    ├── settings/
    │   ├── durations.spec.ts   # Duration customization
    │   ├── persistence.spec.ts # localStorage persistence
    │   └── display.spec.ts     # Dark mode, toggles
    ├── gamification/
    │   ├── tree-growth.spec.ts
    │   ├── streaks.spec.ts
    │   └── achievements.spec.ts
    ├── responsive/
    │   └── viewport.spec.ts   # Mobile/tablet/desktop
    └── accessibility/
        └── a11y.spec.ts       # ARIA, keyboard, focus
```

## E2E Test Coverage (445 tests across 5 browsers)
| Suite | Tests | Coverage |
|-------|-------|----------|
| Timer Workflow | 8 | Start/pause/resume/reset |
| Timer Phases | 6 | Phase transitions, sessions |
| Timer Keyboard | 5 | Space, R, S shortcuts |
| Task CRUD | 8 | Add/edit/delete/complete |
| Task Templates | 5 | Save/create from templates |
| Task Estimation | 4 | Pomodoro progress |
| Settings Durations | 4 | Duration customization |
| Settings Persistence | 4 | localStorage survive reload |
| Settings Display | 6 | Dark mode, toggles |
| Tree Growth | 6 | Growth stages, planting |
| Streaks | 6 | Streak tracking |
| Achievements | 7 | Unlock, toast, persist |
| Responsive | 9 | Mobile/tablet/desktop |
| Accessibility | 11 | ARIA, keyboard, focus |

**Browser Support:** Chromium, Firefox, Safari, Mobile Chrome, Mobile Safari

## Architecture
- Single-page React app, no routing
- Global state via `AppContext`
- Custom hooks: `useTimer`, `useTasks`, `useStats`, `useAchievements`, `useSounds`, `useNotifications`

## localStorage Schema
| Key | Content |
|-----|---------|
| `pomodoro_settings` | All user settings (durations, sound, dark mode, etc.) |
| `pomodoro_tasks` | Task list with estimated pomodoros |
| `pomodoro_templates` | Saved task templates |
| `pomodoro_stats` | Sessions, achievements, streaks, planted trees |

## Timer State Machine
```
States: idle | running | paused | completed
Phases: work | shortBreak | longBreak
After 4 work sessions → longBreak (configurable)
```

## File Naming
- Components: `PascalCase.jsx` (e.g., `Timer.jsx`)
- Hooks: `useCamelCase.js` (e.g., `useTimer.js`)
- Context: `PascalCase.jsx` (e.g., `AppContext.jsx`)
- Utils: `camelCase.js` (e.g., `sounds.js`, `constants.js`)

## Important Notes
- Notification API: request permission on first timer start
- Tab title: show `🍅 MM:SS` during countdown
- Dark mode: toggle `dark` class on `<html>`
- Sounds: Web Audio API with looping AudioBuffers

## Session Workflow
1. Read `SPEC.md` for current specs
2. Check `CHANGELOG.md` for recent changes
3. Check `TODO.md` for implementation status
4. Ask: "Where would you like to continue?"
5. Update `CHANGELOG.md` and `TODO.md` after changes