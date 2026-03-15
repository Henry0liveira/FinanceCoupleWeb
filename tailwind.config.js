/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0F172A",
          900: "#111827",
          800: "#1F2937"
        },
        slateSoft: {
          100: "#F8F7FB",
          200: "#EAE6F6",
          500: "#8B86A3"
        },
        income: "#23C483",
        expense: "#EF4444",
        accent: "#A855F7",
        brandPink: "#EC4899",
        brandPurple: "#A855F7",
        brandBlue: "#3B82F6"
      },
      boxShadow: {
        card: "0 18px 40px rgba(17, 24, 39, 0.08)",
        glow: "0 16px 40px rgba(168, 85, 247, 0.25)"
      },
      borderRadius: {
        xl: "18px",
        "2xl": "24px"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Manrope'", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
