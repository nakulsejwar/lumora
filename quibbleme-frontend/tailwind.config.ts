const { fontFamily } = require("tailwindcss/defaultTheme");
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        bellota: ["Bellota Text", "sans-serif"],
        fredoka: ["Fredoka", "sans-serif"],
        sans: [...fontFamily.sans],
        acuminBold: ["Acumin-Bold", ...fontFamily.sans],
        acuminMedium: ["Acumin-Medium", ...fontFamily.sans],
        acuminLight: ["Acumin-Light", ...fontFamily.sans],
      },
      colors: {
        customThemePrimary: "#06b6d4",
        customThemeSecondary: "#67e8f9",
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
        answerBad: {
          500: "#F75064",
        },
        answerGood: {
          500: "#82D350",
        },

        grey: {
          500: "#6A6A6A",
        },
        blue: {
          500: "#051B71",
        },
        green: {
          300: "#D3E0BE",
          800: "#5c7537",
          900: "#34441c",
        },
        gameSwipe: {
          left: "#fcbab6",
          neutral: "#fafafa",
          right: "#D4E0B2",
          orange: "#93c5fd",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        wiggle: {
          "0%, 100%": { transform: "rotate(-0.5deg)" },
          "50%": { transform: "rotate(0.5deg)" },
        },
        scaleEffect: {
          "0%": { transform: "scale(1)" },
          "20%": { transform: "scale(1.05)" },
          "40%": { transform: "scale(0.95)" },
          "60%": { transform: "scale(1.1)" },
          "80%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle: "wiggle 0.15s ease-in-out ",
      },
      boxShadow: {
        card: "0 0px 15px -2px rgb(0 0 0 / 0.2), 0 0 3px -2px rgb(0 0 0 / 0.1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
