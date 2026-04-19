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

## Testing Methodology

### Unit Tests (Vitest + RTL)
- Run with `npm test`
- Fast, automated tests for hooks and components
- Located in `src/hooks/__tests__/` and `src/components/__tests__/`

### Exploratory Testing (playwright-cli)
- Used for finding bugs, debugging issues, and manual verification
- Commands:
  ```bash
  playwright-cli open <url>      # Open browser
  playwright-cli snapshot         # Get UI snapshot with element refs
  playwright-cli click <ref>     # Click element
  playwright-cli fill <ref> <text>  # Type in input
  playwright-cli console          # Check browser console
  playwright-cli console error   # Check for errors only
  playwright-cli reload          # Reload page
  playwright-cli localstorage-*   # Manipulate localStorage
  ```

### Bug Investigation Workflow
1. Start dev server: `npm run dev`
2. Open app with playwright-cli: `playwright-cli open http://localhost:5173`
3. Take snapshot to see UI state
4. Interact to reproduce the bug
5. Check console for errors: `playwright-cli console error`
6. Identify root cause from error messages
7. Fix the bug
8. Verify with: `npm test && npm run build`

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