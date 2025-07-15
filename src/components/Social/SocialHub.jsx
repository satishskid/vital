import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { useSocial } from '../../context/SocialContext';
import SafeIcon from '../../common/SafeIcon';
import ConnectionForm from './ConnectionForm';

const { FiUsers, FiHeart, FiMessageCircle, FiTrendingUp, FiAward, FiInfo, FiUserPlus, FiFilter } = FiIcons;

const SocialHub = ({ showWhyCard }) => {
  const [activeTab, setActiveTab] = useState('support');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'family', 'friends'
  
  const { 
    connections, 
    loading, 
    getFamilyConnections,
    getFriendConnections
  } = useSocial();
  
  const filteredConnections = 
    filter === 'family' 
      ? getFamilyConnections() 
      : filter === 'friends'
        ? getFriendConnections()
        : connections;
  
  const communityStats = [
    { label: 'Active Members', value: '2,847', icon: FiUsers },
    { label: 'Sessions Today', value: '1,234', icon: FiHeart },
    { label: 'Encouragements', value: '456', icon: FiMessageCircle },
    { label: 'Collective Goals', value: '89', icon: FiTrendingUp }
  ];
  
  const achievements = [
    { title: 'Week Warrior', description: 'Complete 7 days of activity', progress: 85, icon: FiAward, color: 'text-yellow-600' },
    { title: 'Breath Master', description: '30 breathing sessions', progress: 60, icon: FiHeart, color: 'text-red-600' },
    { title: 'Community Helper', description: 'Send 50 encouragements', progress: 40, color: 'text-blue-600' }
  ];

  const handleInfoClick = () => {
    showWhyCard({
      title: 'Social Support & Health',
      content: 'Strong social connections can increase longevity by 50% and reduce the risk of depression, anxiety, and cognitive decline. Social support directly impacts immune function and stress response.',
      source: 'Holt-Lunstad et al. (2010), PLoS Medicine'
    });
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Social Hub</h1>
            <p className="text-gray-600">Connect with your wellness community</p>
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
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'support' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            Support Circle
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('community')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'community' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            Community
          </motion.button>
        </div>
      </div>

      <div className="px-6 py-6">
        {activeTab === 'support' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Support Circle */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Your Support Circle</h3>
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
              ) : filteredConnections.length === 0 ? (
                <div className="text-center py-8">
                  <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 mb-4">No connections in your support circle yet.</p>
                  <motion.button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                    whileTap={{ scale: 0.95 }}
                  >
                    Add someone now
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredConnections.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 ${
                          member.relationshipType === 'family' ? 'bg-red-500' : 'bg-blue-500'
                        } rounded-full flex items-center justify-center text-white font-semibold`}>
                          {member.profile.first_name[0]}
                        </div>
                        <div className="absolute -bottom-1 -right-1 text-lg">
                          {member.profile.mood}
                        </div>
                        <div
                          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            member.profile.status === 'active'
                              ? 'bg-green-500'
                              : member.profile.status === 'resting'
                              ? 'bg-gray-400'
                              : 'bg-blue-500'
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">
                            {member.profile.first_name} {member.profile.last_name}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <SafeIcon 
                              icon={member.relationshipType === 'family' ? FiHeart : FiUsers} 
                              className={`w-3 h-3 ${
                                member.relationshipType === 'family' ? 'text-red-500' : 'text-blue-500'
                              }`} 
                            />
                            <span className="text-xs text-gray-500 capitalize">{member.relationshipType}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{member.profile.last_activity}</p>
                      </div>
                      <motion.button
                        className="bg-red-100 text-red-600 p-2 rounded-full"
                        whileTap={{ scale: 0.9 }}
                      >
                        <SafeIcon icon={FiHeart} className="w-4 h-4" />
                      </motion.button>
                    </div>
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

            {/* Token of Encouragement */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Send Encouragement</h3>
              <div className="grid grid-cols-3 gap-3">
                {['👏', '💪', '🌟', '❤️', '🎉', '🔥'].map((emoji) => (
                  <motion.button
                    key={emoji}
                    className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-2xl"
                    whileTap={{ scale: 0.9 }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Shared Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <SafeIcon
                        icon={achievement.icon}
                        className={`w-5 h-5 ${achievement.color}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                        <span className="text-sm text-gray-600">{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'community' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Community Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Community Today</h3>
              <div className="grid grid-cols-2 gap-4">
                {communityStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                      <SafeIcon icon={stat.icon} className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Circles */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Join a Circle</h3>
              <div className="space-y-3">
                {[
                  {
                    name: '50+ Walkers',
                    members: 234,
                    activity: 'Daily walks & challenges'
                  },
                  {
                    name: 'Meditation Beginners',
                    members: 156,
                    activity: 'Guided sessions & tips'
                  },
                  {
                    name: 'Healthy Cooking',
                    members: 189,
                    activity: 'Recipes & meal ideas'
                  },
                  {
                    name: 'Sleep Wellness',
                    members: 98,
                    activity: 'Sleep hygiene & tracking'
                  }
                ].map((circle, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">{circle.name}</h4>
                      <p className="text-sm text-gray-600">{circle.activity}</p>
                      <p className="text-xs text-gray-500">{circle.members} members</p>
                    </div>
                    <motion.button
                      className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium"
                      whileTap={{ scale: 0.95 }}
                    >
                      Join
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Milestones */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Community Milestones</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">1 Million Steps</h4>
                    <p className="text-sm text-gray-600">Reached by our community today!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <SafeIcon icon={FiHeart} className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">500 Meditation Minutes</h4>
                    <p className="text-sm text-gray-600">Collective mindfulness achieved</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <SafeIcon icon={FiAward} className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">100 New Healthy Habits</h4>
                    <p className="text-sm text-gray-600">Started by members this week</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Add Connection Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <ConnectionForm onClose={() => setShowAddForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialHub;