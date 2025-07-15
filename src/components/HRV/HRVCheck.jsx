import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiHeart, FiInfo, FiCamera, FiCheck, FiTrendingUp } = FiIcons;

const HRVCheck = ({ showWhyCard }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const startHRVCheck = () => {
    setIsChecking(true);
    setProgress(0);
    setResult(null);
    
    // Simulate HRV measurement progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsChecking(false);
          // Simulate HRV result
          const results = [
            { status: 'Primed & Ready', score: 85, color: 'text-green-600', bg: 'bg-green-100' },
            { status: 'In Balance', score: 65, color: 'text-blue-600', bg: 'bg-blue-100' },
            { status: 'Time to Recover', score: 45, color: 'text-orange-600', bg: 'bg-orange-100' }
          ];
          setResult(results[Math.floor(Math.random() * results.length)]);
          return 100;
        }
        return prev + 2;
      });
    }, 120);
  };

  const handleInfoClick = () => {
    showWhyCard({
      title: 'Heart Rate Variability (HRV)',
      content: 'HRV measures the variation in time between heartbeats, reflecting your autonomic nervous system balance. Higher HRV typically indicates better recovery capacity and stress resilience.',
      source: 'Thayer & Lane (2009), Neuroscience & Biobehavioral Reviews'
    });
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Morning Readiness</h1>
            <p className="text-gray-600">Check your HRV to understand your body's readiness</p>
          </div>
          <motion.button
            onClick={handleInfoClick}
            className="bg-red-100 text-red-600 p-3 rounded-full"
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiInfo} className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      <div className="px-6 py-8">
        <AnimatePresence mode="wait">
          {showInstructions && !isChecking && !result && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl p-6 shadow-sm mb-6"
            >
              <div className="text-center mb-6">
                <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <SafeIcon icon={FiCamera} className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">HRV Measurement</h2>
                <p className="text-gray-600">Place your finger on the rear camera lens</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 text-red-600 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Cover the camera completely</h3>
                    <p className="text-sm text-gray-600">Make sure your finger covers both the camera and flash</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 text-red-600 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Stay still for 60 seconds</h3>
                    <p className="text-sm text-gray-600">Keep your finger steady and breathe normally</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 text-red-600 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Find a quiet space</h3>
                    <p className="text-sm text-gray-600">Minimize distractions for the most accurate reading</p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={startHRVCheck}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold"
                whileTap={{ scale: 0.98 }}
              >
                Start HRV Check
              </motion.button>
            </motion.div>
          )}

          {isChecking && (
            <motion.div
              key="checking"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-8 shadow-sm text-center"
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#fee2e2"
                      strokeWidth="6"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#dc2626"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={283}
                      strokeDashoffset={283 - (283 * progress) / 100}
                      transition={{ duration: 0.1 }}
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="breathing-animation">
                      <SafeIcon icon={FiHeart} className="w-8 h-8 text-red-600 mb-2" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{progress}%</div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-2">Measuring HRV</h2>
              <p className="text-gray-600 mb-4">Keep your finger on the camera</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-red-600 rounded-full pulse-dot"></div>
                <span className="text-sm text-gray-500">Stay still and breathe normally</span>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className={`${result.bg} p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center`}>
                  <SafeIcon icon={FiCheck} className={`w-8 h-8 ${result.color}`} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{result.status}</h2>
                <p className="text-gray-600 mb-4">HRV Score: {result.score}</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">What this means:</h3>
                  <p className="text-sm text-gray-600">
                    {result.status === 'Primed & Ready' && 
                      "Your body is well-recovered and ready for challenges. Great time for intense activities or learning new skills."}
                    {result.status === 'In Balance' && 
                      "Your system is balanced. Perfect for moderate activities and maintaining your current routine."}
                    {result.status === 'Time to Recover' && 
                      "Your body is asking for gentleness. Focus on rest, light movement, and stress-reduction techniques."}
                  </p>
                </div>

                <motion.button
                  onClick={() => {
                    setResult(null);
                    setShowInstructions(true);
                  }}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold"
                  whileTap={{ scale: 0.98 }}
                >
                  Check Again
                </motion.button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Recommended Actions</h3>
                <div className="space-y-3">
                  {result.status === 'Primed & Ready' && (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">Try a challenging workout</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <SafeIcon icon={FiHeart} className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">Learn something new</span>
                      </div>
                    </>
                  )}
                  {result.status === 'In Balance' && (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <SafeIcon icon={FiHeart} className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-gray-700">Moderate exercise</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <SafeIcon icon={FiHeart} className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-gray-700">Maintain routine</span>
                      </div>
                    </>
                  )}
                  {result.status === 'Time to Recover' && (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <SafeIcon icon={FiHeart} className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-gray-700">Gentle movement</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <SafeIcon icon={FiHeart} className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-gray-700">Focus on rest</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HRVCheck;