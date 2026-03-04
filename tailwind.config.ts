import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      colors: {
        brand: {
          primary: "var(--color-primary)",
          secondary: "var(--color-secondary)",
          accent: "var(--color-accent)"
        },
        surface: "var(--color-surface)",
        line: "var(--color-border)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)"
        },
        state: {
          success: "var(--color-success)",
          warning: "var(--color-warning)",
          error: "var(--color-error)",
          info: "var(--color-info)"
        },
        appbg: "var(--color-background)"
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1rem"
      },
      boxShadow: {
        soft: "0 12px 35px rgba(31, 41, 51, 0.08)",
        lift: "0 8px 25px rgba(31, 41, 51, 0.10)"
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        }
      },
      animation: {
        "fade-up": "fade-up 360ms ease-out"
      }
    }
  },
  plugins: []
};

export default config;
