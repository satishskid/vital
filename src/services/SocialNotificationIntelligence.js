/**
 * Vita Social Notification Intelligence
 * Privacy-first social interaction detection from app notifications
 */

class VitaSocialNotificationIntelligence {
  constructor(socialCircleManager) {
    this.socialCircleManager = socialCircleManager;
    this.isActive = false;
    this.serviceWorker = null;
    this.capturedInteractions = [];
    
    // Privacy settings
    this.privacySettings = {
      socialTrackingEnabled: false,
      allowedApps: [],
      storeMessageContent: false,
      trackingLevel: 'metadata_only' // metadata_only, basic, detailed
    };
    
    // Communication app patterns
    this.communicationApps = {
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
    
    this.listeners = {
      socialInteraction: [],
      error: []
    };
  }

  /**
   * Initialize social notification intelligence
   */
  async initialize() {
    try {
      // Check if user has enabled social tracking
      if (!this.privacySettings.socialTrackingEnabled) {
        console.log('Social tracking disabled by user');
        return false;
      }

      // Register service worker for notification interception
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register(
          '/social-notification-sw.js',
          { scope: '/' }
        );

        await navigator.serviceWorker.ready;
        this.serviceWorker = registration;

        // Set up message listener
        navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));

        this.isActive = true;
        console.log('Social notification intelligence initialized');
        return true;
      }

      throw new Error('Service Workers not supported');
    } catch (error) {
      console.error('Failed to initialize social notification intelligence:', error);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Enable social tracking with user consent
   */
  async enableSocialTracking(settings = {}) {
    this.privacySettings = {
      ...this.privacySettings,
      socialTrackingEnabled: true,
      ...settings
    };

    // Save settings
    if (this.socialCircleManager) {
      await this.socialCircleManager.updatePrivacySettings(this.privacySettings);
    }

    // Initialize if not already done
    if (!this.isActive) {
      return await this.initialize();
    }

    return true;
  }

  /**
   * Disable social tracking
   */
  async disableSocialTracking() {
    this.privacySettings.socialTrackingEnabled = false;
    this.isActive = false;

    if (this.socialCircleManager) {
      await this.socialCircleManager.updatePrivacySettings(this.privacySettings);
    }

    console.log('Social tracking disabled');
  }

  /**
   * Handle messages from service worker
   */
  handleServiceWorkerMessage(event) {
    const { type, data } = event.data;

    switch (type) {
      case 'SOCIAL_INTERACTION_DETECTED':
        this.processSocialInteraction(data);
        break;
      default:
        console.log('Unknown social message from SW:', type, data);
    }
  }

  /**
   * Process detected social interaction
   */
  async processSocialInteraction(interactionData) {
    try {
      // Check if app is allowed
      if (!this.isAppAllowed(interactionData.app)) {
        return;
      }

      // Extract contact information
      const contactInfo = this.extractContactInfo(interactionData);
      if (!contactInfo) return;

      // Find matching contact in social circle
      const contact = this.findMatchingContact(contactInfo.name);
      
      // Create interaction record
      const interaction = {
        contactId: contact ? contact.id : null,
        contactName: contactInfo.name,
        type: interactionData.type,
        app: interactionData.app,
        timestamp: new Date(interactionData.timestamp),
        duration: interactionData.duration || null,
        metadata: this.createMetadata(interactionData),
        isKnownContact: !!contact
      };

      // Store interaction if contact is in social circle or if tracking unknowns is enabled
      if (contact || this.privacySettings.trackUnknownContacts) {
        this.capturedInteractions.push(interaction);
        
        // Record in social circle manager
        if (this.socialCircleManager && contact) {
          await this.socialCircleManager.recordInteraction(interaction);
        }

        // Emit event
        this.emit('socialInteraction', interaction);
        
        console.log('Social interaction processed:', interaction.type, 'with', interaction.contactName);
      }

    } catch (error) {
      console.error('Error processing social interaction:', error);
      this.emit('error', error);
    }
  }

  /**
   * Extract contact information from notification
   */
  extractContactInfo(interactionData) {
    const { title, body, app } = interactionData;
    const text = `${title} ${body}`.toLowerCase();
    
    // Find app configuration
    const appConfig = Object.values(this.communicationApps).find(config =>
      config.identifier.some(id => text.includes(id) || app.toLowerCase().includes(id))
    );

    if (!appConfig) return null;

    // Try to extract contact name using app-specific patterns
    for (const [type, pattern] of Object.entries(appConfig.patterns)) {
      const match = body.match(pattern);
      if (match) {
        return {
          name: this.cleanContactName(match[1]),
          type: type,
          rawMatch: match
        };
      }
    }

    return null;
  }

  /**
   * Clean and normalize contact name
   */
  cleanContactName(name) {
    if (!name) return null;
    
    // Remove common prefixes/suffixes
    return name
      .replace(/^(from|to|with)\s+/i, '')
      .replace(/\s+(is calling|sent|says)$/i, '')
      .trim();
  }

  /**
   * Find matching contact in social circle
   */
  findMatchingContact(name) {
    if (!name || !this.socialCircleManager) return null;

    const socialCircle = this.socialCircleManager.getSocialCircle();
    
    // Exact name match
    let contact = socialCircle.find(c => 
      c.name.toLowerCase() === name.toLowerCase() ||
      c.nickname.toLowerCase() === name.toLowerCase()
    );

    if (contact) return contact;

    // Partial name match (first name)
    const firstName = name.split(' ')[0].toLowerCase();
    contact = socialCircle.find(c => 
      c.name.toLowerCase().includes(firstName) ||
      c.nickname.toLowerCase().includes(firstName)
    );

    return contact;
  }

  /**
   * Create metadata for interaction (privacy-aware)
   */
  createMetadata(interactionData) {
    const metadata = {
      app: interactionData.app,
      timestamp: interactionData.timestamp
    };

    // Add additional metadata based on privacy level
    if (this.privacySettings.trackingLevel === 'basic') {
      metadata.hasContent = !!interactionData.body;
    } else if (this.privacySettings.trackingLevel === 'detailed') {
      metadata.contentLength = interactionData.body ? interactionData.body.length : 0;
      metadata.timeOfDay = new Date(interactionData.timestamp).getHours();
    }

    // Never store actual message content unless explicitly enabled
    if (this.privacySettings.storeMessageContent && this.privacySettings.trackingLevel === 'detailed') {
      metadata.contentPreview = interactionData.body ? interactionData.body.substring(0, 50) + '...' : null;
    }

    return metadata;
  }

  /**
   * Check if app is allowed for tracking
   */
  isAppAllowed(app) {
    if (!this.privacySettings.socialTrackingEnabled) return false;
    
    // If no specific apps are allowed, allow all communication apps
    if (this.privacySettings.allowedApps.length === 0) return true;
    
    return this.privacySettings.allowedApps.includes(app.toLowerCase());
  }

  /**
   * Get social interaction statistics
   */
  getSocialStats(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentInteractions = this.capturedInteractions.filter(
      i => i.timestamp >= cutoffDate
    );

    const stats = {
      totalInteractions: recentInteractions.length,
      knownContacts: recentInteractions.filter(i => i.isKnownContact).length,
      unknownContacts: recentInteractions.filter(i => !i.isKnownContact).length,
      byType: {},
      byApp: {},
      byDay: {}
    };

    // Group by type and app
    recentInteractions.forEach(interaction => {
      stats.byType[interaction.type] = (stats.byType[interaction.type] || 0) + 1;
      stats.byApp[interaction.app] = (stats.byApp[interaction.app] || 0) + 1;
      
      const day = interaction.timestamp.toDateString();
      stats.byDay[day] = (stats.byDay[day] || 0) + 1;
    });

    return stats;
  }

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(newSettings) {
    this.privacySettings = { ...this.privacySettings, ...newSettings };
    
    if (this.socialCircleManager) {
      await this.socialCircleManager.updatePrivacySettings(this.privacySettings);
    }

    // Reinitialize if tracking was enabled/disabled
    if (newSettings.socialTrackingEnabled !== undefined) {
      if (newSettings.socialTrackingEnabled && !this.isActive) {
        await this.initialize();
      } else if (!newSettings.socialTrackingEnabled && this.isActive) {
        await this.disableSocialTracking();
      }
    }
  }

  /**
   * Add event listener
   */
  addEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  /**
   * Emit event
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in social notification intelligence event listener:', error);
        }
      });
    }
  }

  /**
   * Clear captured data (privacy compliance)
   */
  clearCapturedData() {
    this.capturedInteractions = [];
    console.log('Social interaction data cleared');
  }

  /**
   * Export social interaction data
   */
  exportData() {
    return {
      interactions: this.capturedInteractions.map(i => ({
        contactName: i.contactName,
        type: i.type,
        app: i.app,
        timestamp: i.timestamp,
        isKnownContact: i.isKnownContact
      })),
      privacySettings: this.privacySettings,
      exportDate: new Date().toISOString()
    };
  }
}

export default VitaSocialNotificationIntelligence;
