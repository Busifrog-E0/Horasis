/** @type {import('tailwindcss').Config} */
import extendTheme from "./src/style/theme";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-mode="dark"]'],
  safelist: [
    {
      pattern: /grid-cols-./,
    },
  ],
  theme: {
    extend: {
      ...extendTheme
    },
  },
  plugins: [],
}