/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        haven: {
          50: '#F4F7F4',
          100: '#E6EFE7',
          200: '#C7DFC9',
          300: '#9CBDA0',
          400: '#6E9873',
          500: '#48754D',
          600: '#2E5B38', // Primary Sage Green
          700: '#23472C',
          800: '#1B3722',
          900: '#142B1B', // Deep Forest
        },
        amber: {
          500: '#D99B26', // Warm Amber Accent
        },
        linen: '#FDFBF7',
        charcoal: '#121614',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
