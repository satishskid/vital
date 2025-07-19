import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiTrendingUp, FiCalendar, FiClock } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import CircadianClockDial from './CircadianClockDial';
import PrivacyPillars from './PrivacyPillars';
import BedtimeRoutineOptimizer from './BedtimeRoutineOptimizer';
import AIFoodAnalyzer from './AIFoodAnalyzer';
import VoiceGuidedJournal from './VoiceGuidedJournal';
import WeeklyProgressGarden from './WeeklyProgressGarden';
import { useAuth } from '../../context/FirebaseAuthContext';

const CircadianTracking = () => {
  const { user, saveHealthData, getRecentHealthEntries } = useAuth();
  // Six Neuroscience-Backed Longevity Pillars
  const [todayLogs, setTodayLogs] = useState({
    // 1. Circadian Rhythm Optimization
    circadianRhythm: [],
    // 2. Intentional Movement
    intentionalMovement: [],
    // 3. Controlled Stress for Resilience
    controlledStress: [],
    // 4. Quality Sleep for Brain Detoxification
    qualitySleep: [],
    // 5. Nutrient-Dense Eating
    nutrientDenseEating: [],
    // 6. Positive Self-Narrative
    positiveSelfNarrative: []
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState({
    movement: { steps: 0, activeMinutes: 0 },
    sleep: { quality: 0, duration: 0 },
    hrv: { value: 0, status: 'No data' }
  });
  const [notificationData, setNotificationData] = useState({
    socialActivity: { calls: 0, messages: 0, videoChats: 0 },
    activitySpikes: { detected: false, intensity: 0 },
    screenTime: { reduced: false, nightMode: false }
  });

  // Load real sensor data from Firebase and device sensors
  useEffect(() => {
    const loadRealSensorData = async () => {
      try {
        if (!user) return;

        // Get today's health data from Firebase
        const result = await getRecentHealthEntries(1);
        const todayData = result.success && result.data.length > 0 ? result.data[0] : null;

        // Extract real sensor data or use reasonable defaults
        const realSensorData = {
          movement: {
            steps: todayData?.movement?.steps || 0,
            activeMinutes: todayData?.movement?.activeMinutes || 0
          },
          sleep: {
            quality: todayData?.sleep?.quality || 0,
            duration: todayData?.sleep?.duration || 0
          },
          hrv: {
            value: todayData?.hrv?.value || 0,
            status: todayData?.hrv?.status || 'No data'
          }
        };

        setSensorData(realSensorData);
      } catch (error) {
        console.error('Error loading sensor data:', error);
        // Fallback to empty state
        setSensorData({
          movement: { steps: 0, activeMinutes: 0 },
          sleep: { quality: 0, duration: 0 },
          hrv: { value: 0, status: 'No data' }
        });
      }
    };

    // Load immediately and refresh every 5 minutes
    loadRealSensorData();
    const interval = setInterval(loadRealSensorData, 300000);

    return () => clearInterval(interval);
  }, [user, getRecentHealthEntries]);

  // Load real notification intelligence data from Firebase
  useEffect(() => {
    const loadRealNotificationData = async () => {
      try {
        if (!user) return;

        // Get today's social and activity data from Firebase
        const result = await getRecentHealthEntries(1);
        const todayData = result.success && result.data.length > 0 ? result.data[0] : null;

        // Extract real notification data or use empty defaults
        const realNotificationData = {
          socialActivity: {
            calls: todayData?.social?.calls || 0,
            messages: todayData?.social?.messages || 0,
            videoChats: todayData?.social?.videoChats || 0
          },
          activitySpikes: {
            detected: todayData?.movement?.spikesDetected || false,
            intensity: todayData?.movement?.intensity || 0
          },
          screenTime: {
            reduced: todayData?.screenTime?.reduced || false,
            nightMode: todayData?.screenTime?.nightMode || false
          }
        };

        setNotificationData(realNotificationData);
      } catch (error) {
        console.error('Error loading notification data:', error);
        // Fallback to empty state
        setNotificationData({
          socialActivity: { calls: 0, messages: 0, videoChats: 0 },
          activitySpikes: { detected: false, intensity: 0 },
          screenTime: { reduced: false, nightMode: false }
        });
      }
    };

    // Load immediately and refresh every 10 minutes
    loadRealNotificationData();
    const interval = setInterval(loadRealNotificationData, 600000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadTodayData();
    loadWeeklyData();
  }, [user]);

  const loadTodayData = async () => {
    if (!user) return;

    try {
      const result = await getRecentHealthEntries(7);

      if (result.success && result.data.length > 0) {
        // Find today's entry
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = result.data.find(entry => entry.entry_date === today);

        if (todayEntry && todayEntry.circadian) {
          setTodayLogs(todayEntry.circadian);
        }
      }
    } catch (error) {
      console.error('Error loading today data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWeeklyData = async () => {
    if (!user) return;

    try {
      const result = await getRecentHealthEntries(7);

      if (result.success) {
        const weekData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];

          const dayEntry = result.data.find(entry => entry.entry_date === dateStr);
          weekData.push({
            date: dateStr,
            circadian: dayEntry?.circadian || { light: [], meals: [], blueLight: [], sleep: [] }
          });
        }
        setWeeklyData(weekData);
      }
    } catch (error) {
      console.error('Error loading weekly data:', error);
    }
  };

  const handleLogActivity = async (activityType, time) => {
    if (!user) return;

    const newLog = {
      hour: time.hour,
      minute: time.minute,
      timestamp: new Date().toISOString(),
      duration: activityType === 'light' ? 15 : undefined // Default 15 min for light
    };

    const updatedLogs = {
      ...todayLogs,
      [activityType]: [...(todayLogs[activityType] || []), newLog]
    };

    setTodayLogs(updatedLogs);

    try {
      const result = await saveHealthData({
        circadian: updatedLogs
      });

      if (result.success) {
        // Reload weekly data to update trends
        loadWeeklyData();
      } else {
        console.error('Failed to save circadian data:', result.error);
      }
    } catch (error) {
      console.error('Error saving circadian data:', error);
    }
  };

  const calculateConsistencyScore = () => {
    if (weeklyData.length < 3) return 0;
    
    let totalScore = 0;
    let activities = 0;

    // Check sleep consistency
    const sleepTimes = weeklyData
      .map(day => day.circadian.sleep?.[0])
      .filter(Boolean);
    
    if (sleepTimes.length >= 3) {
      const avgSleepTime = sleepTimes.reduce((sum, time) => sum + time.hour, 0) / sleepTimes.length;
      const variance = sleepTimes.reduce((sum, time) => sum + Math.pow(time.hour - avgSleepTime, 2), 0) / sleepTimes.length;
      totalScore += Math.max(0, 100 - variance * 10);
      activities++;
    }

    // Check morning light consistency
    const lightLogs = weeklyData
      .map(day => day.circadian.light?.length || 0)
      .filter(count => count > 0);
    
    if (lightLogs.length >= 3) {
      totalScore += (lightLogs.length / 7) * 100;
      activities++;
    }

    return activities > 0 ? Math.round(totalScore / activities) : 0;
  };

  const getTodayStats = () => {
    return {
      // Time-based pillars
      lightExposure: todayLogs.light?.length || 0,
      mealsLogged: todayLogs.meals?.length || 0,
      screenFreeTime: todayLogs.blueLight?.length || 0,
      sleepLogged: todayLogs.sleep?.length || 0,
      // Privacy-first pillars
      selfCareEntries: todayLogs.selfTalk?.length || 0,
      socialConnections: todayLogs.socialConnect?.length || 0,
      meTimeActivities: todayLogs.meTime?.length || 0,
      stressResilience: todayLogs.stressResilience?.length || 0,
      // Total wellness score
      totalPillars: Object.values(todayLogs).reduce((sum, logs) => sum + (logs?.length || 0), 0)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading circadian data...</p>
        </div>
      </div>
    );
  }

  const stats = getTodayStats();
  const consistencyScore = calculateConsistencyScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <SafeIcon icon={FiSun} className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-800">Light & Timing</h1>
            <SafeIcon icon={FiMoon} className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Optimize your circadian rhythm through strategic light exposure, meal timing, and sleep consistency
          </p>
        </motion.div>

        {/* Six Pillars Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Six Longevity Pillars</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{stats.totalPillars}</div>
                <div className="text-xs text-gray-600">Total Activities</div>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              <div className="text-center">
                <SafeIcon icon={FiSun} className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-800">{stats.lightExposure}</div>
                <div className="text-xs text-gray-600">Light</div>
              </div>
              <div className="text-center">
                <SafeIcon icon={FiClock} className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-800">{stats.mealsLogged}</div>
                <div className="text-xs text-gray-600">Nutrition</div>
              </div>
              <div className="text-center">
                <SafeIcon icon={FiMoon} className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-800">{stats.sleepLogged}</div>
                <div className="text-xs text-gray-600">Sleep</div>
              </div>
              <div className="text-center">
                <span className="text-lg mx-auto mb-1 block">💪</span>
                <div className="text-lg font-bold text-gray-800">{stats.stressResilience}</div>
                <div className="text-xs text-gray-600">Resilience</div>
              </div>
              <div className="text-center">
                <span className="text-lg mx-auto mb-1 block">🤗</span>
                <div className="text-lg font-bold text-gray-800">{stats.socialConnections}</div>
                <div className="text-xs text-gray-600">Social</div>
              </div>
              <div className="text-center">
                <span className="text-lg mx-auto mb-1 block">✨</span>
                <div className="text-lg font-bold text-gray-800">{stats.selfCareEntries}</div>
                <div className="text-xs text-gray-600">Mindset</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Sensor Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-8"
        >
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg">📱</span>
            <h3 className="font-bold text-gray-800">Live Sensor Data</h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Auto-Tracking
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{sensorData.movement.steps}</div>
              <div className="text-xs text-gray-600">Steps Today</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{sensorData.sleep.quality}%</div>
              <div className="text-xs text-gray-600">Sleep Quality</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{sensorData.hrv.value}ms</div>
              <div className="text-xs text-gray-600">HRV</div>
            </div>
          </div>
        </motion.div>

        {/* Main Clock Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <CircadianClockDial
            onLogActivity={handleLogActivity}
            todayLogs={todayLogs}
            sensorData={sensorData}
          />
        </motion.div>

        {/* Privacy-First Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <PrivacyPillars
            onLogActivity={handleLogActivity}
            todayLogs={todayLogs}
            notificationData={notificationData}
          />
        </motion.div>

        {/* AI-Powered Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg">🤖</span>
              <h3 className="text-lg font-bold text-gray-800">AI-Enhanced Tracking</h3>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                Smart Features
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* AI Food Analyzer */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2">📸 Smart Nutrition</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Photo analysis with AI-powered nutrient detection
                </p>
                <AIFoodAnalyzer
                  onFoodAnalyzed={(mealData) => handleLogActivity('meals', mealData)}
                  currentTime={{
                    hour: new Date().getHours(),
                    minute: new Date().getMinutes()
                  }}
                />
              </div>

              {/* Bedtime Routine Optimizer */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2">🌙 Sleep Optimization</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Science-based bedtime routine guidance
                </p>
                <BedtimeRoutineOptimizer
                  onLogSleepPrep={(routineData) => handleLogActivity('sleep', routineData)}
                  sleepQualityHistory={weeklyData.map(day => day.sleep?.quality || 0).filter(q => q > 0)}
                />
              </div>

              {/* Voice Guided Journal */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2">🎙️ Mindset Coaching</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Voice-guided reflection for positive self-narrative
                </p>
                <VoiceGuidedJournal
                  onJournalEntry={(entryData) => handleLogActivity('selfTalk', entryData)}
                  todayEntries={todayLogs.selfTalk || []}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Six Pillars Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <WeeklyProgressGarden
            todayLogs={todayLogs}
            weeklyData={weeklyData}
          />
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6"
        >
          <h3 className="font-bold text-gray-800 mb-3">Circadian Optimization Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Morning (6-10 AM):</strong> Get 10-30 minutes of direct sunlight within 2 hours of waking
            </div>
            <div>
              <strong>Meals:</strong> Eat within a consistent 8-12 hour window, avoid late-night eating
            </div>
            <div>
              <strong>Evening:</strong> Reduce blue light 2-3 hours before bedtime
            </div>
            <div>
              <strong>Sleep:</strong> Maintain consistent bedtime and wake time, even on weekends
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CircadianTracking;
