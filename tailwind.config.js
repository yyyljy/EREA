/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Avalanche style color palette
        "erea-primary": "#e84142", // Avalanche red
        "erea-secondary": "#ffffff", // White
        "avax-accent": "#e84142", // Red accent
        "avax-light": "#f8f9fa", // Clean background
        "avax-gray": "#6c757d", // Neutral gray
        "avax-dark": "#212529", // Dark gray
        "avax-success": "#28a745", // Success green
        "avax-warning": "#ffc107", // Warning yellow
        "avax-error": "#dc3545", // Error red
        "avax-border": "#dee2e6", // Border color
        "erea-text": "#212529", // Primary text
        "erea-text-light": "#6c757d", // Secondary text
        "avax-red": "#e84142", // Avalanche red
        "avax-black": "#000000", // Black
        "avax-slate": "#495057", // Slate
      },
      fontFamily: {
        mono: ['"Source Code Pro"', '"Courier New"', "monospace"],
        sans: ['"Source Sans Pro"', '"Helvetica Neue"', '"Arial"', "sans-serif"],
        serif: ['"Merriweather"', '"Georgia"', "serif"],
        display: ['"Source Sans Pro"', '"Helvetica Neue"', "sans-serif"],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
