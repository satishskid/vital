import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiX, FiPause, FiPlay, FiVolume2, FiVolumeX } = FiIcons;

const BreathingSession = ({ session, onEnd, showWhyCard }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [timeRemaining, setTimeRemaining] = useState(session.duration === '2 min' ? 120 : 
    session.duration === '5 min' ? 300 : session.duration === '8 min' ? 480 : 720);
  const [cycleCount, setCycleCount] = useState(0);
  const [isAudioOn, setIsAudioOn] = useState(true);

  const phases = {
    'Physiological Sigh': [
      { name: 'inhale', duration: 2000, instruction: 'Inhale through nose' },
      { name: 'inhale2', duration: 1000, instruction: 'Second inhale' },
      { name: 'exhale', duration: 6000, instruction: 'Long exhale through mouth' }
    ],
    'Box Breathing': [
      { name: 'inhale', duration: 4000, instruction: 'Inhale' },
      { name: 'hold1', duration: 4000, instruction: 'Hold' },
      { name: 'exhale', duration: 4000, instruction: 'Exhale' },
      { name: 'hold2', duration: 4000, instruction: 'Hold' }
    ],
    'Morning Intention': [
      { name: 'inhale', duration: 4000, instruction: 'Breathe in peace' },
      { name: 'hold', duration: 2000, instruction: 'Hold your intention' },
      { name: 'exhale', duration: 6000, instruction: 'Breathe out gratitude' }
    ],
    'Body Scan': [
      { name: 'inhale', duration: 5000, instruction: 'Breathe in awareness' },
      { name: 'exhale', duration: 7000, instruction: 'Release tension' }
    ]
  };

  const sessionPhases = phases[session.title] || phases['Box Breathing'];
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  useEffect(() => {
    let phaseTimer;
    if (isActive) {
      const currentPhaseData = sessionPhases[currentPhaseIndex];
      phaseTimer = setTimeout(() => {
        setCurrentPhaseIndex(prev => {
          const next = (prev + 1) % sessionPhases.length;
          if (next === 0) {
            setCycleCount(prev => prev + 1);
          }
          return next;
        });
      }, currentPhaseData.duration);
    }
    return () => clearTimeout(phaseTimer);
  }, [isActive, currentPhaseIndex, sessionPhases]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCircleScale = () => {
    const phase = sessionPhases[currentPhaseIndex];
    if (phase.name.includes('inhale')) return 1.2;
    if (phase.name.includes('hold')) return 1.2;
    return 1;
  };

  const getCircleColor = () => {
    const phase = sessionPhases[currentPhaseIndex];
    if (phase.name.includes('inhale')) return 'from-blue-400 to-cyan-400';
    if (phase.name.includes('hold')) return 'from-purple-400 to-pink-400';
    return 'from-green-400 to-emerald-400';
  };

  if (timeRemaining === 0) {
    return (
      <div className="pb-20 min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-8 shadow-lg text-center max-w-sm mx-4"
        >
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <SafeIcon icon={session.icon} className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Complete!</h2>
          <p className="text-gray-600 mb-4">You completed {cycleCount} breathing cycles</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              Great job! Regular practice strengthens your ability to manage stress and improve focus.
            </p>
          </div>
          <motion.button
            onClick={onEnd}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`pb-20 min-h-screen bg-gradient-to-br ${session.bgColor} relative`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <motion.button
          onClick={onEnd}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-full"
          whileTap={{ scale: 0.9 }}
        >
          <SafeIcon icon={FiX} className="w-6 h-6 text-gray-700" />
        </motion.button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-800">{session.title}</h1>
          <p className="text-sm text-gray-600">{formatTime(timeRemaining)}</p>
        </div>
        <motion.button
          onClick={() => setIsAudioOn(!isAudioOn)}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-full"
          whileTap={{ scale: 0.9 }}
        >
          <SafeIcon icon={isAudioOn ? FiVolume2 : FiVolumeX} className="w-6 h-6 text-gray-700" />
        </motion.button>
      </div>

      {/* Main Breathing Circle */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <motion.div
            className={`w-64 h-64 rounded-full bg-gradient-to-br ${getCircleColor()} shadow-2xl flex items-center justify-center mb-8`}
            animate={{ 
              scale: isActive ? getCircleScale() : 1,
              opacity: isActive ? 0.9 : 0.7
            }}
            transition={{ 
              duration: sessionPhases[currentPhaseIndex]?.duration / 1000 || 4,
              ease: "easeInOut"
            }}
          >
            <div className="text-white text-center">
              <div className="text-6xl font-light mb-2">{cycleCount}</div>
              <div className="text-sm opacity-80">cycles</div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhaseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-light text-gray-800 mb-2">
                {sessionPhases[currentPhaseIndex]?.instruction}
              </h2>
              <p className="text-gray-600">
                {sessionPhases[currentPhaseIndex]?.name.charAt(0).toUpperCase() + 
                 sessionPhases[currentPhaseIndex]?.name.slice(1)}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Play/Pause Button */}
          <motion.button
            onClick={() => setIsActive(!isActive)}
            className={`${session.color} text-white p-4 rounded-full shadow-lg`}
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={isActive ? FiPause : FiPlay} className="w-8 h-8" />
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-full p-2">
          <div className="bg-white rounded-full h-2 relative overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getCircleColor()}`}
              initial={{ width: 0 }}
              animate={{ 
                width: `${((session.duration === '2 min' ? 120 : 
                  session.duration === '5 min' ? 300 : 
                  session.duration === '8 min' ? 480 : 720) - timeRemaining) / 
                  (session.duration === '2 min' ? 120 : 
                  session.duration === '5 min' ? 300 : 
                  session.duration === '8 min' ? 480 : 720) * 100}%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingSession;