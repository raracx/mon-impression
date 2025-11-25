import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette
        navy: {
          DEFAULT: "#1e3a5f",
          light: "#2d4a6f",
          dark: "#152a47",
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#1e3a5f",
          900: "#152a47",
        },
        brand: {
          black: "#1a1a1a",
          white: "#ffffff",
          "gray-dark": "#4a4a4a",
          "gray-light": "#d1d5db",
          "gray-lighter": "#f3f4f6",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
