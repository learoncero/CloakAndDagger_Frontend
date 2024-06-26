import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        spaceshipFloor: "url(/tileImages/spaceshipFloor.png)",
        spaceshipWall: "url(/tileImages/spaceshipWall.png)",
        jungleFloor: "url(/tileImages/jungleFloor.png)",
        jungleWall: "url(/tileImages/jungleWall.png)",
        basementFloor: "url(/tileImages/basementFloor.png)",
        basementWall: "url(/tileImages/basementWall.png)",
        pirateShipFloor: "url(/tileImages/pirateShipFloor.png)",
        pirateShipWall: "url(/tileImages/pirateShipWall.png)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("tailwind-scrollbar")],
};

export default config;
