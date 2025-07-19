import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/FirebaseAuthContext';
import LongevityEngine from '../../services/LongevityEngine';
import HealthDataService from '../../services/HealthDataService';

const { FiClock, FiTrendingDown, FiTrendingUp, FiZap, FiRefreshCw, FiInfo } = FiIcons;

const BiologicalAgeVisualization = ({ showDetails = false }) => {
  const { user } = useAuth();
  const [longevityState, setLongevityState] = useState(null);
  const [chronologicalAge, setChronologicalAge] = useState(null);
  const [biologicalAge, setBiologicalAge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (user) {
      calculateBiologicalAge();
    }
  }, [user]);

  const calculateBiologicalAge = async () => {
    try {
      setLoading(true);
      
      // Get user's chronological age (you might want to store this in user profile)
      const userAge = calculateChronologicalAge(user.metadata?.creationTime);
      setChronologicalAge(userAge);
      
      // Get health data and calculate longevity state
      const healthService = new HealthDataService(user.uid);
      const healthData = await healthService.getTodayStats();
      
      const longevityEngine = new LongevityEngine();
      const state = longevityEngine.calculateLongevityState(healthData);
      setLongevityState(state);
      
      // Calculate biological age based on longevity score
      const bioAge = calculateBiologicalAgeFromScore(userAge, state.score);
      setBiologicalAge(bioAge);
      
    } catch (error) {
      console.error('Error calculating biological age:', error);
      // Set defaults for demo
      setChronologicalAge(35);
      setBiologicalAge(32);
      setLongevityState({
        overall: { name: 'slowedAging', color: '#10B981', message: 'You\'re slowing your biological aging process' },
        score: 75,
        habits: {}
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateChronologicalAge = (creationTime) => {
    // This is a placeholder - you should store actual birth date in user profile
    // For demo, we'll use a reasonable age based on account creation
    const accountAge = creationTime ? 
      Math.floor((Date.now() - new Date(creationTime).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;
    return Math.max(25 + accountAge, 25); // Minimum age 25 for demo
  };

  const calculateBiologicalAgeFromScore = (chronoAge, score) => {
    // Score 0-40: +5 to +10 years (accelerated aging)
    // Score 40-70: chronological age (normal aging)
    // Score 70-85: -2 to -5 years (slowed aging)
    // Score 85-100: -5 to -10 years (reversed aging)
    
    if (score >= 85) {
      const reduction = 5 + ((score - 85) / 15) * 5; // -5 to -10 years
      return Math.max(chronoAge - reduction, 18);
    } else if (score >= 70) {
      const reduction = 2 + ((score - 70) / 15) * 3; // -2 to -5 years
      return Math.max(chronoAge - reduction, 18);
    } else if (score >= 40) {
      const variation = ((score - 55) / 15) * 2; // -2 to +2 years around chronological
      return chronoAge + variation;
    } else {
      const increase = 5 + ((40 - score) / 40) * 5; // +5 to +10 years
      return chronoAge + increase;
    }
  };

  const getAgeDifference = () => {
    if (!chronologicalAge || !biologicalAge) return 0;
    return Math.round((chronologicalAge - biologicalAge) * 10) / 10;
  };

  const getAgeMessage = () => {
    const diff = getAgeDifference();
    if (diff > 5) return `${diff} years younger!`;
    if (diff > 0) return `${diff} years younger`;
    if (diff === 0) return 'aging normally';
    return `${Math.abs(diff)} years older`;
  };

  const getStateIcon = () => {
    if (!longevityState) return FiClock;
    
    switch (longevityState.overall.name) {
      case 'reversedAging': return FiRefreshCw;
      case 'slowedAging': return FiTrendingDown;
      case 'chronologicalAging': return FiClock;
      case 'acceleratedAging': return FiTrendingUp;
      default: return FiClock;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Your Biological Age</h3>
            <p className="text-purple-100 text-sm">Earned through neuroscience-backed habits</p>
          </div>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
          >
            <SafeIcon icon={FiInfo} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="p-6">
        <div className="flex items-center justify-center space-x-8 mb-6">
          {/* Chronological Age */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-400 mb-1">
              {chronologicalAge}
            </div>
            <div className="text-sm text-gray-500">Calendar Age</div>
          </div>

          {/* Arrow/Comparison */}
          <div className="flex flex-col items-center">
            <SafeIcon icon={getStateIcon()} className="w-8 h-8 text-purple-600 mb-2" />
            <div className="text-xs text-gray-500">vs</div>
          </div>

          {/* Biological Age */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold mb-1"
              style={{ color: longevityState?.overall.color || '#8B5CF6' }}
            >
              {Math.round(biologicalAge)}
            </motion.div>
            <div className="text-sm font-medium" style={{ color: longevityState?.overall.color || '#8B5CF6' }}>
              Biological Age
            </div>
          </div>
        </div>

        {/* Age Difference Display */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
            <SafeIcon 
              icon={getAgeDifference() >= 0 ? FiTrendingDown : FiTrendingUp} 
              className={`w-4 h-4 ${getAgeDifference() >= 0 ? 'text-green-600' : 'text-red-600'}`} 
            />
            <span className={`font-medium ${getAgeDifference() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {getAgeMessage()}
            </span>
          </div>
        </div>

        {/* State Message */}
        {longevityState && (
          <div className="text-center mb-4">
            <p className="text-gray-700 font-medium mb-1">
              {longevityState.overall.message}
            </p>
            <p className="text-sm text-gray-600">
              {longevityState.insights?.focus}
            </p>
          </div>
        )}

        {/* Longevity Score */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Longevity Score</span>
            <span className="text-lg font-bold" style={{ color: longevityState?.overall.color || '#8B5CF6' }}>
              {longevityState?.score || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${longevityState?.score || 0}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-2 rounded-full"
              style={{ backgroundColor: longevityState?.overall.color || '#8B5CF6' }}
            />
          </div>
        </div>

        {/* Explanation Modal */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200"
          >
            <h4 className="font-semibold text-purple-800 mb-2">How Biological Age Works</h4>
            <div className="text-sm text-purple-700 space-y-2">
              <p>
                <strong>Your biological age reflects how well your body is aging</strong> based on six 
                neuroscience-backed longevity habits.
              </p>
              <p>
                <strong>Calendar age</strong> is just time passing. <strong>Biological age</strong> is 
                earned through your daily choices and can be younger than your calendar age.
              </p>
              <p>
                <strong>The six habits</strong> - circadian rhythm, movement, stress resilience, sleep quality, 
                nutrition, and mindset - work together to slow or reverse biological aging.
              </p>
              <p>
                <strong>Your score</strong> shows how well you're implementing these habits. Higher scores 
                mean younger biological age and better brain health.
              </p>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        {showDetails && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                View Habit Details
              </button>
              <button className="bg-gray-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                Track Progress
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiologicalAgeVisualization;
