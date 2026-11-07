/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
}
