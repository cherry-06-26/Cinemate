import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // works on GitHub Pages
  plugins: [react()],
  server: { host: true },
});