/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F5F7FA',
        surface: '#FFFFFF',
        ink: '#E8E5DF',
        muted: '#77736D',
        graphite: '#303030',
      },
      fontSize: {
        title: ['28px', { lineHeight: '1.2' }],
        item: ['16px', { lineHeight: '1.35' }],
        body: ['13px', { lineHeight: '1.65' }],
        meta: ['11px', { lineHeight: '1.4' }],
      },
      fontFamily: {
        sans: ['"Geist"', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'blink-caret': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'blink-caret': 'blink-caret 1s step-end infinite',
      },
    },
  },
  plugins: [],
}
