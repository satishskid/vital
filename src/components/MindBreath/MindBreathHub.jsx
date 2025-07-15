import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import BreathingSession from './BreathingSession';

const { FiHeart, FiWind, FiSun, FiMoon, FiPlay, FiInfo, FiClock } = FiIcons;

const MindBreathHub = ({ showWhyCard }) => {
  const [activeSession, setActiveSession] = useState(null);

  const sessions = [
    {
      id: 1,
      title: 'Physiological Sigh',
      description: 'Quick stress relief in 2 minutes',
      duration: '2 min',
      icon: FiWind,
      color: 'bg-blue-500',
      bgColor: 'from-blue-50 to-cyan-50',
      benefits: ['Reduces stress', 'Calms nervous system', 'Improves focus'],
      technique: 'Double inhale through nose, long exhale through mouth'
    },
    {
      id: 2,
      title: 'Box Breathing',
      description: 'Balance your nervous system',
      duration: '5 min',
      icon: FiHeart,
      color: 'bg-purple-500',
      bgColor: 'from-purple-50 to-pink-50',
      benefits: ['Balances autonomic nervous system', 'Increases focus', 'Reduces anxiety'],
      technique: 'Inhale 4, hold 4, exhale 4, hold 4'
    },
    {
      id: 3,
      title: 'Morning Intention',
      description: 'Start your day with purpose',
      duration: '8 min',
      icon: FiSun,
      color: 'bg-orange-500',
      bgColor: 'from-orange-50 to-yellow-50',
      benefits: ['Sets positive tone', 'Increases motivation', 'Enhances clarity'],
      technique: 'Guided meditation with intention setting'
    },
    {
      id: 4,
      title: 'Body Scan',
      description: 'Release tension and relax',
      duration: '12 min',
      icon: FiMoon,
      color: 'bg-indigo-500',
      bgColor: 'from-indigo-50 to-purple-50',
      benefits: ['Reduces muscle tension', 'Improves sleep', 'Increases body awareness'],
      technique: 'Progressive muscle relaxation'
    }
  ];

  const handleSessionStart = (session) => {
    setActiveSession(session);
  };

  const handleSessionEnd = () => {
    setActiveSession(null);
  };

  const handleInfoClick = (session) => {
    showWhyCard({
      title: session.title,
      content: `${session.technique}. Benefits include: ${session.benefits.join(', ')}.`,
      source: 'Research in Neuroscience & Behavioral Psychology'
    });
  };

  if (activeSession) {
    return (
      <BreathingSession 
        session={activeSession} 
        onEnd={handleSessionEnd}
        showWhyCard={showWhyCard}
      />
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mind & Breath</h1>
            <p className="text-gray-600">Guided sessions for mental wellness</p>
          </div>
          <motion.button
            onClick={() => showWhyCard({
              title: 'Breathwork & Meditation',
              content: 'Controlled breathing directly influences the vagus nerve, activating the parasympathetic nervous system and reducing stress hormones like cortisol.',
              source: 'Zaccaro et al. (2018), Frontiers in Psychology'
            })}
            className="bg-purple-100 text-purple-600 p-3 rounded-full"
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiInfo} className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Today's Recommendation */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Recommended for You</h2>
          <p className="text-gray-600 mb-4">Based on your morning HRV reading</p>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500 p-3 rounded-full">
                <SafeIcon icon={FiWind} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Physiological Sigh</h3>
                <p className="text-sm text-gray-600">Perfect for your current stress levels</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`${session.color} p-3 rounded-full`}>
                    <SafeIcon icon={session.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{session.title}</h3>
                    <p className="text-sm text-gray-600">{session.description}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleInfoClick(session)}
                  className="text-gray-400 hover:text-gray-600"
                  whileTap={{ scale: 0.9 }}
                >
                  <SafeIcon icon={FiInfo} className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{session.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Available</span>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleSessionStart(session)}
                  className={`${session.color} text-white px-6 py-2 rounded-full font-medium flex items-center space-x-2`}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={FiPlay} className="w-4 h-4" />
                  <span>Start</span>
                </motion.button>
              </div>

              {/* Benefits */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {session.benefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
          <h3 className="font-semibold text-gray-800 mb-4">This Week's Progress</h3>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-500 mb-1">{day}</div>
                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                  index < 4 ? 'bg-purple-500 text-white' : 'bg-gray-200'
                }`}>
                  {index < 4 && <SafeIcon icon={FiHeart} className="w-4 h-4" />}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-purple-600">4 sessions</span> completed this week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindBreathHub;