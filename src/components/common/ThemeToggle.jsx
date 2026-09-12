import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 group ${
        isDark
          ? 'bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-slate-800 hover:border-slate-700 shadow-sm'
          : 'bg-white hover:bg-slate-100 text-indigo-600 border-slate-200 hover:border-slate-300 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Obsidian Theme'}
      aria-label="Toggle theme mode"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon (shown in dark mode to switch to light, or active in light) */}
        <Sun
          className={`w-4 h-4 transition-all duration-300 absolute transform ${
            isDark
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100 text-amber-500'
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`w-4 h-4 transition-all duration-300 absolute transform ${
            isDark
              ? 'rotate-0 scale-100 opacity-100 text-cyan-300'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  );
};
