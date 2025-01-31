/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primaryBlue: "#0d3b67",
        darkBlue: "#07243f",
        lightBlue: "#2a90f5",
      },
    },
  },
  plugins: [],
};
