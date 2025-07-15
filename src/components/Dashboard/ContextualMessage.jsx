import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { useReminders } from '../../context/ReminderContext';
import { useTime } from '../../context/TimeContext';
import SafeIcon from '../../common/SafeIcon';

const { FiInfo, FiBell, FiSun, FiMoon } = FiIcons;

const ContextualMessage = () => {
  const { contextualMessage } = useReminders();
  const { timeOfDay, sunriseTime, sunsetTime } = useTime();
  
  if (!contextualMessage) return null;
  
  const getMessageIcon = () => {
    if (contextualMessage.includes('HRV')) return FiInfo;
    if (contextualMessage.includes('sun sets')) return FiSun;
    if (contextualMessage.includes('morning')) return FiSun;
    if (contextualMessage.includes('evening') || contextualMessage.includes('wind down')) return FiMoon;
    return FiBell;
  };
  
  const getMessageColor = () => {
    if (timeOfDay === 'morning') return 'from-amber-100 to-yellow-100';
    if (timeOfDay === 'afternoon') return 'from-blue-100 to-cyan-100';
    if (timeOfDay === 'evening') return 'from-orange-100 to-amber-100';
    if (timeOfDay === 'night') return 'from-indigo-100 to-purple-100';
    return 'from-emerald-100 to-teal-100';
  };
  
  const getIconColor = () => {
    if (timeOfDay === 'morning') return 'text-amber-600';
    if (timeOfDay === 'afternoon') return 'text-blue-600';
    if (timeOfDay === 'evening') return 'text-orange-600';
    if (timeOfDay === 'night') return 'text-indigo-600';
    return 'text-emerald-600';
  };
  
  const getSunInfo = () => {
    if (contextualMessage.includes('sun sets')) {
      return ` (${sunsetTime})`;
    }
    if (contextualMessage.includes('morning') && contextualMessage.includes('reset')) {
      return ` (${sunriseTime})`;
    }
    return '';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${getMessageColor()} rounded-xl p-4 mb-4`}
    >
      <div className="flex items-center space-x-3">
        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full">
          <SafeIcon icon={getMessageIcon()} className={`w-5 h-5 ${getIconColor()}`} />
        </div>
        <p className="text-sm text-gray-700">
          {contextualMessage}
          <span className="text-xs font-medium">{getSunInfo()}</span>
        </p>
      </div>
    </motion.div>
  );
};

export default ContextualMessage;