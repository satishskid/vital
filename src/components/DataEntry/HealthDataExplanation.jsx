import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiUser, FiSmartphone, FiShield, FiZap, FiInfo, FiX } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const HealthDataExplanation = ({ isOpen, onClose, showWhyCard }) => {
  const [activeTab, setActiveTab] = useState('simple');

  const tabs = [
    { id: 'simple', label: 'Simple Approach', icon: FiUser },
    { id: 'smart', label: 'Smart Integration', icon: FiSmartphone },
    { id: 'privacy', label: 'Privacy & Security', icon: FiShield }
  ];

  const handleLearnMore = (topic) => {
    const content = {
      manual: {
        title: 'Manual Entry - Trust Your Body Wisdom',
        content: 'You know your body better than any device. Manual entry lets you record how you actually feel - your energy levels, sleep quality, and recovery state. This personal awareness is often more accurate than automated tracking.',
        source: 'Body awareness and mindful health tracking'
      },
      automation: {
        title: 'Smart Automation - Technology That Serves You',
        content: 'Your phone already tracks your movement, sleep patterns, and health app data. Vita can intelligently capture this information while keeping everything private and secure on your device.',
        source: 'Privacy-first automated health tracking'
      },
      privacy: {
        title: 'Your Data, Your Control',
        content: 'Whether you choose manual entry or smart integration, your health data belongs to you. Vita processes everything locally on your device and never shares your personal health information without your explicit consent.',
        source: 'Privacy-by-design health technology'
      }
    };

    showWhyCard(content[topic]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiHeart} className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">How Vita Tracks Your Health</h2>
                  <p className="text-purple-100 text-sm">Simple, private, and completely under your control</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 p-1"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'simple' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="bg-purple-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="w-12 h-12 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      You Know Your Body Best
                    </h3>
                    <p className="text-gray-600">
                      Manual entry puts you in complete control of your health data
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">✨ Why This Works</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• You understand your energy levels better than any device</li>
                        <li>• Quick daily check-ins take less than 2 minutes</li>
                        <li>• No complex setup or permissions needed</li>
                        <li>• 100% private - data stays with you</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">📱 What You'll Track</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• How well you slept (quality, not just hours)</li>
                        <li>• Your energy and mood levels</li>
                        <li>• Movement and activity (as you feel it)</li>
                        <li>• Recovery and stress levels</li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => handleLearnMore('manual')}
                      className="text-purple-600 hover:text-purple-700 flex items-center space-x-1 mx-auto"
                    >
                      <SafeIcon icon={FiInfo} className="w-4 h-4" />
                      <span>Learn more about body awareness tracking</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'smart' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="bg-blue-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                      <SafeIcon icon={FiSmartphone} className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Let Technology Help You
                    </h3>
                    <p className="text-gray-600">
                      Your phone can automatically capture health data while protecting your privacy
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-blue-800 mb-3">🚀 How It Works (Super Simple!)</h4>
                    <div className="space-y-3 text-sm text-blue-700">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                        <span>You tap "Enable Smart Integration"</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                        <span>Give permission when your phone asks</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                        <span>That's it! Vita handles everything else automatically</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">📊 What Gets Captured</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Steps and movement from your phone</li>
                        <li>• Health app notifications (Apple Health, Fitbit, etc.)</li>
                        <li>• Sleep patterns and activity data</li>
                        <li>• Heart rate and wellness metrics</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">⚡ The Magic</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Works in the background automatically</li>
                        <li>• No manual data entry needed</li>
                        <li>• Combines data from multiple sources</li>
                        <li>• Updates your vitality rings in real-time</li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => handleLearnMore('automation')}
                      className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 mx-auto"
                    >
                      <SafeIcon icon={FiInfo} className="w-4 h-4" />
                      <span>Learn more about smart automation</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                      <SafeIcon icon={FiShield} className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Your Privacy is Sacred
                    </h3>
                    <p className="text-gray-600">
                      We believe your health data belongs to you, period.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">🔒 What We Protect</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• All health data stays on your device</li>
                        <li>• No sharing without your explicit consent</li>
                        <li>• No selling data to third parties</li>
                        <li>• You can delete everything anytime</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">🛡️ How We Protect It</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Local processing on your device only</li>
                        <li>• Encrypted data storage</li>
                        <li>• No cloud uploads without permission</li>
                        <li>• Open source transparency</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <SafeIcon icon={FiInfo} className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-1">Your Choice, Always</h4>
                        <p className="text-sm text-yellow-700">
                          You can switch between manual entry and smart integration anytime. 
                          You can also adjust privacy settings, export your data, or delete everything 
                          whenever you want. You're always in control.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => handleLearnMore('privacy')}
                      className="text-green-600 hover:text-green-700 flex items-center space-x-1 mx-auto"
                    >
                      <SafeIcon icon={FiInfo} className="w-4 h-4" />
                      <span>Learn more about our privacy commitment</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiHeart} className="w-4 h-4" />
                <span>Built with privacy and simplicity in mind</span>
              </div>
              <button
                onClick={onClose}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HealthDataExplanation;
