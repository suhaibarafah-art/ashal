import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-arabic)', 'var(--font-latin)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f4daa8',
          300: '#ecc470',
          400: '#e2a83a',
          500: '#c8882a',
          600: '#a56a1e',
          700: '#7e4f17',
          800: '#5a3811',
          900: '#3a240b',
        },
        ink: {
          DEFAULT: '#111110',
          2: '#2a2a28',
          3: '#4a4a47',
          4: '#7a7a75',
          5: '#a8a8a2',
          6: '#d4d4ce',
        }
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      }
    },
  },
  plugins: [],
} satisfies Config
