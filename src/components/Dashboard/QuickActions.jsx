import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiSun, FiActivity, FiZap, FiMoon, FiBrain, FiSmile, FiEdit3 } = FiIcons;

const QuickActions = ({ showWhyCard }) => {
  const navigate = useNavigate();

  // Actions aligned with six neuroscience-backed longevity habits
  const longevityActions = [
    {
      habit: 'Circadian Rhythm',
      color: 'from-yellow-400 to-orange-500',
      icon: FiSun,
      label: 'Light & Timing',
      description: 'Circadian optimization',
      action: () => navigate('/circadian-tracking')
    },
    {
      habit: 'Intentional Movement',
      color: 'from-green-400 to-emerald-500',
      icon: FiActivity,
      label: 'Move & Think',
      description: 'Cognitive movement',
      action: () => navigate('/activity')
    },
    {
      habit: 'Controlled Stress',
      color: 'from-red-400 to-pink-500',
      icon: FiZap,
      label: 'Stress & Recover',
      description: 'HRV resilience',
      action: () => navigate('/camera-hrv')
    },
    {
      habit: 'Quality Sleep',
      color: 'from-indigo-400 to-purple-500',
      icon: FiMoon,
      label: 'Brain Detox',
      description: 'Sleep optimization',
      action: () => navigate('/sleep-tracking')
    },
    {
      habit: 'Nutrient Dense',
      color: 'from-emerald-400 to-teal-500',
      icon: FiBrain,
      label: 'Brain Food',
      description: 'Nutrient tracking',
      action: () => navigate('/manual-entry')
    },
    {
      habit: 'Self Narrative',
      color: 'from-pink-400 to-rose-500',
      icon: FiSmile,
      label: 'Mindset',
      description: 'Positive narrative',
      action: () => navigate('/social')
    }
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Longevity Habits</h3>
        <span className="text-xs text-gray-500">Brain Renewal</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {longevityActions.map((action, index) => (
          <motion.button
            key={index}
            onClick={action.action}
            className={`bg-gradient-to-r ${action.color} text-white p-3 rounded-lg flex flex-col items-center space-y-1 hover:opacity-90 transition-opacity`}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SafeIcon icon={action.icon} className="w-5 h-5" />
            <span className="text-xs font-bold">{action.label}</span>
            <span className="text-xs opacity-90">{action.description}</span>
          </motion.button>
        ))}
      </div>

      {/* Educational Note */}
      <div className="mt-3 p-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
        <p className="text-xs text-purple-700 text-center font-medium">
          🧠 Six neuroscience-backed habits for biological age reversal and brain renewal
        </p>
      </div>
    </div>
  );
};

export default QuickActions;