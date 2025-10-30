import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1E3A8A',
        },
        primary: {
          DEFAULT: '#1E3A8A',
        },
        accent: {
          start: '#2563EB',
          end: '#4F46E5',
        },
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(to right, #2563EB, #4F46E5)',
      },
      ringColor: {
        'accent-focus': '#2563EB',
      },
      borderColor: {
        'accent-focus': '#2563EB',
      },
    },
  },
  plugins: [],
};
export default config;
