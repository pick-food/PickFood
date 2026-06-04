import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        sans: ["Pretendard Variable", "Pretendard", "system-ui", "sans-serif"],
      },
      fontSize: {
        "h-26": ["26px", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        "h-24": ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "h-20": ["20px", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "h-16": ["16px", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "h-14": ["14px", { lineHeight: "1.4", letterSpacing: "0" }],
        "b-11": ["11px", { lineHeight: "1.4", letterSpacing: "0" }],
        "b-12": ["12px", { lineHeight: "1.4", letterSpacing: "0" }],
        "b-13": ["13px", { lineHeight: "1.4", letterSpacing: "0" }],
        "b-14": ["14px", { lineHeight: "1.4", letterSpacing: "0" }],
        "b-15": ["15px", { lineHeight: "1.4", letterSpacing: "0" }],
        "b-16": ["16px", { lineHeight: "1.5", letterSpacing: "0" }],
        "b-18": ["18px", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        "b-20": ["20px", { lineHeight: "1.5", letterSpacing: "0" }],
        "b-22": ["22px", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        xs:   "4px",
        sm:   "5px",
        base: "6px",
        md:   "8px",
        lg:   "10px",
        xl:   "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      colors: {
        white:  "#FFFFFF",
        black:  "#000000",
        naver:  "#03A94D",
        kakao:  "#FEE500",

        // ── Pickfood primary: forest green ─────────────────────
        primary: {
          DEFAULT:  "#1F4D2C",   // forest green
          dark:     "#0F2E18",   // deep forest
          darker:   "#0F1E12",   // darkest bg
          light:    "#EBF5EC",   // tint
          mid:      "#2A6339",   // mid green
        },

        // ── Lime accent ────────────────────────────────────────
        lime: {
          DEFAULT: "#A8E063",
          dark:    "#7CB835",
          light:   "#F0FADA",
        },

        // ── Gray scale ─────────────────────────────────────────
        gray: {
          900: "#1A1A1A",
          800: "#333333",
          600: "#555555",
          400: "#777777",
          300: "#999999",
          200: "#AAAAAA",
          100: "#CCCCCC",
          50:  "#F4F5F1",
        },

        // ── Surface & border ───────────────────────────────────
        surface: {
          DEFAULT: "#F4F5F1",
          warm:    "#F8F9F5",
          card:    "#FFFFFF",
        },
        border: {
          DEFAULT: "#E5E7E1",
          light:   "#ECEEE9",
          mid:     "#D4D7CE",
          hover:   "#B8BDB2",
          warm:    "#DEEBD5",
        },

        // ── Semantic: danger / sale ────────────────────────────
        warn: {
          DEFAULT:   "#D32F2F",
          light:     "#FFF5F5",
          active:    "#B71C1C",
          border:    "#FFCDD2",
          tagLight:  "#FFF5F5",
          tagBorder: "#FFCDD2",
        },

        // ── Semantic: safe / organic ──────────────────────────
        safe: {
          DEFAULT: "#2A7A3A",
          light:   "#F0FAF2",
          border:  "#B0DDB8",
          vegan:   "#2D6A2D",
        },

        // ── Amber accent (price highlights) ───────────────────
        accent: {
          DEFAULT: "#E89B26",
          light:   "#FFF8EC",
          dark:    "#B57A10",
        },
      },
    },
  },
} satisfies Config;
