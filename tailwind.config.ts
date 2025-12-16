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
        // Design System Colors
        "bg-canvas": "#F9FAFB",
        primary: {
          blue: "#5B8CFF",
        },
        "primary-blue": "#5B8CFF",
        success: {
          leaf: "#4CAF50",
        },
        "success-leaf": "#4CAF50",
        danger: {
          rose: "#EF5350",
        },
        "danger-rose": "#EF5350",
        "card-white": "#FFFFFF",
        "text-ink": "#1F2937",
      },
      boxShadow: {
        "soft": "0 4px 20px -2px rgba(0,0,0,0.05)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};

export default config;
