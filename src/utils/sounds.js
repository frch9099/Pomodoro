export const SOUNDS = [
  { id: 'rain', label: 'Rain', icon: '🌧️' },
  { id: 'forest', label: 'Forest', icon: '🌲' },
  { id: 'coffeeShop', label: 'Coffee Shop', icon: '☕' },
  { id: 'whiteNoise', label: 'White Noise', icon: '📻' },
  { id: 'ocean', label: 'Ocean', icon: '🌊' },
  { id: 'fireplace', label: 'Fireplace', icon: '🔥' },
];

export const getSoundById = (id) => SOUNDS.find((s) => s.id === id);
