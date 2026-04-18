import '@testing-library/jest-dom'

global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
}

Object.defineProperty(global, 'localStorage', {
  value: global.localStorage,
  writable: true,
})