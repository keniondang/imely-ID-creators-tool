/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ["bg-teal/5", "bg-cyan/5"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1A1A",
        cream: "#F0FBF9",
        teal: { DEFAULT: "#14B8A6", dark: "#0D9488", light: "#5EEAD4" },
        mint: "#3DE3C0",
        cyan: { DEFAULT: "#22D3EE", dark: "#06B6D4" },
        muted: "#6B8783",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      keyframes: {
        "aurora-1": {
          "0%,100%": { transform: "translate(-10%,-10%) scale(1)" },
          "50%": { transform: "translate(10%,8%) scale(1.25)" },
        },
        "aurora-2": {
          "0%,100%": { transform: "translate(8%,5%) scale(1.1)" },
          "50%": { transform: "translate(-8%,-6%) scale(1.3)" },
        },
        "rise": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%,100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-12px) rotate(2deg)" },
        },
      },
      animation: {
        "aurora-1": "aurora-1 14s ease-in-out infinite",
        "aurora-2": "aurora-2 18s ease-in-out infinite",
        "rise": "rise 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};