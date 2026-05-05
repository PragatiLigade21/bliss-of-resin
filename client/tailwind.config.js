/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury resin art store colors
        primary: "#f8b4b4", // soft pink
        secondary: "#e8a5a5",
        accent: "#d49595",
        cream: "#fdf8f6",
        beige: "#f5ebe8",
        dark: "#2d2d2d",
        light: "#fafafa",
        gray: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px rgba(0, 0, 0, 0.06)",
        medium: "0 4px 20px rgba(0, 0, 0, 0.08)",
        hover: "0 8px 30px rgba(0, 0, 0, 0.12)",
        luxury: "0 10px 40px rgba(248, 180, 180, 0.15)",
      },
      backgroundImage: {
        'cream-gradient': 'linear-gradient(to bottom, #fdf8f6, #faf5f3)',
        'soft-pink': 'linear-gradient(135deg, #f8b4b4 0%, #f5caca 100%)',
      },
    },
  },
  plugins: [],
}
