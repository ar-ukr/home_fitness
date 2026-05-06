const CACHE_NAME = 'recomp-v1.2';
const ASSETS = [
  './index.html',
  './manifest.json',
  './sw.js'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Форсируем активацию новой версии SW сразу
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Удаляем старый кэш предыдущих версий
          }
        })
      );
    }).then(() => self.clients.claim()) // Немедленно берем под контроль все вкладки
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
