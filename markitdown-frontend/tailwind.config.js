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
        brand: {
          orange:        '#D4541B',
          'orange-hover':'#B8430F',
          'orange-light':'#F0A07A',
          'orange-bg':   '#FFF7F3',
          'gray-900':    '#2C2C2A',
          'gray-700':    '#5F5E5A',
          'gray-400':    '#888780',
          'gray-200':    '#D3D1C7',
          'gray-100':    '#F1EFE8',
          'gray-50':     '#FAFAF9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-border': 'pulse-border 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': { borderColor: 'rgba(212, 84, 27, 0.3)' },
          '50%': { borderColor: 'rgba(212, 84, 27, 0.7)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
