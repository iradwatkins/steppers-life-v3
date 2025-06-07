import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: mode === 'development' ? 'http://localhost:8080' : 'https://api.stepperslife.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-slot', '@radix-ui/react-toast']
        }
      }
    }
  },
  base: '/',
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB limit
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/api\//,
          /\/__/,
          /\/sw\.js$/,
          /\/manifest\.json$/,
          /\/manifest\.webmanifest$/,
          /\.(js|css|png|jpg|jpeg|svg|gif|ico|woff|woff2|ttf|eot|webp|avif|map)$/
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: mode === 'development' 
              ? /^http:\/\/localhost:8080\/.*$/ 
              : /^https:\/\/api\.stepperslife\.com\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'external-images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/pwa/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pwa-pages-cache',
              networkTimeoutSeconds: 3
            }
          }
        ]
      },
      manifest: {
        name: 'SteppersLife - Event Management PWA',
        short_name: 'SteppersLife',
        description: 'Progressive Web App for SteppersLife event management with offline capability.',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        id: '/',
        categories: ['productivity', 'business', 'utilities'],
        lang: 'en-US',
        dir: 'ltr',
        icons: [
          {
            src: '/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ],
        shortcuts: [
          {
            name: 'Event Check-in',
            short_name: 'Check-in',
            description: 'Quick access to event check-in scanner',
            url: '/pwa/checkin',
            icons: [
              {
                src: '/icons/checkin-icon-96x96.png',
                sizes: '96x96',
                type: 'image/png'
              }
            ]
          },
          {
            name: 'Event Dashboard',
            short_name: 'Dashboard',
            description: 'View event management dashboard',
            url: '/pwa/dashboard',
            icons: [
              {
                src: '/icons/dashboard-icon-96x96.png',
                sizes: '96x96',
                type: 'image/png'
              }
            ]
          },
          {
            name: 'App Install Guide',
            short_name: 'Install Guide',
            description: 'App installation instructions',
            url: '/download',
            icons: [
              {
                src: '/icons/icon-96x96.png',
                sizes: '96x96',
                type: 'image/png'
              }
            ]
          }
        ],
        screenshots: [
          {
            src: '/screenshots/mobile-login.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'SteppersLife PWA Login Screen'
          },
          {
            src: '/screenshots/mobile-dashboard.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Event Management Dashboard'
          },
          {
            src: '/screenshots/tablet-checkin.png',
            sizes: '820x1180',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Event Check-in Interface'
          }
        ],
        related_applications: [],
        prefer_related_applications: false,
        edge_side_panel: {
          preferred_width: 400
        },
        handle_links: 'preferred',
        launch_handler: {
          client_mode: ['navigate-existing', 'auto']
        }
      },
      devOptions: {
        enabled: mode === 'development',
        type: 'module',
        navigateFallback: 'index.html',
        suppressWarnings: true
      },
      injectRegister: mode === 'development' ? 'script' : 'auto'
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
