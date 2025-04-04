// // // Service Worker for PWA functionality
// // const CACHE_NAME = "predicas-app-v1"
// // const urlsToCache = ["/", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"]

// // // Install event - cache assets
// // self.addEventListener("install", (event) => {
// //     event.waitUntil(
// //         caches.open(CACHE_NAME).then((cache) => {
// //             return cache.addAll(urlsToCache)
// //         }),
// //     )
// // })

// // // Activate event - clean up old caches
// // self.addEventListener("activate", (event) => {
// //     event.waitUntil(
// //         caches.keys().then((cacheNames) => {
// //             return Promise.all(
// //                 cacheNames
// //                     .filter((cacheName) => {
// //                         return cacheName !== CACHE_NAME
// //                     })
// //                     .map((cacheName) => {
// //                         return caches.delete(cacheName)
// //                     }),
// //             )
// //         }),
// //     )
// // })

// // Fetch event - serve from cache, fall back to network
// self.addEventListener("fetch", (event) => {
//     event.respondWith(
//         caches.match(event.request).then((response) => {
//             // Cache hit - return response
//             if (response) {
//                 return response
//             }
//             return fetch(event.request).then((response) => {
//                 // Check if we received a valid response
//                 if (!response || response.status !== 200 || response.type !== "basic") {
//                     return response
//                 }

//                 // Clone the response
//                 const responseToCache = response.clone()

//                 caches.open(CACHE_NAME).then((cache) => {
//                     cache.put(event.request, responseToCache)
//                 })

//                 return response
//             })
//         }),
//     )
// })




const CACHE_NAME = 'bibleapp-cache-v2';
const STATIC_CACHE = 'bibleapp-static-v2';
const DYNAMIC_CACHE = 'bibleapp-dynamic-v2';

// Recursos estáticos que se cachean al instalar el service worker
const urlsToCache = [
  '/',                    // Página principal (index.html generado por Next.js)
  '/manifest.json',       // El manifest.json
  '/_next/static/chunks/main.js',  // Archivos generados por Next.js (ajusta según tu build)
  '/_next/static/chunks/pages/index.js',  // Código específico de la página index
  '/_next/static/css/styles.css'  // Archivos CSS generados (ajusta según tu build)
];

// Instalación: cachea los recursos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('Caching static assets for BibleApp');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación: limpia cachés antiguos
self.addEventListener('activate', event => {
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch: estrategia mixta (cache-first para estáticos, network-first para dinámicos)
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Recursos estáticos: cache-first
  if (urlsToCache.includes(requestUrl.pathname) || requestUrl.pathname === '/') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
  // Recursos dinámicos (como imágenes): network-first con fallback al caché
  else if (requestUrl.pathname.startsWith('/logo.png') || requestUrl.pathname.startsWith('/globe.svg')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
  // Resto de los recursos: intenta desde la red, con fallback al caché
  else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          return caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});