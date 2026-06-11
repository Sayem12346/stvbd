/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        bgdark: '#0a0a0f',
        accent: '#22c55e',
        highlight: '#f97316',
      },
      boxShadow: {
        brut: '4px 4px 0px #000',
        'brut-lg': '8px 8px 0px #000',
        'brut-sm': '2px 2px 0px #000',
      },
      borderRadius: {
        brut: '12px',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
