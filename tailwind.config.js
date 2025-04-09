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
        primaryBlue: "#1A7E22",
        darkBlue: "#97C9A3",
        lightBlue: "#E7F5DC",
      },
    },
  },
  plugins: [],
};
