import { create } from 'zustand';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('careerbot_theme');
  if (savedTheme) {
    return savedTheme;
  }
  // Check system preference
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
};

const applyThemeToDocument = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }
};

export const useThemeStore = create((set, get) => {
  const initialTheme = getInitialTheme();
  // Apply immediately on store initialization
  if (typeof window !== 'undefined') {
    applyThemeToDocument(initialTheme);
  }

  return {
    theme: initialTheme,

    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('careerbot_theme', nextTheme);
      applyThemeToDocument(nextTheme);
      set({ theme: nextTheme });
    },

    setTheme: (theme) => {
      localStorage.setItem('careerbot_theme', theme);
      applyThemeToDocument(theme);
      set({ theme });
    }
  };
});
