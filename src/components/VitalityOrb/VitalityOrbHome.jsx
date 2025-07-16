import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiRefreshCw, FiTrendingUp, FiCalendar, FiTarget } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import VitalityOrb from './VitalityOrb';
import VitalityInsights from './VitalityInsights';
import VitalityRecommendations from './VitalityRecommendations';

const VitalityOrbHome = ({ healthData, onThemeToggle }) => {
  const [vitalityState, setVitalityState] = useState(null);
  const [showInsights, setShowInsights] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleStateChange = (newState) => {
    setVitalityState(newState);
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // Trigger orb refresh by updating a key or calling refresh method
  };

  const getBackgroundGradient = () => {
    if (!vitalityState) {
      return 'from-purple-100 via-pink-50 to-indigo-100';
    }

    const gradients = {
      recovering: 'from-amber-50 via-yellow-50 to-orange-100',
      balanced: 'from-emerald-50 via-green-50 to-teal-100',
      primed: 'from-violet-50 via-purple-50 to-indigo-100'
    };

    return gradients[vitalityState.overall.name] || gradients.balanced;
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diff = now - lastUpdated;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return lastUpdated.toLocaleDateString();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000`}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Vitality</h1>
            <p className="text-gray-600 text-sm">
              Last updated {formatLastUpdated()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={handleRefresh}
              className="p-2 bg-white bg-opacity-70 backdrop-blur-sm rounded-full shadow-sm"
              whileTap={{ scale: 0.95, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <SafeIcon icon={FiRefreshCw} className="w-5 h-5 text-gray-700" />
            </motion.button>
            
            <motion.button
              onClick={onThemeToggle}
              className="p-2 bg-white bg-opacity-70 backdrop-blur-sm rounded-full shadow-sm"
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiSettings} className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>
        </div>

        {/* Quick Stats */}
        {vitalityState && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-gray-800">
                {vitalityState.score}
              </div>
              <div className="text-xs text-gray-600">Overall</div>
            </div>
            
            <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-yellow-600">
                {Math.round(vitalityState.pillars.recovery.score)}
              </div>
              <div className="text-xs text-gray-600">Recovery</div>
            </div>
            
            <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">
                {Math.round(vitalityState.pillars.resilience.score)}
              </div>
              <div className="text-xs text-gray-600">Resilience</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Vitality Orb */}
      <div className="px-6">
        <VitalityOrb 
          healthData={healthData}
          onStateChange={handleStateChange}
        />
      </div>

      {/* Action Buttons */}
      {vitalityState && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-6 mt-8"
        >
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={() => setShowInsights(!showInsights)}
              className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center space-x-2"
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Insights</span>
            </motion.button>
            
            <motion.button
              className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center space-x-2"
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={FiTarget} className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Goals</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Insights Panel */}
      <AnimatePresence>
        {showInsights && vitalityState && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 mt-6 overflow-hidden"
          >
            <VitalityInsights vitalityState={vitalityState} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations */}
      {vitalityState && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="px-6 mt-6 pb-24"
        >
          <VitalityRecommendations vitalityState={vitalityState} />
        </motion.div>
      )}

      {/* Floating Theme Toggle Hint */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-20 right-4 bg-gray-800 bg-opacity-80 text-white text-xs px-3 py-2 rounded-full"
      >
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiSettings} className="w-3 h-3" />
          <span>Switch to standard view</span>
        </div>
      </motion.div>
    </div>
  );
};

export default VitalityOrbHome;
