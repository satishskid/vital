import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiHome, FiActivity, FiUsers, FiUser, FiHeart, FiBookOpen, FiBell, FiEdit3, FiSmartphone, FiTrendingUp } = FiIcons;

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/manual-entry', icon: FiEdit3, label: 'Log Data' },
    { path: '/health-apps', icon: FiSmartphone, label: 'Apps' },
    { path: '/camera-hrv', icon: FiActivity, label: 'HRV' },
    { path: '/mind-breath', icon: FiHeart, label: 'Mind' },
    { path: '/social', icon: FiUsers, label: 'Social' },
    { path: '/activity', icon: FiTrendingUp, label: 'Activity' },
    { path: '/profile', icon: FiUser, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-emerald-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
              </motion.div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-8 h-1 bg-emerald-600 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;