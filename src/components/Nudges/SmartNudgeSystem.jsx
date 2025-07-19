import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/FirebaseAuthContext';
import CircadianNudgeEngine from '../../services/CircadianNudgeEngine';
import HealthDataService from '../../services/HealthDataService';

const { FiX, FiCheck, FiClock, FiZap, FiGift } = FiIcons;

const SmartNudgeSystem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeNudges, setActiveNudges] = useState([]);
  const [autoRewards, setAutoRewards] = useState([]);
  const [nudgeEngine] = useState(() => new CircadianNudgeEngine());
  const [userState, setUserState] = useState({});

  useEffect(() => {
    if (user) {
      initializeNudgeSystem();
      
      // Check for opportune moments every 15 minutes
      const nudgeInterval = setInterval(checkOpportuneMoments, 15 * 60 * 1000);
      
      // Check for automatic activities every 5 minutes
      const rewardInterval = setInterval(checkAutomaticActivities, 5 * 60 * 1000);
      
      // Initial checks
      checkOpportuneMoments();
      checkAutomaticActivities();
      
      return () => {
        clearInterval(nudgeInterval);
        clearInterval(rewardInterval);
      };
    }
  }, [user]);

  const initializeNudgeSystem = async () => {
    try {
      // Load user's current habit state
      const healthService = new HealthDataService(user.uid);
      const todayData = await healthService.getTodayStats();
      
      setUserState({
        circadian: todayData.lightExposure?.morningLight || todayData.nutrition?.mealTiming || 0,
        movement: todayData.movement?.breaks || todayData.exercise?.purposeful || 0,
        stress: todayData.hrv?.resilience || todayData.stress?.strategic || 0,
        sleep: todayData.sleep?.brainDetox || todayData.sleep?.environment || 0,
        nutrition: todayData.nutrition?.brainFoods || todayData.nutrition?.nutrientDensity || 0,
        mindset: todayData.mindset?.growth || todayData.social?.quality || 0
      });
      
      nudgeEngine.loadNudgeHistory();
    } catch (error) {
      console.error('Error initializing nudge system:', error);
    }
  };

  const checkOpportuneMoments = () => {
    const opportunities = nudgeEngine.checkOpportuneMoments();
    
    const newNudges = opportunities.map(opportunity => 
      nudgeEngine.generateContextualNudge(opportunity, userState)
    );
    
    if (newNudges.length > 0) {
      setActiveNudges(prev => [...prev, ...newNudges]);
      
      // Record nudges
      newNudges.forEach(nudge => {
        nudgeEngine.recordNudge(nudge.id);
      });
    }
  };

  const checkAutomaticActivities = () => {
    const detectedActivities = nudgeEngine.detectAutomaticActivities();
    
    if (detectedActivities.length > 0) {
      setAutoRewards(prev => [...prev, ...detectedActivities]);
      
      // Auto-log detected activities
      detectedActivities.forEach(activity => {
        autoLogActivity(activity);
      });
    }
  };

  const autoLogActivity = async (activity) => {
    try {
      const healthService = new HealthDataService(user.uid);
      
      const logData = {
        [activity.pillar]: {
          [activity.activity]: activity.autoLogValue,
          autoDetected: true,
          confidence: activity.confidence,
          timestamp: new Date()
        }
      };
      
      await healthService.logHealthData(logData);
      
      // Update user state
      setUserState(prev => ({
        ...prev,
        [activity.pillar]: Math.max(prev[activity.pillar] || 0, activity.autoLogValue)
      }));
      
    } catch (error) {
      console.error('Error auto-logging activity:', error);
    }
  };

  const handleNudgeAction = (nudge) => {
    navigate(nudge.actionButton.route);
    dismissNudge(nudge.id);
  };

  const dismissNudge = (nudgeId) => {
    setActiveNudges(prev => prev.filter(nudge => nudge.id !== nudgeId));
  };

  const dismissReward = (rewardIndex) => {
    setAutoRewards(prev => prev.filter((_, index) => index !== rewardIndex));
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! 🌅";
    if (hour < 17) return "Good afternoon! ☀️";
    return "Good evening! 🌙";
  };

  const getNudgeIcon = (pillar) => {
    const icons = {
      circadian: '🌅',
      movement: '🏃',
      stress: '⚡',
      sleep: '🌙',
      nutrition: '🧠',
      mindset: '🌟'
    };
    return icons[pillar] || '💡';
  };

  return (
    <>
      {/* Opportune Moment Nudges */}
      <AnimatePresence>
        {activeNudges.map((nudge, index) => (
          <motion.div
            key={nudge.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm"
          >
            <div className="bg-white rounded-xl shadow-lg border border-purple-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getNudgeIcon(nudge.pillar)}</span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <SafeIcon icon={FiClock} className="w-3 h-3" />
                    <span>Perfect timing</span>
                  </div>
                </div>
                {nudge.dismissible && (
                  <button
                    onClick={() => dismissNudge(nudge.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-sm text-gray-800 mb-3 leading-relaxed">
                {nudge.contextualMessage}
              </p>

              {nudge.rewardMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                  <p className="text-xs text-green-800">{nudge.rewardMessage}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleNudgeAction(nudge)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
                >
                  {nudge.actionButton.text}
                </button>
                {nudge.dismissible && (
                  <button
                    onClick={() => dismissNudge(nudge.id)}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                  >
                    Later
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Automatic Activity Rewards */}
      <AnimatePresence>
        {autoRewards.map((reward, index) => (
          <motion.div
            key={`reward-${index}`}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            className="fixed top-20 right-4 z-50 max-w-xs"
          >
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl shadow-lg p-4 text-white">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiGift} className="w-5 h-5" />
                  <span className="font-semibold text-sm">Auto-Detected!</span>
                </div>
                <button
                  onClick={() => dismissReward(index)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm mb-2 leading-relaxed">
                {reward.message}
              </p>

              <div className="bg-white/20 rounded-lg p-2 mb-3">
                <p className="text-xs font-medium">{reward.reward}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="bg-white/30 rounded-full px-2 py-1">
                    <span className="text-xs">Confidence: {Math.round(reward.confidence * 100)}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => dismissReward(index)}
                className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
              >
                <SafeIcon icon={FiCheck} className="w-4 h-4" />
                <span>Awesome!</span>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Gentle Time-Based Greeting (appears briefly) */}
      {activeNudges.length === 0 && autoRewards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 left-4 right-4 z-40 mx-auto max-w-sm pointer-events-none"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-3 text-center">
            <p className="text-sm text-gray-700">
              {getTimeBasedGreeting()} Ready to optimize your longevity habits?
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default SmartNudgeSystem;
