import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2E7D32", // Example Green
          light: "#4CAF50",
          dark: "#1B5E20",
        },
        secondary: {
          DEFAULT: "#000000",
          light: "#333333",
        },
        accent: {
          white: "#FFFFFF",
          grey: "#F5F5F5",
          darkGrey: "#9E9E9E",
        },
      },
      fontFamily: {
        sans: ["var(--font-league-spartan)"],
      },
    },
  },
  plugins: [],
};
export default config;
