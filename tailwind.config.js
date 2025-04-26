const { randomizePosition } = require("./helpers/helper");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1200px",
        },
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
      },
      animation: {
        gentleFloat1: "gentleFloat 7s ease-in-out infinite",
        gentleFloat2: "gentleFloat2 7s ease-in-out infinite",
        gentleFloat3: "gentleFloat2 7s ease-in-out infinite",
      },
      keyframes: {
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
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
