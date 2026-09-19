import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward any request starting with /api to the Express server
    proxy: { "/api": "http://localhost:3000" },
  },
});
