/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: {
          DEFAULT: "var(--color-surface)",
          2: "var(--color-surface-2)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          2: "var(--color-border-2)",
        },
        text: {
          DEFAULT: "var(--color-text)",
          2: "var(--color-text-2)",
          3: "var(--color-text-3)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          light: "var(--color-accent-light)",
          text: "var(--color-accent-text)",
        },
        amber: {
          DEFAULT: "var(--color-amber)",
          light: "var(--color-amber-light)",
        },
        violet: {
          DEFAULT: "var(--color-violet)",
          light: "var(--color-violet-light)",
        },
        red: {
          DEFAULT: "var(--color-red)",
          light: "var(--color-red-light)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      boxShadow: {
        card: "0 1px 3px var(--color-shadow), 0 1px 2px var(--color-shadow)",
        "card-hover": "0 4px 12px var(--color-shadow)",
      },
    },
  },
  plugins: [],
};
