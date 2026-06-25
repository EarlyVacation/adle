import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'dot-flip': {
          '0%':   { transform: 'scaleY(0.08) scale(0.85)', opacity: '0' },
          '42%':  { transform: 'scaleY(1.14) scale(1.06)', opacity: '1' },
          '68%':  { transform: 'scaleY(0.93) scale(0.98)' },
          '100%': { transform: 'scaleY(1) scale(1)', opacity: '1' },
        },
        'reveal-badge': {
          '0%':   { opacity: '0', transform: 'scale(0.4)' },
          '60%':  { opacity: '1', transform: 'scale(1.25)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'lock-pop': {
          '0%':   { opacity: '0', transform: 'scaleY(0.85)' },
          '55%':  { transform: 'scaleY(1.04)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
        'year-clue': {
          '0%':   { opacity: '0', transform: 'translateY(6px) scale(0.96)' },
          '55%':  { transform: 'translateY(-2px) scale(1.01)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'dot-flip':     'dot-flip 480ms ease-in-out both',
        'reveal-badge': 'reveal-badge 260ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'lock-pop':     'lock-pop 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'year-clue':    'year-clue 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
}

export default config
