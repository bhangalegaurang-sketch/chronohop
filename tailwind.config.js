/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sketch: {
          bg: '#1A1A1A',
          card: '#222222',
          chalk: '#E6E6E6',
          white: '#FFFFFF',
          orange: '#FF8C42',
          green: '#88D49E',
          muted: '#8E8E8E',
          border: '#3A3A3A',
        },
        cust: {
          bg: '#1A1A1A',
          card: '#222222',
          ink: '#E6E6E6',
          muted: '#8E8E8E',
          brass: '#FF8C42',
          deepBrass: '#E06B1A',
          green: '#88D49E',
          border: '#3A3A3A',
        },
        staff: {
          bg: '#141414',
          panel: '#1E1E1E',
          border: '#333333',
          text: '#E6E6E6',
          muted: '#8E8E8E',
          brass: '#FF8C42',
          glow: '#FFA86A',
          danger: '#E5484D',
          dangerLight: '#FF8D91',
          ok: '#88D49E',
        }
      },
      fontFamily: {
        sketch: ['"Kalam"', '"Patrick Hand"', '"Caveat"', 'cursive', 'sans-serif'],
        marker: ['"Caveat"', '"Kalam"', 'cursive', 'sans-serif'],
        chalk: ['"Patrick Hand"', '"Kalam"', 'cursive', 'sans-serif'],
        hand: ['"Kalam"', 'cursive', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        digits: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
}
