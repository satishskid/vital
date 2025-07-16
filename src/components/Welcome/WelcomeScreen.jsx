import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiArrowRight, FiHeart, FiSun, FiMoon, FiActivity, FiDroplet, FiUsers, FiShield } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import PodcastPlayer from '../Audio/PodcastPlayer';

const WelcomeScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasListened, setHasListened] = useState(false);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Vita',
      subtitle: 'Your Science-Based Vitality Companion'
    },
    {
      id: 'podcast',
      title: 'Six Golden Habits for Enduring Youth',
      subtitle: 'Listen to the science behind your vitality journey'
    },
    {
      id: 'pillars',
      title: 'Your Six Vitality Pillars',
      subtitle: 'The foundation of your wellness transformation'
    },
    {
      id: 'ready',
      title: 'Ready to Begin?',
      subtitle: 'Let\'s start your personalized vitality journey'
    }
  ];

  const sixPillars = [
    {
      icon: FiMoon,
      title: 'Recovery',
      description: 'Quality sleep and stress management',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      icon: FiActivity,
      title: 'Movement',
      description: 'Physical activity and exercise',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      icon: FiHeart,
      title: 'Nutrition',
      description: 'Mindful eating and nourishment',
      color: 'from-red-400 to-pink-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      icon: FiSun,
      title: 'Mindfulness',
      description: 'Mental clarity and emotional balance',
      color: 'from-purple-400 to-indigo-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      icon: FiDroplet,
      title: 'Hydration',
      description: 'Optimal fluid balance and cellular health',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      icon: FiUsers,
      title: 'Connection',
      description: 'Social wellness and community',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePodcastProgress = (progress) => {
    if (progress > 0.1 && !hasListened) {
      setHasListened(true);
    }
  };

  const WelcomeStep = () => (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="mb-8"
      >
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
          <SafeIcon icon={FiHeart} className="w-16 h-16 text-white" />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Vita</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your science-based companion for building enduring vitality through evidence-backed habits and mindful awareness.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <SafeIcon icon={FiShield} className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Privacy First</h3>
            <p className="text-sm text-gray-600">Your health data stays private and secure, always under your control.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <SafeIcon icon={FiHeart} className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Science-Based</h3>
            <p className="text-sm text-gray-600">Every feature backed by peer-reviewed research and evidence.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <SafeIcon icon={FiSun} className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Holistic Approach</h3>
            <p className="text-sm text-gray-600">Address all aspects of vitality for lasting transformation.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const PodcastStep = () => (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Six Golden Habits for Enduring Youth</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Before we begin your journey, listen to the foundational science behind Vita's approach to vitality and longevity.
        </p>
      </motion.div>

      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto mb-8">
        <PodcastPlayer
          audioSrc="/audio/Six Golden Habits for Enduring Youth.wav"
          title="Six Golden Habits for Enduring Youth"
          description="The scientific foundation for your vitality transformation"
        />
      </div>

      <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
        <h3 className="font-semibold text-blue-800 mb-2">Why Listen First?</h3>
        <p className="text-blue-700 text-sm">
          Understanding the science behind vitality helps you make informed decisions about your health journey. 
          This podcast explains the research that powers every feature in Vita.
        </p>
      </div>
    </div>
  );

  const PillarsStep = () => (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Six Vitality Pillars</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Vita tracks and optimizes these six interconnected aspects of your health, creating a comprehensive picture of your vitality.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sixPillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${pillar.bgColor} rounded-xl p-6 text-center`}
          >
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${pillar.color} rounded-full flex items-center justify-center`}>
              <SafeIcon icon={pillar.icon} className="w-8 h-8 text-white" />
            </div>
            <h3 className={`font-bold text-lg ${pillar.textColor} mb-2`}>{pillar.title}</h3>
            <p className="text-sm text-gray-600">{pillar.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 max-w-3xl mx-auto">
        <h3 className="font-semibold text-gray-800 mb-2">The Vita Difference</h3>
        <p className="text-gray-700 text-sm">
          Unlike apps that focus on single metrics, Vita understands that true vitality comes from the synergy 
          between all six pillars. Your personalized vitality score reflects this holistic approach.
        </p>
      </div>
    </div>
  );

  const ReadyStep = () => (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <SafeIcon icon={FiArrowRight} className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Begin Your Journey?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          You now understand the science and pillars behind Vita. Let's set up your personalized vitality tracking.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">What's Next?</h3>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• Choose your data tracking preference</li>
            <li>• Set up your health profile</li>
            <li>• Start building your vitality habits</li>
            <li>• Watch your vitality rings grow</li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Remember</h3>
          <p className="text-sm text-gray-600 text-left">
            Vita is your companion, not your judge. Every small step toward vitality matters, 
            and you're always in control of your journey.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'welcome': return <WelcomeStep />;
      case 'podcast': return <PodcastStep />;
      case 'pillars': return <PillarsStep />;
      case 'ready': return <ReadyStep />;
      default: return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-600">{steps[currentStep].title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {renderStep()}
        </motion.div>

        {/* Navigation */}
        <div className="max-w-2xl mx-auto mt-12 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            disabled={currentStep === 0}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              (currentStep === 1 && !hasListened)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            }`}
            disabled={currentStep === 1 && !hasListened}
          >
            <span>{currentStep === steps.length - 1 ? 'Start Your Journey' : 'Continue'}</span>
            <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
          </button>
        </div>

        {/* Podcast listening requirement notice */}
        {currentStep === 1 && !hasListened && (
          <div className="max-w-2xl mx-auto mt-4">
            <p className="text-center text-sm text-gray-500">
              Please listen to at least 10% of the podcast to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
