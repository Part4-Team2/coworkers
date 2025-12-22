/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#10b981",
          secondary: "#a3e635",
          tertiary: "#a1dd70",
          gradient: "#a3e635",
        },
        point: {
          purple: "#a855f7",
          blue: "#3b82f6",
          cyan: "#06b6d4",
          pink: "#ec4899",
          rose: "#f43f5e",
          orange: "#f97316",
          yellow: "#eab308",
        },
        background: {
          primary: "#1f2937",
          secondary: "#374151",
          tertiary: "#4b5563",
          inverse: "#ffffff",
        },
        interaction: {
          inactive: "#cbd5e1",
          hover: "#10b981",
          pressed: "#047857",
          focus: "#34d399",
        },
        text: {
          primary: "#ffffff",
          secondary: "#9ca3af",
          tertiary: "#e5e7eb",
          default: "#6b7280",
          disabled: "#6b7280",
        },
      },
      fontSize: {
        "4xl": ["40px", { lineHeight: "48px" }],
        "3xl": ["32px", { lineHeight: "38px" }],
        "2xl": ["24px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "21px" }],
        md: ["14px", { lineHeight: "17px" }],
        sm: ["13px", { lineHeight: "16px" }],
        xs: ["12px", { lineHeight: "14px" }],
      },
      fontWeight: {
        medium: "500",
        semibold: "600",
        bold: "700",
        regular: "400",
      },
    },
  },
  plugins: [],
};
