import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHeart, FiZap, FiMic, FiPlay, FiPause, FiVolume2,
  FiUser, FiSun, FiMoon, FiWind, FiCircle, FiSquare,
  FiTriangle, FiRefreshCw, FiCheckCircle, FiClock
} from 'react-icons/fi';
import { useAuth } from '../../context/FirebaseAuthContext';

const SelfConnectHub = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // inhale, hold, exhale, pause
  const [breathingCount, setBreathingCount] = useState(0);
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const { saveHealthData, user } = useAuth();

  // Box Breathing Pattern (4-4-4-4)
  const boxBreathingPattern = {
    inhale: 4000,   // 4 seconds
    hold1: 4000,    // 4 seconds
    exhale: 4000,   // 4 seconds
    hold2: 4000     // 4 seconds
  };

  const mindfulnessExercises = [
    {
      id: 'box-breathing',
      name: 'Box Breathing',
      icon: FiSquare,
      duration: '5-10 minutes',
      description: 'Navy SEAL technique for stress reduction and focus',
      benefits: ['Reduces anxiety', 'Improves focus', 'Calms nervous system', 'Enhances performance'],
      instructions: [
        'Inhale for 4 counts',
        'Hold for 4 counts',
        'Exhale for 4 counts',
        'Hold empty for 4 counts',
        'Repeat the cycle'
      ]
    },
    {
      id: 'body-scan',
      name: 'Body Scan Meditation',
      icon: FiUser,
      duration: '10-20 minutes',
      description: 'Progressive relaxation and body awareness',
      benefits: ['Releases tension', 'Improves body awareness', 'Promotes relaxation', 'Better sleep'],
      instructions: [
        'Lie down comfortably',
        'Start with your toes',
        'Notice sensations without judgment',
        'Move slowly up your body',
        'End with your head and face'
      ]
    },
    {
      id: 'loving-kindness',
      name: 'Loving-Kindness Meditation',
      icon: FiHeart,
      duration: '10-15 minutes',
      description: 'Cultivate compassion for self and others',
      benefits: ['Increases self-compassion', 'Reduces negative emotions', 'Improves relationships', 'Boosts mood'],
      instructions: [
        'Start with yourself: "May I be happy"',
        'Extend to loved ones',
        'Include neutral people',
        'Embrace difficult relationships',
        'Expand to all beings'
      ]
    },
    {
      id: 'mindful-walking',
      name: 'Mindful Walking',
      icon: FiWind,
      duration: '5-30 minutes',
      description: 'Moving meditation for daily life',
      benefits: ['Grounds you in present', 'Combines movement with mindfulness', 'Accessible anywhere', 'Improves focus'],
      instructions: [
        'Walk slower than normal',
        'Feel each step',
        'Notice your surroundings',
        'Return attention when mind wanders',
        'End with gratitude'
      ]
    }
  ];

  const brainExercises = [
    {
      id: 'memory-palace',
      name: 'Memory Palace',
      icon: FiZap,
      difficulty: 'Intermediate',
      description: 'Ancient technique for enhancing memory',
      exercise: 'Visualize a familiar place and associate items you want to remember with specific locations'
    },
    {
      id: 'dual-n-back',
      name: 'Dual N-Back',
      icon: FiRefreshCw,
      difficulty: 'Advanced',
      description: 'Working memory training exercise',
      exercise: 'Remember sequences of positions and sounds, improving working memory capacity'
    },
    {
      id: 'gratitude-practice',
      name: 'Gratitude Reflection',
      icon: FiSun,
      difficulty: 'Beginner',
      description: 'Daily practice for positive mindset',
      exercise: 'Write or think of 3 specific things you\'re grateful for and why they matter to you'
    },
    {
      id: 'visualization',
      name: 'Goal Visualization',
      icon: FiCircle,
      difficulty: 'Beginner',
      description: 'Mental rehearsal for success',
      exercise: 'Vividly imagine achieving your goals, including emotions, sensations, and details'
    }
  ];

  const innerVoicePrompts = [
    "How am I feeling right now, and what might be causing these emotions?",
    "What am I most grateful for today?",
    "What challenge am I facing, and what would my wisest self advise?",
    "What patterns do I notice in my thoughts and behaviors?",
    "How can I show myself more compassion today?",
    "What would I tell a good friend in my situation?",
    "What small step can I take toward my goals today?",
    "What am I learning about myself through this experience?"
  ];

  // Box Breathing Logic
  useEffect(() => {
    let interval;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingPhase(prev => {
          switch (prev) {
            case 'inhale': return 'hold1';
            case 'hold1': return 'exhale';
            case 'exhale': return 'hold2';
            case 'hold2': 
              setBreathingCount(c => c + 1);
              return 'inhale';
            default: return 'inhale';
          }
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  const startBoxBreathing = () => {
    setBreathingActive(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');
  };

  const stopBoxBreathing = () => {
    setBreathingActive(false);
    setBreathingPhase('inhale');
  };

  const logMindfulnessSession = async (exerciseId, duration) => {
    try {
      await saveHealthData({
        mindfulness: {
          exercise: exerciseId,
          duration: duration,
          timestamp: new Date().toISOString(),
          mood: 'calm'
        }
      });
    } catch (error) {
      console.error('Error logging mindfulness session:', error);
    }
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold Empty';
      default: return 'Breathe In';
    }
  };

  const getBreathingColor = () => {
    switch (breathingPhase) {
      case 'inhale': return 'from-blue-400 to-cyan-500';
      case 'hold1': return 'from-purple-400 to-blue-500';
      case 'exhale': return 'from-green-400 to-emerald-500';
      case 'hold2': return 'from-gray-400 to-gray-500';
      default: return 'from-blue-400 to-cyan-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Self Connect
          </h1>
          <p className="text-gray-600 text-sm">
            Inner voice, mindfulness & brain training
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
              activeSection === 'overview'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection('mindfulness')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
              activeSection === 'mindfulness'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mindfulness
          </button>
          <button
            onClick={() => setActiveSection('brain')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
              activeSection === 'brain'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Brain Training
          </button>
          <button
            onClick={() => setActiveSection('journal')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
              activeSection === 'journal'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Inner Voice
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quick Start */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Start</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={startBoxBreathing}
                    className="p-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg text-white text-center"
                  >
                    <FiSquare className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Box Breathing</div>
                    <div className="text-xs opacity-90">2 minutes</div>
                  </button>
                  <button
                    onClick={() => setActiveSection('journal')}
                    className="p-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg text-white text-center"
                  >
                    <FiMic className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Inner Voice</div>
                    <div className="text-xs opacity-90">Reflect</div>
                  </button>
                </div>
              </div>

              {/* Today's Focus */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Self-Connection</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <FiSquare className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">Morning Breathing</div>
                        <div className="text-sm text-gray-600">Start your day centered</div>
                      </div>
                    </div>
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FiMic className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-800">Evening Reflection</div>
                        <div className="text-sm text-gray-600">Process your day</div>
                      </div>
                    </div>
                    <FiClock className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Why Self-Connection Matters</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiZap className="w-5 h-5 text-purple-600 mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium text-gray-800">Enhances Self-Awareness</div>
                      <div className="text-sm text-gray-600">Better understanding of thoughts and emotions</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiHeart className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium text-gray-800">Reduces Stress</div>
                      <div className="text-sm text-gray-600">Activates parasympathetic nervous system</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiSun className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium text-gray-800">Improves Focus</div>
                      <div className="text-sm text-gray-600">Strengthens attention and concentration</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'mindfulness' && (
            <motion.div
              key="mindfulness"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Box Breathing Interface */}
              {breathingActive && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <motion.div
                    className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${getBreathingColor()} flex items-center justify-center mb-4`}
                    animate={{
                      scale: breathingPhase === 'inhale' ? 1.2 : breathingPhase === 'exhale' ? 0.8 : 1
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                  >
                    <FiSquare className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{getBreathingInstruction()}</h3>
                  <p className="text-gray-600 mb-4">Cycle {breathingCount + 1}</p>
                  <button
                    onClick={stopBoxBreathing}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Stop
                  </button>
                </div>
              )}

              {/* Mindfulness Exercises */}
              <div className="space-y-4">
                {mindfulnessExercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center mr-3">
                        <exercise.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
                        <p className="text-xs text-gray-500">{exercise.duration}</p>
                      </div>
                      {exercise.id === 'box-breathing' && (
                        <button
                          onClick={breathingActive ? stopBoxBreathing : startBoxBreathing}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            breathingActive
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                        >
                          {breathingActive ? 'Stop' : 'Start'}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>

                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {exercise.benefits.map((benefit, idx) => (
                          <span key={idx} className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Instructions:</h4>
                      <div className="space-y-1">
                        {exercise.instructions.map((instruction, idx) => (
                          <div key={idx} className="flex items-start">
                            <span className="w-4 h-4 bg-purple-100 text-purple-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-xs text-gray-600">{instruction}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'brain' && (
            <motion.div
              key="brain"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Brain Training Exercises */}
              <div className="space-y-4">
                {brainExercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-3">
                        <exercise.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          exercise.difficulty === 'Beginner' ? 'bg-green-100 text-green-600' :
                          exercise.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                      <button
                        onClick={() => logMindfulnessSession(exercise.id, 10)}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        Start
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>

                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Exercise:</h4>
                      <p className="text-sm text-blue-700">{exercise.exercise}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Voice Recording Interface */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Inner Voice Journal</h2>
                  <p className="text-sm text-gray-600">Reflect on your thoughts and feelings</p>
                </div>

                <div className="flex justify-center mb-6">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-purple-500 hover:bg-purple-600'
                    }`}
                  >
                    <FiMic className="w-8 h-8 text-white" />
                  </button>
                </div>

                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600">
                    {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
                  </p>
                  {isRecording && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full animate-pulse" style={{width: '45%'}}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reflection Prompts */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Reflection Prompts</h3>
                <div className="space-y-3">
                  {innerVoicePrompts.map((prompt, index) => (
                    <div key={index} className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <p className="text-sm text-gray-700">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-start">
                  <FiUser className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Privacy First</h4>
                    <p className="text-sm text-yellow-700">
                      Your voice recordings are processed locally on your device and can be automatically deleted after processing for maximum privacy.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SelfConnectHub;
