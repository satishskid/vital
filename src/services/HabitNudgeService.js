/**
 * Vita Habit Nudge Service
 * Generates intelligent nudges aligned with the 6 longevity habits
 * Routes directly to habit-specific logging
 */

class HabitNudgeService {
  constructor() {
    this.nudgeHistory = [];
    this.userPreferences = {
      enableMorningNudges: true,
      enableAfternoonNudges: true,
      enableEveningNudges: true,
      quietHours: { start: 22, end: 6 },
      maxNudgesPerDay: 6
    };
    this.loadPreferences();
  }

  /**
   * Generate contextual nudges based on current time and habit status
   */
  generateNudges(healthData, vitalityState) {
    const nudges = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.toDateString();
    
    // Check if we're in quiet hours
    if (this.isQuietHour(currentHour)) {
      return [];
    }

    // Check daily nudge limit
    const todayNudges = this.nudgeHistory.filter(n => n.date === currentDay);
    if (todayNudges.length >= this.userPreferences.maxNudgesPerDay) {
      return [];
    }

    // Morning nudges (6-10 AM)
    if (currentHour >= 6 && currentHour <= 10 && this.userPreferences.enableMorningNudges) {
      // Circadian rhythm optimization
      if (!this.hasHabitBeenLogged('circadian', healthData)) {
        nudges.push({
          id: `circadian-${Date.now()}`,
          habitId: 'circadian',
          type: 'circadian',
          priority: 'high',
          title: '🌅 Morning Light Ritual',
          message: 'Get 10-20 minutes of natural light to set your circadian clock',
          action: 'Log Light Exposure',
          timing: 'morning',
          actionType: 'quick-log',
          science: 'Morning light exposure within 2 hours of waking optimizes cortisol and melatonin production',
          quickOptions: [
            { value: 90, label: '20+ min bright sunlight', icon: '🌅' },
            { value: 75, label: '15 min outdoor light', icon: '☀️' },
            { value: 60, label: '10 min window light', icon: '🌤️' },
            { value: 40, label: '5 min light exposure', icon: '💡' }
          ]
        });
      }

      // Movement activation
      if (!this.hasHabitBeenLogged('movement', healthData)) {
        nudges.push({
          id: `movement-morning-${Date.now()}`,
          habitId: 'movement',
          type: 'movement',
          priority: 'medium',
          title: '🏃 Activate Your Body',
          message: 'Start your day with intentional movement to boost cognitive function',
          action: 'Log Movement',
          timing: 'morning',
          actionType: 'quick-log',
          science: 'Morning movement increases BDNF and enhances neuroplasticity for the entire day',
          quickOptions: [
            { value: 90, label: 'Intense workout', icon: '💪' },
            { value: 75, label: 'Moderate exercise', icon: '🏃' },
            { value: 60, label: 'Light stretching', icon: '🤸' },
            { value: 40, label: 'Movement breaks', icon: '🚶' }
          ]
        });
      }
    }

    // Afternoon nudges (12-17 PM)
    if (currentHour >= 12 && currentHour <= 17 && this.userPreferences.enableAfternoonNudges) {
      // Stress resilience building
      if (!this.hasHabitBeenLogged('stress', healthData)) {
        nudges.push({
          id: `stress-${Date.now()}`,
          habitId: 'stress',
          type: 'stress',
          priority: 'medium',
          title: '❄️ Build Resilience',
          message: 'Time for controlled stress exposure to strengthen your stress response',
          action: 'Log Stress Practice',
          timing: 'afternoon',
          actionType: 'quick-log',
          science: 'Controlled stress followed by recovery builds resilience and improves stress tolerance',
          quickOptions: [
            { value: 90, label: 'Cold exposure + recovery', icon: '❄️' },
            { value: 75, label: 'Intense breathing exercise', icon: '🌬️' },
            { value: 60, label: 'Meditation session', icon: '🧘' },
            { value: 40, label: 'Stress awareness', icon: '💭' }
          ]
        });
      }

      // Nutrition reminder
      if (!this.hasHabitBeenLogged('nutrition', healthData)) {
        nudges.push({
          id: `nutrition-${Date.now()}`,
          habitId: 'nutrition',
          type: 'nutrition',
          priority: 'medium',
          title: '🧠 Brain Food Time',
          message: 'Choose nutrient-dense foods to fuel your brain',
          action: 'Log Nutrition',
          timing: 'afternoon',
          actionType: 'quick-log',
          science: 'Brain-supporting nutrients enhance cognitive function and protect against neurodegeneration',
          quickOptions: [
            { value: 90, label: 'Brain foods + fasting', icon: '🧠' },
            { value: 75, label: 'Nutrient-dense meal', icon: '🥗' },
            { value: 60, label: 'Balanced nutrition', icon: '🍎' },
            { value: 40, label: 'Some healthy choices', icon: '🥕' }
          ]
        });
      }
    }

    // Evening nudges (18-21 PM)
    if (currentHour >= 18 && currentHour <= 21 && this.userPreferences.enableEveningNudges) {
      // Sleep preparation
      if (!this.hasHabitBeenLogged('sleep', healthData)) {
        nudges.push({
          id: `sleep-${Date.now()}`,
          habitId: 'sleep',
          type: 'sleep',
          priority: 'high',
          title: '🌙 Brain Detox Prep',
          message: 'Start your evening routine for optimal brain detoxification',
          action: 'Log Sleep Prep',
          timing: 'evening',
          actionType: 'quick-log',
          science: 'Quality sleep activates the glymphatic system, clearing brain toxins and consolidating memories',
          quickOptions: [
            { value: 90, label: 'Full wind-down routine', icon: '🌙' },
            { value: 75, label: 'Screen-free evening', icon: '📱' },
            { value: 60, label: 'Relaxation practice', icon: '😌' },
            { value: 40, label: 'Sleep awareness', icon: '💤' }
          ]
        });
      }

      // Positive mindset reflection
      if (!this.hasHabitBeenLogged('mindset', healthData)) {
        nudges.push({
          id: `mindset-${Date.now()}`,
          habitId: 'mindset',
          type: 'mindset',
          priority: 'low',
          title: '🌟 Reflect & Grow',
          message: 'Take a moment for gratitude and positive self-reflection',
          action: 'Log Mindset',
          timing: 'evening',
          actionType: 'quick-log',
          science: 'Positive self-narrative and gratitude practices rewire the brain for resilience and growth',
          quickOptions: [
            { value: 90, label: 'Gratitude + growth mindset', icon: '🌟' },
            { value: 75, label: 'Positive self-talk', icon: '💭' },
            { value: 60, label: 'Mindful reflection', icon: '🎯' },
            { value: 40, label: 'Brief awareness', icon: '💡' }
          ]
        });
      }
    }

    // Prioritize and limit nudges
    const prioritizedNudges = this.prioritizeNudges(nudges, vitalityState);
    const limitedNudges = prioritizedNudges.slice(0, 2); // Max 2 nudges at once

    // Record nudges
    limitedNudges.forEach(nudge => {
      this.recordNudge(nudge);
    });

    return limitedNudges;
  }

  /**
   * Check if a habit has been logged today
   */
  hasHabitBeenLogged(habitId, healthData) {
    if (!healthData || !healthData[habitId]) return false;
    
    const habitData = healthData[habitId];
    if (Array.isArray(habitData)) {
      // Check if any entry is from today
      const today = new Date().toDateString();
      return habitData.some(entry => 
        new Date(entry.timestamp).toDateString() === today
      );
    }
    
    // Single entry - check if from today
    if (habitData.timestamp) {
      const today = new Date().toDateString();
      return new Date(habitData.timestamp).toDateString() === today;
    }
    
    return false;
  }

  /**
   * Check if current time is in quiet hours
   */
  isQuietHour(hour) {
    const { start, end } = this.userPreferences.quietHours;
    if (start > end) {
      // Quiet hours span midnight (e.g., 22-6)
      return hour >= start || hour <= end;
    }
    return hour >= start && hour <= end;
  }

  /**
   * Prioritize nudges based on vitality state and habit importance
   */
  prioritizeNudges(nudges, vitalityState) {
    return nudges.sort((a, b) => {
      // Priority order: high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // If same priority, prioritize based on vitality state gaps
      const aGap = this.getHabitGap(a.habitId, vitalityState);
      const bGap = this.getHabitGap(b.habitId, vitalityState);
      
      return bGap - aGap;
    });
  }

  /**
   * Get habit gap (how much improvement is needed)
   */
  getHabitGap(habitId, vitalityState) {
    if (!vitalityState || !vitalityState.habits) return 100;
    const habitScore = vitalityState.habits[habitId] || 0;
    return 100 - habitScore;
  }

  /**
   * Record nudge in history
   */
  recordNudge(nudge) {
    this.nudgeHistory.push({
      ...nudge,
      date: new Date().toDateString(),
      timestamp: Date.now()
    });
    
    // Keep only last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    this.nudgeHistory = this.nudgeHistory.filter(n => n.timestamp > thirtyDaysAgo);
    
    this.saveNudgeHistory();
  }

  /**
   * Load user preferences
   */
  loadPreferences() {
    try {
      const stored = localStorage.getItem('vita-nudge-preferences');
      if (stored) {
        this.userPreferences = { ...this.userPreferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading nudge preferences:', error);
    }
  }

  /**
   * Save user preferences
   */
  savePreferences() {
    try {
      localStorage.setItem('vita-nudge-preferences', JSON.stringify(this.userPreferences));
    } catch (error) {
      console.error('Error saving nudge preferences:', error);
    }
  }

  /**
   * Load nudge history
   */
  loadNudgeHistory() {
    try {
      const stored = localStorage.getItem('vita-nudge-history');
      if (stored) {
        this.nudgeHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading nudge history:', error);
    }
  }

  /**
   * Save nudge history
   */
  saveNudgeHistory() {
    try {
      localStorage.setItem('vita-nudge-history', JSON.stringify(this.nudgeHistory));
    } catch (error) {
      console.error('Error saving nudge history:', error);
    }
  }

  /**
   * Update user preferences
   */
  updatePreferences(newPreferences) {
    this.userPreferences = { ...this.userPreferences, ...newPreferences };
    this.savePreferences();
  }

  /**
   * Get nudge statistics
   */
  getStats() {
    const today = new Date().toDateString();
    const todayNudges = this.nudgeHistory.filter(n => n.date === today);
    
    return {
      totalNudges: this.nudgeHistory.length,
      todayNudges: todayNudges.length,
      maxDaily: this.userPreferences.maxNudgesPerDay,
      byHabit: this.getNudgesByHabit(),
      preferences: this.userPreferences
    };
  }

  /**
   * Get nudges grouped by habit
   */
  getNudgesByHabit() {
    const byHabit = {};
    this.nudgeHistory.forEach(nudge => {
      if (!byHabit[nudge.habitId]) {
        byHabit[nudge.habitId] = 0;
      }
      byHabit[nudge.habitId]++;
    });
    return byHabit;
  }
}

export default HabitNudgeService;
