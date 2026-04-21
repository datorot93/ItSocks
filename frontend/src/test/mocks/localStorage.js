/**
 * localStorage mock utilities — exposed for tests that need manual control.
 * The global mock is set up in setup.js.
 */
export function getLocalStorageMock() {
  return window.localStorage;
}

export function setLocalStorageItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
