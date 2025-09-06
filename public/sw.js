import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

// 👇 Inject manifest during build
precacheAndRoute(self.__WB_MANIFEST || []);

// ✅ API calls (network-first, fallback to cache)
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    cacheName: "api-cache",
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// ✅ Images (cache-first with expiry)
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);

// ✅ Fonts (cache-first, long expiry)
registerRoute(
  ({ url }) =>
    url.origin.includes("fonts.googleapis.com") ||
    url.origin.includes("fonts.gstatic.com"),
  new CacheFirst({
    cacheName: "font-cache",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
    ],
  })
);

// ✅ App shell fallback (offline.html if you want)
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/index.html"))
    );
  }
});
