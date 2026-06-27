/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08080D',
        'bg-alt': '#0E0E15',
        'bg-card': '#13131C',
        card: '#13131C',
        ink: '#EDEBF5',
        'ink-mid': 'rgba(237, 235, 245, 0.55)',
        'ink-light': 'rgba(237, 235, 245, 0.25)',
        accent: '#8B5CF6',
        'accent-bright': '#A78BFA',
        'accent-glow': 'rgba(139, 92, 246, 0.15)',
        line: 'rgba(237, 235, 245, 0.07)',
        'off-white': '#F0EDE6',
      },
      fontFamily: {
        display: ['"DM Sans"', '-apple-system', 'sans-serif'],
        serif: ['"DM Sans"', '-apple-system', 'sans-serif'],
        body: ['"DM Sans"', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
