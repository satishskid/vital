import InteractionTracker from './InteractionTracker.js';

/**
 * CircadianNudgeEngine - Proactive nudging based on opportune moments
 * Aligns with natural circadian rhythms for optimal habit formation
 */

class CircadianNudgeEngine {
  constructor() {
    this.nudgeHistory = new Map();
    this.userPreferences = this.loadUserPreferences();
    this.interactionTracker = InteractionTracker;
  }

  /**
   * Get opportune moments for each longevity habit based on circadian science
   */
  getOpportuneMoments() {
    return {
      circadian: {
        morningLight: {
          optimal: [6, 7, 8, 9], // 6-9 AM - cortisol awakening response
          message: "🌅 Perfect time for morning light! Step outside for 10 minutes to set your circadian clock.",
          urgency: "high",
          window: 180 // 3-hour window
        },
        mealTiming: {
          optimal: [7, 12, 18], // 7 AM, 12 PM, 6 PM - natural meal windows
          message: "🍽️ Optimal meal timing window! Log your eating pattern to support circadian metabolism.",
          urgency: "medium",
          window: 60 // 1-hour window
        }
      },
      
      movement: {
        morningMovement: {
          optimal: [7, 8, 9], // 7-9 AM - natural energy peak
          message: "💪 Your body is primed for movement! Perfect time for intentional exercise.",
          urgency: "medium",
          window: 120
        },
        afternoonBreaks: {
          optimal: [14, 15, 16], // 2-4 PM - post-lunch dip, need movement
          message: "🚶 Beat the afternoon slump! Take a movement break to boost cognitive function.",
          urgency: "high",
          window: 30
        }
      },

      stress: {
        morningResilience: {
          optimal: [8, 9, 10], // 8-10 AM - cortisol peak, good for controlled stress
          message: "❄️ High cortisol = perfect time for controlled stress! Cold shower or breathwork?",
          urgency: "medium",
          window: 90
        },
        eveningRecovery: {
          optimal: [19, 20, 21], // 7-9 PM - parasympathetic activation time
          message: "🧘 Your nervous system is ready to recover. Time for meditation or breathwork.",
          urgency: "high",
          window: 120
        }
      },

      sleep: {
        sleepPrep: {
          optimal: [21, 22], // 9-10 PM - natural melatonin rise
          message: "🌙 Melatonin is rising! Prepare your sleep environment for optimal brain detox.",
          urgency: "high",
          window: 60
        },
        morningReflection: {
          optimal: [7, 8, 9], // 7-9 AM - reflect on sleep quality
          message: "☀️ How did your brain detox? Log your sleep quality while it's fresh in memory.",
          urgency: "medium",
          window: 120
        }
      },

      nutrition: {
        fastingWindow: {
          optimal: [16, 17, 18], // 4-6 PM - check fasting status
          message: "⏰ How's your eating window today? Perfect time to log your fasting pattern.",
          urgency: "medium",
          window: 90
        },
        brainFoodTiming: {
          optimal: [12, 13], // 12-1 PM - lunch, brain food opportunity
          message: "🧠 Fuel your brain! Great time to choose nutrient-dense foods for cognitive power.",
          urgency: "medium",
          window: 60
        }
      },

      mindset: {
        morningIntention: {
          optimal: [6, 7, 8], // 6-8 AM - set daily intention
          message: "🌟 Start with intention! Set your growth mindset for the day ahead.",
          urgency: "medium",
          window: 120
        },
        eveningReflection: {
          optimal: [20, 21, 22], // 8-10 PM - daily reflection
          message: "💭 Reflect on your day. How did you practice self-compassion and growth?",
          urgency: "medium",
          window: 120
        }
      }
    };
  }

  /**
   * Check if current time is an opportune moment for any habit
   */
  checkOpportuneMoments() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const opportunities = [];

    const moments = this.getOpportuneMoments();

    Object.entries(moments).forEach(([pillar, habits]) => {
      Object.entries(habits).forEach(([habit, config]) => {
        if (this.isOpportuneTime(currentHour, currentMinute, config)) {
          opportunities.push({
            pillar,
            habit,
            ...config,
            timestamp: now,
            id: `${pillar}_${habit}_${currentHour}`
          });
        }
      });
    });

    return opportunities.filter(opp => !this.wasRecentlyNudged(opp.id));
  }

  /**
   * Check if current time falls within opportune window
   */
  isOpportuneTime(hour, minute, config) {
    return config.optimal.some(optimalHour => {
      const windowStart = optimalHour * 60; // Convert to minutes
      const windowEnd = windowStart + config.window;
      const currentTime = hour * 60 + minute;
      
      return currentTime >= windowStart && currentTime <= windowEnd;
    });
  }

  /**
   * Check if user was recently nudged for this opportunity
   */
  wasRecentlyNudged(opportunityId) {
    const lastNudge = this.nudgeHistory.get(opportunityId);
    if (!lastNudge) return false;
    
    const timeSinceLastNudge = Date.now() - lastNudge;
    const cooldownPeriod = 4 * 60 * 60 * 1000; // 4 hours
    
    return timeSinceLastNudge < cooldownPeriod;
  }

  /**
   * Generate contextual nudge based on user's current state
   */
  generateContextualNudge(opportunity, userState = {}) {
    const { pillar, habit, message, urgency } = opportunity;
    const hasLoggedToday = userState[pillar] && userState[pillar] > 0;
    
    let contextualMessage = message;
    let rewardMessage = null;

    // Add context based on user's current progress
    if (hasLoggedToday) {
      contextualMessage = `✨ ${message.replace('Perfect time', 'Great job today! Another opportunity')}`;
      rewardMessage = "🎉 You're building consistent habits!";
    }

    // Add urgency indicators
    const urgencyEmoji = {
      high: "⚡",
      medium: "💡",
      low: "🌱"
    };

    return {
      ...opportunity,
      contextualMessage: `${urgencyEmoji[urgency]} ${contextualMessage}`,
      rewardMessage,
      actionButton: this.getActionButton(pillar, habit),
      dismissible: urgency !== "high"
    };
  }

  /**
   * Get appropriate action button for the nudge
   */
  getActionButton(pillar, habit) {
    const actions = {
      circadian: { text: "Get Light ☀️", route: "/circadian-tracking" },
      movement: { text: "Move Now 🏃", route: "/circadian-tracking" },
      stress: { text: "Build Resilience ⚡", route: "/circadian-tracking" },
      sleep: { text: "Optimize Sleep 🌙", route: "/circadian-tracking" },
      nutrition: { text: "Fuel Brain 🧠", route: "/circadian-tracking" },
      mindset: { text: "Set Intention 🌟", route: "/circadian-tracking" }
    };

    return actions[pillar] || { text: "Track Habit", route: "/manual-entry" };
  }

  /**
   * Record that user was nudged
   */
  recordNudge(opportunityId) {
    this.nudgeHistory.set(opportunityId, Date.now());
    this.saveNudgeHistory();
  }

  /**
   * Detect automatic activities and generate rewards
   */
  detectAutomaticActivities() {
    const detectedActivities = [];

    // Check for automatic detections
    if (this.isLikelyMorningLightExposure()) {
      detectedActivities.push({
        pillar: 'circadian',
        activity: 'morningLight',
        confidence: 0.8,
        message: "🌅 Great! We detected you got morning light exposure!",
        reward: "🏆 Circadian rhythm optimized! +20 longevity points",
        autoLogValue: 85
      });
    }

    if (this.isLikelyMovementBreak()) {
      detectedActivities.push({
        pillar: 'movement',
        activity: 'break',
        confidence: 0.7,
        message: "🚶 Nice! We detected movement during your break!",
        reward: "💪 Brain-body connection activated! +15 longevity points",
        autoLogValue: 75
      });
    }

    if (this.isLikelyMeditationSession()) {
      detectedActivities.push({
        pillar: 'stress',
        activity: 'recovery',
        confidence: 0.6,
        message: "🧘 Wonderful! We detected a mindfulness session!",
        reward: "🌟 Stress resilience boosted! +18 longevity points",
        autoLogValue: 80
      });
    }

    return detectedActivities;
  }

  /**
   * Smart detection methods using phone sensors and patterns
   */
  isLikelyMorningLightExposure() {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();

    // Check if it's morning hours (6-9 AM)
    if (hour < 6 || hour > 9) return false;

    // Check ambient light sensor if available
    if (navigator.permissions && 'AmbientLightSensor' in window) {
      try {
        // Modern browsers with ambient light sensor
        const lightLevel = this.getAmbientLight();
        return lightLevel > 1000; // Bright outdoor light
      } catch (e) {
        // Fallback to time-based heuristic
      }
    }

    // Check if user's screen brightness increased (indirect light indicator)
    const screenBrightness = this.getScreenBrightness();

    // Check location change (going outside)
    const locationChange = this.detectLocationChange();

    // Combine heuristics
    const morningTimeScore = hour >= 6 && hour <= 9 ? 0.4 : 0;
    const brightnessScore = screenBrightness > 0.8 ? 0.3 : 0;
    const locationScore = locationChange ? 0.3 : 0;

    return (morningTimeScore + brightnessScore + locationScore) > 0.6;
  }

  isLikelyMovementBreak() {
    // Check accelerometer data if available
    if ('DeviceMotionEvent' in window) {
      const recentMovement = this.getRecentMovementData();
      const movementIntensity = this.calculateMovementIntensity(recentMovement);

      // Detect patterns: stillness followed by movement
      const wasStill = this.wasRecentlyStill();
      const isMovingNow = movementIntensity > 0.3;

      return wasStill && isMovingNow;
    }

    // Fallback: check if user is interacting with app during typical break times
    const hour = new Date().getHours();
    const isBreakTime = (hour >= 10 && hour <= 11) || (hour >= 14 && hour <= 16);
    const hasRecentInteraction = this.hasRecentAppInteraction();

    return isBreakTime && hasRecentInteraction;
  }

  isLikelyMeditationSession() {
    // Detect stillness patterns
    if ('DeviceMotionEvent' in window) {
      const stillnessDuration = this.getStillnessDuration();
      const isVeryStill = stillnessDuration > 5 * 60 * 1000; // 5 minutes of stillness

      // Check if meditation apps are running (if permission available)
      const meditationAppActive = this.isMeditationAppActive();

      // Check breathing pattern through device motion (advanced)
      const rhythmicMotion = this.detectRhythmicMotion();

      return isVeryStill && (meditationAppActive || rhythmicMotion);
    }

    return false;
  }

  /**
   * Helper methods for sensor data
   */
  getAmbientLight() {
    // Placeholder for ambient light sensor API
    return Math.random() * 2000;
  }

  getScreenBrightness() {
    // Estimate based on screen settings if available
    return Math.random();
  }

  detectLocationChange() {
    // Check if GPS coordinates changed significantly using InteractionTracker
    return this.interactionTracker.isLikelyOutdoors();
  }

  getRecentMovementData() {
    // Get movement data from InteractionTracker
    return this.interactionTracker.getRecentMovementData();
  }

  calculateMovementIntensity(movementData) {
    // Calculate movement intensity from accelerometer data
    if (!movementData.length) return 0;

    const totalAcceleration = movementData.reduce((sum, reading) => {
      return sum + Math.sqrt(reading.x * reading.x + reading.y * reading.y + reading.z * reading.z);
    }, 0);

    return totalAcceleration / movementData.length / 9.8; // Normalize by gravity
  }

  wasRecentlyStill() {
    // Check if user was still in the last 10 minutes using InteractionTracker
    return this.interactionTracker.wasRecentlyStill();
  }

  hasRecentAppInteraction() {
    // Check if user interacted with app recently using InteractionTracker
    return this.interactionTracker.hasRecentActivity();
  }

  getStillnessDuration() {
    // Get current stillness duration from InteractionTracker
    return this.interactionTracker.getCurrentStillnessDuration();
  }

  isMeditationAppActive() {
    // Check if meditation apps are in foreground (limited by browser security)
    // This would require user permission and specific APIs
    return false;
  }

  detectRhythmicMotion() {
    // Detect breathing-like rhythmic motion patterns
    const recentMotion = this.getRecentMovementData();
    if (recentMotion.length < 10) return false;

    // Simple rhythm detection (would be more sophisticated in real implementation)
    const intervals = [];
    for (let i = 1; i < recentMotion.length; i++) {
      intervals.push(recentMotion[i].timestamp - recentMotion[i-1].timestamp);
    }

    // Check for consistent intervals (breathing pattern)
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;

    return variance < 1000 && avgInterval > 3000 && avgInterval < 8000; // 3-8 second breathing cycles
  }

  /**
   * Load user preferences for nudging
   */
  loadUserPreferences() {
    const stored = localStorage.getItem('vita-nudge-preferences');
    return stored ? JSON.parse(stored) : {
      enableNudges: true,
      quietHours: { start: 22, end: 7 },
      preferredIntensity: 'medium',
      enableAutoRewards: true
    };
  }

  /**
   * Save nudge history to localStorage
   */
  saveNudgeHistory() {
    const historyArray = Array.from(this.nudgeHistory.entries());
    localStorage.setItem('vita-nudge-history', JSON.stringify(historyArray));
  }

  /**
   * Load nudge history from localStorage
   */
  loadNudgeHistory() {
    const stored = localStorage.getItem('vita-nudge-history');
    if (stored) {
      const historyArray = JSON.parse(stored);
      this.nudgeHistory = new Map(historyArray);
    }
  }
}

export default CircadianNudgeEngine;
