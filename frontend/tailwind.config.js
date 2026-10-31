/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: {
          50: '#fff7f2',
          100: '#ffeedd',
          200: '#ffd8be',
          300: '#ffbc94',
          400: '#ff9965',
          500: '#f97316',
          sidebar: '#fdf3ed',
          sidebarHover: '#fae5d8',
        },
        maroon: {
          50: '#fdf2f4',
          100: '#fbe6e9',
          200: '#f7cfd6',
          300: '#f0aab7',
          400: '#e5778f',
          500: '#d34b6a',
          600: '#b83252',
          700: '#992240',
          800: '#7f1d37',
          900: '#6c1b31',
          accent: '#8b1e3f',
          light: '#a63456',
        },
        campus: {
          bg: '#f8f9fb',
          card: '#ffffff',
          border: '#f0e6e0',
          dark: '#1e293b',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(139, 30, 63, 0.06)',
      }
    },
  },
  plugins: [],
}
