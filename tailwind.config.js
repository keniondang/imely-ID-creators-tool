/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1A1A",
        cream: "#F0FBF9", // mint-tinted off-white background
        teal: {
          DEFAULT: "#14B8A6",
          dark: "#0D9488",
          light: "#5EEAD4",
        },
        mint: "#3DE3C0",
        cyan: {
          DEFAULT: "#22D3EE",
          dark: "#06B6D4",
        },
        muted: "#6B8783",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
    },
  },
};