/**
 * Pushkala Organic Dairy Farm — Service Worker
 * Strategy: Cache-First for static assets, Network-First for HTML navigation.
 * Version: 1.0.0
 */

const CACHE_NAME = 'pushkala-dairy-v3';
const OFFLINE_URL = './index.html';

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  './index.html',
  './css/style.css',
  './js/main.js',
  './manifest.json',
  './assets/pushkala_logo.jpg',
  './assets/hero_farm.jpg',
  './assets/gir_cow_a2.jpg',
  './assets/hf_cow_a1.jpg',
  './assets/murrah_buffalo.jpg',
  './assets/fresh_milk_bottles.jpg',
  './assets/fresh_paneer.jpg',
  './assets/pure_ghee.jpg',
  './assets/farm_visit.jpg',
  './assets/pwa_icon_192.jpg',
  './assets/pwa_icon_512.jpg'
];

// ─── Install: Pre-cache all static assets ───────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v1...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching assets...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      console.log('[SW] Pre-caching complete.');
      return self.skipWaiting(); // Activate immediately
    })
  );
});

// ─── Activate: Clean up old caches ──────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Service Worker activated. Claiming clients...');
      return self.clients.claim();
    })
  );
});

// ─── Fetch: Cache-First for assets, Network-First for navigation ─────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests (WhatsApp links etc.)
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // For HTML navigation: Network-First → fallback to cache → fallback to offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache fresh copy
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((cached) => cached || caches.match(OFFLINE_URL));
        })
    );
    return;
  }

  // For all other assets: Cache-First → Network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Serve from cache and update in background (stale-while-revalidate)
        const networkFetch = fetch(request).then((response) => {
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          }
          return response;
        }).catch(() => { /* silent fail - already served from cache */ });

        return cached;
      }

      // Not in cache — fetch from network and cache it
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
        return response;
      });
    })
  );
});

// ─── Push Notifications (future-ready stub) ──────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Pushkala Organic Dairy Farm';
  const options = {
    body: data.body || 'Fresh milk is ready for you!',
    icon: './assets/pwa_icon_192.jpg',
    badge: './assets/pwa_icon_192.jpg',
    vibrate: [200, 100, 200],
    data: { url: data.url || './' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
