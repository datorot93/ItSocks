import '@testing-library/jest-dom';

// Fix for @vitejs/plugin-react React Fast Refresh in test environment
window.__vite_plugin_react_preamble_installed__ = true;
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;

// Global localStorage mock
const localStorageStore = {};
const localStorageMock = {
  getItem: (key) => localStorageStore[key] ?? null,
  setItem: (key, value) => { localStorageStore[key] = String(value); },
  removeItem: (key) => { delete localStorageStore[key]; },
  clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); },
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});
beforeEach(() => {
  localStorageMock.clear();
});
