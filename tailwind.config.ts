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
          DEFAULT: "#27be2eff", // Example Green
          light: "#72e175ff",
          dark: "#105614ff",
        },
        secondary: {
          DEFAULT: "#000000ff",
          light: "#3e3e3eff",
        },
        accent: {
          white: "#e1e1e177",
          grey: "#7e7777ba",
          darkGrey: "#1c1b1bff",
        },
      },
      fontFamily: {
        sans: ["var(--font-league-spartan)"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
