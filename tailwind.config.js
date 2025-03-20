/** @type {import('tailwindcss').Config} */
import PrimeUI from "tailwindcss-primeui";

module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/primeng/**/*.{js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [PrimeUI, require("tailwindcss-primeui")],
};
