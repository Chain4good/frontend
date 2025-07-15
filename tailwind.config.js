import { randomizePosition } from "./src/utils/helper";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1300px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        gentleFloat: {
          "0%, 100%": {
            transform: `translateY(${randomizePosition(
              -10,
              10
            )}px) translateX(${randomizePosition(-10, 10)}px)`,
          },
          "25%": {
            transform: `translateY(${randomizePosition(
              -20,
              20
            )}px) translateX(${randomizePosition(-20, 20)}px)`,
          },
          "50%": {
            transform: `translateY(${randomizePosition(
              -10,
              10
            )}px) translateX(${randomizePosition(-10, 10)}px)`,
          },
          "75%": {
            transform: `translateY(${randomizePosition(
              -20,
              20
            )}px) translateX(${randomizePosition(-20, 20)}px)`,
          },
        },
        gentleFloat2: {
          "0%, 100%": {
            transform: `translateY(${randomizePosition(
              -10,
              10
            )}px) translateX(${randomizePosition(-10, 10)}px)`,
          },
          "25%": {
            transform: `translateY(${randomizePosition(
              -20,
              20
            )}px) translateX(${randomizePosition(-20, 20)}px)`,
          },
          "50%": {
            transform: `translateY(${randomizePosition(
              -10,
              10
            )}px) translateX(${randomizePosition(-10, 10)}px)`,
          },
          "75%": {
            transform: `translateY(${randomizePosition(
              -20,
              20
            )}px) translateX(${randomizePosition(-20, 20)}px)`,
          },
        },
        gentleFloat3: {
          "0%, 100%": {
            transform: `translateY(${randomizePosition(
              -10,
              10
            )}px) translateX(${randomizePosition(-10, 10)}px)`,
          },
          "25%": {
            transform: `translateY(${randomizePosition(
              -20,
              20
            )}px) translateX(${randomizePosition(-20, 20)}px)`,
          },
          "50%": {
            transform: `translateY(${randomizePosition(
              -10,
              10
            )}px) translateX(${randomizePosition(-10, 10)}px)`,
          },
          "75%": {
            transform: `translateY(${randomizePosition(
              -20,
              20
            )}px) translateX(${randomizePosition(-20, 20)}px)`,
          },
        },
        "bell-shake": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "20%, 60%": { transform: "rotate(8deg)" },
          "40%, 80%": { transform: "rotate(-8deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        gentleFloat1: "gentleFloat 7s ease-in-out infinite",
        gentleFloat2: "gentleFloat2 7s ease-in-out infinite",
        gentleFloat3: "gentleFloat2 7s ease-in-out infinite",
        "bell-shake": "bell-shake 1s infinite",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        heading: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
