/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'clash-display': 'Clash Display',
        inter: 'Inter',
      },
      boxShadow: {
        widget: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
