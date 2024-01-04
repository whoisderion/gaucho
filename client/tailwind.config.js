/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#3f3cbb',
        'secondary': '#d1d5db',
        'ternary': '#eceeef',
      }
    },
  },
  plugins: [],
}

