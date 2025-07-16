import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPlus, FiX, FiClock, FiHeart, FiInfo, FiCheck } = FiIcons;

const SelfConnectionManager = ({ onClose, onActivityAdded, socialManager, showWhyCard }) => {
  const [step, setStep] = useState('choose'); // 'choose', 'hobby', 'me_time', 'log_activity'
  const [selectedHobby, setSelectedHobby] = useState(null);
  const [selectedMeTime, setSelectedMeTime] = useState(null);
  const [activityData, setActivityData] = useState({
    duration: 30,
    quality: 'good',
    mood: 'neutral',
    notes: '',
    benefits: []
  });

  const hobbyCategories = [
    { id: 'creative', label: 'Creative Arts', icon: '🎨', activities: [
      { id: 'painting', name: 'Painting', icon: '🎨' },
      { id: 'drawing', name: 'Drawing', icon: '✏️' },
      { id: 'writing', name: 'Writing', icon: '✍️' },
      { id: 'photography', name: 'Photography', icon: '📸' },
      { id: 'music', name: 'Music', icon: '🎵' },
      { id: 'crafting', name: 'Crafting', icon: '🧵' }
    ]},
    { id: 'physical', label: 'Physical Activities', icon: '🏃', activities: [
      { id: 'yoga', name: 'Yoga', icon: '🧘' },
      { id: 'dancing', name: 'Dancing', icon: '💃' },
      { id: 'hiking', name: 'Hiking', icon: '🥾' },
      { id: 'cycling', name: 'Cycling', icon: '🚴' },
      { id: 'swimming', name: 'Swimming', icon: '🏊' },
      { id: 'running', name: 'Running', icon: '🏃' }
    ]},
    { id: 'intellectual', label: 'Learning & Growth', icon: '📚', activities: [
      { id: 'reading', name: 'Reading', icon: '📖' },
      { id: 'studying', name: 'Studying', icon: '📝' },
      { id: 'puzzles', name: 'Puzzles', icon: '🧩' },
      { id: 'languages', name: 'Languages', icon: '🗣️' },
      { id: 'coding', name: 'Coding', icon: '💻' },
      { id: 'research', name: 'Research', icon: '🔍' }
    ]},
    { id: 'mindful', label: 'Mindfulness & Wellness', icon: '🧘', activities: [
      { id: 'meditation', name: 'Meditation', icon: '🧘' },
      { id: 'journaling', name: 'Journaling', icon: '📔' },
      { id: 'breathing', name: 'Breathing Exercises', icon: '💨' },
      { id: 'stretching', name: 'Stretching', icon: '🤸' },
      { id: 'spa', name: 'Self-Care/Spa', icon: '🛁' },
      { id: 'reflection', name: 'Reflection', icon: '💭' }
    ]},
    { id: 'nature', label: 'Nature & Outdoors', icon: '🌱', activities: [
      { id: 'gardening', name: 'Gardening', icon: '🌱' },
      { id: 'birdwatching', name: 'Birdwatching', icon: '🦅' },
      { id: 'camping', name: 'Camping', icon: '⛺' },
      { id: 'fishing', name: 'Fishing', icon: '🎣' },
      { id: 'astronomy', name: 'Stargazing', icon: '⭐' },
      { id: 'nature_walk', name: 'Nature Walks', icon: '🌲' }
    ]}
  ];

  const wellnessBenefits = [
    { id: 'stress_relief', label: 'Stress Relief', icon: '😌' },
    { id: 'creativity', label: 'Enhanced Creativity', icon: '💡' },
    { id: 'focus', label: 'Improved Focus', icon: '🎯' },
    { id: 'mood', label: 'Better Mood', icon: '😊' },
    { id: 'energy', label: 'More Energy', icon: '⚡' },
    { id: 'confidence', label: 'Confidence Boost', icon: '💪' },
    { id: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { id: 'accomplishment', label: 'Sense of Achievement', icon: '🏆' }
  ];

  const handleInfoClick = () => {
    showWhyCard({
      title: 'Self-Connection & Mental Health',
      content: 'Engaging in hobbies and personal time reduces stress hormones by up to 75%, improves cognitive function, and enhances overall life satisfaction. Regular self-connection activities are as important as social connections for mental wellness.',
      source: 'American Journal of Health Promotion (2016)'
    });
  };

  const handleAddHobby = async (activity) => {
    try {
      const hobbyData = {
        name: activity.name,
        category: activity.category,
        icon: activity.icon,
        description: `${activity.name} - A ${activity.category} activity for personal wellness`,
        benefits: []
      };
      
      const newHobby = await socialManager.addHobby(hobbyData);
      setSelectedHobby(newHobby);
      setStep('log_activity');
    } catch (error) {
      console.error('Error adding hobby:', error);
    }
  };

  const handleAddMeTime = async () => {
    try {
      const meTime = await socialManager.addMeTime();
      setSelectedMeTime(meTime);
      setStep('log_activity');
    } catch (error) {
      console.error('Error adding me time:', error);
    }
  };

  const handleLogActivity = async () => {
    try {
      const contact = selectedHobby || selectedMeTime;
      const logData = {
        contactId: contact.id,
        contactName: contact.name,
        type: selectedHobby ? 'hobby_time' : 'me_time',
        duration: activityData.duration,
        quality: activityData.quality,
        mood: activityData.mood,
        notes: activityData.notes,
        benefits: activityData.benefits
      };

      await socialManager.logSelfActivity(logData);
      onActivityAdded?.(logData);
      onClose();
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const toggleBenefit = (benefitId) => {
    setActivityData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefitId)
        ? prev.benefits.filter(b => b !== benefitId)
        : [...prev.benefits, benefitId]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'choose' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Self-Connection Activities</h3>
              <motion.button
                onClick={handleInfoClick}
                className="bg-blue-100 text-blue-600 p-2 rounded-full"
                whileTap={{ scale: 0.9 }}
              >
                <SafeIcon icon={FiInfo} className="w-4 h-4" />
              </motion.button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Track time spent on hobbies and personal wellness activities to maintain a healthy balance.
            </p>

            <div className="space-y-3">
              <motion.button
                onClick={() => setStep('hobby')}
                className="w-full bg-purple-500 text-white py-4 rounded-lg font-medium flex items-center justify-center space-x-3"
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">🎨</span>
                <div className="text-left">
                  <div className="font-semibold">Add Hobby/Passion</div>
                  <div className="text-sm opacity-90">Creative, physical, intellectual activities</div>
                </div>
              </motion.button>

              <motion.button
                onClick={handleAddMeTime}
                className="w-full bg-green-500 text-white py-4 rounded-lg font-medium flex items-center justify-center space-x-3"
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">🧘</span>
                <div className="text-left">
                  <div className="font-semibold">Log Me Time</div>
                  <div className="text-sm opacity-90">Private personal wellness time</div>
                </div>
              </motion.button>

              <motion.button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        )}

        {step === 'hobby' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Choose Your Hobby</h3>
              <motion.button
                onClick={() => setStep('choose')}
                className="text-gray-500 p-1"
                whileTap={{ scale: 0.9 }}
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              {hobbyCategories.map(category => (
                <div key={category.id}>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.activities.map(activity => (
                      <motion.button
                        key={activity.id}
                        onClick={() => handleAddHobby({ ...activity, category: category.id })}
                        className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg text-left transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{activity.icon}</span>
                          <span className="text-sm font-medium text-gray-800">{activity.name}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'log_activity' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Log Activity Time</h3>
              <motion.button
                onClick={() => setStep('choose')}
                className="text-gray-500 p-1"
                whileTap={{ scale: 0.9 }}
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{(selectedHobby || selectedMeTime)?.icon}</div>
              <h4 className="font-semibold text-gray-800">{(selectedHobby || selectedMeTime)?.name}</h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="5"
                    max="180"
                    step="5"
                    value={activityData.duration}
                    onChange={(e) => setActivityData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-600 w-12">{activityData.duration}m</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How did it feel?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['poor', 'okay', 'good', 'excellent'].map(quality => (
                    <motion.button
                      key={quality}
                      onClick={() => setActivityData(prev => ({ ...prev, quality }))}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        activityData.quality === quality
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits experienced (optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {wellnessBenefits.map(benefit => (
                    <motion.button
                      key={benefit.id}
                      onClick={() => toggleBenefit(benefit.id)}
                      className={`p-2 rounded-lg text-xs transition-colors ${
                        activityData.benefits.includes(benefit.id)
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{benefit.icon}</span>
                        <span>{benefit.label}</span>
                        {activityData.benefits.includes(benefit.id) && (
                          <SafeIcon icon={FiCheck} className="w-3 h-3" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <motion.button
                  onClick={handleLogActivity}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
                  whileTap={{ scale: 0.95 }}
                >
                  Log Activity
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SelfConnectionManager;
