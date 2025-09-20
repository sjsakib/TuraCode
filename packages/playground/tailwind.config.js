/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3f51b5',
          light: '#757de8',
          dark: '#002984'
        },
        secondary: {
          DEFAULT: '#f50057',
          light: '#ff5983',
          dark: '#bb002f'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace']
      }
    },
  },
  plugins: [],
}