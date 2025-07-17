import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import ProgressRing from './ProgressRing';
import PeerTicker from './PeerTicker';
import PeerAvatars from './PeerAvatars';
import QuickActions from './QuickActions';
import VitalityOrbHome from '../VitalityOrb/VitalityOrbHome';
import HealthDataService from '../../services/HealthDataService';
import PodcastSnippetService from '../../services/PodcastSnippetService';
import PodcastModal from '../Audio/PodcastModal';
import { useAuth } from '../../context/FirebaseAuthContext';

const { FiSun, FiMoon, FiInfo, FiTrendingUp, FiBookOpen, FiSettings } = FiIcons;

const Dashboard = ({ showWhyCard }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const [isVitalityTheme, setIsVitalityTheme] = useState(false);
  const [dailyProgress, setDailyProgress] = useState({
    movement: 0,
    nutrition: 0,
    mindfulness: 0
  });
  const [todayStats, setTodayStats] = useState({
    steps: 0,
    hrv: 'No data',
    lastMeal: 'No data',
    mood: 'No data'
  });
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();
  const healthServiceRef = useRef(null);
  const podcastServiceRef = useRef(null);
  const [showPodcastPlayer, setShowPodcastPlayer] = useState(false);
  const [podcastInfo, setPodcastInfo] = useState(null);

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS

  // Initialize health data service and load data
  useEffect(() => {
    if (user) {
      healthServiceRef.current = new HealthDataService(user.uid);
      podcastServiceRef.current = new PodcastSnippetService();

      // Initialize podcast snippets for new users
      const hasInitializedSnippets = localStorage.getItem(`vita-snippets-${user.uid}`);
      if (!hasInitializedSnippets) {
        podcastServiceRef.current.initializeForUser(user.uid);
      }

      loadHealthData();
      loadPodcastInfo();
    }
  }, [user]);

  // Set up podcast event listeners
  useEffect(() => {
    const handleOpenPodcast = (event) => {
      setPodcastInfo(event.detail);
      setShowPodcastPlayer(true);
    };

    const handleSnippetDetails = (event) => {
      showWhyCard(event.detail);
    };

    window.addEventListener('open-podcast', handleOpenPodcast);
    window.addEventListener('show-snippet-details', handleSnippetDetails);

    return () => {
      window.removeEventListener('open-podcast', handleOpenPodcast);
      window.removeEventListener('show-snippet-details', handleSnippetDetails);
    };
  }, []);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('vita-home-theme');
    if (savedTheme === 'vitality') {
      setIsVitalityTheme(true);
    }
  }, []);

  // Load real health data from Firebase
  const loadHealthData = async () => {
    if (!healthServiceRef.current) return;

    try {
      setLoading(true);

      // Get today's stats and health data for vitality
      const [stats, vitalityData] = await Promise.all([
        healthServiceRef.current.getTodayStats(),
        healthServiceRef.current.getHealthDataForVitality()
      ]);

      // Update today's stats
      setTodayStats({
        steps: stats.steps || 0,
        hrv: stats.hrv?.status || 'No data',
        lastMeal: stats.lastMeal || 'No data',
        mood: getMoodText(stats.mood) || 'No data'
      });

      // Calculate daily progress from stats
      setDailyProgress({
        movement: calculateMovementProgress(stats),
        nutrition: calculateNutritionProgress(stats),
        mindfulness: calculateMindfulnessProgress(stats)
      });

      // Set health data for vitality orb
      setHealthData(vitalityData);

    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Helper functions for data processing
  const getMoodText = (mood) => {
    if (!mood) return null;
    const moodMap = {
      1: 'Poor',
      2: 'Low',
      3: 'Okay',
      4: 'Good',
      5: 'Excellent'
    };
    return moodMap[mood] || 'Unknown';
  };

  const calculateMovementProgress = (stats) => {
    const steps = stats.steps || 0;
    const activeMinutes = stats.activeMinutes || 0;
    // Progress based on 10,000 steps and 30 active minutes
    const stepProgress = Math.min((steps / 10000) * 70, 70);
    const activeProgress = Math.min((activeMinutes / 30) * 30, 30);
    return Math.round(stepProgress + activeProgress);
  };

  const calculateNutritionProgress = (stats) => {
    const meals = stats.nutrition?.meals || 0;
    const water = stats.nutrition?.water || 0;
    // Progress based on 3 meals and 8 glasses of water
    const mealProgress = Math.min((meals / 3) * 60, 60);
    const waterProgress = Math.min((water / 8) * 40, 40);
    return Math.round(mealProgress + waterProgress);
  };

  const calculateMindfulnessProgress = (stats) => {
    const sessions = stats.mindfulness?.sessions || 0;
    // Progress based on 1 session = 100%
    return Math.min(sessions * 100, 100);
  };

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

  // Helper functions for theme toggle
  const toggleTheme = () => {
    const newTheme = !isVitalityTheme;
    setIsVitalityTheme(newTheme);
    localStorage.setItem('vita-home-theme', newTheme ? 'vitality' : 'standard');
  };

  // Prepare health data for Vitality Orb (uses real data with reasonable defaults)
  const getHealthDataForOrb = () => {
    // Return health data from service (which includes good defaults) or fallback to reasonable values
    return healthData || {
      sleep: { duration: 420, quality: 75 }, // 7 hours, good quality
      hrv: { readiness: 30 }, // Moderate readiness
      activity: { steps: 5000, activeMinutes: 20 }, // Moderate activity
      mindfulness: { sessions: 0 },
      nutrition: { mealsLogged: 2, waterIntake: 6 }, // Some nutrition data
      mood: 3, // Neutral mood (1-5 scale)
      social: { socialWellnessScore: 50 } // Moderate social wellness
    };
  };

  // Load podcast information
  const loadPodcastInfo = () => {
    const podcastLink = localStorage.getItem('vita-podcast-link');
    const podcastTitle = localStorage.getItem('vita-podcast-title');

    if (podcastLink) {
      setPodcastInfo({
        src: podcastLink,
        title: podcastTitle || 'Six Golden Habits for Enduring Youth'
      });
    }
  };

  // Refresh data function
  const refreshData = () => {
    if (healthServiceRef.current) {
      loadHealthData();
    }
  };

  // Handle podcast access
  const handleOpenPodcast = () => {
    if (podcastInfo) {
      setShowPodcastPlayer(true);
    } else {
      // Fallback to default podcast
      setPodcastInfo({
        src: '/audio/Six Golden Habits for Enduring Youth.wav',
        title: 'Six Golden Habits for Enduring Youth'
      });
      setShowPodcastPlayer(true);
    }
  };

  // CONDITIONAL RENDERING - If Vitality theme is enabled, render the Vitality Orb home
  if (isVitalityTheme) {
    return (
      <VitalityOrbHome
        healthData={getHealthDataForOrb()}
        onThemeToggle={toggleTheme}
        onRefresh={refreshData}
        onOpenPodcast={handleOpenPodcast}
        loading={loading}
      />
    );
  }

  // Show loading state
  if (loading && !healthData) {
    return (
      <div className="pb-20 min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health data...</p>
        </div>
      </div>
    );
  }

  // STANDARD DASHBOARD RENDERING
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
          <div className="flex items-center space-x-4">
            {podcastInfo && (
              <motion.button
                onClick={handleOpenPodcast}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                whileTap={{ scale: 0.95 }}
                title="Listen to Six Golden Habits podcast"
              >
                <SafeIcon icon={FiIcons.FiPlay} className="w-4 h-4" />
                <span className="text-sm font-medium">Podcast</span>
              </motion.button>
            )}
            <motion.button
              onClick={toggleTheme}
              className="p-2 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors"
              whileTap={{ scale: 0.95 }}
              title="Switch to Vitality Orb theme"
            >
              <SafeIcon icon={FiIcons.FiSettings} className="w-5 h-5 text-purple-600" />
            </motion.button>
            <div className="text-right">
              <div className="text-3xl font-light text-gray-800">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
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
        <PeerTicker socialConnections={[]} />
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

      {/* Podcast Modal */}
      <PodcastModal
        isOpen={showPodcastPlayer}
        onClose={() => setShowPodcastPlayer(false)}
        podcastInfo={podcastInfo}
      />
    </div>
  );
};

export default Dashboard;