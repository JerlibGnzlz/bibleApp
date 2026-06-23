if ('serviceWorker' in navigator) {
  const isLocalDev =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.local');

  if (isLocalDev) {
    // En desarrollo, el SW interfiere con HMR y causa 404 en chunks de Next.js
    window.addEventListener('load', async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    });
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado con éxito:', registration);
        })
        .catch((error) => {
          console.log('Error al registrar el Service Worker:', error);
        });
    });
  }
}
