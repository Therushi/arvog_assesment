/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  corePlugins: {
    preflight: false, // avoid clashing with Angular Material's base styles
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
