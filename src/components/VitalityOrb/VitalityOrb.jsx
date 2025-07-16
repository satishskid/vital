import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiZap, FiHeart, FiActivity, FiDroplet, FiInfo, FiBook, FiHeadphones, FiX } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import VitalityStateEngine from '../../services/VitalityStateEngine';
import VitalityScience from './VitalityScience';
import PodcastPlayer from '../Audio/PodcastPlayer';

const VitalityOrb = ({ healthData, onStateChange }) => {
  const [vitalityState, setVitalityState] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const [showPodcast, setShowPodcast] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  const engineRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new VitalityStateEngine();
    }
    
    updateVitalityState();
  }, [healthData]);

  useEffect(() => {
    // Show tutorial on first visit
    const hasSeenTutorial = localStorage.getItem('vita-orb-tutorial-seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('vita-orb-tutorial-seen', 'true');
  };

  const updateVitalityState = () => {
    if (engineRef.current && healthData && Object.keys(healthData).length > 0) {
      const state = engineRef.current.calculateVitalityState(healthData);
      setVitalityState(state);
      if (onStateChange) {
        onStateChange(state);
      }
    } else {
      console.warn('VitalityOrb: No health data provided - cannot calculate vitality state');
    }
  };

  const getStateIcon = (stateName) => {
    const icons = {
      recovering: FiMoon,
      balanced: FiSun,
      primed: FiZap
    };
    return icons[stateName] || FiSun;
  };

  const getPillarIcon = (pillarName) => {
    const icons = {
      recovery: FiMoon,
      resilience: FiActivity,
      fuel: FiHeart
    };
    return icons[pillarName] || FiHeart;
  };

  const getPillarColor = (pillarName) => {
    const colors = {
      recovery: '#F59E0B', // Yellow
      resilience: '#10B981', // Green
      fuel: '#EF4444' // Red
    };
    return colors[pillarName] || '#6B7280';
  };

  const getOrbSize = () => {
    if (!vitalityState) return 200;
    
    // Size varies slightly based on state
    const baseSizes = {
      recovering: 180,
      balanced: 200,
      primed: 220
    };
    
    return baseSizes[vitalityState.overall.name] || 200;
  };

  const getAnimationVariants = () => {
    if (!vitalityState) return {};
    
    const variants = {
      recovering: {
        scale: [1, 1.05, 1],
        opacity: [0.7, 0.9, 0.7],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      },
      balanced: {
        scale: [1, 1.02, 1],
        opacity: [0.8, 1, 0.8],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      },
      primed: {
        scale: [1, 1.08, 1.03, 1],
        opacity: [0.9, 1, 0.95, 0.9],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
      }
    };
    
    return variants[vitalityState.overall.name] || variants.balanced;
  };

  if (!vitalityState) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const StateIcon = getStateIcon(vitalityState.overall.name);
  const orbSize = getOrbSize();

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] relative">
      {/* Main Orb */}
      <motion.div
        ref={orbRef}
        className="relative cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        animate={getAnimationVariants()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Orb Background */}
        <div
          className="rounded-full relative overflow-hidden shadow-2xl"
          style={{
            width: orbSize,
            height: orbSize,
            background: `radial-gradient(circle at 30% 30%, ${vitalityState.overall.gradient[0]}, ${vitalityState.overall.gradient[1]})`
          }}
        >
          {/* Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${30 + (i * 8)}%`
                }}
                animate={{
                  y: [-10, 10, -10],
                  x: [-5, 5, -5],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{
                  duration: 3 + (i * 0.2),
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
          
          {/* Central Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <SafeIcon 
                icon={StateIcon} 
                className="w-16 h-16 text-white drop-shadow-lg" 
              />
            </motion.div>
          </div>
          
          {/* Score Display */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white font-bold text-lg">
                {vitalityState.score}
              </span>
            </div>
          </div>
        </div>

        {/* Completion Rings - Always Visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
              {/* Recovery Ring (Outer) - Apple Watch Style */}
              <div className="absolute" style={{ top: -30, left: -30, width: orbSize + 60, height: orbSize + 60 }}>
                <svg width={orbSize + 60} height={orbSize + 60} className="transform -rotate-90">
                  {/* Background ring */}
                  <circle
                    cx={(orbSize + 60) / 2}
                    cy={(orbSize + 60) / 2}
                    r={(orbSize + 60) / 2 - 10}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    opacity="0.3"
                  />
                  {/* Progress ring */}
                  <motion.circle
                    cx={(orbSize + 60) / 2}
                    cy={(orbSize + 60) / 2}
                    r={(orbSize + 60) / 2 - 10}
                    fill="none"
                    stroke={getPillarColor('recovery')}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * ((orbSize + 60) / 2 - 10)}`}
                    strokeDashoffset={`${2 * Math.PI * ((orbSize + 60) / 2 - 10)}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * ((orbSize + 60) / 2 - 10)}` }}
                    animate={{
                      strokeDashoffset: `${2 * Math.PI * ((orbSize + 60) / 2 - 10) * (1 - Math.min(vitalityState.pillars.recovery.score / 100, 1))}`
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <SafeIcon icon={getPillarIcon('recovery')} className="w-3 h-3" />
                    <span>{Math.round(vitalityState.pillars.recovery.score)}</span>
                  </div>
                </div>
              </div>

              {/* Resilience Ring (Middle) - Completion Style */}
              <div className="absolute" style={{ top: -15, left: -15, width: orbSize + 30, height: orbSize + 30 }}>
                <svg width={orbSize + 30} height={orbSize + 30} className="transform -rotate-90">
                  {/* Background ring */}
                  <circle
                    cx={(orbSize + 30) / 2}
                    cy={(orbSize + 30) / 2}
                    r={(orbSize + 30) / 2 - 10}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    opacity="0.3"
                  />
                  {/* Progress ring */}
                  <motion.circle
                    cx={(orbSize + 30) / 2}
                    cy={(orbSize + 30) / 2}
                    r={(orbSize + 30) / 2 - 10}
                    fill="none"
                    stroke={getPillarColor('resilience')}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * ((orbSize + 30) / 2 - 10)}`}
                    strokeDashoffset={`${2 * Math.PI * ((orbSize + 30) / 2 - 10)}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * ((orbSize + 30) / 2 - 10)}` }}
                    animate={{
                      strokeDashoffset: `${2 * Math.PI * ((orbSize + 30) / 2 - 10) * (1 - Math.min(vitalityState.pillars.resilience.score / 100, 1))}`
                    }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  />
                </svg>
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <SafeIcon icon={getPillarIcon('resilience')} className="w-3 h-3" />
                    <span>{Math.round(vitalityState.pillars.resilience.score)}</span>
                  </div>
                </div>
              </div>

              {/* Fuel Ring (Inner) - Completion Style */}
              <div className="absolute" style={{ top: -7.5, left: -7.5, width: orbSize + 15, height: orbSize + 15 }}>
                <svg width={orbSize + 15} height={orbSize + 15} className="transform -rotate-90">
                  {/* Background ring */}
                  <circle
                    cx={(orbSize + 15) / 2}
                    cy={(orbSize + 15) / 2}
                    r={(orbSize + 15) / 2 - 10}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    opacity="0.3"
                  />
                  {/* Progress ring */}
                  <motion.circle
                    cx={(orbSize + 15) / 2}
                    cy={(orbSize + 15) / 2}
                    r={(orbSize + 15) / 2 - 10}
                    fill="none"
                    stroke={getPillarColor('fuel')}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * ((orbSize + 15) / 2 - 10)}`}
                    strokeDashoffset={`${2 * Math.PI * ((orbSize + 15) / 2 - 10)}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * ((orbSize + 15) / 2 - 10)}` }}
                    animate={{
                      strokeDashoffset: `${2 * Math.PI * ((orbSize + 15) / 2 - 10) * (1 - Math.min(vitalityState.pillars.fuel.score / 100, 1))}`
                    }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                  />
                </svg>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <SafeIcon icon={getPillarIcon('fuel')} className="w-3 h-3" />
                    <span>{Math.round(vitalityState.pillars.fuel.score)}</span>
                  </div>
                </div>
              </div>
        </motion.div>
      </motion.div>

      {/* State Information */}
      <motion.div
        className="mt-8 text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2 capitalize">
          {vitalityState.overall.name === 'primed' ? 'Primed & Ready' : vitalityState.overall.name}
        </h2>
        <p className="text-gray-600 mb-4">
          {vitalityState.insights.primary}
        </p>
        <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm text-gray-700 font-medium">
            {vitalityState.insights.focus}
          </p>
        </div>
      </motion.div>

      {/* Pillar Breakdown (when expanded) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid grid-cols-3 gap-4 w-full max-w-md"
          >
            {Object.entries(vitalityState.pillars).map(([pillarName, pillar]) => {
              const PillarIcon = getPillarIcon(pillarName);
              const pillarColor = getPillarColor(pillarName);
              
              return (
                <div
                  key={pillarName}
                  className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-3 text-center"
                >
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: pillarColor }}
                  >
                    <SafeIcon icon={PillarIcon} className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-800 capitalize mb-1">
                    {pillarName}
                  </h4>
                  <div className="text-lg font-bold" style={{ color: pillarColor }}>
                    {Math.round(pillar.score)}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Tip */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiInfo} className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  Your Vitality Orb
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Your three vitality rings show completion: Recovery (yellow) from HRV, Resilience (green) from movement & mindfulness, and Fuel (red) from nutrition. Tap for details!
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowScience(true)}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <SafeIcon icon={FiBook} className="w-3 h-3" />
                    <span>Learn Science</span>
                  </button>
                  <button
                    onClick={dismissTutorial}
                    className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition-colors"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
            {/* Arrow pointing down to orb */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap Hint */}
      {!isExpanded && !showTutorial && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="bg-gray-800 bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
            Tap for detailed insights
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      {!showTutorial && (
        <div className="absolute top-4 right-4 flex space-x-2">
          {/* Podcast Button */}
          <motion.button
            onClick={() => setShowPodcast(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Listen: Six Golden Habits for Enduring Youth"
          >
            <SafeIcon icon={FiHeadphones} className="w-5 h-5" />
          </motion.button>

          {/* Science Button */}
          <motion.button
            onClick={() => setShowScience(true)}
            className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Learn the science behind your vitality rings"
          >
            <SafeIcon icon={FiBook} className="w-4 h-4" />
          </motion.button>
        </div>
      )}

      {/* Science Explanation Modal */}
      <VitalityScience
        isOpen={showScience}
        onClose={() => setShowScience(false)}
      />

      {/* Podcast Modal */}
      <AnimatePresence>
        {showPodcast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPodcast(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiHeadphones} className="w-6 h-6" />
                    <div>
                      <h2 className="text-xl font-bold">Six Golden Habits</h2>
                      <p className="text-purple-100 text-sm">For Enduring Youth & Vitality</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPodcast(false)}
                    className="text-white hover:text-gray-200 p-1"
                  >
                    <SafeIcon icon={FiX} className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Motivational Science for Your Vitality Journey
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Listen to evidence-based insights that directly support the vitality pillars measured by your rings.
                    These golden habits are the foundation for optimizing your Recovery, Resilience, and Fuel systems.
                  </p>
                </div>

                <PodcastPlayer
                  audioSrc="/audio/Six Golden Habits for Enduring Youth.wav"
                  title="Six Golden Habits for Enduring Youth"
                  description="Science-backed strategies for optimizing your vitality rings"
                />

                <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>Perfect companion to your vitality ring insights</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VitalityOrb;
