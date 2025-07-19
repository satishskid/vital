/**
 * InteractionTracker - Tracks user interactions for smart nudging
 * Helps determine opportune moments based on user behavior patterns
 */

class InteractionTracker {
  constructor() {
    this.interactions = [];
    this.sessionStart = Date.now();
    this.isTracking = false;
    this.movementBuffer = [];
    this.stillnessStartTime = null;
    this.lastMovementTime = null;
    
    this.initializeTracking();
  }

  /**
   * Initialize all tracking mechanisms
   */
  initializeTracking() {
    this.trackAppInteractions();
    this.trackDeviceMotion();
    this.trackScreenEvents();
    this.trackLocationChanges();
    this.isTracking = true;
  }

  /**
   * Track user interactions with the app
   */
  trackAppInteractions() {
    // Track clicks, taps, scrolls
    ['click', 'touchstart', 'scroll', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        this.recordInteraction({
          type: 'app_interaction',
          eventType,
          timestamp: Date.now(),
          target: event.target.tagName,
          className: event.target.className
        });
      }, { passive: true });
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.recordInteraction({
        type: 'visibility_change',
        visible: !document.hidden,
        timestamp: Date.now()
      });
    });

    // Track focus/blur events
    window.addEventListener('focus', () => {
      this.recordInteraction({
        type: 'app_focus',
        timestamp: Date.now()
      });
    });

    window.addEventListener('blur', () => {
      this.recordInteraction({
        type: 'app_blur',
        timestamp: Date.now()
      });
    });
  }

  /**
   * Track device motion for activity detection
   */
  trackDeviceMotion() {
    if ('DeviceMotionEvent' in window) {
      // Request permission for iOS 13+
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              this.startMotionTracking();
            }
          })
          .catch(console.error);
      } else {
        this.startMotionTracking();
      }
    }
  }

  startMotionTracking() {
    window.addEventListener('devicemotion', (event) => {
      const acceleration = event.accelerationIncludingGravity;
      if (acceleration) {
        const motionData = {
          x: acceleration.x || 0,
          y: acceleration.y || 0,
          z: acceleration.z || 0,
          timestamp: Date.now()
        };

        this.addToMovementBuffer(motionData);
        this.detectStillness(motionData);
      }
    }, { passive: true });
  }

  /**
   * Add motion data to buffer (keep last 30 seconds)
   */
  addToMovementBuffer(motionData) {
    this.movementBuffer.push(motionData);
    
    // Keep only last 30 seconds of data
    const thirtySecondsAgo = Date.now() - 30 * 1000;
    this.movementBuffer = this.movementBuffer.filter(
      data => data.timestamp > thirtySecondsAgo
    );
  }

  /**
   * Detect periods of stillness for meditation detection
   */
  detectStillness(motionData) {
    const movementThreshold = 0.5;
    const totalAcceleration = Math.sqrt(
      motionData.x * motionData.x + 
      motionData.y * motionData.y + 
      motionData.z * motionData.z
    );

    if (totalAcceleration < movementThreshold) {
      // User is still
      if (!this.stillnessStartTime) {
        this.stillnessStartTime = Date.now();
      }
    } else {
      // User is moving
      if (this.stillnessStartTime) {
        const stillnessDuration = Date.now() - this.stillnessStartTime;
        
        this.recordInteraction({
          type: 'stillness_period',
          duration: stillnessDuration,
          timestamp: Date.now()
        });
        
        this.stillnessStartTime = null;
      }
      this.lastMovementTime = Date.now();
    }
  }

  /**
   * Track screen-related events
   */
  trackScreenEvents() {
    // Track screen orientation changes (might indicate outdoor activity)
    window.addEventListener('orientationchange', () => {
      this.recordInteraction({
        type: 'orientation_change',
        orientation: screen.orientation?.angle || window.orientation,
        timestamp: Date.now()
      });
    });

    // Track screen brightness changes (if available)
    if ('screen' in window && 'brightness' in window.screen) {
      // Monitor brightness changes
      setInterval(() => {
        this.recordInteraction({
          type: 'brightness_check',
          brightness: window.screen.brightness,
          timestamp: Date.now()
        });
      }, 60000); // Check every minute
    }
  }

  /**
   * Track location changes for outdoor activity detection
   */
  trackLocationChanges() {
    if ('geolocation' in navigator) {
      let lastPosition = null;
      
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };

          if (lastPosition) {
            const distance = this.calculateDistance(lastPosition, currentPosition);
            
            if (distance > 50) { // Moved more than 50 meters
              this.recordInteraction({
                type: 'location_change',
                distance,
                accuracy: position.coords.accuracy,
                timestamp: Date.now()
              });
            }
          }

          lastPosition = currentPosition;
        },
        (error) => {
          console.log('Geolocation error:', error);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000
        }
      );

      // Store watch ID for cleanup
      this.geolocationWatchId = watchId;
    }
  }

  /**
   * Calculate distance between two GPS coordinates
   */
  calculateDistance(pos1, pos2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = pos1.lat * Math.PI/180;
    const φ2 = pos2.lat * Math.PI/180;
    const Δφ = (pos2.lat-pos1.lat) * Math.PI/180;
    const Δλ = (pos2.lng-pos1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  /**
   * Record an interaction
   */
  recordInteraction(interaction) {
    this.interactions.push(interaction);
    
    // Keep only last 1000 interactions
    if (this.interactions.length > 1000) {
      this.interactions = this.interactions.slice(-1000);
    }

    // Update last interaction timestamp
    localStorage.setItem('vita-last-interaction', interaction.timestamp.toString());
  }

  /**
   * Get recent interactions of a specific type
   */
  getRecentInteractions(type, timeWindow = 5 * 60 * 1000) {
    const cutoff = Date.now() - timeWindow;
    return this.interactions.filter(
      interaction => interaction.type === type && interaction.timestamp > cutoff
    );
  }

  /**
   * Check if user has been active recently
   */
  hasRecentActivity(timeWindow = 5 * 60 * 1000) {
    const cutoff = Date.now() - timeWindow;
    return this.interactions.some(interaction => interaction.timestamp > cutoff);
  }

  /**
   * Get current stillness duration
   */
  getCurrentStillnessDuration() {
    return this.stillnessStartTime ? Date.now() - this.stillnessStartTime : 0;
  }

  /**
   * Get recent movement data
   */
  getRecentMovementData() {
    return this.movementBuffer;
  }

  /**
   * Check if user was recently still
   */
  wasRecentlyStill(timeWindow = 10 * 60 * 1000) {
    const stillnessPeriods = this.getRecentInteractions('stillness_period', timeWindow);
    return stillnessPeriods.some(period => period.duration > 5 * 60 * 1000); // 5+ minutes of stillness
  }

  /**
   * Detect if user is likely outdoors based on location and brightness
   */
  isLikelyOutdoors() {
    const recentLocationChanges = this.getRecentInteractions('location_change', 10 * 60 * 1000);
    const recentBrightnessChecks = this.getRecentInteractions('brightness_check', 5 * 60 * 1000);
    
    const hasLocationMovement = recentLocationChanges.length > 0;
    const hasBrightScreen = recentBrightnessChecks.some(check => check.brightness > 0.8);
    
    return hasLocationMovement || hasBrightScreen;
  }

  /**
   * Clean up tracking
   */
  stopTracking() {
    this.isTracking = false;
    
    if (this.geolocationWatchId) {
      navigator.geolocation.clearWatch(this.geolocationWatchId);
    }
  }

  /**
   * Get interaction summary for debugging
   */
  getInteractionSummary() {
    const now = Date.now();
    const lastHour = now - 60 * 60 * 1000;
    
    const recentInteractions = this.interactions.filter(i => i.timestamp > lastHour);
    const interactionTypes = {};
    
    recentInteractions.forEach(interaction => {
      interactionTypes[interaction.type] = (interactionTypes[interaction.type] || 0) + 1;
    });
    
    return {
      totalInteractions: recentInteractions.length,
      interactionTypes,
      currentStillness: this.getCurrentStillnessDuration(),
      movementBufferSize: this.movementBuffer.length,
      isLikelyOutdoors: this.isLikelyOutdoors()
    };
  }
}

// Create singleton instance
const interactionTracker = new InteractionTracker();

export default interactionTracker;
