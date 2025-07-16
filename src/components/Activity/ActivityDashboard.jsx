import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiPlay, FiPause, FiMoon, FiSun, FiTrendingUp, FiInfo, FiSettings } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import VitaActivityTracker from '../../services/ActivityTracker';
import VitaNotificationIntelligence from '../../services/NotificationIntelligence';
import NotificationTester from './NotificationTester';

const ActivityDashboard = () => {
  const [activityData, setActivityData] = useState({
    steps: { daily: 0, total: 0 },
    activity: { current: 'sedentary', history: [] },
    sleep: { isTracking: false, duration: 0, movements: 0 },
    tracking: { isActive: false, hasPermission: false }
  });
  
  const [isTracking, setIsTracking] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [error, setError] = useState(null);
  const [sleepMode, setSleepMode] = useState(false);
  const [notificationIntelligence, setNotificationIntelligence] = useState({
    isActive: false,
    capturedData: [],
    stats: { totalCaptured: 0, bySource: {}, byType: {} }
  });

  const trackerRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    // Initialize activity tracker
    trackerRef.current = new VitaActivityTracker();

    // Set up event listeners
    trackerRef.current.addEventListener('step', handleStepUpdate);
    trackerRef.current.addEventListener('activity', handleActivityUpdate);
    trackerRef.current.addEventListener('sleep', handleSleepUpdate);

    // Initialize notification intelligence
    initializeNotificationIntelligence();

    // Load initial data
    updateActivityData();

    // Set up periodic updates
    const interval = setInterval(updateActivityData, 5000);

    return () => {
      if (trackerRef.current) {
        trackerRef.current.stopTracking();
      }
      if (notificationRef.current) {
        notificationRef.current.stopCapture();
      }
      clearInterval(interval);
    };
  }, []);

  const initializeNotificationIntelligence = async () => {
    try {
      notificationRef.current = new VitaNotificationIntelligence();

      // Set up event listeners
      notificationRef.current.addEventListener('dataCapture', handleNotificationDataCapture);
      notificationRef.current.addEventListener('error', handleNotificationError);

      // Initialize the system
      const success = await notificationRef.current.initialize();
      if (success) {
        await notificationRef.current.startCapture();
        updateNotificationIntelligenceData();
      }
    } catch (error) {
      console.error('Failed to initialize notification intelligence:', error);
    }
  };

  const updateActivityData = () => {
    if (trackerRef.current) {
      const summary = trackerRef.current.getActivitySummary();
      setActivityData(summary);
      setIsTracking(summary.tracking.isActive);
      setSleepMode(summary.sleep.isTracking);
    }
  };

  const updateNotificationIntelligenceData = () => {
    if (notificationRef.current) {
      const stats = notificationRef.current.getStats();
      setNotificationIntelligence(prev => ({
        ...prev,
        isActive: stats.isActive,
        stats: stats
      }));
    }
  };

  const handleNotificationDataCapture = (data) => {
    console.log('Notification data captured:', data);
    setNotificationIntelligence(prev => ({
      ...prev,
      capturedData: [...prev.capturedData, data]
    }));

    // Cross-validate with accelerometer data if available
    crossValidateData(data);
  };

  const handleNotificationError = (error) => {
    console.error('Notification intelligence error:', error);
    setError(`Notification capture error: ${error.message}`);
  };

  const crossValidateData = (notificationData) => {
    // Compare notification data with accelerometer data for accuracy
    if (notificationData.data.steps && trackerRef.current) {
      const accelerometerSteps = trackerRef.current.getActivitySummary().steps.daily;
      const notificationSteps = notificationData.data.steps;

      // If there's a significant difference, log it for analysis
      const difference = Math.abs(accelerometerSteps - notificationSteps);
      if (difference > 1000) {
        console.log('Step count discrepancy detected:', {
          accelerometer: accelerometerSteps,
          notification: notificationSteps,
          difference: difference
        });
      }
    }
  };

  const handleStepUpdate = (data) => {
    setActivityData(prev => ({
      ...prev,
      steps: {
        daily: data.dailySteps,
        total: data.stepCount
      }
    }));
  };

  const handleActivityUpdate = (data) => {
    setActivityData(prev => ({
      ...prev,
      activity: {
        current: data.level,
        history: prev.activity.history
      }
    }));
  };

  const handleSleepUpdate = (data) => {
    setActivityData(prev => ({
      ...prev,
      sleep: {
        ...prev.sleep,
        duration: data.sleepDuration,
        movements: prev.sleep.movements + 1
      }
    }));
  };

  const startTracking = async () => {
    if (!trackerRef.current) return;
    
    setError(null);
    const success = await trackerRef.current.startTracking();
    
    if (success) {
      setIsTracking(true);
      updateActivityData();
    } else {
      setError('Failed to start activity tracking. Please check permissions.');
      setShowPermissionModal(true);
    }
  };

  const stopTracking = () => {
    if (trackerRef.current) {
      trackerRef.current.stopTracking();
      setIsTracking(false);
      updateActivityData();
    }
  };

  const toggleSleepMode = () => {
    if (!trackerRef.current) return;
    
    if (sleepMode) {
      const sleepData = trackerRef.current.stopSleepTracking();
      setSleepMode(false);
      console.log('Sleep session completed:', sleepData);
    } else {
      trackerRef.current.startSleepTracking();
      setSleepMode(true);
    }
  };

  const getActivityColor = (level) => {
    switch (level) {
      case 'vigorous': return 'red';
      case 'moderate': return 'orange';
      case 'light': return 'yellow';
      default: return 'gray';
    }
  };

  const getActivityLabel = (level) => {
    switch (level) {
      case 'vigorous': return 'Vigorous Activity';
      case 'moderate': return 'Moderate Activity';
      case 'light': return 'Light Activity';
      default: return 'Sedentary';
    }
  };

  const formatDuration = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStepGoalProgress = () => {
    const goal = 10000; // Default daily step goal
    return Math.min((activityData.steps.daily / goal) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Activity Tracking</h1>
          <p className="text-gray-600">Monitor your movement and activity using your phone's sensors</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tracking Control */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Activity Monitoring</h2>
            <div className="flex items-center space-x-3">
              {isTracking && (
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Active</span>
                </div>
              )}
              <motion.button
                onClick={isTracking ? stopTracking : startTracking}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                  isTracking 
                    ? 'bg-red-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={isTracking ? FiPause : FiPlay} className="w-4 h-4" />
                <span>{isTracking ? 'Stop' : 'Start'} Tracking</span>
              </motion.button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">How It Works</h3>
                <p className="text-sm text-blue-700">
                  Uses your phone's accelerometer to detect steps, activity levels, and movement patterns. 
                  Keep your phone with you for accurate tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Daily Steps</h2>
            <SafeIcon icon={FiActivity} className="w-6 h-6 text-emerald-500" />
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-emerald-600 mb-2">
              {activityData.steps.daily.toLocaleString()}
            </div>
            <p className="text-gray-600">steps today</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              className="bg-emerald-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getStepGoalProgress()}%` }}
              transition={{ duration: 1 }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Goal: 10,000 steps</span>
            <span>{Math.round(getStepGoalProgress())}% complete</span>
          </div>
        </div>

        {/* Activity Level Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Current Activity</h2>
            <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-blue-500" />
          </div>

          <div className="text-center mb-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-${getActivityColor(activityData.activity.current)}-100 text-${getActivityColor(activityData.activity.current)}-700`}>
              <div className={`w-2 h-2 bg-${getActivityColor(activityData.activity.current)}-500 rounded-full mr-2`}></div>
              {getActivityLabel(activityData.activity.current)}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            {['sedentary', 'light', 'moderate', 'vigorous'].map((level) => (
              <div key={level} className="p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  activityData.activity.current === level 
                    ? `bg-${getActivityColor(level)}-500` 
                    : 'bg-gray-300'
                }`}></div>
                <p className="text-xs text-gray-600 capitalize">{level}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sleep Tracking Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Sleep Tracking</h2>
            <SafeIcon icon={sleepMode ? FiMoon : FiSun} className="w-6 h-6 text-purple-500" />
          </div>

          {sleepMode ? (
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {formatDuration(activityData.sleep.duration)}
              </div>
              <p className="text-gray-600">sleep duration</p>
              <p className="text-sm text-gray-500 mt-2">
                {activityData.sleep.movements} movements detected
              </p>
            </div>
          ) : (
            <div className="text-center mb-6">
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <SafeIcon icon={FiMoon} className="w-12 h-12 text-purple-600" />
              </div>
              <p className="text-gray-600">Sleep tracking not active</p>
            </div>
          )}

          <motion.button
            onClick={toggleSleepMode}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
              sleepMode 
                ? 'bg-orange-500 text-white' 
                : 'bg-purple-500 text-white'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <SafeIcon icon={sleepMode ? FiSun : FiMoon} className="w-5 h-5" />
            <span>{sleepMode ? 'Stop Sleep Tracking' : 'Start Sleep Tracking'}</span>
          </motion.button>
        </div>

        {/* Notification Tester */}
        <div className="mb-8">
          <NotificationTester />
        </div>

        {/* Notification Intelligence Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Smart Data Capture</h2>
            <div className="flex items-center space-x-2">
              {notificationIntelligence.isActive && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Listening</span>
                </div>
              )}
              <SafeIcon icon={FiInfo} className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {notificationIntelligence.stats.totalCaptured}
              </div>
              <p className="text-sm text-gray-600">Data Points Captured</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Object.keys(notificationIntelligence.stats.bySource).length}
              </div>
              <p className="text-sm text-gray-600">Health Apps Detected</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Object.keys(notificationIntelligence.stats.byType).length}
              </div>
              <p className="text-sm text-gray-600">Data Types</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-2">🚀 Revolutionary Feature</h3>
                <p className="text-sm text-blue-700 mb-2">
                  Vita automatically captures health data from your existing health app notifications -
                  no complex integrations needed!
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Works with Apple Health, Google Fit, Fitbit, and more</li>
                  <li>• Captures steps, sleep, heart rate from notifications</li>
                  <li>• Cross-validates with accelerometer data</li>
                  <li>• Privacy-first - data processed locally</li>
                </ul>
              </div>
            </div>
          </div>

          {notificationIntelligence.capturedData.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-800 mb-3">Recent Captures</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {notificationIntelligence.capturedData.slice(-5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {item.source}
                      </span>
                      <span className="text-sm text-gray-600">
                        {Object.keys(item.data).join(', ')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiInfo} className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-emerald-800 mb-2">Activity Tracking Tips</h3>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Keep your phone with you throughout the day</li>
                <li>• Place phone in pocket or bag for best step detection</li>
                <li>• Start sleep tracking when you go to bed</li>
                <li>• Activity levels update automatically every 5 seconds</li>
                <li>• Enable notifications from health apps for smart capture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Modal */}
      <AnimatePresence>
        {showPermissionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Motion Permission Required</h3>
              <p className="text-gray-600 mb-6">
                To track your activity, we need access to your device's motion sensors. 
                This allows us to count steps and detect activity levels.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPermissionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPermissionModal(false);
                    startTracking();
                  }}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  Allow Access
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityDashboard;
