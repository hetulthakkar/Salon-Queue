/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937', // Brand Charcoal
          900: '#111827', // Deep Charcoal
          950: '#0B0F17',
        },
        gold: {
          50: '#FDFBF0',
          100: '#FAF4D8',
          200: '#F5E8AC',
          300: '#EDD776',
          400: '#E2C241',
          500: '#D4A017', // Brand Warm Gold
          600: '#B8860B', // Dark Gold
          700: '#936908',
          800: '#75520D',
          900: '#61430F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
}
