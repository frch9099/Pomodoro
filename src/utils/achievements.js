export const ACHIEVEMENTS = [
  {
    id: 'first-pomodoro',
    title: 'First Step',
    description: 'Complete your first pomodoro',
    icon: 'Rocket',
    requirement: 1,
    type: 'count',
  },
  {
    id: 'pom-10',
    title: 'Getting Started',
    description: 'Complete 10 pomodoros',
    icon: 'Target',
    requirement: 10,
    type: 'count',
  },
  {
    id: 'pom-50',
    title: 'Focus Master',
    description: 'Complete 50 pomodoros',
    icon: 'Award',
    requirement: 50,
    type: 'count',
  },
  {
    id: 'pom-100',
    title: 'Century',
    description: 'Complete 100 pomodoros',
    icon: 'Trophy',
    requirement: 100,
    type: 'count',
  },
  {
    id: 'streak-3',
    title: 'Three Days',
    description: 'Maintain a 3-day streak',
    icon: 'Flame',
    requirement: 3,
    type: 'streak',
  },
  {
    id: 'streak-7',
    title: 'Weekly Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'Flame',
    requirement: 7,
    type: 'streak',
  },
  {
    id: 'streak-30',
    title: 'Monthly Champion',
    description: 'Maintain a 30-day streak',
    icon: 'Flame',
    requirement: 30,
    type: 'streak',
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete a pomodoro before 8am',
    icon: 'Sunrise',
    requirement: 1,
    type: 'special',
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Complete a pomodoro after 10pm',
    icon: 'Moon',
    requirement: 1,
    type: 'special',
  },
  {
    id: 'template-creator',
    title: 'Planner',
    description: 'Create your first task template',
    icon: 'Bookmark',
    requirement: 1,
    type: 'special',
  },
  {
    id: 'forest-grower',
    title: 'Forest',
    description: 'Plant 10 trees in your forest',
    icon: 'TreePine',
    requirement: 10,
    type: 'count',
  },
  {
    id: 'perfect-day',
    title: 'Perfect Day',
    description: 'Complete your daily goal in one day',
    icon: 'Star',
    requirement: 1,
    type: 'special',
  },
];

export const TREE_TYPES = {
  oak: {
    name: 'Oak',
    unlockAt: 0,
    color: '#4CAF50',
  },
  pine: {
    name: 'Pine',
    unlockAt: 10,
    color: '#2E7D32',
  },
  cherry: {
    name: 'Cherry',
    unlockAt: 25,
    color: '#E91E63',
  },
  maple: {
    name: 'Maple',
    unlockAt: 50,
    color: '#FF5722',
  },
  bonsai: {
    name: 'Bonsai',
    unlockAt: 100,
    color: '#795548',
  },
};

export const getTreeTypeForPomodoros = (totalPomodoros) => {
  const types = Object.entries(TREE_TYPES)
    .sort((a, b) => b[1].unlockAt - a[1].unlockAt);
  for (const [key, value] of types) {
    if (totalPomodoros >= value.unlockAt) return key;
  }
  return 'oak';
};

export const getNextTreeType = (totalPomodoros) => {
  const types = Object.entries(TREE_TYPES)
    .filter(([_, v]) => v.unlockAt > totalPomodoros)
    .sort((a, b) => a[1].unlockAt - b[1].unlockAt);
  return types.length > 0 ? types[0] : null;
};
