
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
          foreground: "#FFFFFF"
        },
        themison: {
          text: "#31343A",
          gray: "#6D7688",
          success: "#00C07C",
          error: "#FF4747",
          bg: {
            gray: "#F5F5F5"
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
