/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tgviolet: "#2B0E4C",
        tgmagenta: "#6A1B9A",
        tgteal: "#00D4FF",
      },
      keyframes: {
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%,100%": { opacity: 0.35 },
          "50%": { opacity: 0.85 },
        }
      },
      animation: {
        gradientShift: "gradientShift 12s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 3.5s ease-in-out infinite",
      }
    },
  },
  plugins: [],
}
