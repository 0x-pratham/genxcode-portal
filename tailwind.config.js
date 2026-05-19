/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Premium Deep Dark Canvas (from the logo base)
          cosmos: "#030712",
          midnight: "#0B1123",
          slateBlue: "#1E293B",
          
          // Sophisticated Accent Sky Blue (from the slogan text)
          accent: "#00A3FF",
          accentGlow: "rgba(0, 163, 255, 0.12)",
          accentMuted: "#38BDF8",
        },
        neutral: {
          premiumText: "#F8FAFC",   // Crisp Off-White
          secondaryText: "#94A3B8", // Sleek Muted Blue-Gray
          borderTint: "rgba(255, 255, 255, 0.06)",
        },
      },
    },
  },
  plugins: [],  
};