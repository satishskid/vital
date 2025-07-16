import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSmartphone, FiCheck, FiShield, FiZap, FiHeart, FiActivity, FiMoon, FiArrowRight } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const SmartIntegrationSetup = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [permissions, setPermissions] = useState({
    notifications: false,
    healthApps: false,
    sensors: false
  });

  const steps = [
    {
      title: 'Welcome to Smart Integration',
      description: 'Let Vita automatically capture your health data from your phone and apps',
      component: 'welcome'
    },
    {
      title: 'Enable Notification Intelligence',
      description: 'Capture health data from your existing apps (Apple Health, Fitbit, etc.)',
      component: 'notifications'
    },
    {
      title: 'Phone Sensor Access',
      description: 'Use your phone\'s built-in sensors for movement and activity tracking',
      component: 'sensors'
    },
    {
      title: 'Setup Complete!',
      description: 'Your smart integration is ready. Vita will now work automatically.',
      component: 'complete'
    }
  ];

  const handlePermissionGrant = async (type) => {
    try {
      let granted = false;
      
      if (type === 'notifications') {
        // Request notification permission
        const permission = await Notification.requestPermission();
        granted = permission === 'granted';
      } else if (type === 'sensors') {
        // Request device motion permission (iOS 13+)
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
          const permission = await DeviceMotionEvent.requestPermission();
          granted = permission === 'granted';
        } else {
          granted = true; // Android or older iOS
        }
      }

      setPermissions(prev => ({ ...prev, [type]: granted }));
      
      if (granted) {
        setTimeout(() => setCurrentStep(prev => prev + 1), 1000);
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const WelcomeStep = () => (
    <div className="text-center">
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-8 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
        <SafeIcon icon={FiSmartphone} className="w-16 h-16 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Smart Integration Setup
      </h3>
      <p className="text-gray-600 mb-6">
        We'll help you set up automatic health data capture in just a few simple steps. 
        This is completely optional and you can change these settings anytime.
      </p>
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-800 mb-2">What Vita will capture:</h4>
        <div className="space-y-2 text-sm text-blue-700">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiActivity} className="w-4 h-4" />
            <span>Steps and movement from your phone</span>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiHeart} className="w-4 h-4" />
            <span>Health data from your existing apps</span>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiMoon} className="w-4 h-4" />
            <span>Sleep and recovery patterns</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => setCurrentStep(1)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Let's Get Started
      </button>
    </div>
  );

  const NotificationStep = () => (
    <div className="text-center">
      <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <SafeIcon icon={FiZap} className="w-12 h-12 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Capture Health App Data
      </h3>
      <p className="text-gray-600 mb-6">
        Vita can intelligently read notifications from your health apps (like Apple Health, Fitbit, etc.) 
        to automatically capture your health data. This happens privately on your device.
      </p>
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <SafeIcon icon={FiShield} className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-800">Privacy Protected</span>
        </div>
        <p className="text-sm text-green-700">
          Vita only reads health-related notifications and processes them locally on your device. 
          No personal data is sent to external servers.
        </p>
      </div>
      {permissions.notifications ? (
        <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
          <SafeIcon icon={FiCheck} className="w-6 h-6" />
          <span className="font-semibold">Notification access granted!</span>
        </div>
      ) : (
        <button
          onClick={() => handlePermissionGrant('notifications')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors mb-4"
        >
          Enable Notification Intelligence
        </button>
      )}
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() => setCurrentStep(2)}
          className="text-gray-600 hover:text-gray-800"
        >
          Skip for now
        </button>
      </div>
    </div>
  );

  const SensorStep = () => (
    <div className="text-center">
      <div className="bg-purple-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <SafeIcon icon={FiActivity} className="w-12 h-12 text-purple-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Enable Phone Sensors
      </h3>
      <p className="text-gray-600 mb-6">
        Your phone can track your movement, steps, and activity patterns using its built-in sensors. 
        This helps Vita understand your daily activity levels.
      </p>
      <div className="bg-purple-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <SafeIcon icon={FiZap} className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-800">Automatic Tracking</span>
        </div>
        <p className="text-sm text-purple-700">
          Once enabled, your phone will automatically track your movement and activity 
          throughout the day without any additional effort from you.
        </p>
      </div>
      {permissions.sensors ? (
        <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
          <SafeIcon icon={FiCheck} className="w-6 h-6" />
          <span className="font-semibold">Sensor access granted!</span>
        </div>
      ) : (
        <button
          onClick={() => handlePermissionGrant('sensors')}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors mb-4"
        >
          Enable Phone Sensors
        </button>
      )}
      <div className="flex space-x-4 justify-center">
        <button
          onClick={() => setCurrentStep(3)}
          className="text-gray-600 hover:text-gray-800"
        >
          Skip for now
        </button>
      </div>
    </div>
  );

  const CompleteStep = () => (
    <div className="text-center">
      <div className="bg-gradient-to-r from-green-100 to-blue-100 p-8 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
        <SafeIcon icon={FiCheck} className="w-16 h-16 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Smart Integration Complete!
      </h3>
      <p className="text-gray-600 mb-6">
        Vita is now set up to automatically capture your health data. You can always adjust 
        these settings later in your privacy preferences.
      </p>
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">What happens next:</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiZap} className="w-4 h-4 text-green-600" />
            <span>Vita starts capturing data automatically</span>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiHeart} className="w-4 h-4 text-blue-600" />
            <span>Your vitality rings update with real data</span>
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiShield} className="w-4 h-4 text-purple-600" />
            <span>All data stays private and secure</span>
          </div>
        </div>
      </div>
      <button
        onClick={onComplete}
        className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all flex items-center space-x-2 mx-auto"
      >
        <span>Start Using Vita</span>
        <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
      </button>
    </div>
  );

  const renderStep = () => {
    switch (steps[currentStep].component) {
      case 'welcome': return <WelcomeStep />;
      case 'notifications': return <NotificationStep />;
      case 'sensors': return <SensorStep />;
      case 'complete': return <CompleteStep />;
      default: return <WelcomeStep />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Back to options
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>
    </div>
  );
};

export default SmartIntegrationSetup;
