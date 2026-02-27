const CACHE_NAME = 'nft-marketplace-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // Ignore offline errors for demo purposes
                });
            })
    );
});

self.addEventListener('push', event => {
    const title = 'NFT Galaxy Drop';
    const options = {
        body: event.data ? event.data.text() : 'A new NFT drop is live!',
        icon: '/logo192.png',
        badge: '/logo192.png'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});
