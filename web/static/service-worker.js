const CACHE_NAME = "findalways-pwa-v1";
const ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/static/css/styles.css",
  "/static/js/app.js",
  "/static/icons/icon-192.png",
  "/static/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(networkRes => {
        caches.open(CACHE_NAME).then(cache => cache.put(req, networkRes.clone())).catch(()=>{});
        return networkRes.clone();
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
