/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0d1117',
        'dark-card': '#161b22',
        'dark-border': '#30363d',
        'light-bg': '#ffffff',
        'light-card': '#f6f8fa',
        'light-border': '#d0d7de',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
