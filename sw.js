// Dead Hotel : hors ligne. Sert la copie en cache tout de suite,
// et télécharge la nouvelle version en fond (utilisée au lancement suivant).
const C = 'dead-hotel';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  const net = fetch(e.request).then(async r => { if (r.ok) await (await caches.open(C)).put(e.request, r.clone()); return r; });
  e.waitUntil(net.catch(() => {}));
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || net));
});
