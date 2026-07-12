/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: '#084C61',
        secondary: '#6A994E',
        accent: '#BC4749',
        danger: '#BC4749',
        warning: '#F59E0B',
        success: '#6A994E',
        dark: '#1F2937',
        light: '#F9FAFB',
        teal: '#084C61',
        'teal-light': '#E0F2F1',
        'success-light': '#E8F5E9',
        'warning-light': '#FFF3E0',
        'danger-light': '#FCE4EC',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'warm': '0 4px 16px rgba(8, 76, 97, 0.08)',
      },
    },
  },
  plugins: [],
}
