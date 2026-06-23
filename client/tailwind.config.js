/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        velore: {
          black: '#0A0A0A',
          white: '#FFFFFF',
          red: '#D94F3D',
          charcoal: '#2C2C2C',
          light: '#F5F5F5',
          gold: '#C9A96E'
        }
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace']
      },
      aspectRatio: {
        '3/4': '3 / 4'
      }
    }
  },
  plugins: []
};
