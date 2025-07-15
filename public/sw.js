// Service Worker for Vita Health App
// Handles push notifications and offline functionality

const CACHE_NAME = 'vita-health-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  let notificationData = {
    title: 'Vita Health Reminder',
    body: 'Time to log your health data!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'health-reminder',
    requireInteraction: false,
    actions: [
      {
        action: 'log_data',
        title: 'Log Data',
        icon: '/icons/log-data.png'
      },
      {
        action: 'snooze',
        title: 'Remind Later',
        icon: '/icons/snooze.png'
      }
    ],
    data: {
      url: '/dashboard'
    }
  };

  // If push event has data, use it
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data || {};

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (let client of clientList) {
          if (client.url.includes(self.location.origin)) {
            if (action === 'log_data') {
              // Navigate to dashboard
              client.postMessage({
                type: 'NAVIGATE',
                url: '/dashboard'
              });
            } else if (action === 'snooze') {
              // Handle snooze action
              client.postMessage({
                type: 'SNOOZE_REMINDER',
                reminderId: notificationData.reminderId
              });
            }
            return client.focus();
          }
        }

        // If app is not open, open it
        let urlToOpen = self.location.origin;
        
        if (action === 'log_data') {
          urlToOpen += '/dashboard';
        } else if (action === 'snooze') {
          // For snooze, just open the main app
          urlToOpen += '/';
        } else {
          // Default action
          urlToOpen += notificationData.url || '/dashboard';
        }

        return clients.openWindow(urlToOpen);
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event);
  
  if (event.tag === 'health-data-sync') {
    event.waitUntil(syncHealthData());
  }
});

// Function to sync health data when back online
async function syncHealthData() {
  try {
    // Get pending health data from IndexedDB
    const pendingData = await getPendingHealthData();
    
    if (pendingData.length === 0) {
      console.log('No pending health data to sync');
      return;
    }

    // Attempt to sync each pending entry
    for (const entry of pendingData) {
      try {
        const response = await fetch('/api/health-entries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry.data)
        });

        if (response.ok) {
          // Remove from pending data
          await removePendingHealthData(entry.id);
          console.log('Synced health data entry:', entry.id);
        }
      } catch (error) {
        console.error('Failed to sync health data entry:', entry.id, error);
      }
    }
  } catch (error) {
    console.error('Error during health data sync:', error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingHealthData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VitaHealthDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pendingSync'], 'readonly');
      const store = transaction.objectStore('pendingSync');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || []);
      };
      
      getAllRequest.onerror = () => {
        reject(getAllRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function removePendingHealthData(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VitaHealthDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        resolve();
      };
      
      deleteRequest.onerror = () => {
        reject(deleteRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Message handling from main app
self.addEventListener('message', (event) => {
  console.log('Service worker received message:', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'SCHEDULE_REMINDER':
      scheduleLocalReminder(data);
      break;
    case 'CANCEL_REMINDER':
      cancelLocalReminder(data.reminderId);
      break;
    case 'STORE_PENDING_DATA':
      storePendingHealthData(data);
      break;
    default:
      console.log('Unknown message type:', type);
  }
});

// Schedule a local reminder
function scheduleLocalReminder(reminderData) {
  const { id, title, message, time, days } = reminderData;
  
  // Calculate next occurrence
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() + i);
    checkDate.setHours(hours, minutes, 0, 0);
    
    const dayName = checkDate.toLocaleDateString('en', { weekday: 'lowercase' });
    
    if (days.includes(dayName) && checkDate > now) {
      const delay = checkDate.getTime() - now.getTime();
      
      setTimeout(() => {
        self.registration.showNotification(title, {
          body: message,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: `reminder-${id}`,
          actions: [
            { action: 'log_data', title: 'Log Data' },
            { action: 'snooze', title: 'Remind Later' }
          ],
          data: { reminderId: id, url: '/dashboard' }
        });
        
        // Reschedule for next occurrence
        scheduleLocalReminder(reminderData);
      }, delay);
      
      break;
    }
  }
}

// Cancel a local reminder
function cancelLocalReminder(reminderId) {
  // Note: There's no direct way to cancel setTimeout in service worker
  // This would need to be implemented with a more sophisticated scheduling system
  console.log('Cancelling reminder:', reminderId);
}

// Store pending health data for offline sync
async function storePendingHealthData(healthData) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VitaHealthDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');
      
      const addRequest = store.add({
        data: healthData,
        timestamp: Date.now()
      });
      
      addRequest.onsuccess = () => {
        resolve();
      };
      
      addRequest.onerror = () => {
        reject(addRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}
