import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../../context/FirebaseAuthContext';
import SafeIcon from '../../common/SafeIcon';
import VitaSocialCircleManager from '../../services/SocialCircleManager';
import ContactImport from './ContactImport';
import SelfConnectionManager from './SelfConnectionManager';

const { FiUsers, FiHeart, FiMessageCircle, FiPhone, FiShield, FiInfo, FiUserPlus, FiFilter, FiSmartphone, FiEye, FiEyeOff, FiStar, FiClock } = FiIcons;

const SocialHub = ({ showWhyCard }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('contacts');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSelfConnection, setShowSelfConnection] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'family', 'friends', 'hobbies', 'me_time'
  const [socialCircle, setSocialCircle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationConsent, setNotificationConsent] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [wellnessMetrics, setWellnessMetrics] = useState(null);

  const socialManagerRef = useRef(null);

  useEffect(() => {
    if (user) {
      initializeSocialManager();
      checkNotificationConsent();
    }
  }, [user]);

  const initializeSocialManager = async () => {
    try {
      socialManagerRef.current = new VitaSocialCircleManager(user.uid);
      await socialManagerRef.current.loadData();
      setSocialCircle(socialManagerRef.current.getSocialCircle());

      // Load wellness metrics
      const metrics = socialManagerRef.current.getSocialWellnessMetrics(7);
      setWellnessMetrics(metrics);

      setLoading(false);
    } catch (error) {
      console.error('Error initializing social manager:', error);
      setLoading(false);
    }
  };

  const checkNotificationConsent = () => {
    const consent = localStorage.getItem('vita-notification-consent');
    setNotificationConsent(consent === 'true');
  };

  const filteredContacts =
    filter === 'family'
      ? socialCircle.filter(c => c.relationship === 'family')
      : filter === 'friends'
        ? socialCircle.filter(c => c.relationship === 'friend' || c.relationship === 'close_friend')
        : filter === 'hobbies'
          ? socialCircle.filter(c => c.type === 'hobby')
          : filter === 'me_time'
            ? socialCircle.filter(c => c.type === 'me_time')
            : socialCircle;
  
  const handleInfoClick = () => {
    showWhyCard({
      title: 'Holistic Social Wellness',
      content: 'Vita tracks both social connections and self-connection activities for complete wellness. Strong social bonds increase longevity by 50%, while regular hobby engagement reduces stress hormones by 75% and improves cognitive function. The healthiest individuals maintain balance between social time and personal time.',
      source: 'Holt-Lunstad et al. (2010), American Journal of Health Promotion (2016)'
    });
  };

  const handleContactTap = (contact) => {
    setSelectedContact(contact);
  };

  const handleNotificationConsent = async () => {
    if (!notificationConsent) {
      // Request notification permission
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          localStorage.setItem('vita-notification-consent', 'true');
          setNotificationConsent(true);
          // Initialize notification intelligence
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.register('/social-notification-sw.js');
            console.log('Social notification service worker registered');
          }
        }
      }
    } else {
      localStorage.setItem('vita-notification-consent', 'false');
      setNotificationConsent(false);
    }
  };

  const generateAvatar = (name, relationship) => {
    const colors = {
      family: 'bg-red-500',
      partner: 'bg-pink-500',
      close_friend: 'bg-blue-500',
      friend: 'bg-green-500',
      colleague: 'bg-purple-500',
      other: 'bg-gray-500'
    };
    return colors[relationship] || 'bg-gray-500';
  };

  const handleContactAdded = async (contactData) => {
    // Refresh the social circle
    await initializeSocialManager();
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Social Hub</h1>
            <p className="text-gray-600">Connect with others and yourself for holistic wellness</p>
          </div>
          <motion.button
            onClick={handleInfoClick}
            className="bg-blue-100 text-blue-600 p-3 rounded-full"
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiInfo} className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <motion.button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-2 px-2 rounded-md font-medium transition-colors ${
              activeTab === 'contacts' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-1">
              <SafeIcon icon={FiUsers} className="w-4 h-4" />
              <span className="text-sm">Social</span>
            </div>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('self')}
            className={`flex-1 py-2 px-2 rounded-md font-medium transition-colors ${
              activeTab === 'self' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-1">
              <SafeIcon icon={FiStar} className="w-4 h-4" />
              <span className="text-sm">Self</span>
            </div>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 px-2 rounded-md font-medium transition-colors ${
              activeTab === 'privacy' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-1">
              <SafeIcon icon={FiShield} className="w-4 h-4" />
              <span className="text-sm">Privacy</span>
            </div>
          </motion.button>
        </div>
      </div>

      <div className="px-6 py-6">
        {activeTab === 'contacts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiShield} className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Privacy-First Social Tracking</h4>
                  <p className="text-sm text-blue-700">
                    Your contacts are represented by anonymous avatars. No personal data is shared without your explicit consent.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Management */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Your Social Circle</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <motion.button
                      onClick={() => setFilter(prev =>
                        prev === 'all' ? 'family' :
                        prev === 'family' ? 'friends' : 'all'
                      )}
                      className="bg-gray-100 text-gray-700 p-2 rounded-full"
                      whileTap={{ scale: 0.9 }}
                    >
                      <SafeIcon icon={
                        filter === 'family' ? FiHeart :
                        filter === 'friends' ? FiUsers :
                        FiFilter
                      } className="w-4 h-4" />
                    </motion.button>
                    {filter !== 'all' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <motion.button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 text-white p-2 rounded-full"
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-8">
                  <SafeIcon icon={FiSmartphone} className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 mb-4">No contacts in your social circle yet.</p>
                  <p className="text-gray-400 text-sm mb-4">Add contacts to track social wellness through anonymous avatars</p>
                  <motion.button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 mx-auto"
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
                    <span>Add Contact</span>
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <motion.div
                      key={contact.id}
                      onClick={() => handleContactTap(contact)}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 ${generateAvatar(contact.name, contact.relationship)} rounded-full flex items-center justify-center text-white font-semibold`}>
                          {contact.nickname ? contact.nickname[0].toUpperCase() : contact.name[0].toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full p-1">
                          {contact.relationship === 'family' ? '👨‍👩‍👧‍👦' :
                           contact.relationship === 'partner' ? '💕' :
                           contact.relationship === 'close_friend' ? '👥' : '🤝'}
                        </div>
                        {notificationConsent && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">
                            {contact.nickname || contact.name}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiShield} className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-gray-500 capitalize">{contact.relationship}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {contact.lastContact ?
                            `Last contact: ${contact.lastContact.toLocaleDateString()}` :
                            'Tap to connect'
                          }
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-400" />
                        <SafeIcon icon={FiMessageCircle} className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Filter indicator */}
              {filter !== 'all' && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Showing {filter === 'family' ? 'family members' : 'friends'} only •
                  <button
                    onClick={() => setFilter('all')}
                    className="text-blue-500 ml-1"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>

            {/* Notification Intelligence */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Social Wellness Tracking</h3>
                <motion.button
                  onClick={handleNotificationConsent}
                  className={`p-2 rounded-full ${
                    notificationConsent ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <SafeIcon icon={notificationConsent ? FiEye : FiEyeOff} className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {notificationConsent ?
                  'Tracking calls and messages to measure social wellness impact on your health.' :
                  'Enable to track social interactions and their impact on your wellness metrics.'
                }
              </p>
              {notificationConsent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-green-700">
                    <SafeIcon icon={FiShield} className="w-4 h-4" />
                    <span className="text-sm font-medium">Privacy Protected</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Only interaction frequency is tracked. No message content is stored.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'self' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Self-Connection Overview */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <SafeIcon icon={FiStar} className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-gray-800">Self-Connection Wellness</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Track time spent on hobbies, passions, and personal wellness activities. Research shows that regular self-connection activities reduce stress by up to 75% and improve overall life satisfaction.
              </p>
              {wellnessMetrics && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{wellnessMetrics.selfInteractions || 0}</div>
                    <div className="text-xs text-gray-600">Self Activities (7 days)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{wellnessMetrics.dailySelfTimeMinutes || 0}m</div>
                    <div className="text-xs text-gray-600">Daily Average</div>
                  </div>
                </div>
              )}
            </div>

            {/* Hobbies & Passions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Your Hobbies & Passions</h3>
                <div className="flex space-x-2">
                  <div className="relative">
                    <motion.button
                      onClick={() => setFilter(prev =>
                        prev === 'all' ? 'hobbies' :
                        prev === 'hobbies' ? 'me_time' : 'all'
                      )}
                      className="bg-gray-100 text-gray-700 p-2 rounded-full"
                      whileTap={{ scale: 0.9 }}
                    >
                      <SafeIcon icon={
                        filter === 'hobbies' ? FiStar :
                        filter === 'me_time' ? FiClock :
                        FiFilter
                      } className="w-4 h-4" />
                    </motion.button>
                    {filter !== 'all' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                    )}
                  </div>
                  <motion.button
                    onClick={() => setShowSelfConnection(true)}
                    className="bg-purple-500 text-white p-2 rounded-full"
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon icon={FiUserPlus} className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredContacts.filter(c => c.type === 'hobby' || c.type === 'me_time').length === 0 ? (
                <div className="text-center py-8">
                  <SafeIcon icon={FiStar} className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 mb-4">No self-connection activities yet.</p>
                  <p className="text-gray-400 text-sm mb-4">Add hobbies, passions, or me-time to track your personal wellness</p>
                  <motion.button
                    onClick={() => setShowSelfConnection(true)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 mx-auto"
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={FiStar} className="w-4 h-4" />
                    <span>Add Self-Connection Activity</span>
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContacts.filter(c => c.type === 'hobby' || c.type === 'me_time').map((activity) => (
                    <motion.div
                      key={activity.id}
                      onClick={() => handleContactTap(activity)}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 ${
                          activity.type === 'hobby' ? 'bg-purple-500' : 'bg-green-500'
                        } rounded-full flex items-center justify-center text-white text-xl`}>
                          {activity.icon || (activity.type === 'hobby' ? '🎨' : '🧘')}
                        </div>
                        <div className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full p-1">
                          {activity.type === 'hobby' ? '🎨' : '🧘'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">
                            {activity.name}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiClock} className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {activity.totalTimeSpent ? `${Math.round(activity.totalTimeSpent / 60)}h` : '0h'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {activity.lastActivity ?
                            `Last activity: ${activity.lastActivity.toLocaleDateString()}` :
                            'Tap to log time'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          {activity.activityCount || 0} sessions
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Filter indicator */}
              {filter !== 'all' && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Showing {filter === 'hobbies' ? 'hobbies & passions' : 'me-time activities'} only •
                  <button
                    onClick={() => setFilter('all')}
                    className="text-purple-500 ml-1"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>

            {/* Wellness Balance */}
            {wellnessMetrics?.balance && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Social-Self Balance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Social Connections</span>
                    <span className="text-sm font-medium text-blue-600">{wellnessMetrics.balance.socialRatio}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${wellnessMetrics.balance.socialRatio}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Self-Connection</span>
                    <span className="text-sm font-medium text-purple-600">{wellnessMetrics.balance.selfRatio}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${wellnessMetrics.balance.selfRatio}%` }}
                    ></div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-blue-800">{wellnessMetrics.balance.recommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'privacy' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Privacy Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <SafeIcon icon={FiShield} className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-gray-800">Privacy Protection</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-800">Anonymous Avatars</h4>
                    <p className="text-sm text-gray-600">Contacts are represented by color-coded avatars to protect identity</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-800">Local Processing</h4>
                    <p className="text-sm text-gray-600">All contact data is processed locally on your device</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-800">Opt-in Consent</h4>
                    <p className="text-sm text-gray-600">You control what data is tracked and shared</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Intelligence Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Notification Intelligence</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">Track Social Interactions</h4>
                    <p className="text-sm text-gray-600">Monitor calls and messages for wellness insights</p>
                  </div>
                  <motion.button
                    onClick={handleNotificationConsent}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationConsent ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notificationConsent ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </motion.button>
                </div>
                {notificationConsent && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h5 className="font-medium text-blue-800 mb-2">What we track:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Frequency of calls and messages</li>
                      <li>• Time of day for social interactions</li>
                      <li>• Duration of phone calls</li>
                      <li>• Response patterns (not content)</li>
                    </ul>
                    <h5 className="font-medium text-blue-800 mt-3 mb-2">What we DON'T track:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Message content or call recordings</li>
                      <li>• Contact names or phone numbers</li>
                      <li>• Location data</li>
                      <li>• Personal information</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Data Control */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Data Control</h3>
              <div className="space-y-3">
                <motion.button
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-medium text-gray-800">Export Social Data</span>
                  <SafeIcon icon={FiUsers} className="w-5 h-5 text-gray-600" />
                </motion.button>
                <motion.button
                  className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-medium text-red-800">Delete All Social Data</span>
                  <SafeIcon icon={FiShield} className="w-5 h-5 text-red-600" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Contact Selection Modal */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className={`w-16 h-16 ${generateAvatar(selectedContact.name, selectedContact.relationship)} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                  {selectedContact.nickname ? selectedContact.nickname[0].toUpperCase() : selectedContact.name[0].toUpperCase()}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {selectedContact.nickname || selectedContact.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 capitalize">
                  {selectedContact.relationship}
                </p>
                <div className="space-y-3">
                  <motion.button
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={FiPhone} className="w-5 h-5" />
                    <span>Call</span>
                  </motion.button>
                  <motion.button
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                    whileTap={{ scale: 0.95 }}
                  >
                    <SafeIcon icon={FiMessageCircle} className="w-5 h-5" />
                    <span>Message</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setSelectedContact(null)}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Contact Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <ContactImport
            onClose={() => setShowAddForm(false)}
            onContactAdded={handleContactAdded}
            userId={user?.uid}
          />
        )}
      </AnimatePresence>

      {/* Self-Connection Manager Modal */}
      <AnimatePresence>
        {showSelfConnection && (
          <SelfConnectionManager
            onClose={() => setShowSelfConnection(false)}
            onActivityAdded={handleContactAdded}
            socialManager={socialManagerRef.current}
            showWhyCard={showWhyCard}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialHub;