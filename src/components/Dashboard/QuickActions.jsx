import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiActivity, FiHeart, FiPlus, FiCoffee } = FiIcons;

const QuickActions = ({ showWhyCard }) => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: FiActivity,
      label: 'HRV Check',
      color: 'bg-blue-500',
      action: () => navigate('/hrv')
    },
    {
      icon: FiHeart,
      label: 'Breathwork',
      color: 'bg-purple-500',
      action: () => navigate('/mind-breath')
    },
    {
      icon: FiCoffee,
      label: 'Log Meal',
      color: 'bg-emerald-500',
      action: () => showWhyCard({
        title: 'Meal Logging',
        content: 'Mindful eating and tracking helps build awareness of how different foods affect your energy, mood, and overall well-being.',
        source: 'Mindful Eating Research (2019)'
      })
    },
    {
      icon: FiPlus,
      label: 'Quick Log',
      color: 'bg-orange-500',
      action: () => showWhyCard({
        title: 'Quick Logging',
        content: 'Regular check-ins with yourself help build self-awareness and identify patterns in your health journey.',
        source: 'Self-Monitoring Research (2020)'
      })
    }
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            onClick={action.action}
            className={`${action.color} text-white p-4 rounded-xl flex flex-col items-center space-y-2 hover:opacity-90 transition-opacity`}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SafeIcon icon={action.icon} className="w-6 h-6" />
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;