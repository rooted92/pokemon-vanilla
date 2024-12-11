/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        oxfordBlue: 'var(--oxford-blue)',
        orangeWeb: 'var(--orange-web)',
        platinum: 'var(--platinum)',
      },
      screens: {
        'xs': '475px',
        'xxs': '375px',
        'tiny': '320px',
        'tiniest': '280px',
      }
    },
  },
  plugins: [],
}