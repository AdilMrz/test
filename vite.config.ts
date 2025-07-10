import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  base: "/",
  esbuild: {
    target: "esnext",
    format: "esm",
  },
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
        // Simplified chunk splitting to avoid circular dependencies
        manualChunks: {
          // Core React libraries
          react: ["react", "react-dom"],
          // Material-UI components
          mui: ["@mui/material", "@mui/icons-material", "@mui/system"],
          // React Query
          "react-query": ["@tanstack/react-query"],
          // Charts library
          charts: ["recharts"],
          // PDF generation
          pdf: ["jspdf", "jspdf-autotable"],
          // Supabase and React Admin
          admin: ["react-admin", "ra-supabase", "ra-core"],
        },
        // Ensure proper file extensions and format
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        format: "es",
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
