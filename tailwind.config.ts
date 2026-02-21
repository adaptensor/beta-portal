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
          gold: '#FADC1A',
          yellow: "#FADC1A",
          'gold-dark': '#EDD800',
          cyan: "#06B6D4",
          black: "#0A0A0A",
          dark: "#020617",
          card: "#0F172A",
          cardHover: "#1E293B",
          border: "#334155",
          borderHover: "#475569",
        },
        'adapt-books': '#3B82F6',
        'adapt-aero': '#F59E0B',
        'adapt-clean': '#008000',
        'adapt-fix': '#E9011B',
        'adapt-lawn': '#D3A700',
        'adapt-care': '#263B98',
        'adapt-vault': '#44EE30',
        'adapt-law': '#253B97',
        'adapt-home': '#06B6D4',
        'adapt-calc': '#F97316',
        'adapt-pos': '#F4D225',
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
