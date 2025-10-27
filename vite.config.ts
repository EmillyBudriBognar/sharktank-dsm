import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize build performance
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor bundles
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'animation-vendor': ['framer-motion', 'gsap'],
          'ui-vendor': ['lucide-react', 'react-icons'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps only in development
    sourcemap: mode === 'development',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
  esbuild: {
    // Drop console and debugger in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
