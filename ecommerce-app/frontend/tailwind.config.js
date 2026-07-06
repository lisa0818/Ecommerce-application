/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf6',
          100: '#dbfaea',
          400: '#3ecf8e',
          500: '#1fb87c',
          600: '#149663',
          900: '#0c3d2a',
        },
        ink: '#14181f',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
