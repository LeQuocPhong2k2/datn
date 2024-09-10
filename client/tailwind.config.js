/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: ["./node_modules/flowbite/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", "./public/**/*.html", "./src/**/*.{ts,tsx,jsx}"],
  plugins: [require("flowbite/plugin")],
  theme: {
    extend: {
      animation: {
        wiggle: "wiggle 2s ease-in-out infinite",
      },
    },
  },
};
