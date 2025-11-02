/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gita: "#c77d28", // Bhagavad Gita saffron tone
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

