const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;

// Install a SERVICE WORKER
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Open Cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Listen for Request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cache) => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

// Activate the service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
