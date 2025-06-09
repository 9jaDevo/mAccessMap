const CACHE_NAME = 'maccessmap-v1.0.0';
const STATIC_CACHE_NAME = 'maccessmap-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'maccessmap-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Add other critical assets here
];

// Routes to cache dynamically
const CACHE_ROUTES = [
  '/map',
  '/review',
  '/badges',
  '/profile',
  '/leaderboard',
  '/auth'
];

// Network-first routes (always try network first)
const NETWORK_FIRST_ROUTES = [
  '/api/',
  'supabase.co',
  'googleapis.com'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Network-first strategy for API calls and external services
  if (NETWORK_FIRST_ROUTES.some(route => request.url.includes(route))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first strategy for static assets
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      request.url.includes('/assets/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale-while-revalidate for navigation requests
  if (request.mode === 'navigate' || 
      CACHE_ROUTES.some(route => url.pathname === route)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default: network-first
  event.respondWith(networkFirst(request));
});

// Cache-first strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    return new Response('Offline content not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    return new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, return cached version if available
    return cachedResponse;
  });

  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-reviews') {
    event.waitUntil(syncOfflineReviews());
  }
});

// Sync offline reviews when connection is restored
async function syncOfflineReviews() {
  try {
    // Get offline reviews from IndexedDB or localStorage
    const offlineReviews = await getOfflineReviews();
    
    for (const review of offlineReviews) {
      try {
        // Attempt to submit the review
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(review)
        });
        
        if (response.ok) {
          // Remove from offline storage
          await removeOfflineReview(review.id);
          console.log('Offline review synced successfully:', review.id);
        }
      } catch (error) {
        console.error('Failed to sync offline review:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for offline storage (placeholder implementations)
async function getOfflineReviews() {
  // Implementation would use IndexedDB to store offline reviews
  return [];
}

async function removeOfflineReview(reviewId) {
  // Implementation would remove the review from IndexedDB
  console.log('Removing offline review:', reviewId);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('mAccessMap', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/map')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered:', event.tag);
  
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  try {
    // Sync critical content in the background
    console.log('Service Worker: Syncing content in background');
    
    // Pre-cache important routes
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    await cache.addAll(CACHE_ROUTES);
    
    console.log('Service Worker: Background content sync completed');
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}