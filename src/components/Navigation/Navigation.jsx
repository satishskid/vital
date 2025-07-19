import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiHome, FiSun, FiActivity, FiZap, FiMoon, FiBrain, FiSmile, FiEdit3, FiUser } = FiIcons;

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation aligned with neuroscience-backed longevity habits
  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/circadian-tracking', icon: FiSun, label: 'My Health', habit: 'circadian' },
    { path: '/health-metrics', icon: FiEdit3, label: 'Learn & Log' },
    { path: '/self-connect', icon: FiSmile, label: 'Self Connect', habit: 'mindset' },
    { path: '/profile', icon: FiUser, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-50">
      <div className="px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            // Longevity habit-specific colors for educational consistency
            const getHabitColor = (habit) => {
              switch(habit) {
                case 'circadian': return 'text-yellow-600';
                case 'movement': return 'text-green-600';
                case 'mindset': return 'text-pink-600';
                default: return 'text-emerald-600';
              }
            };

            const getHabitBg = (habit) => {
              switch(habit) {
                case 'circadian': return 'bg-yellow-600';
                case 'movement': return 'bg-green-600';
                case 'mindset': return 'bg-pink-600';
                default: return 'bg-emerald-600';
              }
            };

            const activeColor = item.habit ? getHabitColor(item.habit) : 'text-emerald-600';
            const activeBg = item.habit ? getHabitBg(item.habit) : 'bg-emerald-600';

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                  isActive ? activeColor : 'text-gray-500 hover:text-gray-700'
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
                    className={`absolute -top-1 w-8 h-1 ${activeBg} rounded-full`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* GreyBrain.ai Branding */}
      <div className="px-4 pb-2 pt-1 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Made by <a href="https://greybrain.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-600 transition-colors">GreyBrain.ai</a> - Science for Smiles
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navigation;