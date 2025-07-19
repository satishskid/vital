import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoon, FiCheck, FiX, FiClock, FiSun, FiSmartphone, FiThermometer } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const BedtimeRoutineOptimizer = ({ onLogSleepPrep, sleepQualityHistory = [] }) => {
  const [showRoutine, setShowRoutine] = useState(false);
  const [routineItems, setRoutineItems] = useState({});
  const [bedtimeGoal, setBedtimeGoal] = useState('22:00');
  const [routineStarted, setRoutineStarted] = useState(false);

  // Optimal bedtime routine based on sleep science
  const routineChecklist = [
    {
      id: 'dim-lights',
      name: 'Dim the lights',
      description: 'Reduce blue light 2 hours before bed',
      icon: FiSun,
      timeOffset: -120, // 2 hours before bed
      science: 'Helps trigger natural melatonin production'
    },
    {
      id: 'no-screens',
      name: 'Put away screens',
      description: 'No phones, tablets, or TV',
      icon: FiSmartphone,
      timeOffset: -60, // 1 hour before bed
      science: 'Blue light suppresses melatonin by up to 50%'
    },
    {
      id: 'cool-room',
      name: 'Cool the bedroom',
      description: 'Set temperature to 65-68°F (18-20°C)',
      icon: FiThermometer,
      timeOffset: -60,
      science: 'Core body temperature drop signals sleep time'
    },
    {
      id: 'relaxation',
      name: 'Relaxation activity',
      description: 'Reading, meditation, or gentle stretching',
      icon: FiMoon,
      timeOffset: -30,
      science: 'Activates parasympathetic nervous system'
    },
    {
      id: 'consistent-time',
      name: 'Consistent bedtime',
      description: 'Go to bed at the same time',
      icon: FiClock,
      timeOffset: 0,
      science: 'Strengthens circadian rhythm consistency'
    }
  ];

  useEffect(() => {
    checkBedtimeApproaching();
  }, []);

  const checkBedtimeApproaching = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [bedHour, bedMinute] = bedtimeGoal.split(':').map(Number);
    const bedtimeMinutes = bedHour * 60 + bedMinute;
    
    // Show routine 2 hours before bedtime
    const routineStartTime = bedtimeMinutes - 120;
    
    if (currentTime >= routineStartTime && currentTime < bedtimeMinutes) {
      setShowRoutine(true);
    }
  };

  const toggleRoutineItem = (itemId) => {
    setRoutineItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getRoutineProgress = () => {
    const completed = Object.values(routineItems).filter(Boolean).length;
    const total = routineChecklist.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const handleCompleteRoutine = () => {
    const progress = getRoutineProgress();
    const routineData = {
      bedtimeGoal,
      itemsCompleted: routineItems,
      completionPercentage: progress.percentage,
      timestamp: new Date(),
      predictedSleepQuality: predictSleepQuality(progress.percentage)
    };

    onLogSleepPrep(routineData);
    setShowRoutine(false);
    setRoutineItems({});
  };

  const predictSleepQuality = (routineCompletion) => {
    // Simple prediction based on routine completion and historical data
    const baseQuality = 60;
    const routineBonus = (routineCompletion / 100) * 30;
    const historyAverage = sleepQualityHistory.length > 0 
      ? sleepQualityHistory.reduce((sum, quality) => sum + quality, 0) / sleepQualityHistory.length
      : 70;
    
    return Math.round((baseQuality + routineBonus + historyAverage * 0.1));
  };

  const getBedtimeRecommendation = () => {
    const avgQuality = sleepQualityHistory.length > 0 
      ? sleepQualityHistory.reduce((sum, q) => sum + q, 0) / sleepQualityHistory.length
      : null;

    if (!avgQuality) return null;

    if (avgQuality < 70) {
      return {
        suggestion: 'Try going to bed 30 minutes earlier',
        reason: 'Your recent sleep quality suggests you may need more sleep time'
      };
    } else if (avgQuality > 85) {
      return {
        suggestion: 'Your current bedtime is working well!',
        reason: 'Keep maintaining this consistent schedule'
      };
    }

    return null;
  };

  const progress = getRoutineProgress();
  const recommendation = getBedtimeRecommendation();

  return (
    <>
      {/* Bedtime Routine Trigger */}
      {showRoutine && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMoon} className="w-5 h-5 text-indigo-600" />
              <h3 className="font-medium text-indigo-800">Bedtime Routine</h3>
              <span className="text-sm text-indigo-600">
                {progress.completed}/{progress.total} completed
              </span>
            </div>
            <button
              onClick={() => setShowRoutine(false)}
              className="text-indigo-400 hover:text-indigo-600"
            >
              <SafeIcon icon={FiX} className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="bg-indigo-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          {/* Routine Checklist */}
          <div className="space-y-2 mb-4">
            {routineChecklist.map(item => (
              <div
                key={item.id}
                className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                  routineItems[item.id] 
                    ? 'bg-green-100 border border-green-200' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => toggleRoutineItem(item.id)}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  routineItems[item.id] 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {routineItems[item.id] ? (
                    <SafeIcon icon={FiCheck} className="w-3 h-3" />
                  ) : (
                    <SafeIcon icon={item.icon} className="w-3 h-3" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                  <div className="text-xs text-indigo-600">{item.science}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Predicted Sleep Quality */}
          {progress.completed > 0 && (
            <div className="bg-white rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-600 mb-1">Predicted Sleep Quality</div>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-indigo-600">
                  {predictSleepQuality(progress.percentage)}%
                </div>
                <div className="text-sm text-gray-500">
                  Based on routine completion
                </div>
              </div>
            </div>
          )}

          {/* Complete Routine Button */}
          <button
            onClick={handleCompleteRoutine}
            disabled={progress.completed === 0}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Bedtime Routine
          </button>
        </motion.div>
      )}

      {/* Bedtime Optimization Insights */}
      {recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4"
        >
          <div className="flex items-start space-x-2">
            <SafeIcon icon={FiMoon} className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-800">{recommendation.suggestion}</div>
              <div className="text-sm text-blue-600">{recommendation.reason}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Manual Trigger Button */}
      {!showRoutine && (
        <button
          onClick={() => setShowRoutine(true)}
          className="w-full bg-indigo-100 text-indigo-700 py-2 px-4 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
        >
          🌙 Start Bedtime Routine
        </button>
      )}
    </>
  );
};

export default BedtimeRoutineOptimizer;
