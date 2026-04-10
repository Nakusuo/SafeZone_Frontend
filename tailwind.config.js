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
        primary: '#1e4d5c',
        secondary: '#5a9e3d',
        accent: '#a4393d',
        danger: '#a4393d',
        warning: '#f59e0b',
        success: '#5a9e3d',
        dark: '#1F2937',
        light: '#F9FAFB',
        teal: '#1e4d5c',
        'teal-light': '#e0f2f1',
        'success-light': '#e8f5e9',
        'warning-light': '#fff3e0',
        'danger-light': '#fce4ec',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'warm': '0 4px 16px rgba(8, 76, 97, 0.08)',
      },
    },
  },
  plugins: [],
}
