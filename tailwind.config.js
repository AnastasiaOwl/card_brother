// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        swoosh: {
          '0%':   { 'offset-distance': '0%' },
          '100%': { 'offset-distance': '100%' },
        }
      },
      animation: {
        'swoosh': 'swoosh 5s ease-in-out infinite',
      }
    }
  },
  plugins: [],
}
