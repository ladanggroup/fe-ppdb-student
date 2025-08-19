/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // colors: {
      //   "orange-soft": {
      //     DEFAULT: "#FFB347",
      //     100: "#FFF5E6",
      //     200: "#FFE8C2",
      //     300: "#FFDB9E",
      //     400: "#FFCE7A",
      //     500: "#FFB347",
      //     600: "#FF9E1F",
      //     700: "#E6860C",
      //     800: "#B36809",
      //     900: "#804B06",
      //   },
      //   "ppdb-orange": "#FFA500", // orange
      //   "ppdb-soft": "#FFE8D1", // orange soft
      //   "ppdb-orange-light": "#FFF5E6", // orange light
      //   "ppdb-orange-dark": "#CC8400", // untuk hover atau border
      //   "ppdb-gray-dark": "#1F2937",
      //   "ppdb-gray-light": "#F9FAFB",
      // },
    },
  },
  plugins: [],
};
