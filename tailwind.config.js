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
        pca: "#29353c",
        pcb: "#44576d",
        pcc: "#768A96",
        pcd: "#aac7d8",
        pce: "#dfebf6",
        pcf: "#e6e6e6",
      },
    },
  },
  variants: {
    opacity: ["disabled"],
  },
  plugins: [],
};
