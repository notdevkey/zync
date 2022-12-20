/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/**/*.{js,jsx,ts,tsx}', './libs/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'pink-400': '#F187FC',
        'blue-100': '#5D6770',
        'blue-100-opacity-0.05': 'rgba(93, 103, 112, 0.05)',
        'blue-100-opacity-0.1': 'rgba(93, 103, 112, 0.1)',
        'dark-100': '#72798E',
        'dark-200': '#212634',
        'dark-300': '#161A25',
        'dark-400': '#0F141A',
      },
      gradientColorStops: {
        'white-opacity-0.2': 'rgba(255, 255, 255, 0.2)',
        'white-opacity-0.05': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        'clash-display': 'Clash Display',
        'dm-sans': 'DM Sans',
      },
      boxShadow: {
        widget: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
