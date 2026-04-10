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
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
      fontSize: {
        "h-26": ["26px", { lineHeight: "26px", letterSpacing: "-0.02em" }],
        "h-24": ["24px", { lineHeight: "24px", letterSpacing: "-0.01em" }],
        "h-16": ["16px", { lineHeight: "16px", letterSpacing: "-0em" }],
        "h-14": ["14px", { lineHeight: "14px", letterSpacing: "-0em" }],
        "b-11": ["11px", { lineHeight: "12px", letterSpacing: "-0em" }],
        "b-12": ["12px", { lineHeight: "12px", letterSpacing: "-0em" }],
        "b-13": ["13px", { lineHeight: "14px", letterSpacing: "-0em" }],
        "b-14": ["14px", { lineHeight: "14px", letterSpacing: "-0em" }],
        "b-15": ["15px", { lineHeight: "16px", letterSpacing: "-0em" }],
        "b-16": ["16px", { lineHeight: "16px", letterSpacing: "-0em" }],
        "b-18": ["18px", { lineHeight: "18px", letterSpacing: "-0.02em" }],
        "b-20": ["20px", { lineHeight: "20px", letterSpacing: "-0em" }],
        "b-22": ["22px", { lineHeight: "30px", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        xs:   "4px",
        sm:   "5px",
        base: "6px",
        md:   "8px",
        lg:   "10px",
        xl:   "12px",
      },
      colors: {
        white:  "#FFFFFF",
        black:  "#000000",
        naver:  "#03A94D",
        kakao:  "#FEE500",
        
        primary: {
          DEFAULT: "#8B3A1A",
          dark:    "#5C2D0A",
          red:     "#C0392B",
          light:   "#F5E7E2",
        },
        gray: {
          900: "#1A1A1A",
          800: "#333333",
          600: "#555555",
          400: "#777777",
          300: "#999999",
          200: "#AAAAAA",
          100: "#BBBBBB",
        },
        border: {
          DEFAULT: "#EBEBEB",
          light:   "#F0F0F0",
          mid:     "#DDDDDD",
          hover:   "#CCCCCC",
          warm:    "#F0EBE6",
        },
        warn: {
          DEFAULT:   "#8B2A1A",
          light:     "#FFF3F0",
          active:    "#A02010",
          border:    "#F5C5B8",
          tagLight:  "#FFF2EE",
          tagBorder: "#F0C0B0",
        },
        safe: {
          DEFAULT: "#2A7A3A",
          light:   "#F0FAF2",
          border:  "#B0DDB8",
          vegan:   "#2D6A2D",
        },
        accent: {
          DEFAULT: "#E8C8A0",
          peach:   "#FFCC99",
          mint:    "#A0E8B0",
          aque:    "#99FFCC",
        },
        surface: {
          DEFAULT: "#FAFAFA",
          faint:   "#F8F8F8",
          warm:    "#FAF5F2",
        },
      },
    },
  },
} satisfies Config;