self.addEventListener('install', event => {
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    // Delete all caches immediately upon activation
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    console.log('Deleting outdated cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            // Unregister the service worker entirely after destroying the cache
            self.registration.unregister();
            // Tell clients (open tabs) to reload in order to fetch fresh assets
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', event => {
    // Bypass service worker and go straight to network
    event.respondWith(fetch(event.request));
});
