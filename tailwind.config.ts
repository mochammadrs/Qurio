import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          lowest: "var(--surface-lowest)",
          low: "var(--surface-low)",
          container: "var(--surface-container)",
          high: "var(--surface-high)",
          highest: "var(--surface-highest)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
          fixed: "var(--primary-fixed)",
          "fixed-dim": "var(--primary-fixed-dim)",
        },
        "on-primary": "var(--on-primary)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",
        secondary: {
          DEFAULT: "var(--secondary)",
          container: "var(--secondary-container)",
          "on-container": "var(--on-secondary-container)",
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          container: "var(--tertiary-container)",
          "on-container": "var(--on-tertiary-container)",
        },
        error: {
          DEFAULT: "var(--error)",
          container: "var(--error-container)",
          onContainer: "var(--on-error-container)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)",
          inverse: "var(--text-inverse)",
          "inverse-on": "var(--text-inverse-on)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
        },
        "bg-canvas": "var(--bg-canvas)",
        "primary-blue": "var(--primary)",
        "success-leaf": "var(--success-leaf)",
        "danger-rose": "var(--danger-rose)",
        "card-white": "var(--card-white)",
        "text-ink": "var(--text-ink)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
        mono: ["Inter", "monospace"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "title-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
        "mono-xs": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
      },
      borderRadius: {
        DEFAULT: "2px",
        lg: "4px",
        xl: "8px",
        "2xl": "12px",
        full: "9999px",
      },
      spacing: {
        "container-max": "1120px",
        gutter: "20px",
      },
      borderWidth: {
        DEFAULT: "1px",
        "2": "2px",
        "3": "3px",
      },
      boxShadow: {
        "soft": "none",
        "card": "none",
        "hover": "0 0 0 1px rgba(49, 46, 129, 0.1)",
      },
      maxWidth: {
        container: "1120px",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-up": "slideUp 200ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
