/**
 * Vita Notification Intelligence System
 * Captures and processes health data from app notifications
 */

class VitaNotificationIntelligence {
  constructor() {
    this.isActive = false;
    this.serviceWorker = null;
    this.capturedData = [];
    this.listeners = {
      dataCapture: [],
      error: []
    };
    
    // Statistics
    this.stats = {
      totalCaptured: 0,
      bySource: {},
      byType: {}
    };
    
    // Settings
    this.settings = {
      enableSteps: true,
      enableSleep: true,
      enableHeartRate: true,
      enableActivity: true,
      enableCalories: true,
      autoSync: true
    };
    
    this.loadSettings();
  }

  /**
   * Initialize the notification intelligence system
   */
  async initialize() {
    try {
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Workers not supported');
      }

      // Register the notification capture service worker
      const registration = await navigator.serviceWorker.register(
        '/notification-capture-sw.js',
        { scope: '/' }
      );

      console.log('Notification Intelligence SW registered:', registration);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
      this.serviceWorker = registration;

      // Set up message listener
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));

      // Request notification permission
      await this.requestNotificationPermission();

      this.isActive = true;
      console.log('Vita Notification Intelligence initialized');
      
      return true;

    } catch (error) {
      console.error('Failed to initialize Notification Intelligence:', error);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      throw new Error('Notification permission denied');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    return true;
  }

  /**
   * Start capturing health data from notifications
   */
  async startCapture() {
    if (!this.isActive) {
      throw new Error('Notification Intelligence not initialized');
    }

    try {
      // Tell service worker we're active
      this.sendToServiceWorker('VITA_APP_ACTIVE', { active: true });
      
      // Register notification listener
      this.sendToServiceWorker('REGISTER_NOTIFICATION_LISTENER', {});
      
      console.log('Notification capture started');
      return true;

    } catch (error) {
      console.error('Failed to start notification capture:', error);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Stop capturing health data
   */
  stopCapture() {
    if (this.serviceWorker) {
      this.sendToServiceWorker('VITA_APP_ACTIVE', { active: false });
    }
    console.log('Notification capture stopped');
  }

  /**
   * Handle messages from service worker
   */
  handleServiceWorkerMessage(event) {
    const { type, data } = event.data;

    switch (type) {
      case 'HEALTH_DATA_CAPTURED':
        this.processHealthData(data);
        break;
        
      case 'CAPTURED_DATA':
        this.capturedData = data;
        break;
        
      default:
        console.log('Unknown message from SW:', type, data);
    }
  }

  /**
   * Process captured health data
   */
  processHealthData(healthData) {
    // Validate and clean the data
    const cleanedData = this.validateHealthData(healthData);
    if (!cleanedData) return;

    // Add to captured data
    this.capturedData.push(cleanedData);

    // Update statistics
    this.updateStats(cleanedData);

    // Emit data capture event
    this.emit('dataCapture', cleanedData);

    // Auto-sync if enabled
    if (this.settings.autoSync) {
      this.syncToVitaDatabase(cleanedData);
    }

    console.log('Health data processed:', cleanedData);
  }

  /**
   * Validate and clean health data
   */
  validateHealthData(data) {
    if (!data || !data.data) return null;

    const cleaned = {
      source: data.source || 'unknown',
      timestamp: data.timestamp || Date.now(),
      data: {}
    };

    // Validate steps
    if (data.data.steps && this.settings.enableSteps) {
      const steps = parseInt(data.data.steps);
      if (steps > 0 && steps < 100000) { // Reasonable range
        cleaned.data.steps = steps;
      }
    }

    // Validate sleep
    if (data.data.sleep && this.settings.enableSleep) {
      const sleep = data.data.sleep;
      if (sleep.duration > 0 && sleep.duration < 1440) { // 0-24 hours
        cleaned.data.sleep = sleep;
      }
    }

    // Validate heart rate
    if (data.data.heartRate && this.settings.enableHeartRate) {
      const hr = parseInt(data.data.heartRate);
      if (hr > 30 && hr < 220) { // Reasonable HR range
        cleaned.data.heartRate = hr;
      }
    }

    // Validate activity
    if (data.data.activity && this.settings.enableActivity) {
      const activity = parseInt(data.data.activity);
      if (activity > 0 && activity < 1440) { // 0-24 hours
        cleaned.data.activity = activity;
      }
    }

    // Validate calories
    if (data.data.calories && this.settings.enableCalories) {
      const calories = parseInt(data.data.calories);
      if (calories > 0 && calories < 10000) { // Reasonable range
        cleaned.data.calories = calories;
      }
    }

    return Object.keys(cleaned.data).length > 0 ? cleaned : null;
  }

  /**
   * Update statistics
   */
  updateStats(data) {
    this.stats.totalCaptured++;
    
    // By source
    if (!this.stats.bySource[data.source]) {
      this.stats.bySource[data.source] = 0;
    }
    this.stats.bySource[data.source]++;
    
    // By type
    Object.keys(data.data).forEach(type => {
      if (!this.stats.byType[type]) {
        this.stats.byType[type] = 0;
      }
      this.stats.byType[type]++;
    });
  }

  /**
   * Sync captured data to Vita database
   */
  async syncToVitaDatabase(data) {
    try {
      // This would integrate with your existing Firebase/database system
      // For now, we'll store in localStorage and emit event for main app
      
      const vitaData = this.convertToVitaFormat(data);
      
      // Store locally
      const stored = JSON.parse(localStorage.getItem('vita-notification-data') || '[]');
      stored.push(vitaData);
      
      // Keep only last 1000 entries
      if (stored.length > 1000) {
        stored.splice(0, stored.length - 1000);
      }
      
      localStorage.setItem('vita-notification-data', JSON.stringify(stored));
      
      // Emit sync event for main app to handle
      this.emit('dataSync', vitaData);
      
    } catch (error) {
      console.error('Error syncing to Vita database:', error);
    }
  }

  /**
   * Convert notification data to Vita format
   */
  convertToVitaFormat(data) {
    const vitaData = {
      timestamp: new Date(data.timestamp),
      source: `notification_${data.source}`,
      data: {}
    };

    // Convert steps
    if (data.data.steps) {
      vitaData.data.steps = {
        value: data.data.steps,
        unit: 'steps',
        confidence: 0.8 // Notification data is generally reliable
      };
    }

    // Convert sleep
    if (data.data.sleep) {
      vitaData.data.sleep = {
        duration: data.data.sleep.duration,
        hours: data.data.sleep.hours,
        minutes: data.data.sleep.minutes,
        unit: 'minutes',
        confidence: 0.9
      };
    }

    // Convert heart rate
    if (data.data.heartRate) {
      vitaData.data.heartRate = {
        value: data.data.heartRate,
        unit: 'bpm',
        confidence: 0.7
      };
    }

    // Convert activity
    if (data.data.activity) {
      vitaData.data.activity = {
        duration: data.data.activity,
        unit: 'minutes',
        confidence: 0.8
      };
    }

    // Convert calories
    if (data.data.calories) {
      vitaData.data.calories = {
        value: data.data.calories,
        unit: 'cal',
        confidence: 0.7
      };
    }

    return vitaData;
  }

  /**
   * Get captured data from service worker
   */
  async getCapturedData() {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        if (event.data.type === 'CAPTURED_DATA') {
          resolve(event.data.data);
        }
      };
      
      this.sendToServiceWorker('GET_CAPTURED_DATA', {}, [channel.port2]);
    });
  }

  /**
   * Clear captured data
   */
  clearCapturedData() {
    this.capturedData = [];
    this.sendToServiceWorker('CLEAR_CAPTURED_DATA', {});
  }

  /**
   * Send message to service worker
   */
  sendToServiceWorker(type, data, transfer = []) {
    if (this.serviceWorker && this.serviceWorker.active) {
      this.serviceWorker.active.postMessage({ type, data }, transfer);
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      ...this.stats,
      isActive: this.isActive,
      capturedCount: this.capturedData.length
    };
  }

  /**
   * Update settings
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    try {
      const stored = localStorage.getItem('vita-notification-settings');
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem('vita-notification-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
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
   * Remove event listener
   */
  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
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
          console.error('Error in notification intelligence event listener:', error);
        }
      });
    }
  }

  /**
   * Test notification parsing (for development)
   */
  testNotificationParsing(title, body) {
    const testNotification = { title, body };
    // This would call the same parsing logic as the service worker
    console.log('Test notification parsing:', testNotification);
    
    // Simulate the parsing
    const text = `${title} ${body}`.toLowerCase();
    const result = {
      steps: this.extractStepsFromText(text),
      sleep: this.extractSleepFromText(text),
      heartRate: this.extractHeartRateFromText(text)
    };
    
    return result;
  }

  // Helper methods for testing (simplified versions of SW functions)
  extractStepsFromText(text) {
    const patterns = [/(\d+,?\d*)\s*steps?/i, /walked\s*(\d+,?\d*)/i];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return parseInt(match[1].replace(/,/g, ''));
    }
    return null;
  }

  extractSleepFromText(text) {
    const patterns = [/slept\s*(\d+)h?\s*(\d+)?m?/i, /(\d+)h\s*(\d+)m?\s*sleep/i];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        return { hours, minutes, duration: hours * 60 + minutes };
      }
    }
    return null;
  }

  extractHeartRateFromText(text) {
    const patterns = [/(\d+)\s*bpm/i, /heart\s*rate:\s*(\d+)/i];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return parseInt(match[1]);
    }
    return null;
  }
}

export default VitaNotificationIntelligence;
