/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom touch target sizes
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      // Custom mobile spacing for safe areas
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Custom z-index scale
      zIndex: {
        'overlay': '30',
        'sidebar': '40',
        'header': '50',
      },
    },
  },
  plugins: [],
}