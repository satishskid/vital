/* eslint-env serviceworker */
/* global clients */
/**
 * Vita Social Notification Service Worker
 * Privacy-first social interaction detection from app notifications
 */

// Cache for storing captured social interactions
let socialInteractionCache = [];
let isVitaAppActive = false;
let privacySettings = {
  socialTrackingEnabled: false,
  allowedApps: [],
  trackingLevel: 'metadata_only'
};

// Communication app patterns for social interaction detection
const COMMUNICATION_APP_PATTERNS = {
  'WhatsApp': {
    identifier: ['whatsapp'],
    patterns: {
      message: /(.+): (.+)/i,
      call: /(?:incoming|outgoing) call (?:from|with) (.+)/i,
      video_call: /video call (?:from|with) (.+)/i,
      group_message: /(.+) in (.+): (.+)/i,
      missed_call: /missed call from (.+)/i
    }
  },
  'iMessage': {
    identifier: ['imessage', 'messages', 'message'],
    patterns: {
      message: /(.+): (.+)/i,
      call: /call (?:from|with) (.+)/i,
      facetime: /facetime (?:from|with) (.+)/i
    }
  },
  'Telegram': {
    identifier: ['telegram'],
    patterns: {
      message: /(.+): (.+)/i,
      call: /(.+) is calling/i,
      video_call: /video call (?:from|with) (.+)/i,
      voice_message: /(.+) sent a voice message/i
    }
  },
  'FaceTime': {
    identifier: ['facetime'],
    patterns: {
      video_call: /facetime (?:from|with) (.+)/i,
      audio_call: /facetime audio (?:from|with) (.+)/i,
      missed_call: /missed facetime call from (.+)/i
    }
  },
  'Zoom': {
    identifier: ['zoom'],
    patterns: {
      video_call: /(.+) is inviting you to a zoom meeting/i,
      meeting_start: /your zoom meeting is starting/i,
      meeting_reminder: /(.+) meeting starting in/i
    }
  },
  'Discord': {
    identifier: ['discord'],
    patterns: {
      message: /(.+): (.+)/i,
      call: /(.+) is calling/i,
      voice_channel: /(.+) joined (.+)/i
    }
  },
  'Slack': {
    identifier: ['slack'],
    patterns: {
      message: /(.+) in (.+): (.+)/i,
      direct_message: /(.+): (.+)/i,
      call: /(.+) is calling/i
    }
  },
  'Signal': {
    identifier: ['signal'],
    patterns: {
      message: /(.+): (.+)/i,
      call: /call from (.+)/i,
      video_call: /video call from (.+)/i
    }
  },
  'Phone': {
    identifier: ['phone', 'call', 'dialer'],
    patterns: {
      incoming_call: /incoming call from (.+)/i,
      missed_call: /missed call from (.+)/i,
      call_ended: /call with (.+) ended/i
    }
  }
};

/**
 * Install event - set up the service worker
 */
self.addEventListener('install', (event) => {
  console.log('Vita Social Notification SW installed');
  self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('Vita Social Notification SW activated');
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
      
    case 'UPDATE_PRIVACY_SETTINGS':
      privacySettings = { ...privacySettings, ...data.settings };
      break;
      
    case 'GET_SOCIAL_INTERACTIONS':
      event.ports[0].postMessage({
        type: 'SOCIAL_INTERACTIONS',
        data: socialInteractionCache
      });
      break;
      
    case 'CLEAR_SOCIAL_DATA':
      socialInteractionCache = [];
      break;
      
    case 'REGISTER_SOCIAL_LISTENER':
      console.log('Social notification listener registered');
      break;
  }
});

/**
 * Notification click event - capture and process social interactions
 */
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  
  try {
    if (privacySettings.socialTrackingEnabled) {
      const socialInteraction = extractSocialInteraction(notification);
      if (socialInteraction) {
        storeSocialInteraction(socialInteraction);
        
        // Notify main app if active
        if (isVitaAppActive) {
          notifyMainApp('SOCIAL_INTERACTION_DETECTED', socialInteraction);
        }
      }
    }
  } catch (error) {
    console.error('Error processing social notification:', error);
  }
  
  // Close notification
  notification.close();
});

/**
 * Push event - capture data from push notifications
 */
self.addEventListener('push', (event) => {
  if (!event.data || !privacySettings.socialTrackingEnabled) return;
  
  try {
    const payload = event.data.json();
    const socialInteraction = extractSocialInteractionFromPush(payload);
    
    if (socialInteraction) {
      storeSocialInteraction(socialInteraction);
      
      if (isVitaAppActive) {
        notifyMainApp('SOCIAL_INTERACTION_DETECTED', socialInteraction);
      }
    }
  } catch (error) {
    console.error('Error processing social push notification:', error);
  }
});

/**
 * Extract social interaction from notification
 */
function extractSocialInteraction(notification) {
  const title = notification.title || '';
  const body = notification.body || '';
  const text = `${title} ${body}`.toLowerCase();
  
  // Identify the communication app
  const appInfo = identifyCommunicationApp(text, title);
  if (!appInfo) return null;
  
  // Check if app is allowed
  if (!isAppAllowed(appInfo.app)) return null;
  
  // Extract contact and interaction details
  const interactionData = extractInteractionDetails(title, body, appInfo);
  if (!interactionData) return null;
  
  return {
    app: appInfo.app,
    type: interactionData.type,
    contactName: interactionData.contactName,
    timestamp: Date.now(),
    title: title,
    body: privacySettings.trackingLevel === 'detailed' ? body : null,
    metadata: createInteractionMetadata(interactionData, appInfo)
  };
}

/**
 * Identify which communication app sent the notification
 */
function identifyCommunicationApp(text, title) {
  for (const [appName, config] of Object.entries(COMMUNICATION_APP_PATTERNS)) {
    for (const identifier of config.identifier) {
      if (text.includes(identifier) || title.toLowerCase().includes(identifier)) {
        return { app: appName, config: config };
      }
    }
  }
  return null;
}

/**
 * Extract interaction details from notification
 */
function extractInteractionDetails(title, body, appInfo) {
  const { config } = appInfo;
  
  // Try to match against app-specific patterns
  for (const [type, pattern] of Object.entries(config.patterns)) {
    const match = body.match(pattern);
    if (match) {
      return {
        type: type,
        contactName: cleanContactName(match[1]),
        rawMatch: match
      };
    }
  }
  
  return null;
}

/**
 * Clean and normalize contact name
 */
function cleanContactName(name) {
  if (!name) return null;
  
  return name
    .replace(/^(from|to|with)\s+/i, '')
    .replace(/\s+(is calling|sent|says)$/i, '')
    .trim();
}

/**
 * Create metadata for interaction (privacy-aware)
 */
function createInteractionMetadata(interactionData, appInfo) {
  const metadata = {
    app: appInfo.app,
    interactionType: interactionData.type,
    timestamp: Date.now()
  };
  
  // Add metadata based on privacy level
  if (privacySettings.trackingLevel === 'basic') {
    metadata.hasContent = !!interactionData.rawMatch;
  } else if (privacySettings.trackingLevel === 'detailed') {
    metadata.contentLength = interactionData.rawMatch ? 
      interactionData.rawMatch[0].length : 0;
    metadata.timeOfDay = new Date().getHours();
  }
  
  return metadata;
}

/**
 * Check if app is allowed for tracking
 */
function isAppAllowed(app) {
  if (!privacySettings.socialTrackingEnabled) return false;
  
  // If no specific apps are allowed, allow all communication apps
  if (privacySettings.allowedApps.length === 0) return true;
  
  return privacySettings.allowedApps.includes(app.toLowerCase());
}

/**
 * Store social interaction data
 */
function storeSocialInteraction(interactionData) {
  socialInteractionCache.push(interactionData);
  
  // Keep only last 100 entries to prevent memory issues
  if (socialInteractionCache.length > 100) {
    socialInteractionCache = socialInteractionCache.slice(-100);
  }
  
  console.log('Social interaction captured:', interactionData.type, 'with', interactionData.contactName);
}

/**
 * Extract social interaction from push notification payload
 */
function extractSocialInteractionFromPush(payload) {
  const text = `${payload.title || ''} ${payload.body || ''}`.toLowerCase();
  const appInfo = identifyCommunicationApp(text, payload.title || '');
  
  if (!appInfo) return null;
  
  const interactionData = extractInteractionDetails(
    payload.title || '', 
    payload.body || '', 
    appInfo
  );
  
  if (!interactionData) return null;
  
  return {
    app: appInfo.app,
    type: interactionData.type,
    contactName: interactionData.contactName,
    timestamp: Date.now(),
    title: payload.title,
    body: privacySettings.trackingLevel === 'detailed' ? payload.body : null,
    metadata: createInteractionMetadata(interactionData, appInfo)
  };
}

/**
 * Notify main app of captured social interaction
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
