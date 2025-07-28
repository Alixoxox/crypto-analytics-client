const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        spaceGrotesk: ['"Space Grotesk"', ...fontFamily.sans],
      },
      colors: {
        primary: "#A855F7",
        secondary: "#22D3EE",
        muted: "#adadad",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
};
