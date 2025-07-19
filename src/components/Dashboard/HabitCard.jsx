import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/FirebaseAuthContext';
import HealthDataService from '../../services/HealthDataService';

const { FiPlus, FiCheck, FiX, FiInfo } = FiIcons;

const HabitCard = ({ pillar, status, score, index, onHabitLogged }) => {
  const { user } = useAuth();
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [logging, setLogging] = useState(false);

  const getQuickLogOptions = () => {
    const options = {
      circadian: [
        { value: 90, label: '20+ min morning light', icon: '🌅' },
        { value: 75, label: '10-15 min morning light', icon: '☀️' },
        { value: 60, label: '5-10 min morning light', icon: '🌤️' },
        { value: 40, label: 'Some light exposure', icon: '💡' }
      ],
      movement: [
        { value: 90, label: 'Intense workout', icon: '💪' },
        { value: 75, label: 'Moderate exercise', icon: '🏃' },
        { value: 60, label: 'Light activity', icon: '🚶' },
        { value: 40, label: 'Movement breaks', icon: '🤸' }
      ],
      stress: [
        { value: 90, label: 'Cold exposure + recovery', icon: '❄️' },
        { value: 75, label: 'Meditation session', icon: '🧘' },
        { value: 60, label: 'Breathing exercise', icon: '🌬️' },
        { value: 40, label: 'Stress awareness', icon: '💭' }
      ],
      sleep: [
        { value: 90, label: '8+ hours quality sleep', icon: '😴' },
        { value: 75, label: '7-8 hours good sleep', icon: '🌙' },
        { value: 60, label: '6-7 hours fair sleep', icon: '😊' },
        { value: 40, label: '5-6 hours poor sleep', icon: '😵' }
      ],
      nutrition: [
        { value: 90, label: 'Brain foods + fasting', icon: '🧠' },
        { value: 75, label: 'Nutrient-dense meals', icon: '🥗' },
        { value: 60, label: 'Balanced nutrition', icon: '🍎' },
        { value: 40, label: 'Some healthy choices', icon: '🥕' }
      ],
      mindset: [
        { value: 90, label: 'Growth mindset + gratitude', icon: '🌟' },
        { value: 75, label: 'Positive self-talk', icon: '💭' },
        { value: 60, label: 'Mindful awareness', icon: '🎯' },
        { value: 40, label: 'Some reflection', icon: '💡' }
      ]
    };
    return options[pillar.id] || [];
  };

  const logHabit = async (value, label) => {
    if (!user) return;
    
    setLogging(true);
    try {
      const healthService = new HealthDataService(user.uid);
      
      // Map pillar to data structure
      const logData = {
        [pillar.id]: {
          score: value,
          activity: label,
          timestamp: new Date(),
          quickLogged: true
        }
      };

      await healthService.logHealthData(logData);
      
      // Show success feedback
      setShowQuickLog(false);
      if (onHabitLogged) {
        onHabitLogged();
      }
      
    } catch (error) {
      console.error('Error logging habit:', error);
    } finally {
      setLogging(false);
    }
  };

  const getEducationalTip = () => {
    const tips = {
      circadian: "🧠 Morning light exposure within 2 hours of waking sets your circadian clock and optimizes hormone production for the entire day.",
      movement: "🧠 Intentional movement breaks every 30-60 minutes enhance cognitive function and promote neuroplasticity.",
      stress: "🧠 Controlled stress exposure followed by recovery builds resilience and strengthens your stress response system.",
      sleep: "🧠 Quality sleep activates the glymphatic system, clearing brain toxins and consolidating memories for optimal brain health.",
      nutrition: "🧠 Brain-supporting foods rich in omega-3s and antioxidants fuel neuroplasticity and protect against cognitive decline.",
      mindset: "🧠 A positive self-narrative and growth mindset literally rewire your brain for resilience and continued learning."
    };
    return tips[pillar.id] || "";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-xl p-4 shadow-sm relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-5`} />
        
        {/* Card content */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className={`bg-gradient-to-r ${pillar.color} p-2 rounded-lg`}>
              <SafeIcon icon={pillar.icon} className="w-6 h-6 text-white" />
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
              {status.text}
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-800 text-sm mb-1">{pillar.name}</h3>
          <p className="text-xs text-gray-600 mb-3">{pillar.description}</p>
          
          {/* Progress bar */}
          {score > 0 && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${pillar.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">{score}%</span>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowQuickLog(true)}
              className={`flex-1 bg-gradient-to-r ${pillar.color} text-white py-2 px-3 rounded-lg text-xs font-medium hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-1`}
            >
              <SafeIcon icon={FiPlus} className="w-3 h-3" />
              <span>Log Now</span>
            </button>
            
            <button
              onClick={() => alert(getEducationalTip())}
              className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <SafeIcon icon={FiInfo} className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Log Modal */}
      <AnimatePresence>
        {showQuickLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowQuickLog(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`bg-gradient-to-r ${pillar.color} p-2 rounded-lg`}>
                    <SafeIcon icon={pillar.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{pillar.name}</h3>
                    <p className="text-xs text-gray-600">Quick log your progress</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuickLog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>

              {/* Educational tip */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-purple-800 leading-relaxed">
                  {getEducationalTip()}
                </p>
              </div>

              {/* Quick log options */}
              <div className="space-y-2">
                {getQuickLogOptions().map((option, index) => (
                  <button
                    key={index}
                    onClick={() => logHabit(option.value, option.label)}
                    disabled={logging}
                    className="w-full bg-gray-50 hover:bg-gray-100 p-3 rounded-lg text-left transition-colors disabled:opacity-50 flex items-center space-x-3"
                  >
                    <span className="text-lg">{option.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.value}% completion</div>
                    </div>
                    {logging && <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />}
                  </button>
                ))}
              </div>

              {/* Reflect & Act section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center mb-2">
                  <strong>REFLECT:</strong> How does this habit make you feel?
                </p>
                <p className="text-xs text-gray-600 text-center">
                  <strong>ACT:</strong> What will you do next to improve?
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HabitCard;
