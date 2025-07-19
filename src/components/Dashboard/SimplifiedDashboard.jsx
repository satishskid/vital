import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/FirebaseAuthContext';
import LongevityEngine from '../../services/LongevityEngine';
import HealthDataService from '../../services/HealthDataService';
import HabitNudgeService from '../../services/HabitNudgeService';
import SmartNudgeSystem from '../Nudges/SmartNudgeSystem';
import HabitCard from './HabitCard';
import HabitNudgeDisplay from './HabitNudgeDisplay';

const { FiSun, FiActivity, FiZap, FiMoon, FiHeart, FiSmile, FiTrendingUp, FiTarget, FiRefreshCw } = FiIcons;

const SimplifiedDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [longevityState, setLongevityState] = useState(null);
  const [todayHabits, setTodayHabits] = useState({});
  const [loading, setLoading] = useState(true);
  const [nudges, setNudges] = useState([]);
  const [nudgeService] = useState(() => new HabitNudgeService());

  const sixPillars = [
    {
      id: 'circadian',
      name: 'Circadian Rhythm',
      icon: FiSun,
      color: 'from-yellow-400 to-orange-500',
      route: '/circadian-tracking',
      description: 'Light & meal timing'
    },
    {
      id: 'movement',
      name: 'Intentional Movement',
      icon: FiActivity,
      color: 'from-green-400 to-emerald-500',
      route: '/circadian-tracking',
      description: 'Cognitive enhancement'
    },
    {
      id: 'stress',
      name: 'Controlled Stress',
      icon: FiZap,
      color: 'from-red-400 to-pink-500',
      route: '/circadian-tracking',
      description: 'Resilience building'
    },
    {
      id: 'sleep',
      name: 'Quality Sleep',
      icon: FiMoon,
      color: 'from-indigo-400 to-purple-500',
      route: '/circadian-tracking',
      description: 'Brain detoxification'
    },
    {
      id: 'nutrition',
      name: 'Nutrient-Dense Eating',
      icon: FiHeart,
      color: 'from-emerald-400 to-teal-500',
      route: '/nutrition-tracking',
      description: 'Brain-supporting foods'
    },
    {
      id: 'mindset',
      name: 'Positive Self-Narrative',
      icon: FiSmile,
      color: 'from-pink-400 to-rose-500',
      route: '/mindset-tracking',
      description: 'Mindset & social wellness'
    }
  ];

  useEffect(() => {
    if (user) {
      loadTodayData();
    }
  }, [user]);

  const loadTodayData = async () => {
    try {
      setLoading(true);
      const healthService = new HealthDataService(user.uid);
      const todayData = await healthService.getTodayStats();
      
      // Calculate longevity state
      const longevityEngine = new LongevityEngine();
      const state = longevityEngine.calculateLongevityState(todayData);
      setLongevityState(state);
      
      // Extract today's habit completion
      const habitScores = {
        circadian: todayData.lightExposure?.morningLight || todayData.nutrition?.mealTiming || 0,
        movement: todayData.movement?.breaks || todayData.exercise?.purposeful || 0,
        stress: todayData.hrv?.resilience || todayData.stress?.strategic || 0,
        sleep: todayData.sleep?.brainDetox || todayData.sleep?.environment || 0,
        nutrition: todayData.nutrition?.brainFoods || todayData.nutrition?.nutrientDensity || 0,
        mindset: todayData.mindset?.growth || todayData.social?.quality || 0
      };
      setTodayHabits(habitScores);

      // Generate smart nudges based on current state
      const currentNudges = nudgeService.generateNudges(todayData, state);
      setNudges(currentNudges);

    } catch (error) {
      console.error('Error loading today data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNudgeAction = (nudge, action, option) => {
    console.log('Nudge action:', action, nudge, option);
    // Remove the nudge after action
    setNudges(prev => prev.filter(n => n.id !== nudge.id));
    // Reload data to reflect changes
    loadTodayData();
  };

  const handleNudgeDismiss = (nudge) => {
    setNudges(prev => prev.filter(n => n.id !== nudge.id));
  };

  const getHabitStatus = (pillarId) => {
    const score = todayHabits[pillarId] || 0;
    if (score >= 80) return { status: 'excellent', color: 'bg-green-500', text: 'Excellent' };
    if (score >= 60) return { status: 'good', color: 'bg-blue-500', text: 'Good' };
    if (score >= 40) return { status: 'fair', color: 'bg-yellow-500', text: 'Fair' };
    if (score > 0) return { status: 'started', color: 'bg-orange-500', text: 'Started' };
    return { status: 'not_logged', color: 'bg-gray-300', text: 'Not Logged' };
  };

  const getMotivationalMessage = () => {
    const completedHabits = Object.values(todayHabits).filter(score => score > 0).length;
    const avgScore = Object.values(todayHabits).reduce((sum, score) => sum + score, 0) / 6;
    
    if (completedHabits === 6 && avgScore >= 80) {
      return "🌟 Outstanding! You're optimizing all 6 longevity pillars today!";
    } else if (completedHabits >= 4) {
      return "💪 Great progress! You're building strong longevity habits!";
    } else if (completedHabits >= 2) {
      return "🎯 Good start! Keep building your longevity foundation!";
    } else if (completedHabits >= 1) {
      return "🌱 Every habit counts! Log more pillars to boost your biological age!";
    } else {
      return "🚀 Ready to start your longevity journey? Log your first habit!";
    }
  };

  const getActionableInsight = () => {
    const unloggedHabits = sixPillars.filter(pillar => !todayHabits[pillar.id] || todayHabits[pillar.id] === 0);
    const weakestHabits = sixPillars.filter(pillar => todayHabits[pillar.id] > 0 && todayHabits[pillar.id] < 60);
    
    if (unloggedHabits.length > 0) {
      const nextHabit = unloggedHabits[0];
      return {
        type: 'log',
        message: `Log your ${nextHabit.name} to improve your biological age`,
        action: () => navigate(nextHabit.route),
        buttonText: `Track ${nextHabit.name}`
      };
    } else if (weakestHabits.length > 0) {
      const weakestHabit = weakestHabits[0];
      return {
        type: 'improve',
        message: `Your ${weakestHabit.name} could use some attention`,
        action: () => navigate(weakestHabit.route),
        buttonText: `Improve ${weakestHabit.name}`
      };
    } else {
      return {
        type: 'maintain',
        message: "Excellent work! Keep maintaining your longevity habits",
        action: () => navigate('/manual-entry'),
        buttonText: "View Full Progress"
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const insight = getActionableInsight();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 pb-20">
      {/* Smart Nudge System */}
      <SmartNudgeSystem />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Your 6 Longevity Pillars</h1>
        <p className="text-purple-100">Track → Reflect → Act → Improve</p>
        
        {/* Today's Score */}
        {longevityState && (
          <div className="bg-white bg-opacity-20 rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{longevityState.score}%</div>
                <div className="text-purple-100">Today's Longevity Score</div>
              </div>
              <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiTrendingUp} className="w-8 h-8" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm text-center"
        >
          <p className="text-lg font-medium text-gray-800">{getMotivationalMessage()}</p>
        </motion.div>

        {/* 6 Pillars Grid - Interactive Habit Cards */}
        <div className="grid grid-cols-2 gap-4">
          {sixPillars.map((pillar, index) => {
            const status = getHabitStatus(pillar.id);
            const score = todayHabits[pillar.id] || 0;

            return (
              <HabitCard
                key={pillar.id}
                pillar={pillar}
                status={status}
                score={score}
                index={index}
                onHabitLogged={loadTodayData}
              />
            );
          })}
        </div>

        {/* Smart Nudges */}
        {nudges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <HabitNudgeDisplay
              nudges={nudges}
              onNudgeAction={handleNudgeAction}
              onNudgeDismiss={handleNudgeDismiss}
            />
          </motion.div>
        )}

        {/* Actionable Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center space-x-3 mb-3">
            <SafeIcon icon={FiTarget} className="w-6 h-6" />
            <h3 className="font-semibold">Next Action</h3>
          </div>
          <p className="mb-4">{insight.message}</p>
          <button
            onClick={insight.action}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {insight.buttonText}
          </button>
        </motion.div>

        {/* Quick Log All Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => navigate('/manual-entry')}
          className="w-full bg-white border-2 border-purple-300 text-purple-600 py-4 rounded-xl font-medium hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2"
        >
          <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
          <span>Log All 6 Pillars at Once</span>
        </motion.button>
      </div>
    </div>
  );
};

export default SimplifiedDashboard;
