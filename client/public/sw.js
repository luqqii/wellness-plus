const CACHE_NAME = 'wellness-plus-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  // Skip waiting allows the new service worker to immediately control the page
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Network First strategy
    fetch(event.request)
      .then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Update cache if it's a valid GET request
          if (event.request.method === 'GET' && networkResponse.ok) {
             cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push notification listener
self.addEventListener('push', function(event) {
  const title = 'Wellness+';
  const options = {
    body: event.data ? event.data.text() : 'You have a new AI coaching insight!',
    icon: '/vite.svg',
    badge: '/vite.svg'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
