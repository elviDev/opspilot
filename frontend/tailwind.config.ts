import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0d10",
        surface: "#14171b",
        border: "#22262b",
        accent: "#22c55e",
        danger: "#ef4444",
        warning: "#f59e0b",
        muted: "#8b949e",
      },
    },
  },
  plugins: [],
};

export default config;
