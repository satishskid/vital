import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/FirebaseAuthContext';

const { FiActivity, FiHeart, FiSun, FiMoon, FiUsers } = FiIcons;

const PeerTicker = ({ socialConnections = [] }) => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const { user } = useAuth();

  // Only show real peer activities if user has social connections
  const hasRealConnections = socialConnections && socialConnections.length > 0;

  // Real activities from social connections (when available)
  const realActivities = socialConnections.map(connection => ({
    icon: FiActivity,
    text: `${connection.first_name} is staying active today`,
    isReal: true
  }));

  // Fallback to motivational community messages (not fake peer data)
  const communityMessages = [
    { icon: FiUsers, text: "Join the Vita community to see peer activity", isReal: false },
    { icon: FiHeart, text: "Connect with friends to share your wellness journey", isReal: false },
    { icon: FiSun, text: "Build your social circle for better health outcomes", isReal: false }
  ];

  const activities = hasRealConnections ? realActivities : communityMessages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activities.length]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">
          {hasRealConnections ? 'Your Circle' : 'Community'}
        </h3>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${hasRealConnections ? 'bg-green-500 pulse-dot' : 'bg-gray-400'}`}></div>
          <span className="text-xs text-gray-500">
            {hasRealConnections ? 'Live' : 'Connect'}
          </span>
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