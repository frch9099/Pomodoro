export function useHaptics() {
  const vibrate = (pattern) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    timerComplete: () => vibrate([200, 100, 200]),
    achievementUnlock: () => vibrate([50, 50, 100, 50, 200]),
    taskComplete: () => vibrate(50),
    buttonTap: () => vibrate(10),
    error: () => vibrate([100, 50, 100]),
    skip: () => vibrate(75),
  };
}