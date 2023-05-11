/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        "qwik-light-blue": "var(--qwik-light-blue)",
        "qwik-dark-blue": "var(--qwik-dark-blue)",
        "qwik-dirty-black": "var(--qwik-dirty-black)"
      },
    },
  },
  plugins: [],
};
