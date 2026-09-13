import { create } from "zustand";

const STORAGE_KEY = "careerbot-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch (e) {
    // localStorage unavailable — fall through to system preference
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.className = theme;
}

const initialTheme = getInitialTheme();
applyThemeClass(initialTheme);

export const useThemeStore = create((set, get) => ({
  theme: initialTheme,

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    applyThemeClass(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // ignore write failures (private browsing, storage disabled)
    }
    set({ theme: next });
  },

  setTheme: (value) => {
    applyThemeClass(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      // ignore write failures
    }
    set({ theme: value });
  },
}));
