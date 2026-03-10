// UCO PWA – Service Worker v4
var CACHE = 'uco-v4';
var ARCHIVOS = [
  '/uco-inspeccion/',
  '/uco-inspeccion/index.html',
  '/uco-inspeccion/manifest.json',
  '/uco-inspeccion/icon-96.png',
  '/uco-inspeccion/icon-192.png',
  '/uco-inspeccion/icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ARCHIVOS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.indexOf('google') !== -1) return;
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request).then(function(cached) {
        return cached || caches.match('/uco-inspeccion/index.html');
      });
    })
  );
});
