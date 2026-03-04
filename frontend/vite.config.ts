import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import Sitemap from "vite-plugin-sitemap";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: process.env.DISABLE_HMR === "true" ? false : { overlay: false },
    allowedHosts: [
      "youssefalsherief.tech",
      "www.youssefalsherief.tech",
      "api.youssefalsherief.tech"
    ],
  },
  plugins: [
    react(),
    Sitemap({
      hostname: "https://youssefalsherief.tech",
      dynamicRoutes: ["/en", "/ar"],
      exclude: ["/404"],
    }),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      // Enable SW in dev for testing
      devOptions: {
        enabled: mode === "development",
        type: "module",
      },
      workbox: {
        // ── Runtime Caching ────────────────────────────────────────────────
        runtimeCaching: [
          // Static images — CacheFirst (30 days)
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          // JS / CSS / Workers — StaleWhileRevalidate
          {
            urlPattern: ({ request }) =>
              request.destination === "style" ||
              request.destination === "script" ||
              request.destination === "worker",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "static-resources" },
          },
          // Public API calls — NetworkFirst + 1 h offline fallback
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/api/portfolio/") ||
              url.pathname.startsWith("/api/about"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-portfolio-cache",
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Fonts stylesheets
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          // Google Fonts files
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        cleanupOutdatedCaches: true,
        // SPA offline routing — serve cached index.html for navigation requests
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
      },
      // ── Web App Manifest ────────────────────────────────────────────────
      manifest: {
        name: "Youssef AlSherief — Tech Portfolio",
        short_name: "AlSherief",
        description: "Full-Stack Developer & Computer Engineer Portfolio",
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        display: "standalone",
        start_url: "/",
        scope: "/",
        lang: "en",
        orientation: "any",
        categories: ["portfolio", "technology"],
        icons: [
          { src: "/favicon.ico", sizes: "64x64", type: "image/x-icon" },
          { src: "/assets/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/assets/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        shortcuts: [
          { name: "Projects", url: "/en#projects", description: "View portfolio projects" },
          { name: "Contact", url: "/en#contact", description: "Get in touch" },
        ],
      },
    }),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 70 },
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    target: "esnext",
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("three")) return "three";
          if (id.includes("framer-motion")) return "framer";
          if (id.includes("@radix-ui/")) return "radix";
          if (id.includes("lucide-react")) return "lucide";
          if (id.includes("@tanstack/")) return "query";
          if (id.includes("i18next") || id.includes("react-i18next")) return "i18n";
          if (
            id.includes("react-dom") ||
            id.includes("react-router") ||
            id.includes("/react/")
          ) return "vendor";
        },
      },
    },
  },
}));
