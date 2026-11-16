import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(import.meta.dirname, "src")
    }
  },
  build: {
    outDir: "dist",
    target: "es2022",
    rollupOptions: {
      input: { main: path.resolve(import.meta.dirname, "index.html"), clientDemo: path.resolve(import.meta.dirname, "client-demo.html"), renderDemo: path.resolve(import.meta.dirname, "render-demo.html") }
    }
  }
});
