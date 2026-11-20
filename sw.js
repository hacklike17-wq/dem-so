// The offline copy: every file of the app is kept on install and served from here, with or without a network.
// build.mjs puts the version (a hash of the files) in CACHE, so a new build replaces the old copy the next time
// the app is opened with a network.
const CACHE = 'dem-so-e991c8e2aa';
const FILES = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('dem-so-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit ?? fetch(e.request)));
});
