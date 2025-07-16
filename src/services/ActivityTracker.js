/**
 * VitaActivityTracker - Phone accelerometer-based activity tracking
 * Detects steps, activity levels, and sleep movement patterns
 */

class VitaActivityTracker {
  constructor() {
    // Step counting
    this.stepCount = 0;
    this.dailySteps = 0;
    this.lastStepTime = 0;
    
    // Activity detection
    this.activityLevel = 'sedentary'; // sedentary, light, moderate, vigorous
    this.activityHistory = [];
    this.currentActivityStart = Date.now();
    
    // Sleep tracking
    this.sleepMovement = [];
    this.isSleepMode = false;
    this.sleepStartTime = null;
    
    // Accelerometer data processing
    this.lastAcceleration = { x: 0, y: 0, z: 0 };
    this.accelerationBuffer = [];
    this.bufferSize = 50; // Keep last 50 readings for analysis
    
    // Thresholds and calibration
    this.stepThreshold = 1.2; // Acceleration magnitude threshold for steps
    this.activityThresholds = {
      sedentary: 0.5,
      light: 1.0,
      moderate: 2.0,
      vigorous: 3.0
    };
    
    // Event listeners
    this.listeners = {
      step: [],
      activity: [],
      sleep: []
    };
    
    // Tracking state
    this.isTracking = false;
    this.permissionGranted = false;
    
    // Daily reset
    this.lastResetDate = new Date().toDateString();
    
    this.initializeFromStorage();
  }

  /**
   * Initialize tracker with stored data
   */
  initializeFromStorage() {
    try {
      const stored = localStorage.getItem('vita-activity-data');
      if (stored) {
        const data = JSON.parse(stored);
        const today = new Date().toDateString();
        
        // Reset daily counters if it's a new day
        if (data.date === today) {
          this.dailySteps = data.dailySteps || 0;
          this.stepCount = data.stepCount || 0;
        } else {
          // New day - reset counters
          this.dailySteps = 0;
          this.stepCount = 0;
          this.saveToStorage();
        }
      }
    } catch (error) {
      console.error('Error loading activity data:', error);
    }
  }

  /**
   * Save current state to localStorage
   */
  saveToStorage() {
    try {
      const data = {
        date: new Date().toDateString(),
        dailySteps: this.dailySteps,
        stepCount: this.stepCount,
        activityLevel: this.activityLevel,
        lastUpdate: Date.now()
      };
      localStorage.setItem('vita-activity-data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving activity data:', error);
    }
  }

  /**
   * Request device motion permissions and start tracking
   */
  async startTracking() {
    try {
      // Check if DeviceMotionEvent is available
      if (!window.DeviceMotionEvent) {
        throw new Error('Device motion not supported');
      }

      // Request permission for iOS 13+
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Motion permission denied');
        }
      }

      this.permissionGranted = true;
      this.isTracking = true;

      // Start listening to device motion
      window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this));
      
      // Start periodic analysis
      this.analysisInterval = setInterval(() => {
        this.analyzeActivity();
      }, 5000); // Analyze every 5 seconds

      console.log('Activity tracking started');
      return true;

    } catch (error) {
      console.error('Failed to start activity tracking:', error);
      this.permissionGranted = false;
      this.isTracking = false;
      return false;
    }
  }

  /**
   * Stop activity tracking
   */
  stopTracking() {
    this.isTracking = false;
    window.removeEventListener('devicemotion', this.handleDeviceMotion.bind(this));
    
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
    
    this.saveToStorage();
    console.log('Activity tracking stopped');
  }

  /**
   * Handle device motion events
   */
  handleDeviceMotion(event) {
    if (!this.isTracking) return;

    const acceleration = event.acceleration || event.accelerationIncludingGravity;
    if (!acceleration) return;

    // Store current acceleration
    const currentAccel = {
      x: acceleration.x || 0,
      y: acceleration.y || 0,
      z: acceleration.z || 0,
      timestamp: Date.now()
    };

    // Add to buffer
    this.accelerationBuffer.push(currentAccel);
    if (this.accelerationBuffer.length > this.bufferSize) {
      this.accelerationBuffer.shift();
    }

    // Detect steps
    this.detectStep(currentAccel);

    // Update last acceleration
    this.lastAcceleration = currentAccel;
  }

  /**
   * Detect steps from acceleration data
   */
  detectStep(acceleration) {
    // Calculate acceleration magnitude
    const magnitude = Math.sqrt(
      acceleration.x * acceleration.x +
      acceleration.y * acceleration.y +
      acceleration.z * acceleration.z
    );

    // Simple step detection algorithm
    const now = Date.now();
    const timeSinceLastStep = now - this.lastStepTime;

    // Prevent double counting (minimum 300ms between steps)
    if (timeSinceLastStep < 300) return;

    // Check if magnitude exceeds threshold
    if (magnitude > this.stepThreshold) {
      // Additional validation: check for pattern in recent data
      if (this.validateStepPattern()) {
        this.recordStep();
      }
    }
  }

  /**
   * Validate step pattern to reduce false positives
   */
  validateStepPattern() {
    if (this.accelerationBuffer.length < 10) return false;

    // Check for rhythmic pattern in recent accelerations
    const recent = this.accelerationBuffer.slice(-10);
    const magnitudes = recent.map(a => 
      Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
    );

    // Look for peak pattern
    const avgMagnitude = magnitudes.reduce((sum, m) => sum + m, 0) / magnitudes.length;
    const peakCount = magnitudes.filter(m => m > avgMagnitude * 1.2).length;

    return peakCount >= 2; // At least 2 peaks in recent data
  }

  /**
   * Record a detected step
   */
  recordStep() {
    this.stepCount++;
    this.dailySteps++;
    this.lastStepTime = Date.now();

    // Emit step event
    this.emit('step', {
      stepCount: this.stepCount,
      dailySteps: this.dailySteps,
      timestamp: this.lastStepTime
    });

    // Save periodically (every 10 steps)
    if (this.stepCount % 10 === 0) {
      this.saveToStorage();
    }
  }

  /**
   * Analyze activity level from recent acceleration data
   */
  analyzeActivity() {
    if (this.accelerationBuffer.length < 20) return;

    // Calculate average acceleration magnitude over recent period
    const recent = this.accelerationBuffer.slice(-20);
    const magnitudes = recent.map(a => 
      Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
    );

    const avgMagnitude = magnitudes.reduce((sum, m) => sum + m, 0) / magnitudes.length;
    const variance = magnitudes.reduce((sum, m) => sum + Math.pow(m - avgMagnitude, 2), 0) / magnitudes.length;

    // Determine activity level
    let newActivityLevel;
    if (variance < this.activityThresholds.sedentary) {
      newActivityLevel = 'sedentary';
    } else if (variance < this.activityThresholds.light) {
      newActivityLevel = 'light';
    } else if (variance < this.activityThresholds.moderate) {
      newActivityLevel = 'moderate';
    } else {
      newActivityLevel = 'vigorous';
    }

    // Update activity if changed
    if (newActivityLevel !== this.activityLevel) {
      const previousLevel = this.activityLevel;
      const duration = Date.now() - this.currentActivityStart;

      // Record activity period
      this.activityHistory.push({
        level: previousLevel,
        duration: duration,
        startTime: this.currentActivityStart,
        endTime: Date.now()
      });

      this.activityLevel = newActivityLevel;
      this.currentActivityStart = Date.now();

      // Emit activity change event
      this.emit('activity', {
        level: newActivityLevel,
        previousLevel: previousLevel,
        duration: duration,
        timestamp: Date.now()
      });
    }

    // Sleep detection (if enabled)
    if (this.isSleepMode) {
      this.analyzeSleepMovement(variance);
    }
  }

  /**
   * Analyze sleep movement patterns
   */
  analyzeSleepMovement(movementVariance) {
    const now = Date.now();
    
    this.sleepMovement.push({
      variance: movementVariance,
      timestamp: now
    });

    // Keep only last 2 hours of sleep data
    const twoHoursAgo = now - (2 * 60 * 60 * 1000);
    this.sleepMovement = this.sleepMovement.filter(m => m.timestamp > twoHoursAgo);

    // Emit sleep movement event
    this.emit('sleep', {
      movement: movementVariance,
      timestamp: now,
      sleepDuration: this.sleepStartTime ? now - this.sleepStartTime : 0
    });
  }

  /**
   * Enable sleep tracking mode
   */
  startSleepTracking() {
    this.isSleepMode = true;
    this.sleepStartTime = Date.now();
    this.sleepMovement = [];
    console.log('Sleep tracking started');
  }

  /**
   * Disable sleep tracking mode
   */
  stopSleepTracking() {
    this.isSleepMode = false;
    const sleepDuration = this.sleepStartTime ? Date.now() - this.sleepStartTime : 0;
    
    // Calculate sleep quality based on movement
    const sleepQuality = this.calculateSleepQuality();
    
    const sleepData = {
      duration: sleepDuration,
      quality: sleepQuality,
      movements: this.sleepMovement.length,
      startTime: this.sleepStartTime,
      endTime: Date.now()
    };

    this.sleepStartTime = null;
    console.log('Sleep tracking stopped', sleepData);
    
    return sleepData;
  }

  /**
   * Calculate sleep quality from movement data
   */
  calculateSleepQuality() {
    if (this.sleepMovement.length === 0) return 85; // Default good quality

    const avgMovement = this.sleepMovement.reduce((sum, m) => sum + m.variance, 0) / this.sleepMovement.length;
    
    // Lower movement = better sleep quality
    if (avgMovement < 0.1) return 95; // Excellent
    if (avgMovement < 0.3) return 85; // Good
    if (avgMovement < 0.6) return 70; // Fair
    return 55; // Poor
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
   * Emit event to listeners
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in activity tracker event listener:', error);
        }
      });
    }
  }

  /**
   * Get current activity summary
   */
  getActivitySummary() {
    return {
      steps: {
        daily: this.dailySteps,
        total: this.stepCount
      },
      activity: {
        current: this.activityLevel,
        history: this.activityHistory.slice(-10) // Last 10 activity periods
      },
      sleep: {
        isTracking: this.isSleepMode,
        duration: this.sleepStartTime ? Date.now() - this.sleepStartTime : 0,
        movements: this.sleepMovement.length
      },
      tracking: {
        isActive: this.isTracking,
        hasPermission: this.permissionGranted
      }
    };
  }

  /**
   * Reset daily counters (called at midnight)
   */
  resetDailyCounters() {
    this.dailySteps = 0;
    this.stepCount = 0;
    this.activityHistory = [];
    this.saveToStorage();
  }
}

export default VitaActivityTracker;
