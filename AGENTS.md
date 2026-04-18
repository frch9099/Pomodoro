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
- Vitest (test runner)
- React Testing Library (component tests)
- jsdom (DOM environment)

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