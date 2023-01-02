/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/**/*.{js,jsx,ts,tsx}', './libs/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          400: '#F187FC',
        },
        blue: {
          100: '#386DFF',
        },
        darkblue: {
          100: '#72798E',
          200: '#212634',
          300: '#161A25',
          400: '#0F141A',
        },
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
