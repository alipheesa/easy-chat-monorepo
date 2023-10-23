/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
	"./src/**/*.{js,jsx,ts,tsx}"
	],
  theme: {
    extend: {
      colors: {
        gray: {
          950: "#101113",
          900: "#242529",
          800: "#2f3136",
          700: "#34363c", // 36393f
          600: "#44484f",
          400: "#d4d7dc",
          300: "#e3e5e8",
          200: "#ebedef",
          100: "#f2f3f5",
        },
      },

      gridTemplateColumns: {
        "groups-box": "repeat(auto-fill, minmax(240px, 1fr))",
      },

      animation: {
        "slide-from-top": "slideFromTop 0.8s ease-out",
        "transparent-slide-from-top": "transparentSlideFromTop 0.3s ease-out",
      },

      keyframes: (theme) => ({
        slideFromTop: {
          "0%": {
            backgroundColor: theme("colors.gray.500"),
            transform: "scale(0.9) translateY(-35%)",
          },
          "100%": {
            backgroundColor: theme("colors.gray.700"),
          },
        },
        transparentSlideFromTop: {
          "0%": {
            transform: "translateY(-25%)",
          },
        },
      }),

      boxShadow: {
        icon: "inset 0 0 0 2px rgba(255, 255, 255, 0.5)",
      },

      backgroundImage: {
        "gradient-radial-tr":
          "radial-gradient(at top right, var(--tw-gradient-stops))",
        "gradient-radial-bl":
          "radial-gradient(at bottom left, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
};
