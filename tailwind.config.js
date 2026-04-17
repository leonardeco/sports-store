/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:         "#FF6B00",
          "orange-light": "#FF8C3A",
          neon:           "#AAFF00",
          dark:           "#0A0A0A",
          "dark-2":       "#111111",
          "dark-3":       "#1A1A1A",
          "dark-card":    "#1E1E1E",
          muted:          "#6B7280",
        },
      },
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        display: ["Bebas Neue", "sans-serif"],
      },
      animation: {
        "fade-in":    "fadeIn 0.3s ease-in-out",
        "slide-up":   "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" },                                "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
}
