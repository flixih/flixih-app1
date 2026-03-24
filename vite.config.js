import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      "all",
      ".base44.app",
      ".modal.host",
      ".w.modal.host",
    ],
    host: true,
    strictPort: false,
  },
});
