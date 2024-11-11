/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "bg-gradient":
          "linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #415a77 100%)",
      },
    },
  },
  plugins: [],
};
