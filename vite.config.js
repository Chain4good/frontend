import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        "./src"
      ),
    },
  },
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    strictPort: true,
  },
});
