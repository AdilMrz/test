import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  base: "/",
  build: {
    // Optimize for LCP and performance
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React and core libraries
          react: ["react", "react-dom"],
          // React Admin core
          "react-admin": ["react-admin"],
          // Material-UI
          mui: ["@mui/material", "@mui/icons-material"],
          // React Query
          "react-query": ["@tanstack/react-query"],
          // Charts and heavy libraries
          charts: ["recharts"],
          // PDF generation
          pdf: ["jspdf", "jspdf-autotable"],
          // Supabase
          supabase: ["ra-supabase"],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    // Pre-bundle these dependencies for faster dev startup
    include: [
      "react",
      "react-dom",
      "react-admin",
      "@mui/material",
      "@tanstack/react-query",
    ],
  },
});
