
const CACHE_NAME = 'aether-v3';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// On install, cache the core UI
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use individual add for better debugging of failed requests
      return Promise.allSettled(
        PRECACHE_ASSETS.map(url => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});

// Network-First Strategy
self.addEventListener('fetch', (event) => {
  // Ignore external API calls to avoid CORS cache issues
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
