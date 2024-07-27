import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
        content: "src/content.js",
        background: "src/background.js",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
