import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiActivity, FiHeart, FiSun, FiMoon } = FiIcons;

const PeerTicker = () => {
  const [currentActivity, setCurrentActivity] = useState(0);
  
  const activities = [
    { icon: FiActivity, text: "A peer just completed a 20-minute walk" },
    { icon: FiHeart, text: "Someone finished their morning breath session" },
    { icon: FiSun, text: "A peer logged a healthy breakfast" },
    { icon: FiMoon, text: "Someone completed their evening reflection" },
    { icon: FiActivity, text: "A peer achieved their movement goal" },
    { icon: FiHeart, text: "Someone practiced 10 minutes of meditation" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activities.length]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">Community Activity</h3>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full pulse-dot"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentActivity}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-3"
        >
          <div className="bg-gradient-to-r from-emerald-100 to-blue-100 p-2 rounded-full">
            <SafeIcon 
              icon={activities[currentActivity].icon} 
              className="w-4 h-4 text-emerald-600" 
            />
          </div>
          <p className="text-sm text-gray-700">{activities[currentActivity].text}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PeerTicker;