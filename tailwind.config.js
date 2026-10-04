/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        october: {
          red: '#B22222',
          dark: '#1a1a1a',
          light: '#E8E8E8'
        }
      },
      fontFamily: {
        display: ['"Unbounded"', 'sans-serif'],
      },
      animation: {
        'spider-drop': 'drop 3s ease-in-out infinite',
      },
      keyframes: {
        drop: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        }
      }
    },
  },
  plugins: [],
}