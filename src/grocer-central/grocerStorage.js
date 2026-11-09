// src/grocer-central/grocerStorage.js

const STORAGE_KEY = "sid-grocer-central-v1";

const DEFAULT_STATE = {
  reports: [],
  discovered: [],
  cart: null,
  started: false,
  completed: false,
};

export function loadGrocerState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return { ...DEFAULT_STATE };

    return {
      ...DEFAULT_STATE,
      ...JSON.parse(saved),
    };
  } catch (error) {
    console.error("Could not load Grocer Central data:", error);
    return { ...DEFAULT_STATE };
  }
}

export function saveGrocerState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Could not save Grocer Central data:", error);
  }
}

export function clearGrocerState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Could not reset Grocer Central data:", error);
  }
}