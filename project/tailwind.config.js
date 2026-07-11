/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f5dbb2',
          300: '#eec07e',
          400: '#e5a04a',
          500: '#dc8829',
          600: '#c96e1e',
          700: '#a7561b',
          800: '#87451e',
          900: '#6e3a1c',
          950: '#3c1d0d',
        },
        sage: {
          50: '#f3f7f3',
          100: '#e3ede3',
          200: '#c7dcc8',
          300: '#9dc29f',
          400: '#6ea272',
          500: '#4c8451',
          600: '#3a6940',
          700: '#305436',
          800: '#28432d',
          900: '#223826',
          950: '#0f1f14',
        },
        cream: {
          50: '#fdfcf8',
          100: '#faf6ee',
          200: '#f4ead6',
          300: '#ebd8b4',
          400: '#dfc08a',
          500: '#d4a766',
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
        modal: '0 24px 64px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
