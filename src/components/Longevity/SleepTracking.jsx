import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/FirebaseAuthContext';
import HealthDataService from '../../services/HealthDataService';

const { FiMoon, FiBrain, FiThermometer, FiVolume, FiEye, FiClock } = FiIcons;

const SleepTracking = () => {
  const { user } = useAuth();
  const [sleepData, setSleepData] = useState({
    duration: null,
    quality: null,
    environment: null,
    timing: null,
    brainDetox: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSleepData();
    }
  }, [user]);

  const loadSleepData = async () => {
    try {
      const healthService = new HealthDataService(user.uid);
      const data = await healthService.getTodayStats();
      
      setSleepData({
        duration: data.sleep?.duration || null,
        quality: data.sleep?.quality || null,
        environment: data.sleep?.environment || null,
        timing: data.sleep?.timing || null,
        brainDetox: data.sleep?.brainDetox || null
      });
    } catch (error) {
      console.error('Error loading sleep data:', error);
    } finally {
      setLoading(false);
    }
  };

  const logSleepDuration = async (hours) => {
    const minutes = hours * 60;
    try {
      const healthService = new HealthDataService(user.uid);
      await healthService.logHealthData({
        sleep: {
          duration: minutes,
          timestamp: new Date()
        }
      });
      setSleepData(prev => ({ ...prev, duration: minutes }));
    } catch (error) {
      console.error('Error logging sleep duration:', error);
    }
  };

  const logSleepEnvironment = async (score) => {
    try {
      const healthService = new HealthDataService(user.uid);
      await healthService.logHealthData({
        sleep: {
          environment: score,
          timestamp: new Date()
        }
      });
      setSleepData(prev => ({ ...prev, environment: score }));
    } catch (error) {
      console.error('Error logging sleep environment:', error);
    }
  };

  const formatSleepDuration = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getSleepQualityScore = () => {
    if (!sleepData.duration) return 0;
    
    // Optimal sleep duration scoring (7-9 hours)
    const durationScore = sleepData.duration >= 420 && sleepData.duration <= 540 ? 100 : 
                         Math.max(0, 100 - Math.abs(480 - sleepData.duration) / 2);
    
    const environmentScore = sleepData.environment || 0;
    const timingScore = sleepData.timing || 0;
    
    return Math.round((durationScore * 0.4) + (environmentScore * 0.3) + (timingScore * 0.3));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <SafeIcon icon={FiMoon} className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quality Sleep for Brain Detoxification</h1>
            <p className="text-indigo-100">Sleep optimization for hormonal balance & brain cleaning</p>
          </div>
        </div>
        
        {/* Sleep Quality Score */}
        <div className="bg-white bg-opacity-20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{getSleepQualityScore()}%</div>
              <div className="text-indigo-100">Brain Detox Score</div>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiBrain} className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Sleep Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <SafeIcon icon={FiClock} className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Sleep Duration</h3>
                <p className="text-sm text-gray-600">7-9 hours optimal for brain detox</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {formatSleepDuration(sleepData.duration)}
              </div>
              <div className="text-sm text-gray-600">Last Night</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {[6, 7, 8, 9].map((hours) => (
              <button
                key={hours}
                onClick={() => logSleepDuration(hours)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  hours >= 7 && hours <= 9 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
              >
                {hours}h
              </button>
            ))}
          </div>

          <div className="bg-indigo-50 p-3 rounded-lg">
            <p className="text-sm text-indigo-800">
              <strong>Brain Detox:</strong> During deep sleep, your brain's glymphatic system clears toxic proteins 
              like amyloid-beta, reducing Alzheimer's risk and supporting cognitive longevity.
            </p>
          </div>
        </motion.div>

        {/* Sleep Environment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <SafeIcon icon={FiThermometer} className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Sleep Environment</h3>
                <p className="text-sm text-gray-600">Cool, dark, quiet optimization</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => logSleepEnvironment(90)}
              className="bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              <SafeIcon icon={FiThermometer} className="w-5 h-5 mx-auto mb-1" />
              Cool (65-68°F)
            </button>
            <button
              onClick={() => logSleepEnvironment(85)}
              className="bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              <SafeIcon icon={FiEye} className="w-5 h-5 mx-auto mb-1" />
              Blackout Dark
            </button>
            <button
              onClick={() => logSleepEnvironment(80)}
              className="bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 transition-colors"
            >
              <SafeIcon icon={FiVolume} className="w-5 h-5 mx-auto mb-1" />
              Quiet/White Noise
            </button>
            <button
              onClick={() => logSleepEnvironment(95)}
              className="bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              All Optimized
            </button>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Hormonal Balance:</strong> Optimal sleep environment supports growth hormone release, 
              cortisol regulation, and melatonin production for cellular repair and longevity.
            </p>
          </div>
        </motion.div>

        {/* Sleep Timing Consistency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <SafeIcon icon={FiClock} className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Sleep Timing Consistency</h3>
                <p className="text-sm text-gray-600">Same bedtime & wake time daily</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-800">
              {sleepData.timing || 0}%
            </div>
            <div className="text-sm text-gray-600">Consistency Score</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setSleepData(prev => ({ ...prev, timing: 90 }))}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Same Time ±30min
            </button>
            <button
              onClick={() => setSleepData(prev => ({ ...prev, timing: 70 }))}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Same Time ±1hr
            </button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Circadian Strength:</strong> Consistent sleep timing strengthens your internal clock, 
              improving sleep architecture and maximizing brain detoxification efficiency.
            </p>
          </div>
        </motion.div>

        {/* Brain Detox Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <SafeIcon icon={FiBrain} className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Brain Detox Quality</h3>
                <p className="text-sm text-gray-600">How did you wake up?</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setSleepData(prev => ({ ...prev, brainDetox: 90 }))}
              className="bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Refreshed & Alert
            </button>
            <button
              onClick={() => setSleepData(prev => ({ ...prev, brainDetox: 70 }))}
              className="bg-yellow-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              Somewhat Rested
            </button>
            <button
              onClick={() => setSleepData(prev => ({ ...prev, brainDetox: 50 }))}
              className="bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Groggy
            </button>
            <button
              onClick={() => setSleepData(prev => ({ ...prev, brainDetox: 30 }))}
              className="bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Exhausted
            </button>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Morning Clarity:</strong> Waking up refreshed indicates effective brain detoxification, 
              memory consolidation, and cellular repair during sleep.
            </p>
          </div>
        </motion.div>

        {/* Sleep Optimization Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl p-6 text-white"
        >
          <h3 className="font-semibold mb-3">Brain Detox Optimization</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMoon} className="w-4 h-4" />
              <span className="text-sm">Sleep on your side to enhance glymphatic drainage</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiThermometer} className="w-4 h-4" />
              <span className="text-sm">Keep bedroom temperature 65-68°F for deep sleep</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiBrain} className="w-4 h-4" />
              <span className="text-sm">Avoid alcohol - it disrupts brain cleaning cycles</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiClock} className="w-4 h-4" />
              <span className="text-sm">Consistent timing maximizes detox efficiency</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SleepTracking;
