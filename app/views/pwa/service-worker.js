// Service worker for Nowlog
const CACHE_NAME = "nowlog-cache-v1";
const urlsToCache = ["/", "/manifest.json", "/icon.png", "/icon.svg"];

// Install event: cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: attempt to serve from cache first, then network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the response from the cached version
      if (response) {
        return response;
      }

      // Clone the request because it can only be used once
      let fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Don't cache non-successful responses or non-GET requests
        if (
          !response ||
          response.status !== 200 ||
          event.request.method !== "GET"
        ) {
          return response;
        }

        // Clone the response because it can only be used once
        let responseToCache = response.clone();

        // Cache the fetched response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// For push notifications (optional feature for future use)
self.addEventListener("push", async (event) => {
  if (event.data) {
    const { title, options } = await event.data.json();
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        let clientPath = new URL(client.url).pathname;

        if (clientPath == event.notification.data?.path && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(event.notification.data?.path || "/");
      }
    })
  );
});
