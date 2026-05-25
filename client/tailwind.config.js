/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#101419",
        mist: "#f6f8fb",
        teal: "#0f766e",
        coral: "#e85d4f",
        amber: "#f2b84b",
        violet: "#6d5dfc"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 20, 25, 0.12)"
      }
    }
  },
  plugins: []
};
