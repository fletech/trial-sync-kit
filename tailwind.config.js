/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2B59FF",
          hover: "#1429E1",
          selected: "#19248F",
          foreground: "#FFFFFF",
        },
        themison: {
          text: "#31343A",
          gray: "#6D7688",
          success: "#00C07C",
          error: "#FF4747",
          bg: {
            gray: "#F5F5F5",
          },
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        "success-soft": "#EDFFF8",
        success: "#009664",
        surface: "#F8F9FA",
        secondary: "#6C757D",
        heading: "#495057",
        "primary-dark": "#10121C",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
