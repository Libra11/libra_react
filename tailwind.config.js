/*
 * @Author: Libra
 * @Date: 2023-12-05 16:04:32
 * @LastEditors: Libra
 * @Description: 
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}

