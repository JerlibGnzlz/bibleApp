const STATIC_CACHE = 'bibleapp-static-v3';
const DYNAMIC_CACHE = 'bibleapp-dynamic-v3';

const urlsToCache = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (![STATIC_CACHE, DYNAMIC_CACHE].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  if (urlsToCache.includes(requestUrl.pathname) || requestUrl.pathname === '/') {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  } else if (requestUrl.pathname.startsWith('/_next/static')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          return caches.open(STATIC_CACHE).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const resClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(event.request, resClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
