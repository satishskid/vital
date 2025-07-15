import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import ProgressRing from './ProgressRing';
import PeerTicker from './PeerTicker';
import PeerAvatars from './PeerAvatars';
import QuickActions from './QuickActions';

const { FiSun, FiMoon, FiInfo, FiTrendingUp, FiBookOpen } = FiIcons;

const Dashboard = ({ showWhyCard }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [dailyProgress, setDailyProgress] = useState({
    movement: 65,
    nutrition: 40,
    mindfulness: 80
  });
  const [todayStats, setTodayStats] = useState({
    steps: 7842,
    hrv: 'Ready',
    lastMeal: '2h ago',
    mood: 'Energized'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, [currentTime]);

  const handleHRVInfo = () => {
    showWhyCard({
      title: 'Heart Rate Variability',
      content: 'HRV measures the variation in time between heartbeats. Higher variability indicates better autonomic nervous system balance and recovery capacity.',
      source: 'Research by Thayer & Lane (2009)'
    });
  };

  const handleMovementInfo = () => {
    showWhyCard({
      title: 'Movement & Exercise',
      content: 'Regular physical activity improves cardiovascular health, cognitive function, and mood by increasing BDNF (brain-derived neurotrophic factor).',
      source: 'Harvard Health Publishing (2021)'
    });
  };

  const handleNutritionInfo = () => {
    showWhyCard({
      title: 'Mindful Nutrition',
      content: 'Quality nutrition fuels cellular energy production and supports neurotransmitter balance, directly impacting mood and cognitive performance.',
      source: 'Journal of Nutritional Biochemistry (2020)'
    });
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm px-6 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{greeting}</h1>
            <p className="text-gray-600">How are you feeling today?</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-light text-gray-800">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Science Insight Button */}
        <motion.button
          onClick={() => navigate('/science')}
          className="bg-indigo-50 w-full rounded-xl p-3 mb-4 flex items-center justify-between"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-full mr-3">
              <SafeIcon icon={FiBookOpen} className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 text-sm">Science Behind Vita</h3>
              <p className="text-xs text-gray-500">Explore the research</p>
            </div>
          </div>
          <SafeIcon icon={FiInfo} className="w-5 h-5 text-indigo-400" />
        </motion.button>

        {/* Today's Insights */}
        <div className="bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Today's Readiness</h3>
              <p className="text-2xl font-bold text-emerald-600">{todayStats.hrv}</p>
              <p className="text-sm text-gray-600">Based on your HRV</p>
            </div>
            <motion.button
              onClick={() => navigate('/hrv')}
              className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg font-medium text-emerald-600 hover:bg-white transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              Check Now
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Progress Rings */}
      <div className="px-6 py-6">
        <div className="flex justify-center items-center mb-6">
          <div className="relative">
            <ProgressRing 
              progress={dailyProgress.movement} 
              color="rgb(59, 130, 246)" 
              size={120}
              strokeWidth={8}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dailyProgress.movement}%</div>
                <div className="text-xs text-gray-600">Movement</div>
              </div>
            </div>
            <motion.button
              onClick={handleMovementInfo}
              className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1"
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiInfo} className="w-3 h-3" />
            </motion.button>
          </div>
        </div>

        <div className="flex justify-around mb-6">
          <div className="relative">
            <ProgressRing 
              progress={dailyProgress.nutrition} 
              color="rgb(16, 185, 129)" 
              size={80}
              strokeWidth={6}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">{dailyProgress.nutrition}%</div>
                <div className="text-xs text-gray-600">Nutrition</div>
              </div>
            </div>
            <motion.button
              onClick={handleNutritionInfo}
              className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1"
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiInfo} className="w-2 h-2" />
            </motion.button>
          </div>

          <div className="relative">
            <ProgressRing 
              progress={dailyProgress.mindfulness} 
              color="rgb(168, 85, 247)" 
              size={80}
              strokeWidth={6}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{dailyProgress.mindfulness}%</div>
                <div className="text-xs text-gray-600">Mindfulness</div>
              </div>
            </div>
            <motion.button
              onClick={() => showWhyCard({
                title: 'Mindfulness Practice',
                content: 'Mindfulness meditation physically changes brain structure, increasing gray matter density in areas associated with learning, memory, and emotional regulation.',
                source: 'Harvard Study by Hölzel et al. (2011)'
              })}
              className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full p-1"
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiInfo} className="w-2 h-2" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Peer Activity */}
      <div className="px-6 mb-6">
        <PeerTicker />
        <PeerAvatars />
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <QuickActions showWhyCard={showWhyCard} />
      </div>

      {/* Today's Summary */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Today's Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Steps</span>
              <span className="font-semibold text-blue-600">{todayStats.steps.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Meal</span>
              <span className="font-semibold text-emerald-600">{todayStats.lastMeal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Mood</span>
              <span className="font-semibold text-purple-600">{todayStats.mood}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;