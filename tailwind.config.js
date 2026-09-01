/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        honey: {
          50: '#fdfaf3',
          100: '#faf2dd',
          200: '#f5e3b0',
          300: '#efcd78',
          400: '#e9b34a',
          500: '#e09a2b',
          600: '#c97d1f',
          700: '#a45e1a',
          800: '#864a1b',
          900: '#713e1b',
          950: '#411f0c',
        },
        forest: {
          50: '#f3faf4',
          100: '#e3f6e8',
          200: '#c7edd2',
          300: '#9bdfb1',
          400: '#69c989',
          500: '#43ad68',
          600: '#318a52',
          700: '#286e44',
          800: '#245838',
          900: '#204930',
          950: '#0f2917',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e2',
          300: '#b0b8c8',
          400: '#8590a8',
          500: '#667291',
          600: '#515b78',
          700: '#434b62',
          800: '#3a4053',
          900: '#333846',
          950: '#22252e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 24, 40, 0.04), 0 1px 3px 0 rgba(16, 24, 40, 0.06)',
        'card-hover': '0 4px 12px -2px rgba(16, 24, 40, 0.08), 0 2px 6px -2px rgba(16, 24, 40, 0.06)',
        glow: '0 0 0 3px rgba(224, 154, 43, 0.18)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'pop': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
        'slide-in': 'slide-in 0.3s ease-out both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'pop': 'pop 0.2s ease-out both',
      },
    },
  },
  plugins: [],
};
