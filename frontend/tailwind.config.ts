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
        brand: {
          navy: {
            DEFAULT: "#0F172A",
            dark: "#0A0F1D",
            light: "#1E293B",
          },
          blue: {
            DEFAULT: "#2563EB",
            hover: "#1D4ED8",
            subtle: "#EFF6FF",
          },
          cyan: {
            DEFAULT: "#06B6D4",
            subtle: "#ECFEFF",
          },
          surface: {
            DEFAULT: "#FFFFFF",
            subtle: "#F8FAFC",
            muted: "#F1F5F9",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;