export const BREAK_SUGGESTIONS = [
  { id: 'stand-stretch', label: 'Stand & Stretch', icon: '🧘', duration: 60, category: 'movement' },
  { id: 'drink-water', label: 'Drink Water', icon: '💧', duration: 30, category: 'hydration' },
  { id: 'rest-eyes', label: 'Rest Your Eyes', icon: '👀', duration: 20, category: 'eyes' },
  { id: 'deep-breaths', label: 'Deep Breaths', icon: '🌬️', duration: 45, category: 'mind' },
  { id: 'walk-around', label: 'Walk Around', icon: '🚶', duration: 60, category: 'movement' },
  { id: 'look-window', label: 'Look Out Window', icon: '🪟', duration: 30, category: 'eyes' },
];

export const getRandomSuggestion = () => {
  const index = Math.floor(Math.random() * BREAK_SUGGESTIONS.length);
  return BREAK_SUGGESTIONS[index];
};

export const getSuggestionByCategory = (category) => {
  const filtered = BREAK_SUGGESTIONS.filter((s) => s.category === category);
  if (filtered.length === 0) return getRandomSuggestion();
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index];
};
