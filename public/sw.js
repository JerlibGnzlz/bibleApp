// Service Worker for PWA functionality
const CACHE_NAME = "predicas-app-v1"
const urlsToCache = ["/", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"]

// Install event - cache assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache)
        }),
    )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => {
                        return cacheName !== CACHE_NAME
                    })
                    .map((cacheName) => {
                        return caches.delete(cacheName)
                    }),
            )
        }),
    )
})

// Fetch event - serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit - return response
            if (response) {
                return response
            }
            return fetch(event.request).then((response) => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== "basic") {
                    return response
                }

                // Clone the response
                const responseToCache = response.clone()

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache)
                })

                return response
            })
        }),
    )
})

