import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sidebar: '#2C2C2C',
        main: '#121212',
        hover: '#3A3A3A',
        border: '#444444',
        text: {
          primary: '#FFFFFF',
          secondary: '#E0E0E0',
        },
        button: {
          light: '#E0E0E0',
          primary: '#1A73E8',
          hover: '#357ABD',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
