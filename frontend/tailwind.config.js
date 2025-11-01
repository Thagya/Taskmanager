/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
          800: '#1f2937',
          700: '#374151',
          600: '#4b5563',
          500: '#6b7280',
          400: '#9ca3af',
          300: '#d1d5db',
        },
        purple: {
          600: '#9333ea',
          500: '#a855f7',
          400: '#c084fc',
        },
        pink: {
          600: '#db2777',
          500: '#ec4899',
          400: '#f472b6',
        },
      },
    },
  },
  plugins: [],
}