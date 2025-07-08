/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-bg": "#313131",
        "custom-hover": "#414141",
        // Project green theme colors
        "project-green": {
          50: "#f7f9f5",
          100: "#eef2ea",
          200: "#d1d5db",
          300: "#a3a3a3",
          400: "#6b7280",
          500: "#374151",
          600: "#1f2937",
          700: "#16a34a",
          800: "#14532d",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "3xl": "0 35px 60px -12px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        float: "float 20s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0px, 0px) rotate(0deg)" },
          "33%": { transform: "translate(30px, -30px) rotate(120deg)" },
          "66%": { transform: "translate(-20px, 20px) rotate(240deg)" },
        },
      },
    },
  },
  plugins: [],
};
