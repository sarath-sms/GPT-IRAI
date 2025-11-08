import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      // ✅ assets to copy into build
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],

      manifest: {
        name: 'Iraitchi',
        short_name: 'Iraitchi',
        description: 'Easy Booking, Fast Cooking! Fresh seafood, meat, and poultry delivered direct from market.',
        theme_color: '#26355D',
        background_color: '#FFEB3B',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },

      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          },
          // {
          //   // ✅ Fixed version — TS-safe
          //   urlPattern: ({ url }) =>
          //     url.origin === (typeof self !== 'undefined' && self.location ? self.location.origin : ''),
          //   handler: 'StaleWhileRevalidate'
          // }
        ]
      }
    })
  ],

  // ✅ Helpful alias support
  resolve: {
    alias: {
      '@': '/src'
    }
  },

  // ✅ Clean builds
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})


