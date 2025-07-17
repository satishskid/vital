import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUser, FiSettings, FiHeart, FiTrendingUp, FiAward, FiInfo, FiEdit3, FiLogOut, FiSmartphone, FiActivity, FiTool } = FiIcons;

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const userStats = {
    name: 'Anjali Patel',
    age: 55,
    joinDate: 'March 2024',
    streak: 12,
    totalSessions: 89,
    avgHRV: 72,
    goals: ['Manage Pre-diabetes', 'Improve Sleep', 'Reduce Stress']
  };

  const weeklyData = [
    { day: 'Mon', hrv: 68, mood: 'Good', activity: 85 },
    { day: 'Tue', hrv: 72, mood: 'Great', activity: 92 },
    { day: 'Wed', hrv: 70, mood: 'Good', activity: 78 },
    { day: 'Thu', hrv: 75, mood: 'Excellent', activity: 95 },
    { day: 'Fri', hrv: 73, mood: 'Good', activity: 88 },
    { day: 'Sat', hrv: 71, mood: 'Great', activity: 90 },
    { day: 'Sun', hrv: 74, mood: 'Good', activity: 83 }
  ];

  const achievements = [
    { title: 'First Steps', description: 'Completed onboarding', date: 'March 15', icon: FiHeart },
    { title: 'Week Warrior', description: '7 days of consistent activity', date: 'March 22', icon: FiTrendingUp },
    { title: 'HRV Hero', description: '30 HRV measurements', date: 'April 5', icon: FiAward },
    { title: 'Community Member', description: 'Joined support circle', date: 'March 18', icon: FiUser }
  ];

  const settings = [
    { title: 'Notifications', description: 'Manage your alerts', icon: FiSettings },
    { title: 'Privacy', description: 'Control your data', icon: FiUser },
    { title: 'Health Integrations', description: 'Connect apps & devices', icon: FiHeart },
    { title: 'Goals & Preferences', description: 'Customize your experience', icon: FiTrendingUp }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {userStats.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{userStats.name}</h1>
            <p className="text-gray-600">Member since {userStats.joinDate}</p>
          </div>
          <motion.button
            className="ml-auto bg-indigo-100 text-indigo-600 p-2 rounded-full"
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiEdit3} className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{userStats.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{userStats.totalSessions}</div>
            <div className="text-sm text-gray-600">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userStats.avgHRV}</div>
            <div className="text-sm text-gray-600">Avg HRV</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {['overview', 'progress', 'tools', 'settings'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors text-sm ${
                activeTab === tab 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Current Goals */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Current Goals</h3>
              <div className="space-y-3">
                {userStats.goals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Today's Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiHeart} className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-800">HRV</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">Ready</div>
                  <div className="text-sm text-gray-600">Score: 74</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">Activity</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-gray-600">Goal reached</div>
                </div>
              </div>
            </div>

            {/* Health Insights */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Health Insights</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-1 rounded-full mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">HRV Improving</h4>
                    <p className="text-sm text-gray-600">Your HRV has increased 15% over the past month</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-1 rounded-full mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Consistent Routine</h4>
                    <p className="text-sm text-gray-600">You've maintained a 12-day streak</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-1 rounded-full mt-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Stress Management</h4>
                    <p className="text-sm text-gray-600">Regular breathing sessions are helping</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Weekly Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">This Week's Progress</h3>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-gray-600">{day.day}</div>
                    <div className="flex-1 flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${day.activity}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium text-gray-800">{day.hrv}</div>
                      <div className="text-sm text-gray-600">{day.mood}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Monthly Trends</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">↗️</div>
                  <div className="text-sm text-gray-600">HRV Trending Up</div>
                  <div className="text-xs text-gray-500">+15% this month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">🎯</div>
                  <div className="text-sm text-gray-600">Goals on Track</div>
                  <div className="text-xs text-gray-500">87% completion</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Your Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <SafeIcon icon={achievement.icon} className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500">{achievement.date}</p>
                    </div>
                    <div className="text-2xl">🏆</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tools' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Health Tools</h3>
              <div className="space-y-3">
                <motion.div
                  onClick={() => navigate('/camera-hrv')}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-green-100 p-2 rounded-full">
                    <SafeIcon icon={FiActivity} className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">HRV Check</h4>
                    <p className="text-sm text-gray-600">Measure heart rate variability with camera</p>
                  </div>
                </motion.div>

                <motion.div
                  onClick={() => navigate('/health-apps')}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-blue-100 p-2 rounded-full">
                    <SafeIcon icon={FiSmartphone} className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">Health Apps</h4>
                    <p className="text-sm text-gray-600">Recommended apps for data collection</p>
                  </div>
                </motion.div>

                <motion.div
                  onClick={() => navigate('/mind-breath')}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-purple-100 p-2 rounded-full">
                    <SafeIcon icon={FiHeart} className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">Mind & Breath</h4>
                    <p className="text-sm text-gray-600">Breathing exercises and mindfulness</p>
                  </div>
                </motion.div>

                <motion.div
                  onClick={() => navigate('/activity')}
                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="bg-orange-100 p-2 rounded-full">
                    <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">Activity Tracking</h4>
                    <p className="text-sm text-gray-600">Detailed activity and movement analysis</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Settings</h3>
              <div className="space-y-3">
                {settings.map((setting, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <SafeIcon icon={setting.icon} className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{setting.title}</h4>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <SafeIcon icon={FiInfo} className="w-5 h-5 text-gray-400" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Account</h3>
              <motion.button
                className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white py-3 rounded-lg font-medium"
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiLogOut} className="w-5 h-5" />
                <span>Sign Out</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;