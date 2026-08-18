const CACHE_NAME = "qurio-v1";
const urlsToCache = ["/", "/dashboard", "/login", "/leaderboard"];

self.addEventListener("install", (event: ExtendableEvent) {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event: FetchEvent) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response ?? fetch(event.request);
    })
  );
});
