/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    colors: {
      primary: "#0fa968",
      "primary-dark": "#108554",
      "primary-light": "#1acd81",
      secondary: "#0f9ca9",
      "secondary-dark": "#137e8b",
      "secondary-light": "#0fc5cb",
      "neutral-950": "#0a0a0a",
      "neutral-900": "#171717",
      "neutral-800": "#262626",
      "neutral-700": "#404040",
      "neutral-600": "#525252",
      "neutral-500": "#737373",
      "neutral-400": "#a3a3a3",
      "neutral-300": "#d4d4d4",
      "neutral-200": "#e5e5e5",
      "neutral-150": "#f0f0f0",
      "neutral-100": "#f5f5f5",
      "neutral-50": "#fafafa",
      white: "#ffffff",
      black: "#000000",
      "yellow-500": "#eab308",
      "yellow-600": "#ca8a04",
      "orange-500": "#f97316",
      "red-500": "#ef4444",
      transparent: "transparent",
    },
    extend: {
      backgroundImage: {
        "radial-gradient-blue":
          "radial-gradient(at 50% 40%, #0fa968 0, transparent 58%)",
        "radial-gradient-white":
          "radial-gradient(at 50% 40%, #ffffff 0, transparent 78%)",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
         '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "fadeIn": 'fadeIn 500ms ease-in-out',
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("@tailwindcss/typography"),
  ],
};
