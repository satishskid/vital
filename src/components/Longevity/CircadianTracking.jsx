import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/FirebaseAuthContext';
import HealthDataService from '../../services/HealthDataService';

const { FiSun, FiMoon, FiClock, FiEye, FiCheck, FiPlus } = FiIcons;

const CircadianTracking = () => {
  const { user } = useAuth();
  const [circadianData, setCircadianData] = useState({
    morningLight: null,
    mealTiming: null,
    eveningLight: null,
    sleepConsistency: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCircadianData();
    }
  }, [user]);

  const loadCircadianData = async () => {
    try {
      const healthService = new HealthDataService(user.uid);
      const data = await healthService.getTodayStats();
      
      setCircadianData({
        morningLight: data.lightExposure?.morningLight || null,
        mealTiming: data.nutrition?.mealTiming || null,
        eveningLight: data.lightExposure?.eveningReduction || null,
        sleepConsistency: data.sleep?.consistency || null
      });
    } catch (error) {
      console.error('Error loading circadian data:', error);
    } finally {
      setLoading(false);
    }
  };

  const logMorningLight = async (minutes) => {
    try {
      const healthService = new HealthDataService(user.uid);
      await healthService.logHealthData({
        lightExposure: {
          morningLight: minutes,
          timestamp: new Date()
        }
      });
      setCircadianData(prev => ({ ...prev, morningLight: minutes }));
    } catch (error) {
      console.error('Error logging morning light:', error);
    }
  };

  const logMealTiming = async (timing) => {
    try {
      const healthService = new HealthDataService(user.uid);
      await healthService.logHealthData({
        nutrition: {
          mealTiming: timing,
          timestamp: new Date()
        }
      });
      setCircadianData(prev => ({ ...prev, mealTiming: timing }));
    } catch (error) {
      console.error('Error logging meal timing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <SafeIcon icon={FiSun} className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Circadian Rhythm Optimization</h1>
            <p className="text-yellow-100">Light exposure & meal timing for hormonal balance</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Morning Light Exposure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <SafeIcon icon={FiSun} className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Morning Light Exposure</h3>
                <p className="text-sm text-gray-600">Within 2 hours of waking</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {circadianData.morningLight || 0} min
              </div>
              <div className="text-sm text-gray-600">Today</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[10, 20, 30].map((minutes) => (
              <button
                key={minutes}
                onClick={() => logMorningLight(minutes)}
                className="bg-yellow-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
              >
                {minutes} min
              </button>
            ))}
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Why:</strong> Morning light exposure within 2 hours of waking helps set your circadian clock, 
              improving sleep quality, hormone production, and cognitive function.
            </p>
          </div>
        </motion.div>

        {/* Meal Timing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <SafeIcon icon={FiClock} className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Meal Timing</h3>
                <p className="text-sm text-gray-600">Circadian-aligned eating</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => logMealTiming(85)}
              className="bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Early Eating Window
              <div className="text-sm opacity-90">6am - 6pm</div>
            </button>
            <button
              onClick={() => logMealTiming(70)}
              className="bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Standard Window
              <div className="text-sm opacity-90">8am - 8pm</div>
            </button>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Why:</strong> Eating earlier in the day aligns with your natural metabolism, 
              improving insulin sensitivity and supporting healthy weight management.
            </p>
          </div>
        </motion.div>

        {/* Evening Light Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <SafeIcon icon={FiEye} className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Evening Light Management</h3>
                <p className="text-sm text-gray-600">Blue light reduction</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setCircadianData(prev => ({ ...prev, eveningLight: 90 }))}
              className="bg-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
            >
              <SafeIcon icon={FiCheck} className="w-5 h-5 mx-auto mb-1" />
              Blue Light Filters On
            </button>
            <button
              onClick={() => setCircadianData(prev => ({ ...prev, eveningLight: 95 }))}
              className="bg-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
            >
              <SafeIcon icon={FiMoon} className="w-5 h-5 mx-auto mb-1" />
              Dim Lights 2hrs Before Bed
            </button>
          </div>

          <div className="bg-indigo-50 p-3 rounded-lg">
            <p className="text-sm text-indigo-800">
              <strong>Why:</strong> Reducing blue light exposure in the evening helps maintain natural melatonin 
              production, improving sleep quality and circadian rhythm stability.
            </p>
          </div>
        </motion.div>

        {/* Sleep Consistency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <SafeIcon icon={FiMoon} className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Sleep-Wake Consistency</h3>
                <p className="text-sm text-gray-600">Same time daily</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-gray-800">
              {circadianData.sleepConsistency || 0}%
            </div>
            <div className="text-sm text-gray-600">Consistency Score</div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Why:</strong> Consistent sleep-wake times strengthen your circadian rhythm, 
              leading to better sleep quality, improved mood, and enhanced cognitive performance.
            </p>
          </div>
        </motion.div>

        {/* Today's Circadian Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white"
        >
          <h3 className="font-semibold mb-3">Today's Circadian Optimization</h3>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {Math.round(((circadianData.morningLight || 0) / 30 * 25) + 
                         ((circadianData.mealTiming || 0) / 100 * 25) + 
                         ((circadianData.eveningLight || 0) / 100 * 25) + 
                         ((circadianData.sleepConsistency || 0) / 100 * 25))}%
            </div>
            <div className="text-yellow-100">Circadian Rhythm Score</div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-yellow-100">
              Optimizing your circadian rhythm is the foundation for biological age reversal
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CircadianTracking;
