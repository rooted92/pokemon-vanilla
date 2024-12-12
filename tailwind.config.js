/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        prussianBlue: 'var(--prussian-blue)',
        utOrange: 'var(--ut-orange)',
        selectiveYellow: 'var(--selective-yellow)',
        skyBlue: 'var(--sky-blue)',
        blueGreen: 'var(--blue-green)',

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