/**
 * Vita Health Data Service
 * Centralized service for managing all health data from Firebase and notification intelligence
 */

import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  getDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/supabase';

class HealthDataService {
  constructor(userId) {
    this.userId = userId;
    this.cache = {
      recentEntries: null,
      todayStats: null,
      weeklyData: null,
      lastUpdated: null
    };
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get today's health statistics from Firebase
   */
  async getTodayStats() {
    try {
      if (this.isCacheValid('todayStats')) {
        return this.cache.todayStats;
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Query today's health entries
      const q = query(
        collection(db, 'health_entries'),
        where('user_id', '==', this.userId),
        where('entry_date', '==', today),
        orderBy('created_at', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const todayEntries = [];
      querySnapshot.forEach((doc) => {
        todayEntries.push({ id: doc.id, ...doc.data() });
      });

      // Process entries into stats
      const stats = this.processEntriesToStats(todayEntries);
      
      // Cache the results
      this.cache.todayStats = stats;
      this.cache.lastUpdated = Date.now();

      return stats;
    } catch (error) {
      console.error('Error fetching today stats:', error);
      return this.getDefaultStats();
    }
  }

  /**
   * Get recent health entries for trends and analysis
   */
  async getRecentEntries(days = 7) {
    try {
      if (this.isCacheValid('recentEntries')) {
        return this.cache.recentEntries;
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const q = query(
        collection(db, 'health_entries'),
        where('user_id', '==', this.userId),
        where('entry_date', '>=', startDateStr),
        orderBy('entry_date', 'desc'),
        orderBy('created_at', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });

      this.cache.recentEntries = entries;
      this.cache.lastUpdated = Date.now();

      return entries;
    } catch (error) {
      console.error('Error fetching recent entries:', error);
      return [];
    }
  }

  /**
   * Get weekly aggregated data for progress tracking
   */
  async getWeeklyData() {
    try {
      if (this.isCacheValid('weeklyData')) {
        return this.cache.weeklyData;
      }

      const recentEntries = await this.getRecentEntries(7);
      const weeklyData = this.aggregateWeeklyData(recentEntries);
      
      this.cache.weeklyData = weeklyData;
      return weeklyData;
    } catch (error) {
      console.error('Error processing weekly data:', error);
      return this.getDefaultWeeklyData();
    }
  }

  /**
   * Get health data formatted for VitalityStateEngine
   */
  async getHealthDataForVitality() {
    try {
      const todayStats = await this.getTodayStats();
      const recentEntries = await this.getRecentEntries(3); // Last 3 days for trends

      // Format data for VitalityStateEngine
      return {
        sleep: {
          duration: todayStats.sleep?.duration || this.getAverageFromRecent(recentEntries, 'sleep_duration') || 420, // 7 hours default
          quality: todayStats.sleep?.quality || this.getAverageFromRecent(recentEntries, 'sleep_quality') || 75
        },
        hrv: {
          readiness: todayStats.hrv?.value || this.getAverageFromRecent(recentEntries, 'hrv') || 30
        },
        activity: {
          steps: todayStats.steps || this.getAverageFromRecent(recentEntries, 'steps') || 5000,
          activeMinutes: todayStats.activeMinutes || this.getAverageFromRecent(recentEntries, 'active_minutes') || 20
        },
        mindfulness: {
          sessions: todayStats.mindfulness?.sessions || 0
        },
        nutrition: {
          mealsLogged: todayStats.nutrition?.meals || 0,
          waterIntake: todayStats.nutrition?.water || 6
        },
        mood: todayStats.mood || this.getAverageFromRecent(recentEntries, 'mood') || 3,
        social: {
          socialWellnessScore: todayStats.social?.score || 50
        }
      };
    } catch (error) {
      console.error('Error formatting health data for vitality:', error);
      return this.getDefaultVitalityData();
    }
  }

  /**
   * Save health data to Firebase
   */
  async saveHealthData(healthData) {
    try {
      const docRef = await addDoc(collection(db, 'health_entries'), {
        user_id: this.userId,
        entry_date: new Date().toISOString().split('T')[0],
        entry_type: 'manual',
        source: 'manual_entry',
        ...healthData,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      });

      // Clear cache to force refresh
      this.clearCache();

      return { success: true, data: { id: docRef.id, ...healthData } };
    } catch (error) {
      console.error('Error saving health data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process raw entries into today's stats
   */
  processEntriesToStats(entries) {
    const stats = {
      steps: 0,
      hrv: null,
      sleep: null,
      mood: null,
      nutrition: { meals: 0, water: 0 },
      mindfulness: { sessions: 0 },
      social: { score: 50 },
      activeMinutes: 0,
      lastMeal: null
    };

    entries.forEach(entry => {
      if (entry.steps) stats.steps = Math.max(stats.steps, entry.steps);
      if (entry.hrv) stats.hrv = { value: entry.hrv, status: this.getHRVStatus(entry.hrv) };
      if (entry.sleep_duration) {
        stats.sleep = {
          duration: entry.sleep_duration,
          quality: entry.sleep_quality || 75
        };
      }
      if (entry.mood) stats.mood = entry.mood;
      if (entry.meals_logged) stats.nutrition.meals = Math.max(stats.nutrition.meals, entry.meals_logged);
      if (entry.water_intake) stats.nutrition.water = Math.max(stats.nutrition.water, entry.water_intake);
      if (entry.mindfulness_sessions) stats.mindfulness.sessions += entry.mindfulness_sessions;
      if (entry.active_minutes) stats.activeMinutes = Math.max(stats.activeMinutes, entry.active_minutes);
      if (entry.created_at) {
        const entryTime = entry.created_at.toDate ? entry.created_at.toDate() : new Date(entry.created_at);
        if (!stats.lastMeal || entryTime > stats.lastMeal) {
          stats.lastMeal = entryTime;
        }
      }
    });

    // Format lastMeal as relative time
    if (stats.lastMeal) {
      const now = new Date();
      const diffHours = Math.floor((now - stats.lastMeal) / (1000 * 60 * 60));
      stats.lastMeal = diffHours === 0 ? 'Just now' : `${diffHours}h ago`;
    } else {
      stats.lastMeal = 'No data';
    }

    return stats;
  }

  /**
   * Get average value from recent entries for a specific field
   */
  getAverageFromRecent(entries, field) {
    const values = entries.map(entry => entry[field]).filter(val => val != null);
    if (values.length === 0) return null;
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  }

  /**
   * Get HRV status based on value
   */
  getHRVStatus(hrv) {
    if (hrv >= 40) return 'Excellent';
    if (hrv >= 30) return 'Good';
    if (hrv >= 20) return 'Fair';
    return 'Needs Attention';
  }

  /**
   * Check if cache is still valid
   */
  isCacheValid(key) {
    return this.cache[key] && 
           this.cache.lastUpdated && 
           (Date.now() - this.cache.lastUpdated) < this.cacheTimeout;
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    this.cache = {
      recentEntries: null,
      todayStats: null,
      weeklyData: null,
      lastUpdated: null
    };
  }

  /**
   * Get default stats when no data is available
   */
  getDefaultStats() {
    return {
      steps: 0,
      hrv: { value: 25, status: 'No data' },
      sleep: null,
      mood: null,
      nutrition: { meals: 0, water: 0 },
      mindfulness: { sessions: 0 },
      social: { score: 50 },
      activeMinutes: 0,
      lastMeal: 'No data'
    };
  }

  /**
   * Get default vitality data when no real data is available
   */
  getDefaultVitalityData() {
    return {
      sleep: { duration: 420, quality: 75 },
      hrv: { readiness: 30 },
      activity: { steps: 5000, activeMinutes: 20 },
      mindfulness: { sessions: 0 },
      nutrition: { mealsLogged: 2, waterIntake: 6 },
      mood: 3,
      social: { socialWellnessScore: 50 }
    };
  }

  /**
   * Aggregate weekly data for trends
   */
  aggregateWeeklyData(entries) {
    // Group entries by date
    const dailyData = {};
    entries.forEach(entry => {
      const date = entry.entry_date;
      if (!dailyData[date]) {
        dailyData[date] = { date, entries: [] };
      }
      dailyData[date].entries.push(entry);
    });

    // Process each day
    const weeklyData = Object.values(dailyData).map(day => {
      const dayStats = this.processEntriesToStats(day.entries);
      return {
        date: day.date,
        day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        ...dayStats
      };
    });

    return weeklyData.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Get default weekly data
   */
  getDefaultWeeklyData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      steps: 0,
      hrv: { value: 25 },
      mood: 3,
      activeMinutes: 0
    }));
  }
}

export default HealthDataService;
