import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiActivity, FiMoon, FiInfo, FiSave, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/FirebaseAuthContext';
import EnhancedInput from './EnhancedInput';
import {
  heartRateSuggestions,
  hrvSuggestions,
  sleepDurationSuggestions,
  stepsSuggestions,
  activityLevelOptions,
  sleepQualityOptions
} from './healthInputData';

const SafeIcon = ({ icon: Icon, ...props }) => {
  if (!Icon) return <div {...props} />;
  return <Icon {...props} />;
};

const InfoTooltip = ({ content }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block ml-2">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-gray-400 hover:text-gray-600"
      >
        <SafeIcon icon={FiInfo} className="w-4 h-4" />
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-10">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

const HealthDataForm = ({ onSuccess, initialData = null }) => {
  const { user, saveHealthData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [healthData, setHealthData] = useState({
    heart_rate: initialData?.heart_rate || '',
    hrv: initialData?.hrv || '',
    steps: initialData?.steps || '',
    sleep_duration: initialData?.sleep_duration || '',
    sleep_quality: initialData?.sleep_quality || 5,
    activity_level: initialData?.activity_level || 'moderate',
    notes: initialData?.notes || ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (healthData.heart_rate && (healthData.heart_rate < 40 || healthData.heart_rate > 200)) {
      errors.heart_rate = 'Heart rate should be between 40-200 BPM';
    }

    if (healthData.hrv && (healthData.hrv < 5 || healthData.hrv > 100)) {
      errors.hrv = 'HRV should be between 5-100 ms';
    }

    if (healthData.steps && (healthData.steps < 0 || healthData.steps > 50000)) {
      errors.steps = 'Steps should be between 0-50,000';
    }

    if (healthData.sleep_duration && (healthData.sleep_duration < 0 || healthData.sleep_duration > 24)) {
      errors.sleep_duration = 'Sleep duration should be between 0-24 hours';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      setError('Please sign in to save health data');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data for Firebase
      const entryData = {
        heart_rate: healthData.heart_rate ? parseInt(healthData.heart_rate) : null,
        hrv: healthData.hrv ? parseFloat(healthData.hrv) : null,
        steps: healthData.steps ? parseInt(healthData.steps) : null,
        sleep_duration: healthData.sleep_duration ? parseFloat(healthData.sleep_duration) : null,
        sleep_quality: parseInt(healthData.sleep_quality),
        activity_level: healthData.activity_level,
        notes: healthData.notes || null
      };

      // Save to Firebase
      const result = await saveHealthData(entryData);

      if (!result.success) {
        throw new Error(result.error);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      if (onSuccess) {
        onSuccess(result.data);
      }

      // Reset form if this was a new entry
      if (!initialData) {
        setHealthData({
          heart_rate: '',
          hrv: '',
          steps: '',
          sleep_duration: '',
          sleep_quality: 5,
          activity_level: 'moderate',
          notes: ''
        });
      }

    } catch (error) {
      console.error('Error saving health data:', error);
      setError('Failed to save health data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStreak = async (userId, entryDate) => {
    try {
      // Get current streak data
      // TODO: Implement Firebase-based streak tracking
      // const { data: streakData, error: streakError } = await supabase
      //   .from('streaks')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .single();
      const streakData = null;
      const streakError = null;

      if (streakError && streakError.code !== 'PGRST116') {
        console.error('Error fetching streak:', streakError);
        return;
      }

      const today = new Date(entryDate);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let newStreak = 1;
      let longestStreak = streakData?.longest_streak || 1;

      if (streakData?.last_entry_date) {
        const lastEntryDate = new Date(streakData.last_entry_date);
        
        if (lastEntryDate.toDateString() === yesterday.toDateString()) {
          // Consecutive day
          newStreak = (streakData.current_streak || 0) + 1;
        } else if (lastEntryDate.toDateString() === today.toDateString()) {
          // Same day, don't increment
          newStreak = streakData.current_streak || 1;
        }
        // If gap > 1 day, streak resets to 1
      }

      longestStreak = Math.max(longestStreak, newStreak);

      // Update streak
      // TODO: Implement Firebase-based streak tracking
      // const { error: updateError } = await supabase
      //   .from('streaks')
      //   .upsert([
      //     {
      //       user_id: userId,
      //       current_streak: newStreak,
      //       longest_streak: longestStreak,
      //       last_entry_date: entryDate,
      //       updated_at: new Date().toISOString()
      //     }
      //   ], { onConflict: 'user_id' });
      const updateError = null;

      if (updateError) {
        console.error('Error updating streak:', updateError);
      }

      // Check for achievements
      await checkAchievements(userId, newStreak, longestStreak);

    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const checkAchievements = async (userId, currentStreak, longestStreak) => {
    const achievements = [];

    if (currentStreak === 7) {
      achievements.push({
        user_id: userId,
        achievement_type: 'streak',
        title: 'Week Warrior',
        description: 'Logged health data for 7 consecutive days',
        icon: '🏆'
      });
    }

    if (currentStreak === 30) {
      achievements.push({
        user_id: userId,
        achievement_type: 'streak',
        title: 'Monthly Master',
        description: 'Logged health data for 30 consecutive days',
        icon: '🎯'
      });
    }

    if (longestStreak === 100) {
      achievements.push({
        user_id: userId,
        achievement_type: 'streak',
        title: 'Consistency Champion',
        description: 'Reached 100-day streak',
        icon: '👑'
      });
    }

    if (achievements.length > 0) {
      // TODO: Implement Firebase-based achievements
      // const { error } = await supabase
      //   .from('achievements')
      //   .insert(achievements);

      // if (error) {
      //   console.error('Error saving achievements:', error);
      // }
      console.log('Achievements earned:', achievements);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? 'Edit Health Data' : 'Log Your Health Data'}
        </h2>
        {success && (
          <div className="flex items-center text-green-600">
            <SafeIcon icon={FiCheck} className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Saved successfully!</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Heart Rate Section */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <SafeIcon icon={FiHeart} className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="font-medium text-gray-800">Heart Health</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <EnhancedInput
                type="suggestions"
                label="Heart Rate (BPM)"
                value={healthData.heart_rate}
                onChange={(value) => setHealthData({...healthData, heart_rate: value})}
                suggestions={heartRateSuggestions}
                placeholder="e.g., 72"
                min="40"
                max="200"
                tooltip="Your resting heart rate, typically measured in the morning"
                error={validationErrors.heart_rate}
                className="focus:ring-red-500 focus:border-red-500"
                unit="BPM"
              />
            </div>

            <div>
              <EnhancedInput
                type="suggestions"
                label="HRV (RMSSD in ms)"
                value={healthData.hrv}
                onChange={(value) => setHealthData({...healthData, hrv: value})}
                suggestions={hrvSuggestions}
                placeholder="e.g., 35.2"
                min="5"
                max="100"
                step="0.1"
                tooltip="Heart Rate Variability - higher values typically indicate better recovery"
                error={validationErrors.hrv}
                className="focus:ring-red-500 focus:border-red-500"
                unit="ms"
              />
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <SafeIcon icon={FiActivity} className="w-5 h-5 text-emerald-500 mr-2" />
            <h3 className="font-medium text-gray-800">Activity</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <EnhancedInput
                type="suggestions"
                label="Daily Steps"
                value={healthData.steps}
                onChange={(value) => setHealthData({...healthData, steps: value})}
                suggestions={stepsSuggestions}
                placeholder="e.g., 8500"
                min="0"
                max="50000"
                tooltip="Total steps taken today - check your phone's health app"
                error={validationErrors.steps}
                className="focus:ring-emerald-500 focus:border-emerald-500"
                unit="steps"
              />
            </div>

            <div>
              <EnhancedInput
                type="dropdown"
                label="Activity Level"
                value={healthData.activity_level}
                onChange={(value) => setHealthData({...healthData, activity_level: value})}
                suggestions={activityLevelOptions}
                placeholder="Select activity level"
                className="focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Sleep Section */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <SafeIcon icon={FiMoon} className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="font-medium text-gray-800">Sleep</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <EnhancedInput
                type="suggestions"
                label="Sleep Duration (hours)"
                value={healthData.sleep_duration}
                onChange={(value) => setHealthData({...healthData, sleep_duration: value})}
                suggestions={sleepDurationSuggestions}
                placeholder="e.g., 7.5"
                min="0"
                max="24"
                step="0.5"
                tooltip="Total sleep time from last night"
                error={validationErrors.sleep_duration}
                className="focus:ring-blue-500 focus:border-blue-500"
                unit="hours"
              />
            </div>

            <div>
              <EnhancedInput
                type="dropdown"
                label="Sleep Quality (1-10)"
                value={healthData.sleep_quality}
                onChange={(value) => setHealthData({...healthData, sleep_quality: value})}
                suggestions={sleepQualityOptions}
                placeholder="Rate your sleep quality"
                className="focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={healthData.notes}
            onChange={(e) => setHealthData({...healthData, notes: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
            rows="3"
            placeholder="Any additional notes about your health today..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <SafeIcon icon={FiSave} className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Saving...' : (initialData ? 'Update Health Data' : 'Save Health Data')}
        </button>
      </form>
    </motion.div>
  );
};

export default HealthDataForm;
