import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiClock, FiStar, FiPlay, FiCheck, FiMoon, FiActivity, FiHeart } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const VitalityRecommendations = ({ vitalityState }) => {
  const [completedActions, setCompletedActions] = useState(new Set());

  const handleActionComplete = (actionId) => {
    setCompletedActions(prev => new Set([...prev, actionId]));
  };

  const getStateRecommendations = () => {
    const recommendations = {
      recovering: [
        {
          id: 'gentle-walk',
          title: 'Take a Gentle Walk',
          description: 'A 10-15 minute slow walk to promote circulation without stress',
          duration: '10-15 min',
          priority: 'high',
          pillar: 'resilience',
          icon: FiActivity
        },
        {
          id: 'deep-breathing',
          title: 'Practice Deep Breathing',
          description: 'Activate your parasympathetic nervous system for recovery',
          duration: '5 min',
          priority: 'high',
          pillar: 'recovery',
          icon: FiMoon
        },
        {
          id: 'hydrate',
          title: 'Hydrate Mindfully',
          description: 'Drink water slowly and mindfully to support recovery',
          duration: '2 min',
          priority: 'medium',
          pillar: 'fuel',
          icon: FiHeart
        }
      ],
      balanced: [
        {
          id: 'moderate-exercise',
          title: 'Moderate Exercise',
          description: 'A balanced workout that challenges without overwhelming',
          duration: '20-30 min',
          priority: 'high',
          pillar: 'resilience',
          icon: FiActivity
        },
        {
          id: 'mindful-meal',
          title: 'Prepare a Mindful Meal',
          description: 'Focus on nutrition and the joy of preparing healthy food',
          duration: '15-20 min',
          priority: 'medium',
          pillar: 'fuel',
          icon: FiHeart
        },
        {
          id: 'connect-friend',
          title: 'Connect with a Friend',
          description: 'Reach out to someone in your social circle',
          duration: '10-15 min',
          priority: 'medium',
          pillar: 'fuel',
          icon: FiHeart
        }
      ],
      primed: [
        {
          id: 'challenge-workout',
          title: 'Challenge Workout',
          description: 'Push your limits with an intense training session',
          duration: '30-45 min',
          priority: 'high',
          pillar: 'resilience',
          icon: FiActivity
        },
        {
          id: 'tackle-project',
          title: 'Tackle a Big Project',
          description: 'Use your peak state to make progress on important goals',
          duration: '45-60 min',
          priority: 'high',
          pillar: 'resilience',
          icon: FiTarget
        },
        {
          id: 'try-something-new',
          title: 'Try Something New',
          description: 'Learn a new skill or explore a new activity',
          duration: '20-30 min',
          priority: 'medium',
          pillar: 'resilience',
          icon: FiStar
        }
      ]
    };

    return recommendations[vitalityState.overall.name] || recommendations.balanced;
  };

  const getPillarSpecificActions = () => {
    const actions = [];
    
    // Add actions for pillars that need attention
    vitalityState.insights.pillarsNeedingAttention.forEach(pillar => {
      const pillarActions = {
        recovery: [
          {
            id: 'sleep-routine',
            title: 'Optimize Sleep Routine',
            description: 'Set a consistent bedtime and create a relaxing environment',
            duration: '30 min setup',
            priority: 'high',
            pillar: 'recovery',
            icon: FiMoon
          }
        ],
        resilience: [
          {
            id: 'movement-break',
            title: 'Take Movement Breaks',
            description: 'Set reminders for regular movement throughout the day',
            duration: '2-3 min each',
            priority: 'medium',
            pillar: 'resilience',
            icon: FiActivity
          }
        ],
        fuel: [
          {
            id: 'nutrition-planning',
            title: 'Plan Nutritious Meals',
            description: 'Prepare healthy meals and snacks for the day',
            duration: '15-20 min',
            priority: 'medium',
            pillar: 'fuel',
            icon: FiHeart
          }
        ]
      };
      
      if (pillarActions[pillar.name]) {
        actions.push(...pillarActions[pillar.name]);
      }
    });
    
    return actions;
  };

  const getPillarColor = (pillarName) => {
    const colors = {
      recovery: '#F59E0B',
      resilience: '#10B981',
      fuel: '#EF4444'
    };
    return colors[pillarName] || '#6B7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[priority] || colors.medium;
  };

  const stateRecommendations = getStateRecommendations();
  const pillarActions = getPillarSpecificActions();
  const allActions = [...stateRecommendations, ...pillarActions];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Recommended Actions
        </h3>
        <div className="text-sm text-gray-600">
          {completedActions.size} of {allActions.length} completed
        </div>
      </div>

      {/* State-Specific Recommendations */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 flex items-center space-x-2">
          <SafeIcon icon={FiTarget} className="w-4 h-4" />
          <span>For Your Current State</span>
        </h4>
        
        {stateRecommendations.map((action, index) => {
          const isCompleted = completedActions.has(action.id);
          const ActionIcon = action.icon;
          
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-4 border-l-4 ${
                isCompleted ? 'opacity-60' : ''
              }`}
              style={{ borderLeftColor: getPillarColor(action.pillar) }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: getPillarColor(action.pillar) }}
                  >
                    <SafeIcon icon={ActionIcon} className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {action.title}
                      </h5>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(action.priority)}`}>
                        {action.priority}
                      </span>
                    </div>
                    
                    <p className={`text-sm mb-2 ${isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
                      {action.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiClock} className="w-3 h-3" />
                        <span>{action.duration}</span>
                      </div>
                      <div className="capitalize">
                        {action.pillar} pillar
                      </div>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => handleActionComplete(action.id)}
                  disabled={isCompleted}
                  className={`p-2 rounded-full transition-colors ${
                    isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={isCompleted ? FiCheck : FiPlay} className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pillar-Specific Actions */}
      {pillarActions.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center space-x-2">
            <SafeIcon icon={FiStar} className="w-4 h-4" />
            <span>Focus Areas</span>
          </h4>
          
          {pillarActions.map((action, index) => {
            const isCompleted = completedActions.has(action.id);
            const ActionIcon = action.icon;
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (stateRecommendations.length + index) * 0.1 }}
                className={`bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-4 border-l-4 ${
                  isCompleted ? 'opacity-60' : ''
                }`}
                style={{ borderLeftColor: getPillarColor(action.pillar) }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: getPillarColor(action.pillar) }}
                    >
                      <SafeIcon icon={ActionIcon} className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {action.title}
                        </h5>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(action.priority)}`}>
                          {action.priority}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-2 ${isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
                        {action.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiClock} className="w-3 h-3" />
                          <span>{action.duration}</span>
                        </div>
                        <div className="capitalize">
                          {action.pillar} pillar
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => handleActionComplete(action.id)}
                    disabled={isCompleted}
                    className={`p-2 rounded-full transition-colors ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={isCompleted ? FiCheck : FiPlay} className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-purple-800">Today's Progress</h4>
          <span className="text-sm text-purple-600">
            {Math.round((completedActions.size / allActions.length) * 100)}% complete
          </span>
        </div>
        
        <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
          <motion.div
            className="h-2 bg-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedActions.size / allActions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <p className="text-sm text-purple-700">
          {completedActions.size === 0 
            ? "Start with one small action to build momentum"
            : completedActions.size === allActions.length
            ? "Amazing! You've completed all recommended actions today"
            : `Great progress! ${allActions.length - completedActions.size} actions remaining`
          }
        </p>
      </div>
    </div>
  );
};

export default VitalityRecommendations;
