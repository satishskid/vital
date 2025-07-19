import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiSun, FiActivity, FiZap, FiMoon, FiHeart, FiSmile, FiArrowRight, FiCheck } = FiIcons;

const LongevityOnboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Your Longevity Journey",
      subtitle: "Transform your biological age through science-backed habits",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🧠</div>
          <p className="text-lg text-gray-700">
            Your biological age isn't fixed by time - it's <strong>earned through your daily habits</strong>.
          </p>
          <p className="text-gray-600">
            Based on neuroscience research, we'll help you track 6 key habits that can 
            slow or even reverse your biological aging process.
          </p>
        </div>
      )
    },
    {
      title: "The 6 Neuroscience-Backed Longevity Habits",
      subtitle: "Each habit contributes to your biological age optimization",
      content: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: FiSun, name: "Circadian Rhythm", desc: "Light & meal timing", color: "text-yellow-600" },
            { icon: FiActivity, name: "Intentional Movement", desc: "Cognitive enhancement", color: "text-green-600" },
            { icon: FiZap, name: "Controlled Stress", desc: "Resilience building", color: "text-red-600" },
            { icon: FiMoon, name: "Quality Sleep", desc: "Brain detoxification", color: "text-indigo-600" },
            { icon: FiHeart, name: "Nutrient-Dense Eating", desc: "Brain-supporting foods", color: "text-emerald-600" },
            { icon: FiSmile, name: "Positive Self-Narrative", desc: "Mindset & social wellness", color: "text-pink-600" }
          ].map((habit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <SafeIcon icon={habit.icon} className={`w-8 h-8 ${habit.color} mb-2`} />
              <h4 className="font-semibold text-gray-800 text-sm">{habit.name}</h4>
              <p className="text-xs text-gray-600">{habit.desc}</p>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: "Your Simple Daily Cycle",
      subtitle: "Track → Reflect → Act → Improve",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold text-gray-800">LOG Your Habits</h4>
              <p className="text-sm text-gray-600">Quick, simple tracking of your 6 longevity habits</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
            <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold text-gray-800">REFLECT on Your Status</h4>
              <p className="text-sm text-gray-600">See how your habits impact your biological age</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold text-gray-800">ACT on Insights</h4>
              <p className="text-sm text-gray-600">Get personalized nudges and motivation to improve</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 italic">
              This simple cycle helps you build habits that reverse biological aging
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Your Biological Age Journey Starts Now",
      subtitle: "Ready to earn a younger biological age?",
      content: (
        <div className="text-center space-y-6">
          <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white p-6 rounded-xl">
            <div className="text-4xl font-bold mb-2">Your Age</div>
            <div className="flex items-center justify-center space-x-4">
              <div>
                <div className="text-2xl font-bold opacity-60">35</div>
                <div className="text-sm opacity-80">Calendar Age</div>
              </div>
              <div className="text-2xl">→</div>
              <div>
                <div className="text-2xl font-bold">?</div>
                <div className="text-sm opacity-80">Biological Age</div>
              </div>
            </div>
            <p className="text-sm mt-3 opacity-90">
              Your biological age will be calculated based on your 6 longevity habits
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800">
              Start tracking your habits today and watch your biological age improve!
            </p>
            <p className="text-gray-600">
              Every habit you track brings you closer to a younger, healthier you.
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Progress Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-purple-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 mb-6">
                {steps[currentStep].subtitle}
              </p>
              
              <div className="text-left">
                {steps[currentStep].content}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Back
              </button>

              <div className="text-sm text-gray-500">
                {currentStep + 1} of {steps.length}
              </div>

              <button
                onClick={nextStep}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
              >
                <span>{currentStep === steps.length - 1 ? 'Start Journey' : 'Next'}</span>
                <SafeIcon icon={currentStep === steps.length - 1 ? FiCheck : FiArrowRight} className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LongevityOnboarding;
