import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrendingUp, FiAward, FiBookOpen, FiDownload, FiCalendar, FiSettings, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../context/FirebaseAuthContext';
// import { reminderSystem } from '../../lib/reminderSystem';
import HealthDataForm from './HealthDataForm';
import HealthMetricInfo from '../Education/HealthMetricInfo';
import HealthDataExplanation from '../DataEntry/HealthDataExplanation';

const SafeIcon = ({ icon: Icon, ...props }) => {
  if (!Icon) return <div {...props} />;
  return <Icon {...props} />;
};

const ManualEntryDashboard = () => {
  const { user, getRecentHealthEntries } = useAuth();
  const [activeTab, setActiveTab] = useState('log_data');
  const [recentEntries, setRecentEntries] = useState([]);
  const [userStats, setUserStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalEntries: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showDataExplanation, setShowDataExplanation] = useState(false);
  const [whyCardData, setWhyCardData] = useState(null);

  useEffect(() => {
    if (user) {
      initializeUserData();
      initializeReminders();
    }
  }, [user]);

  const initializeUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent health entries
      await fetchRecentEntries();
      
      // Calculate user stats
      await calculateUserStats();
      
      // Get achievements
      await fetchAchievements();
      
      // Get motivational message
      await fetchMotivationalMessage();
      
    } catch (error) {
      console.error('Error initializing user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeReminders = async () => {
    try {
      // Reminder system temporarily disabled for Firebase migration
      console.log('Reminder system will be implemented later');
    } catch (error) {
      console.error('Error initializing reminders:', error);
    }
  };

  const fetchRecentEntries = async () => {
    try {
      const result = await getRecentHealthEntries(7);
      if (result.success) {
        setRecentEntries(result.data || []);
      } else {
        console.error('Error fetching recent entries:', result.error);
      }
    } catch (error) {
      console.error('Error fetching recent entries:', error);
    }
  };

  const calculateUserStats = async () => {
    try {
      // Simplified stats for Firebase - will implement properly later
      setUserStats({
        currentStreak: 0,
        longestStreak: 0,
        totalEntries: recentEntries.length
      });
    } catch (error) {
      console.error('Error calculating user stats:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      // Simplified achievements for Firebase - will implement properly later
      setAchievements([]);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchMotivationalMessage = async () => {
    try {
      // Motivational messages temporarily disabled for Firebase migration
      const messages = [
        "Great job logging your health data! 🌟",
        "Keep up the healthy habits! 💪",
        "Your wellness journey is inspiring! 🚀",
        "Every entry brings you closer to your goals! 🎯"
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setMotivationalMessage(randomMessage);
    } catch (error) {
      console.error('Error fetching motivational message:', error);
    }
  };

  const handleDataSaved = async () => {
    // Refresh data after successful save
    await fetchRecentEntries();
    await calculateUserStats();
    await fetchAchievements();
    await fetchMotivationalMessage();
  };

  const showWhyCard = (data) => {
    setWhyCardData(data);
    // You can implement a modal or tooltip to show this data
    console.log('Why card data:', data);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getEntryCompleteness = (entry) => {
    const fields = ['heart_rate', 'hrv', 'steps', 'sleep_duration', 'sleep_quality'];
    const filledFields = fields.filter(field => entry[field] !== null && entry[field] !== '');
    return Math.round((filledFields.length / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Health Tracking</h1>
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">Manual entry • Privacy-first approach</p>
                <button
                  onClick={() => setShowDataExplanation(true)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <SafeIcon icon={FiInfo} className="w-4 h-4" />
                  <span>How it works</span>
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">{userStats.currentStreak}</div>
              <div className="text-sm text-gray-600">day streak</div>
            </div>
          </div>

          {/* Motivational Message */}
          {motivationalMessage && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <p className="text-emerald-800 font-medium">{motivationalMessage}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-emerald-600">{userStats.currentStreak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{userStats.longestStreak}</div>
              <div className="text-sm text-gray-600">Longest Streak</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{userStats.totalEntries}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'log_data', label: 'Log Data', icon: FiPlus },
              { id: 'import', label: 'Import Guide', icon: FiDownload },
              { id: 'learn', label: 'Learn', icon: FiBookOpen },
              { id: 'progress', label: 'Progress', icon: FiTrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {activeTab === 'log_data' && (
          <div className="space-y-6">
            <HealthDataForm onSuccess={handleDataSaved} />
            
            {/* Recent Entries */}
            {recentEntries.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Entries</h3>
                <div className="space-y-3">
                  {recentEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-800">{formatDate(entry.entry_date)}</div>
                          <div className="text-sm text-gray-600">{entry.entry_type} entry</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-emerald-600">
                          {getEntryCompleteness(entry)}% complete
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.source === 'manual_entry' ? 'Manual' : entry.source}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'import' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Simple Health Tracking</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiInfo} className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">Manual Entry Works Best</h4>
                    <p className="text-sm text-green-700">
                      You know your body better than any device. Manual entry gives you complete control
                      and often provides more accurate insights than automated tracking.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">📱 Quick Daily Check-in</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Takes less than 2 minutes</li>
                    <li>• Simple sliders and selections</li>
                    <li>• Focus on how you feel, not numbers</li>
                    <li>• Build awareness of your patterns</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2">🎯 What to Track</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Sleep quality and duration</li>
                    <li>• Energy and mood levels</li>
                    <li>• Physical activity and movement</li>
                    <li>• Stress and recovery state</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="space-y-6">
            {selectedMetric ? (
              <div>
                <button
                  onClick={() => setSelectedMetric(null)}
                  className="mb-4 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  ← Back to topics
                </button>
                <HealthMetricInfo 
                  metric={selectedMetric}
                  onMarkAsRead={() => setSelectedMetric(null)}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Learn About Health Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'heart_rate', title: 'Heart Rate', icon: '❤️', description: 'Understanding your heart rate and what it means' },
                    { id: 'hrv', title: 'Heart Rate Variability', icon: '📊', description: 'HRV as a marker of recovery and stress' },
                    { id: 'steps', title: 'Daily Steps', icon: '👟', description: 'The importance of daily movement and activity' },
                    { id: 'sleep', title: 'Sleep Quality', icon: '😴', description: 'How sleep affects your overall health' }
                  ].map((metric) => (
                    <button
                      key={metric.id}
                      onClick={() => setSelectedMetric(metric.id)}
                      className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{metric.icon}</span>
                        <h4 className="font-medium text-gray-800">{metric.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{metric.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <SafeIcon icon={FiAward} className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.unlocked
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </span>
                      <div>
                        <h4 className={`font-medium ${
                          achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${
                          achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Chart Placeholder */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</h3>
              <div className="text-center py-8 text-gray-500">
                <SafeIcon icon={FiTrendingUp} className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Progress charts will be available once you have more data entries.</p>
                <p className="text-sm mt-1">Keep logging your health data to see trends!</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Health Data Explanation Modal */}
      <HealthDataExplanation
        isOpen={showDataExplanation}
        onClose={() => setShowDataExplanation(false)}
        showWhyCard={showWhyCard}
      />
    </div>
  );
};

export default ManualEntryDashboard;
