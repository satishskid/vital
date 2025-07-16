import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiSmartphone, FiUser, FiShield, FiZap, FiInfo } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const DataEntryOptions = ({ onOptionSelect, showWhyCard }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onOptionSelect(option);
  };

  const handleLearnMore = (option) => {
    const content = {
      manual: {
        title: 'Manual Entry - You Know Your Body Best',
        content: 'Trust your own awareness of how you feel, how much you\'ve moved, and how well you\'ve recovered. Your personal insights are often more accurate than any device. Vita believes in your ability to understand your own vitality.',
        source: 'Privacy-first health tracking'
      },
      smart: {
        title: 'Smart Integration - Let Your Phone Help',
        content: 'Your phone already tracks steps, sleep patterns, and health app data. Vita can intelligently capture this information in the background while keeping everything private and secure on your device.',
        source: 'Automated health data collection'
      }
    };

    showWhyCard(content[option]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          How would you like to track your vitality?
        </h2>
        <p className="text-gray-600">
          Choose the approach that feels right for you. You can always change this later.
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-8">
        {/* Manual Entry Option */}
        <motion.div
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
            selectedOption === 'manual' 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-200 hover:border-purple-300'
          }`}
          onClick={() => handleOptionSelect('manual')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <SafeIcon icon={FiUser} className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Manual Entry - I'll Add My Own Data
              </h3>
              <p className="text-gray-600 mb-3">
                You know your body best. Simply tell Vita how you're feeling, how much you've moved, 
                and how well you've recovered. Quick, private, and completely under your control.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-green-600">
                  <SafeIcon icon={FiShield} className="w-4 h-4" />
                  <span>100% Private</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-600">
                  <SafeIcon icon={FiZap} className="w-4 h-4" />
                  <span>Quick & Easy</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLearnMore('manual');
                  }}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                >
                  <SafeIcon icon={FiInfo} className="w-4 h-4" />
                  <span>Learn More</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Smart Integration Option */}
        <motion.div
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
            selectedOption === 'smart' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleOptionSelect('smart')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <SafeIcon icon={FiSmartphone} className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Smart Integration - Let My Phone Help
              </h3>
              <p className="text-gray-600 mb-3">
                Your phone already tracks your steps, sleep, and health apps. Let Vita intelligently 
                capture this data in the background. One-time setup, then it works automatically.
              </p>
              <div className="bg-blue-100 rounded-lg p-3 mb-3">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> Just tap "Enable" → Give permission → You're set! 
                  Vita handles all the technical stuff behind the scenes.
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-green-600">
                  <SafeIcon icon={FiShield} className="w-4 h-4" />
                  <span>Privacy Protected</span>
                </div>
                <div className="flex items-center space-x-1 text-purple-600">
                  <SafeIcon icon={FiZap} className="w-4 h-4" />
                  <span>Automatic</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLearnMore('smart');
                  }}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                >
                  <SafeIcon icon={FiInfo} className="w-4 h-4" />
                  <span>Learn More</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Privacy Assurance */}
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <SafeIcon icon={FiShield} className="w-5 h-5 text-green-600" />
          <h4 className="font-semibold text-gray-800">Your Privacy is Protected</h4>
        </div>
        <p className="text-sm text-gray-600">
          Whether you choose manual entry or smart integration, your health data stays private and secure. 
          You're always in control of what gets shared and what stays private.
        </p>
      </div>

      {/* Continue Button */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => onOptionSelect(selectedOption)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Continue with {selectedOption === 'manual' ? 'Manual Entry' : 'Smart Integration'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DataEntryOptions;
