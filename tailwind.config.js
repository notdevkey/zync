/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'clash-display': 'Clash Display',
        inter: 'Inter',
      },
    },
  },
  plugins: [],
};
