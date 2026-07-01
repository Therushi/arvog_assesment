/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  corePlugins: {
    preflight: false, // avoid clashing with Angular Material's base styles
  },
  theme: {
    extend: {
      colors: {
        'google-blue': '#1a73e8',
        'google-red': '#ea4335',
        'google-yellow': '#fbbc04',
        'google-green': '#34a853',
        surface: '#ffffff',
        'surface-alt': '#f8f9fa',
        'on-surface': '#202124',
        'on-surface-muted': '#5f6368',
      },
    },
  },
  plugins: [],
};
