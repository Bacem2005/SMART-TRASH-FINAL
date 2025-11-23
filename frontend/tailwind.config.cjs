module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5fbff',
          100: '#e6f3ff',
          500: '#0ea5e9',
          700: '#0284c7',
        },
      },
      boxShadow: {
        glass: '0 6px 20px rgba(2,6,23,0.6)',
      },
    },
  },
  plugins: [],
};
