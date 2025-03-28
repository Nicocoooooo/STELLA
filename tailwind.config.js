/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#9557fa',
        'secondary': '#ffe1c4',
        'accent': '#fa9b3d',
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },
      height: {
        'screen/3': '33.333vh',
        'screen/2': '50vh',
      }
    },
  },
  plugins: [],
}