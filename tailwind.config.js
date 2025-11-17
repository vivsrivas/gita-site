/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gita: {
          50: '#fdf5ef',
          100: '#fbe8d7',
          200: '#f5cba6',
          300: '#eead75',
          400: '#e88f44',
          500: '#c77d28', // ← your primary brand color
          600: '#a96822',
          700: '#8a541b',
          800: '#6c4014',
          900: '#4d2c0e',
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

