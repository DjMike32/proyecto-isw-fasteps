/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "radius-gradient": "radial-gradient(at center, #FFFFFF, #90C1E9)",
      },
      colors: {
        bgblue: "#0F1C2E",
        bgdark: "#374357",
      },
    },
  },
  variants: {
    opacity: ["disabled"],
  },
  plugins: [],
};
