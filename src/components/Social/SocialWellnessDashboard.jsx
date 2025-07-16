import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiUsers, FiPhone, FiMessageCircle, FiVideo, FiTrendingUp, FiClock, FiAlertCircle } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/FirebaseAuthContext';
import VitaSocialCircleManager from '../../services/SocialCircleManager';
import VitaSocialNotificationIntelligence from '../../services/SocialNotificationIntelligence';

const SocialWellnessDashboard = () => {
  const { user } = useAuth();
  const [socialMetrics, setSocialMetrics] = useState(null);
  const [contactSuggestions, setContactSuggestions] = useState([]);
  const [socialStats, setSocialStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7); // days

  const socialManagerRef = useRef(null);
  const socialIntelligenceRef = useRef(null);

  useEffect(() => {
    if (user) {
      initializeSocialWellness();
    }
  }, [user, timeRange]);

  const initializeSocialWellness = async () => {
    try {
      // Initialize social circle manager
      socialManagerRef.current = new VitaSocialCircleManager(user.uid);
      await socialManagerRef.current.loadData();

      // Initialize social notification intelligence
      socialIntelligenceRef.current = new VitaSocialNotificationIntelligence(socialManagerRef.current);
      
      // Load metrics and stats
      const metrics = socialManagerRef.current.getSocialWellnessMetrics(timeRange);
      const suggestions = socialManagerRef.current.getContactSuggestions();
      const stats = socialIntelligenceRef.current.getSocialStats(timeRange);

      setSocialMetrics(metrics);
      setContactSuggestions(suggestions);
      setSocialStats(stats);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing social wellness:', error);
      setLoading(false);
    }
  };

  const getSocialWellnessGrade = (score) => {
    if (score >= 90) return { grade: 'A', color: 'green', label: 'Excellent' };
    if (score >= 80) return { grade: 'B', color: 'blue', label: 'Good' };
    if (score >= 70) return { grade: 'C', color: 'yellow', label: 'Fair' };
    if (score >= 60) return { grade: 'D', color: 'orange', label: 'Needs Improvement' };
    return { grade: 'F', color: 'red', label: 'Poor' };
  };

  const getInteractionIcon = (type) => {
    const icons = {
      call: FiPhone,
      message: FiMessageCircle,
      video_call: FiVideo,
      social_media: FiUsers
    };
    return icons[type] || FiMessageCircle;
  };

  const formatTimeAgo = (days) => {
    if (days < 1) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${Math.floor(days)} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const wellnessGrade = socialMetrics ? getSocialWellnessGrade(socialMetrics.socialWellnessScore) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Social Wellness</h1>
              <p className="text-gray-600">Your social connections and their impact on your health</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 2 weeks</option>
                <option value={30}>Last month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Social Wellness Score */}
        {socialMetrics && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Social Wellness Score</h2>
              <SafeIcon icon={FiHeart} className="w-6 h-6 text-pink-500" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-6xl font-bold text-${wellnessGrade.color}-600 mb-2`}>
                  {wellnessGrade.grade}
                </div>
                <div className="text-2xl font-semibold text-gray-800 mb-1">
                  {socialMetrics.socialWellnessScore}/100
                </div>
                <div className={`text-sm text-${wellnessGrade.color}-600 font-medium`}>
                  {wellnessGrade.label}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Interactions</span>
                  <span className="text-sm font-medium">{socialMetrics.dailyAverageInteractions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Unique Contacts</span>
                  <span className="text-sm font-medium">{socialMetrics.uniqueContactsReached}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Interactions</span>
                  <span className="text-sm font-medium">{socialMetrics.totalInteractions}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Interaction Types</h4>
                {Object.entries(socialMetrics.interactionTypes).map(([type, count]) => {
                  const Icon = getInteractionIcon(type);
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={Icon} className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{socialMetrics?.uniqueContactsReached || 0}</div>
            <div className="text-sm text-gray-600">People Reached</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <SafeIcon icon={FiMessageCircle} className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{socialMetrics?.totalInteractions || 0}</div>
            <div className="text-sm text-gray-600">Total Interactions</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{socialMetrics?.dailyAverageInteractions || 0}</div>
            <div className="text-sm text-gray-600">Daily Average</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <SafeIcon icon={FiClock} className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{socialMetrics?.staleContacts?.length || 0}</div>
            <div className="text-sm text-gray-600">Need Attention</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Suggestions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Suggested Connections</h3>
              <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-orange-500" />
            </div>
            
            {contactSuggestions.length === 0 ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiHeart} className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h4 className="font-medium text-gray-800 mb-2">Great job!</h4>
                <p className="text-gray-600">You're staying well connected with your social circle.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contactSuggestions.slice(0, 5).map((suggestion, index) => (
                  <motion.div
                    key={suggestion.contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-l-4 pl-4 py-3 ${
                      suggestion.urgency === 'high' ? 'border-red-400 bg-red-50' :
                      suggestion.urgency === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                      'border-blue-400 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{suggestion.contact.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {suggestion.contact.relationship.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{suggestion.reason}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          {formatTimeAgo(suggestion.daysSinceContact)}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded mt-1 ${
                          suggestion.urgency === 'high' ? 'bg-red-100 text-red-700' :
                          suggestion.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {suggestion.urgency} priority
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Social Intelligence Stats */}
          {socialStats && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Smart Tracking Stats</h3>
                <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-blue-500" />
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{socialStats.knownContacts}</div>
                    <div className="text-xs text-green-700">Known Contacts</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{socialStats.totalInteractions}</div>
                    <div className="text-xs text-blue-700">Auto-Detected</div>
                  </div>
                </div>
                
                {Object.keys(socialStats.byApp).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">By App</h4>
                    <div className="space-y-2">
                      {Object.entries(socialStats.byApp).map(([app, count]) => (
                        <div key={app} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 capitalize">{app}</span>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {Object.keys(socialStats.byType).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">By Type</h4>
                    <div className="space-y-2">
                      {Object.entries(socialStats.byType).map(([type, count]) => {
                        const Icon = getInteractionIcon(type);
                        return (
                          <div key={type} className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={Icon} className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Health Impact Insights */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mt-8">
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiHeart} className="w-6 h-6 text-purple-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Social Health Impact</h3>
              <p className="text-sm text-purple-700 mb-3">
                Research shows that strong social connections can improve mental health, boost immune function, 
                and increase longevity by up to 50%.
              </p>
              
              {socialMetrics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-purple-800">Connection Quality</div>
                    <div className="text-xs text-purple-600 mt-1">
                      {socialMetrics.socialWellnessScore >= 80 ? 
                        'Your social connections are positively impacting your wellbeing' :
                        'Consider reaching out to close friends and family more often'
                      }
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-purple-800">Interaction Diversity</div>
                    <div className="text-xs text-purple-600 mt-1">
                      {socialMetrics.uniqueContactsReached >= 3 ?
                        'Good variety in your social interactions' :
                        'Try connecting with a wider circle of people'
                      }
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-purple-800">Consistency</div>
                    <div className="text-xs text-purple-600 mt-1">
                      {socialMetrics.dailyAverageInteractions >= 2 ?
                        'Regular social contact supports mental health' :
                        'Consider increasing daily social interactions'
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialWellnessDashboard;
