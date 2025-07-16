/* eslint-env serviceworker */
/* global clients */
/**
 * Vita Health App - Notification Intelligence Service Worker
 * Captures and processes health data from app notifications
 */

// Cache for storing captured health data
let healthDataCache = [];
let isVitaAppActive = false;

// Health app patterns and parsers
const HEALTH_APP_PATTERNS = {
  // Step tracking patterns
  steps: [
    /(\d+,?\d*)\s*steps?/i,
    /walked\s*(\d+,?\d*)/i,
    /(\d+,?\d*)\s*step/i,
    /steps:\s*(\d+,?\d*)/i
  ],
  
  // Sleep tracking patterns
  sleep: [
    /slept\s*(\d+)h?\s*(\d+)?m?/i,
    /sleep:\s*(\d+)h?\s*(\d+)?m?/i,
    /(\d+)h\s*(\d+)m?\s*sleep/i,
    /(\d+)\s*hours?\s*(\d+)?\s*minutes?\s*sleep/i
  ],
  
  // Heart rate patterns
  heartRate: [
    /(\d+)\s*bpm/i,
    /heart\s*rate:\s*(\d+)/i,
    /resting\s*hr:\s*(\d+)/i,
    /pulse:\s*(\d+)/i
  ],
  
  // Activity/exercise patterns
  activity: [
    /(\d+)\s*minutes?\s*active/i,
    /active\s*for\s*(\d+)/i,
    /workout:\s*(\d+)\s*min/i,
    /exercise:\s*(\d+)/i
  ],
  
  // Calories patterns
  calories: [
    /(\d+,?\d*)\s*cal/i,
    /burned\s*(\d+,?\d*)/i,
    /calories:\s*(\d+,?\d*)/i
  ]
};

// Known health apps and their specific patterns
const HEALTH_APPS = {
  'Apple Health': {
    identifier: ['health', 'apple health', 'healthkit'],
    patterns: {
      steps: /You walked (\d+,?\d*) steps/i,
      sleep: /You slept (\d+)h (\d+)m/i
    }
  },
  'Google Fit': {
    identifier: ['google fit', 'fit'],
    patterns: {
      steps: /(\d+,?\d*) steps today/i,
      activity: /(\d+) minutes active/i
    }
  },
  'Samsung Health': {
    identifier: ['samsung health', 's health'],
    patterns: {
      steps: /(\d+,?\d*) steps/i,
      sleep: /(\d+)h (\d+)m sleep/i
    }
  },
  'Fitbit': {
    identifier: ['fitbit'],
    patterns: {
      steps: /(\d+,?\d*) steps/i,
      sleep: /(\d+)h (\d+)m sleep/i,
      heartRate: /Resting heart rate: (\d+)/i
    }
  },
  'Sleep Cycle': {
    identifier: ['sleep cycle'],
    patterns: {
      sleep: /You slept (\d+)h (\d+)m/i,
      quality: /Sleep quality: (\d+)%/i
    }
  },
  'Strava': {
    identifier: ['strava'],
    patterns: {
      activity: /(\d+) min workout/i,
      calories: /(\d+) calories/i
    }
  },
  'MyFitnessPal': {
    identifier: ['myfitnesspal'],
    patterns: {
      calories: /(\d+) calories logged/i
    }
  }
};

/**
 * Install event - set up the service worker
 */
self.addEventListener('install', (event) => {
  console.log('Vita Notification Intelligence SW installed');
  self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('Vita Notification Intelligence SW activated');
  event.waitUntil(clients.claim());
});

/**
 * Message event - communication with main app
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'VITA_APP_ACTIVE':
      isVitaAppActive = data.active;
      break;
      
    case 'GET_CAPTURED_DATA':
      event.ports[0].postMessage({
        type: 'CAPTURED_DATA',
        data: healthDataCache
      });
      break;
      
    case 'CLEAR_CAPTURED_DATA':
      healthDataCache = [];
      break;
      
    case 'REGISTER_NOTIFICATION_LISTENER':
      // Enable notification interception
      console.log('Notification listener registered');
      break;
  }
});

/**
 * Notification click event - capture and process health data
 */
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  
  try {
    const healthData = extractHealthData(notification);
    if (healthData) {
      storeHealthData(healthData);
      
      // Notify main app if active
      if (isVitaAppActive) {
        notifyMainApp('HEALTH_DATA_CAPTURED', healthData);
      }
    }
  } catch (error) {
    console.error('Error processing notification:', error);
  }
  
  // Close notification
  notification.close();
});

/**
 * Push event - capture data from push notifications
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const payload = event.data.json();
    const healthData = extractHealthDataFromPush(payload);
    
    if (healthData) {
      storeHealthData(healthData);
      
      if (isVitaAppActive) {
        notifyMainApp('HEALTH_DATA_CAPTURED', healthData);
      }
    }
  } catch (error) {
    console.error('Error processing push notification:', error);
  }
});

/**
 * Extract health data from notification
 */
function extractHealthData(notification) {
  const title = notification.title || '';
  const body = notification.body || '';
  const text = `${title} ${body}`.toLowerCase();
  
  // Identify the source app
  const sourceApp = identifyHealthApp(text);
  
  // Extract different types of health data
  const healthData = {
    source: sourceApp || 'unknown',
    timestamp: Date.now(),
    data: {}
  };
  
  // Extract steps
  const steps = extractSteps(text, sourceApp);
  if (steps) healthData.data.steps = steps;
  
  // Extract sleep
  const sleep = extractSleep(text, sourceApp);
  if (sleep) healthData.data.sleep = sleep;
  
  // Extract heart rate
  const heartRate = extractHeartRate(text, sourceApp);
  if (heartRate) healthData.data.heartRate = heartRate;
  
  // Extract activity
  const activity = extractActivity(text, sourceApp);
  if (activity) healthData.data.activity = activity;
  
  // Extract calories
  const calories = extractCalories(text, sourceApp);
  if (calories) healthData.data.calories = calories;
  
  // Return data only if we found something
  return Object.keys(healthData.data).length > 0 ? healthData : null;
}

/**
 * Identify which health app sent the notification
 */
function identifyHealthApp(text) {
  for (const [appName, config] of Object.entries(HEALTH_APPS)) {
    for (const identifier of config.identifier) {
      if (text.includes(identifier)) {
        return appName;
      }
    }
  }
  return null;
}

/**
 * Extract step count from notification text
 */
function extractSteps(text, sourceApp) {
  // Try app-specific patterns first
  if (sourceApp && HEALTH_APPS[sourceApp]?.patterns?.steps) {
    const match = text.match(HEALTH_APPS[sourceApp].patterns.steps);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
  }
  
  // Try general patterns
  for (const pattern of HEALTH_APP_PATTERNS.steps) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
  }
  
  return null;
}

/**
 * Extract sleep data from notification text
 */
function extractSleep(text, sourceApp) {
  // Try app-specific patterns first
  if (sourceApp && HEALTH_APPS[sourceApp]?.patterns?.sleep) {
    const match = text.match(HEALTH_APPS[sourceApp].patterns.sleep);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return {
        duration: hours * 60 + minutes, // Total minutes
        hours: hours,
        minutes: minutes
      };
    }
  }
  
  // Try general patterns
  for (const pattern of HEALTH_APP_PATTERNS.sleep) {
    const match = text.match(pattern);
    if (match) {
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      return {
        duration: hours * 60 + minutes,
        hours: hours,
        minutes: minutes
      };
    }
  }
  
  return null;
}

/**
 * Extract heart rate from notification text
 */
function extractHeartRate(text, sourceApp) {
  // Try app-specific patterns first
  if (sourceApp && HEALTH_APPS[sourceApp]?.patterns?.heartRate) {
    const match = text.match(HEALTH_APPS[sourceApp].patterns.heartRate);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  // Try general patterns
  for (const pattern of HEALTH_APP_PATTERNS.heartRate) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  return null;
}

/**
 * Extract activity data from notification text
 */
function extractActivity(text, sourceApp) {
  // Try app-specific patterns first
  if (sourceApp && HEALTH_APPS[sourceApp]?.patterns?.activity) {
    const match = text.match(HEALTH_APPS[sourceApp].patterns.activity);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  // Try general patterns
  for (const pattern of HEALTH_APP_PATTERNS.activity) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  return null;
}

/**
 * Extract calories from notification text
 */
function extractCalories(text, sourceApp) {
  // Try app-specific patterns first
  if (sourceApp && HEALTH_APPS[sourceApp]?.patterns?.calories) {
    const match = text.match(HEALTH_APPS[sourceApp].patterns.calories);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
  }
  
  // Try general patterns
  for (const pattern of HEALTH_APP_PATTERNS.calories) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
  }
  
  return null;
}

/**
 * Extract health data from push notification payload
 */
function extractHealthDataFromPush(payload) {
  // Similar to extractHealthData but for push payloads
  const text = `${payload.title || ''} ${payload.body || ''}`.toLowerCase();
  return extractHealthData({ title: payload.title, body: payload.body });
}

/**
 * Store captured health data
 */
function storeHealthData(healthData) {
  healthDataCache.push(healthData);
  
  // Keep only last 100 entries to prevent memory issues
  if (healthDataCache.length > 100) {
    healthDataCache = healthDataCache.slice(-100);
  }
  
  console.log('Health data captured:', healthData);
}

/**
 * Notify main app of captured data
 */
function notifyMainApp(type, data) {
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: type,
        data: data
      });
    });
  });
}
