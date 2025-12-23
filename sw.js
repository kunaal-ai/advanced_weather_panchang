
// Temporarily disabled to ensure the latest code is always loaded during debugging
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', () => {
  // Direct pass-through to network
  return;
});
