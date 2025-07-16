import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiActivity, FiMoon, FiExternalLink, FiStar, FiSmartphone, FiDownload, FiInfo } from 'react-icons/fi';

const SafeIcon = ({ icon: Icon, ...props }) => {
  if (!Icon) return <div {...props} />;
  return <Icon {...props} />;
};

const HealthAppsRecommendations = () => {
  const [activeCategory, setActiveCategory] = useState('hrv');

  const appCategories = {
    hrv: {
      title: 'HRV Monitoring Apps',
      icon: FiHeart,
      color: 'red',
      description: 'Track your heart rate variability for recovery insights',
      apps: [
        {
          name: 'HRV4Training',
          description: 'Professional HRV monitoring with personalized training recommendations',
          features: ['Morning HRV readings', 'Training advice', 'Data export'],
          rating: 4.5,
          price: 'Free trial, then $9.99/month',
          platforms: ['iOS', 'Android'],
          downloadLinks: {
            ios: 'https://apps.apple.com/app/hrv4training/id892422330',
            android: 'https://play.google.com/store/apps/details?id=com.hrv4training.hrv4training'
          }
        },
        {
          name: 'Elite HRV',
          description: 'Comprehensive HRV tracking with team features',
          features: ['Multiple HRV metrics', 'Trend analysis', 'Team management'],
          rating: 4.3,
          price: 'Free basic, Premium $5.99/month',
          platforms: ['iOS', 'Android'],
          downloadLinks: {
            ios: 'https://apps.apple.com/app/elite-hrv/id1071313571',
            android: 'https://play.google.com/store/apps/details?id=com.elitehrv'
          }
        },
        {
          name: 'Kubios HRV',
          description: 'Scientific-grade HRV analysis tool',
          features: ['Advanced analytics', 'Research-grade accuracy', 'Detailed reports'],
          rating: 4.4,
          price: 'Free basic, Premium $9.99/month',
          platforms: ['iOS', 'Android'],
          downloadLinks: {
            ios: 'https://apps.apple.com/app/kubios-hrv/id1071313571',
            android: 'https://play.google.com/store/apps/details?id=com.kubios.hrv'
          }
        }
      ]
    },
    fitness: {
      title: 'Fitness Tracking Apps',
      icon: FiActivity,
      color: 'emerald',
      description: 'Monitor your daily activity, workouts, and fitness progress',
      apps: [
        {
          name: 'Strava',
          description: 'Social fitness tracking for running, cycling, and more',
          features: ['Activity tracking', 'Social features', 'Segment challenges'],
          rating: 4.6,
          price: 'Free basic, Premium $5/month',
          platforms: ['iOS', 'Android'],
          downloadLinks: {
            ios: 'https://apps.apple.com/app/strava/id426826309',
            android: 'https://play.google.com/store/apps/details?id=com.strava'
          }
        },
        {
          name: 'MyFitnessPal',
          description: 'Comprehensive nutrition and fitness tracking',
          features: ['Calorie counting', 'Exercise logging', 'Nutrition insights'],
          rating: 4.4,
          price: 'Free basic, Premium $9.99/month',
          platforms: ['iOS', 'Android'],
          downloadLinks: {
            ios: 'https://apps.apple.com/app/myfitnesspal/id341232718',
            android: 'https://play.google.com/store/apps/details?id=com.myfitnesspal.android'
          }
        },
        {
          name: 'Nike Training Club',
          description: 'Free workouts and training programs',
          features: ['Free workouts', 'Training programs', 'Video guidance'],
          rating: 4.7,
          price: 'Free',
          platforms: ['iOS', 'Android'],
          downloadLinks: {
            ios: 'https://apps.apple.com/app/nike-training-club/id301521403',
            android: 'https://play.google.com/store/apps/details?id=com.nike.ntc'
          }
        }
      ]
    },
    sleep: {
      title: 'Sleep Monitoring Apps',
      icon: FiMoon,
      color: 'blue',
      description: 'Track and improve your sleep quality and patterns',
      apps: [
        {
          name: 'Sleep Cycle',
          description: 'Smart alarm and sleep analysis using sound patterns',
          features: ['Smart alarm', 'Sleep analysis', 'Snore detection'],
          rating: 4.5,
          price: 'Free basic, Premium $2.99/month',
          platforms: ['iOS', 'Android'],
          downloadLinks: {
            ios: 'https://apps.apple.com/app/sleep-cycle/id320606217',
            android: 'https://play.google.com/store/apps/details?id=com.northcube.sleepcycle'
          }
        },
        {
          name: 'Pillow',
          description: 'Advanced sleep tracking with Apple Watch integration',
          features: ['Apple Watch support', 'Sleep stages', 'Heart rate analysis'],
          rating: 4.3,
          price: 'Free basic, Premium $4.99/month',
          platforms: ['iOS'],
          downloadLinks: {
            ios: 'https://apps.apple.com/app/pillow-sleep-tracker/id878691772'
          }
        },
        {
          name: 'Sleep as Android',
          description: 'Comprehensive sleep tracking for Android users',
          features: ['Smart alarm', 'Sleep debt tracking', 'Wearable integration'],
          rating: 4.4,
          price: 'Free basic, Premium $3.99',
          platforms: ['Android'],
          downloadLinks: {
            android: 'https://play.google.com/store/apps/details?id=com.urbandroid.sleep'
          }
        }
      ]
    }
  };

  const categories = Object.keys(appCategories);

  const handleDownload = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <SafeIcon key={i} icon={FiStar} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
        )}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  const currentCategory = appCategories[activeCategory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Health App Recommendations</h1>
          <p className="text-gray-600 mb-4">Discover apps to enhance your health tracking journey</p>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Complement Your Manual Tracking</h3>
                <p className="text-sm text-blue-700">
                  These apps can provide additional data sources to complement your manual health entries.
                  Many offer automatic tracking features that can save you time while maintaining your privacy-first approach.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm p-2">
          <div className="flex space-x-2">
            {categories.map((category) => {
              const categoryData = appCategories[category];
              const isActive = activeCategory === category;
              
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                    isActive
                      ? `bg-${categoryData.color}-500 text-white shadow-md`
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon icon={categoryData.icon} className="w-5 h-5" />
                  <span className="hidden sm:inline">{categoryData.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* App Recommendations */}
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Category Header */}
          <div className={`bg-${currentCategory.color}-50 rounded-xl p-6`}>
            <div className="flex items-center space-x-3 mb-2">
              <SafeIcon icon={currentCategory.icon} className={`w-6 h-6 text-${currentCategory.color}-500`} />
              <h2 className="text-xl font-semibold text-gray-800">{currentCategory.title}</h2>
            </div>
            <p className="text-gray-600">{currentCategory.description}</p>
          </div>

          {/* Apps Grid */}
          <div className="space-y-4">
            {currentCategory.apps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{app.name}</h3>
                    <p className="text-gray-600 mb-2">{app.description}</p>
                    {renderStars(app.rating)}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">{app.price}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      {app.platforms.map((platform) => (
                        <span
                          key={platform}
                          className={`px-2 py-1 text-xs rounded-full ${
                            platform === 'iOS' 
                              ? 'bg-gray-100 text-gray-700' 
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {app.features.map((feature) => (
                      <span
                        key={feature}
                        className={`px-3 py-1 text-xs rounded-full bg-${currentCategory.color}-100 text-${currentCategory.color}-700`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Download Buttons */}
                <div className="flex space-x-3">
                  {app.downloadLinks.ios && (
                    <button
                      onClick={() => handleDownload(app.downloadLinks.ios)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <SafeIcon icon={FiSmartphone} className="w-4 h-4" />
                      <span>iOS App Store</span>
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                    </button>
                  )}
                  {app.downloadLinks.android && (
                    <button
                      onClick={() => handleDownload(app.downloadLinks.android)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <SafeIcon icon={FiDownload} className="w-4 h-4" />
                      <span>Google Play</span>
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HealthAppsRecommendations;
