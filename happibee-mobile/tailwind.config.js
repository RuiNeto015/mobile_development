/** @type {import("tailwindcss").Config} */

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Works as expected
        // e.g. bg-brandPrimary vs. dark:bg-brandPrimaryDark
        // brandPrimary: '#000000',
        // brandPrimaryDark: '#ffffff',
        primary: {
          DEFAULT: "#6c5e00",
          dark: "#ddc74d",
        },
        on_primary: {
          DEFAULT: "#ffffff",
          dark: "#383000",
        },
        secondary: {
          DEFAULT: "#655f40",
          dark: "#d0c7a2",
        },
        on_secondary: {
          DEFAULT: "#ffffff",
          dark: "#363016",
        },
        tertiary: {
          DEFAULT: "#785900",
          dark: "#fabd00",
        },
        on_tertiary: {
          DEFAULT: "#ffffff",
          dark: "#3f2e00",
        },
        error: {
          DEFAULT: "#ba1a1a",
          dark: "#ffb4ab",
        },
        on_error: {
          DEFAULT: "#ffffff",
          dark: "#690005",
        },
        background: {
          DEFAULT: "#ffffff",
          dark: "#1d1c16",
        },
        on_background: {
          DEFAULT: "#1d1c16",
          dark: "#e7e2d9",
        },
        outline: {
          DEFAULT: "#7c7768",
          dark: "#969180",
        },
        success: {
          DEFAULT: "#0B6623",
          dark: "#3F704D",
        },
      },
    },
  },
  plugins: [],
};
