import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/FirebaseAuthContext';
import HealthDataService from '../../services/HealthDataService';

const { FiClock, FiTarget, FiInfo, FiX, FiCheck } = FiIcons;

const HabitNudgeDisplay = ({ nudges, onNudgeAction, onNudgeDismiss }) => {
  const { user } = useAuth();
  const [expandedNudge, setExpandedNudge] = useState(null);
  const [logging, setLogging] = useState(false);

  if (!nudges || nudges.length === 0) {
    return null;
  }

  const handleQuickLog = async (nudge, option) => {
    if (!user) return;
    
    setLogging(true);
    try {
      const healthService = new HealthDataService(user.uid);
      
      // Log the habit data
      const logData = {
        [nudge.habitId]: {
          score: option.value,
          activity: option.label,
          timestamp: new Date(),
          nudgeTriggered: true,
          nudgeId: nudge.id
        }
      };

      await healthService.logHealthData(logData);
      
      // Notify parent component
      if (onNudgeAction) {
        onNudgeAction(nudge, 'logged', option);
      }
      
      setExpandedNudge(null);
      
    } catch (error) {
      console.error('Error logging from nudge:', error);
    } finally {
      setLogging(false);
    }
  };

  const handleDismiss = (nudge) => {
    if (onNudgeDismiss) {
      onNudgeDismiss(nudge);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-blue-500 to-purple-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getHabitColor = (habitId) => {
    const colors = {
      circadian: 'from-yellow-400 to-orange-500',
      movement: 'from-green-400 to-emerald-500',
      stress: 'from-red-400 to-pink-500',
      sleep: 'from-purple-400 to-indigo-500',
      nutrition: 'from-green-400 to-teal-500',
      mindset: 'from-pink-400 to-rose-500'
    };
    return colors[habitId] || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
          <SafeIcon icon={FiTarget} className="w-4 h-4 text-purple-600" />
          <span>Smart Nudges</span>
        </h3>
        <span className="text-xs text-gray-500">
          {nudges.length} suggestion{nudges.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {nudges.map((nudge, index) => (
          <motion.div
            key={nudge.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* Nudge Header */}
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getPriorityColor(nudge.priority)}`} />
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {nudge.timing} • {nudge.priority}
                    </span>
                    <SafeIcon icon={FiClock} className="w-3 h-3 text-gray-400" />
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    {nudge.title}
                  </h4>
                  
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {nudge.message}
                  </p>
                </div>
                
                <button
                  onClick={() => handleDismiss(nudge)}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => setExpandedNudge(expandedNudge === nudge.id ? null : nudge.id)}
                  className={`flex-1 bg-gradient-to-r ${getHabitColor(nudge.habitId)} text-white py-2 px-3 rounded-lg text-xs font-medium hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-1`}
                >
                  <SafeIcon icon={FiTarget} className="w-3 h-3" />
                  <span>{nudge.action}</span>
                </button>
                
                <button
                  onClick={() => alert(nudge.science)}
                  className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Learn the science"
                >
                  <SafeIcon icon={FiInfo} className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Expanded Quick Log Options */}
            <AnimatePresence>
              {expandedNudge === nudge.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-200 bg-gray-50"
                >
                  <div className="p-3">
                    {/* Science Tip */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                      <p className="text-xs text-purple-800 leading-relaxed">
                        🧠 <strong>Science:</strong> {nudge.science}
                      </p>
                    </div>

                    {/* Quick Log Options */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Quick log your progress:
                      </p>
                      
                      {nudge.quickOptions?.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleQuickLog(nudge, option)}
                          disabled={logging}
                          className="w-full bg-white hover:bg-gray-50 border border-gray-200 p-3 rounded-lg text-left transition-colors disabled:opacity-50 flex items-center space-x-3"
                        >
                          <span className="text-lg">{option.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">{option.label}</div>
                            <div className="text-xs text-gray-600">{option.value}% completion</div>
                          </div>
                          {logging && (
                            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Reflect & Act */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">
                          <strong>LEARN → REFLECT → LOG → REFLECT → ACT → LEARN</strong>
                        </p>
                        <p className="text-xs text-gray-500">
                          Complete the cycle for lasting habit formation
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Nudge Philosophy */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 mt-4">
        <div className="flex items-center space-x-2 mb-2">
          <SafeIcon icon={FiTarget} className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-800">Smart Nudge Philosophy</span>
        </div>
        <p className="text-xs text-purple-700 leading-relaxed">
          These nudges are timed based on neuroscience research to optimize your circadian rhythm, 
          cognitive function, and habit formation. Each suggestion connects directly to your habit tracking 
          for seamless progress logging.
        </p>
      </div>
    </div>
  );
};

export default HabitNudgeDisplay;
