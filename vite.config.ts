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
        manualChunks: (id) => {
          // React and core libraries
          if (id.includes("react") || id.includes("react-dom")) {
            return "react";
          }
          // React Admin core - be more specific to avoid circular deps
          if (id.includes("react-admin") && !id.includes("node_modules")) {
            return "react-admin";
          }
          // Material-UI
          if (id.includes("@mui/")) {
            return "mui";
          }
          // React Query
          if (id.includes("@tanstack/react-query")) {
            return "react-query";
          }
          // Charts and heavy libraries
          if (id.includes("recharts")) {
            return "charts";
          }
          // PDF generation
          if (id.includes("jspdf")) {
            return "pdf";
          }
          // Supabase
          if (id.includes("ra-supabase") || id.includes("@supabase/")) {
            return "supabase";
          }
          // Vendor chunk for other node_modules
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
        // Ensure proper file extensions
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
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
