/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,css,scss}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#16171E',
        secondary: '#1F212A',
        orange: '#FFC412',
        hover: '#eb9b10'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}