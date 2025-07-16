import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiEye, FiEyeOff, FiSettings, FiInfo, FiCheck, FiX } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const SocialPrivacySettings = ({ socialNotificationIntelligence, onSettingsChange }) => {
  const [settings, setSettings] = useState({
    socialTrackingEnabled: false,
    allowedApps: [],
    trackingLevel: 'metadata_only',
    storeMessageContent: false,
    trackUnknownContacts: false,
    dataRetentionDays: 30
  });

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasGivenConsent, setHasGivenConsent] = useState(false);

  const communicationApps = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', popular: true },
    { id: 'imessage', name: 'iMessage', icon: '💬', popular: true },
    { id: 'telegram', name: 'Telegram', icon: '✈️', popular: true },
    { id: 'facetime', name: 'FaceTime', icon: '📹', popular: true },
    { id: 'signal', name: 'Signal', icon: '🔒', popular: false },
    { id: 'discord', name: 'Discord', icon: '🎮', popular: false },
    { id: 'slack', name: 'Slack', icon: '💼', popular: false },
    { id: 'zoom', name: 'Zoom', icon: '📹', popular: false },
    { id: 'phone', name: 'Phone Calls', icon: '📞', popular: true }
  ];

  const trackingLevels = [
    {
      id: 'metadata_only',
      name: 'Metadata Only',
      description: 'Track only who you communicate with and when',
      privacy: 'High Privacy',
      features: ['Contact names', 'Timestamps', 'App used', 'Interaction type']
    },
    {
      id: 'basic',
      name: 'Basic Tracking',
      description: 'Include basic interaction details',
      privacy: 'Medium Privacy',
      features: ['All metadata features', 'Message/call duration', 'Time of day patterns']
    },
    {
      id: 'detailed',
      name: 'Detailed Tracking',
      description: 'Comprehensive social wellness insights',
      privacy: 'Lower Privacy',
      features: ['All basic features', 'Content length analysis', 'Interaction quality scoring']
    }
  ];

  useEffect(() => {
    if (socialNotificationIntelligence) {
      setSettings(socialNotificationIntelligence.privacySettings);
    }
  }, [socialNotificationIntelligence]);

  const handleEnableSocialTracking = () => {
    if (!hasGivenConsent) {
      setShowConsentModal(true);
    } else {
      updateSettings({ socialTrackingEnabled: true });
    }
  };

  const handleConsentGiven = () => {
    setHasGivenConsent(true);
    setShowConsentModal(false);
    updateSettings({ socialTrackingEnabled: true });
  };

  const updateSettings = async (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    if (socialNotificationIntelligence) {
      await socialNotificationIntelligence.updatePrivacySettings(updatedSettings);
    }
    
    if (onSettingsChange) {
      onSettingsChange(updatedSettings);
    }
  };

  const toggleApp = (appId) => {
    const newAllowedApps = settings.allowedApps.includes(appId)
      ? settings.allowedApps.filter(id => id !== appId)
      : [...settings.allowedApps, appId];
    
    updateSettings({ allowedApps: newAllowedApps });
  };

  return (
    <div className="space-y-6">
      {/* Main Toggle */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiShield} className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Social Wellness Tracking</h3>
              <p className="text-sm text-gray-600">Monitor your social connections for better health insights</p>
            </div>
          </div>
          
          <motion.button
            onClick={() => settings.socialTrackingEnabled ? 
              updateSettings({ socialTrackingEnabled: false }) : 
              handleEnableSocialTracking()
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.socialTrackingEnabled ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.socialTrackingEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </motion.button>
        </div>

        {settings.socialTrackingEnabled && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-700">
              <SafeIcon icon={FiCheck} className="w-4 h-4" />
              <span className="text-sm font-medium">Social tracking is active</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Monitoring social interactions to provide wellness insights while respecting your privacy.
            </p>
          </div>
        )}
      </div>

      {/* Tracking Level Selection */}
      {settings.socialTrackingEnabled && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Privacy Level</h4>
          <div className="space-y-3">
            {trackingLevels.map(level => (
              <motion.div
                key={level.id}
                onClick={() => updateSettings({ trackingLevel: level.id })}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  settings.trackingLevel === level.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-800">{level.name}</h5>
                  <span className={`text-xs px-2 py-1 rounded ${
                    level.privacy === 'High Privacy' ? 'bg-green-100 text-green-700' :
                    level.privacy === 'Medium Privacy' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {level.privacy}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                <div className="flex flex-wrap gap-2">
                  {level.features.map(feature => (
                    <span key={feature} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* App Selection */}
      {settings.socialTrackingEnabled && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Allowed Apps</h4>
          <p className="text-sm text-gray-600 mb-4">
            Choose which communication apps to monitor for social interactions.
          </p>
          
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Popular Apps</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {communicationApps.filter(app => app.popular).map(app => (
                  <motion.div
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                      settings.allowedApps.includes(app.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{app.icon}</span>
                      <span className="text-sm font-medium text-gray-800">{app.name}</span>
                      {settings.allowedApps.includes(app.id) && (
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-blue-500 ml-auto" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Other Apps</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {communicationApps.filter(app => !app.popular).map(app => (
                  <motion.div
                    key={app.id}
                    onClick={() => toggleApp(app.id)}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                      settings.allowedApps.includes(app.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{app.icon}</span>
                      <span className="text-sm font-medium text-gray-800">{app.name}</span>
                      {settings.allowedApps.includes(app.id) && (
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-blue-500 ml-auto" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      {settings.socialTrackingEnabled && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Advanced Settings</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-700">Track Unknown Contacts</h5>
                <p className="text-xs text-gray-500">Monitor interactions with people not in your social circle</p>
              </div>
              <motion.button
                onClick={() => updateSettings({ trackUnknownContacts: !settings.trackUnknownContacts })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  settings.trackUnknownContacts ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    settings.trackUnknownContacts ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Retention (days)
              </label>
              <select
                value={settings.dataRetentionDays}
                onChange={(e) => updateSettings({ dataRetentionDays: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={365}>1 year</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Your Privacy is Protected</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• All social data is processed locally on your device</li>
              <li>• Message content is never stored or transmitted</li>
              <li>• You can disable tracking or delete data at any time</li>
              <li>• Data is used only for your personal health insights</li>
              <li>• No social data is shared with third parties</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Consent Modal */}
      {showConsentModal && (
        <ConsentModal
          onAccept={handleConsentGiven}
          onDecline={() => setShowConsentModal(false)}
        />
      )}
    </div>
  );
};

// Consent Modal Component
const ConsentModal = ({ onAccept, onDecline }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiShield} className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800">Social Wellness Consent</h3>
          </div>
          
          <div className="space-y-4 mb-6">
            <p className="text-gray-700">
              By enabling social wellness tracking, you consent to Vita monitoring your communication 
              app notifications to provide insights about your social connections and their impact on your health.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">What we track:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Who you communicate with (contact names only)</li>
                <li>• When interactions occur (timestamps)</li>
                <li>• Type of interaction (call, message, video call)</li>
                <li>• Which app was used</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">What we DON'T track:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Message content or conversation details</li>
                <li>• Personal information beyond contact names</li>
                <li>• Location or other sensitive data</li>
                <li>• Data from people not in your social circle (unless enabled)</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-600">
              You can disable this feature, modify settings, or delete all data at any time. 
              All processing happens locally on your device for maximum privacy.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              I Consent
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SocialPrivacySettings;
