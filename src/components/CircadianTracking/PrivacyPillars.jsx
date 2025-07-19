import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHeart, FiUsers, FiSmile, FiZap, FiTarget, FiShield,
  FiPlus, FiCheck, FiStar, FiTrendingUp, FiActivity
} from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const PrivacyPillars = ({ onLogActivity, todayLogs = {}, notificationData = {} }) => {
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [achievements, setAchievements] = useState([]);

  // Privacy-first pillars (not time-dependent)
  const privacyPillars = {
    selfTalk: {
      name: 'Positive Self-Narrative',
      icon: FiTarget,
      color: '#EC4899',
      privacy: 'high',
      description: 'Inner dialogue & mindset',
      quickActions: [
        { label: 'Gratitude moment', value: 'gratitude', emoji: '🙏' },
        { label: 'Self-compassion', value: 'compassion', emoji: '💝' },
        { label: 'Positive affirmation', value: 'affirmation', emoji: '✨' },
        { label: 'Mindful breathing', value: 'breathing', emoji: '🧘' }
      ]
    },
    socialConnect: {
      name: 'Social Connection',
      icon: FiUsers,
      color: '#06B6D4',
      privacy: 'medium',
      description: 'Meaningful relationships',
      quickActions: [
        { label: 'Quality conversation', value: 'conversation', emoji: '💬' },
        { label: 'Helped someone', value: 'helping', emoji: '🤝' },
        { label: 'Shared laughter', value: 'laughter', emoji: '😄' },
        { label: 'Physical affection', value: 'affection', emoji: '🤗' }
      ]
    },
    meTime: {
      name: 'Intentional Me-Time',
      icon: FiHeart,
      color: '#8B5CF6',
      privacy: 'high',
      description: 'Self-care & hobbies',
      quickActions: [
        { label: 'Creative activity', value: 'creative', emoji: '🎨' },
        { label: 'Reading/Learning', value: 'learning', emoji: '📚' },
        { label: 'Nature time', value: 'nature', emoji: '🌿' },
        { label: 'Music/Art', value: 'art', emoji: '🎵' }
      ]
    },
    stressResilience: {
      name: 'Controlled Stress',
      icon: FiZap,
      color: '#F59E0B',
      privacy: 'low',
      description: 'Beneficial stress exposure',
      quickActions: [
        { label: 'Cold exposure', value: 'cold', emoji: '🧊' },
        { label: 'Exercise challenge', value: 'exercise', emoji: '💪' },
        { label: 'Learning challenge', value: 'challenge', emoji: '🧠' },
        { label: 'Breathing exercise', value: 'breathwork', emoji: '🌬️' }
      ]
    }
  };

  // Check for notification-based achievements
  useEffect(() => {
    checkNotificationAchievements();
  }, [notificationData]);

  const checkNotificationAchievements = () => {
    const newAchievements = [];

    // Social connection from notifications (UbiFit Garden style)
    if (notificationData.socialActivity?.calls > 0) {
      newAchievements.push({
        pillar: 'socialConnect',
        type: 'call',
        message: `📞 ${notificationData.socialActivity.calls} meaningful calls detected!`,
        autoLog: { action: 'conversation', source: 'notification' }
      });
    }

    if (notificationData.socialActivity?.messages > 5) {
      newAchievements.push({
        pillar: 'socialConnect',
        type: 'messages',
        message: `💬 Active social engagement detected!`,
        autoLog: { action: 'conversation', source: 'notification' }
      });
    }

    // Stress resilience from activity patterns
    if (notificationData.activitySpikes?.detected) {
      newAchievements.push({
        pillar: 'stressResilience',
        type: 'activity',
        message: `💪 Beneficial stress activity detected!`,
        autoLog: { action: 'exercise', source: 'activity_spike' }
      });
    }

    setAchievements(newAchievements);
  };

  const handleQuickLog = (pillar, action) => {
    const logData = {
      pillar: pillar,
      action: action.value,
      emoji: action.emoji,
      timestamp: new Date(),
      privacy: privacyPillars[pillar].privacy,
      manual: true
    };

    onLogActivity(pillar, logData);
    setShowQuickLog(false);
    setSelectedPillar(null);

    // Show achievement feedback
    showAchievementFeedback(pillar, action);
  };

  const showAchievementFeedback = (pillar, action) => {
    // Create positive reinforcement based on pillar
    const messages = {
      selfTalk: `✨ Beautiful! Your positive self-narrative is strengthening your neural pathways.`,
      socialConnect: `🤗 Wonderful! Social connections boost longevity and happiness.`,
      meTime: `🌟 Perfect! Self-care time enhances your overall well-being.`,
      stressResilience: `💪 Excellent! Controlled stress builds resilience and vitality.`
    };

    // Could trigger a brief celebration animation
    console.log(messages[pillar]);
  };

  const getPillarStats = (pillar) => {
    const logs = todayLogs[pillar] || [];
    return {
      count: logs.length,
      lastAction: logs[logs.length - 1]?.action || null,
      streak: calculateStreak(logs)
    };
  };

  const calculateStreak = (logs) => {
    // Simple streak calculation - could be enhanced
    return logs.length > 0 ? Math.min(logs.length, 7) : 0;
  };

  return (
    <div className="space-y-4">
      {/* Privacy Pillars Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
          <SafeIcon icon={FiShield} className="w-5 h-5 text-purple-500" />
          <span>Personal Wellness</span>
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Privacy-First
        </span>
      </div>

      {/* Notification-Based Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-2">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SafeIcon 
                    icon={privacyPillars[achievement.pillar].icon} 
                    className="w-4 h-4 text-green-600" 
                  />
                  <span className="text-sm font-medium text-green-800">
                    {achievement.message}
                  </span>
                </div>
                <button
                  onClick={() => handleQuickLog(achievement.pillar, achievement.autoLog)}
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Auto-Log
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Privacy Pillars Grid */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(privacyPillars).map(([key, pillar]) => {
          const stats = getPillarStats(key);
          
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-all"
              onClick={() => {
                setSelectedPillar(key);
                setShowQuickLog(true);
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${pillar.color}20` }}
                >
                  <SafeIcon 
                    icon={pillar.icon} 
                    className="w-5 h-5"
                    style={{ color: pillar.color }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">{pillar.name}</h4>
                  <p className="text-xs text-gray-600">{pillar.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Today: {stats.count} {stats.count === 1 ? 'entry' : 'entries'}
                </span>
                {stats.streak > 0 && (
                  <div className="flex items-center space-x-1 text-orange-600">
                    <SafeIcon icon={FiStar} className="w-3 h-3" />
                    <span>{stats.streak}d</span>
                  </div>
                )}
              </div>

              {/* Quick Add Button */}
              <div className="mt-3 flex items-center justify-center">
                <SafeIcon icon={FiPlus} className="w-4 h-4 text-gray-400" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Log Modal */}
      <AnimatePresence>
        {showQuickLog && selectedPillar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQuickLog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div 
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${privacyPillars[selectedPillar].color}20` }}
                >
                  <SafeIcon 
                    icon={privacyPillars[selectedPillar].icon} 
                    className="w-8 h-8"
                    style={{ color: privacyPillars[selectedPillar].color }}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {privacyPillars[selectedPillar].name}
                </h3>
                <p className="text-sm text-gray-600">
                  {privacyPillars[selectedPillar].description}
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {privacyPillars[selectedPillar].quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickLog(selectedPillar, action)}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{action.emoji}</span>
                      <span className="font-medium text-gray-800">{action.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowQuickLog(false)}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrivacyPillars;
