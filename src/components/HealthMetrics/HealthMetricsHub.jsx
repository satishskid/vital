import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHeart, FiActivity, FiMoon, FiZap, FiSmartphone,
  FiEdit3, FiInfo, FiCheckCircle, FiClock, FiTrendingUp,
  FiCamera, FiWatch, FiWifi, FiUser
} from 'react-icons/fi';
import { useAuth } from '../../context/FirebaseAuthContext';

const HealthMetricsHub = () => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [expandedMethod, setExpandedMethod] = useState(null);
  const { user } = useAuth();

  const healthMetrics = [
    {
      id: 'hrv',
      name: 'Heart Rate Variability',
      icon: FiHeart,
      color: 'from-red-400 to-pink-500',
      description: 'Measures your nervous system recovery and stress resilience',
      whyImportant: 'HRV shows how well your body handles stress and recovers. Higher HRV typically means better health and resilience.',
      howToCollect: {
        automatic: 'Phone camera can measure HRV using light reflection from your fingertip',
        manual: 'Enter readings from fitness trackers or medical devices',
        frequency: 'Best measured in the morning before getting up'
      },
      normalRanges: {
        excellent: '50+ ms',
        good: '30-50 ms',
        fair: '20-30 ms',
        poor: 'Below 20 ms'
      }
    },
    {
      id: 'sleep',
      name: 'Sleep Quality',
      icon: FiMoon,
      color: 'from-indigo-400 to-purple-500',
      description: 'Tracks your sleep duration, quality, and recovery patterns',
      whyImportant: 'Quality sleep is when your brain detoxifies and consolidates memories. Poor sleep accelerates aging.',
      howToCollect: {
        automatic: 'Phone sensors detect movement patterns and sleep cycles',
        manual: 'Log how you feel upon waking and sleep duration',
        frequency: 'Tracked automatically every night'
      },
      normalRanges: {
        excellent: '7-9 hours, deep sleep',
        good: '6-8 hours, refreshed',
        fair: '5-7 hours, somewhat tired',
        poor: 'Less than 5 hours or very tired'
      }
    },
    {
      id: 'movement',
      name: 'Physical Activity',
      icon: FiActivity,
      color: 'from-green-400 to-emerald-500',
      description: 'Monitors your daily movement, exercise, and cognitive enhancement activities',
      whyImportant: 'Movement increases BDNF (brain fertilizer), improves circulation, and enhances cognitive function.',
      howToCollect: {
        automatic: 'Phone accelerometer counts steps and detects activity patterns',
        manual: 'Log specific exercises, walks, or movement sessions',
        frequency: 'Continuously throughout the day'
      },
      normalRanges: {
        excellent: '10,000+ steps, 30+ active minutes',
        good: '7,000-10,000 steps, 20+ active minutes',
        fair: '5,000-7,000 steps, 10+ active minutes',
        poor: 'Less than 5,000 steps'
      }
    },
    {
      id: 'nutrition',
      name: 'Brain Nutrition',
      icon: FiZap,
      color: 'from-emerald-400 to-teal-500',
      description: 'Tracks nutrient-dense foods that support brain health and longevity',
      whyImportant: 'Your brain uses 20% of your daily calories. Quality nutrition directly affects cognitive function and aging.',
      howToCollect: {
        automatic: 'AI analyzes food photos to identify nutrients and brain foods',
        manual: 'Log meals, snacks, and note how foods make you feel',
        frequency: 'With each meal or snack'
      },
      normalRanges: {
        excellent: '5+ brain foods daily, balanced macros',
        good: '3-4 brain foods, mostly whole foods',
        fair: '1-2 brain foods, some processed foods',
        poor: 'Mostly processed foods, few nutrients'
      }
    }
  ];

  const dataCollectionMethods = [
    {
      type: 'Automatic',
      icon: FiSmartphone,
      color: 'from-blue-400 to-cyan-500',
      title: 'Smart Phone Sensors',
      description: 'Your phone automatically collects health data using built-in sensors',
      methods: [
        'Camera + Flash for heart rate and HRV measurement',
        'Accelerometer for step counting and movement patterns',
        'Microphone for sleep quality analysis',
        'Light sensor for circadian rhythm tracking'
      ],
      benefits: [
        'No extra devices needed',
        'Continuous monitoring',
        'Privacy-focused (data stays on your phone)',
        'Free and always available'
      ]
    },
    {
      type: 'Manual',
      icon: FiEdit3,
      color: 'from-purple-400 to-pink-500',
      title: 'Personal Logging',
      description: 'You can manually enter data for more detailed tracking',
      methods: [
        'How you feel each morning (energy, mood, clarity)',
        'Specific exercises or activities you did',
        'Meals and how they made you feel',
        'Sleep quality and dreams'
      ],
      benefits: [
        'More detailed and personal insights',
        'Captures subjective feelings',
        'Works without any technology',
        'Builds self-awareness'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Health Metrics Guide
          </h1>
          <p className="text-gray-600 text-sm">
            Understand your health metrics and discover the best tracking methods for you
          </p>
        </div>
      </div>



      {/* Educational Content */}
      <div className="max-w-md mx-auto px-4">
            {/* Data Collection Methods */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                How We Collect Your Health Data
              </h2>
              <div className="space-y-3">
                {dataCollectionMethods.map((method, index) => (
                  <motion.div
                    key={method.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedMethod(expandedMethod === method.type ? null : method.type)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center mr-3`}>
                            <method.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{method.title}</h3>
                            <p className="text-xs text-gray-500">{method.type} Collection</p>
                          </div>
                        </div>
                        <FiInfo className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedMethod === method.type ? 'rotate-180' : ''
                        }`} />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{method.description}</p>
                    </div>

                    <AnimatePresence>
                      {expandedMethod === method.type && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-4 bg-gray-50">
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Methods:</h4>
                                <div className="space-y-1">
                                  {method.methods.map((item, idx) => (
                                    <div key={idx} className="flex items-start">
                                      <FiCheckCircle className="w-3 h-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                      <span className="text-xs text-gray-600">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">Benefits:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {method.benefits.map((benefit, idx) => (
                                    <span key={idx} className="text-xs bg-white text-gray-600 px-2 py-1 rounded-full border">
                                      {benefit}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Health Metrics */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Understanding Your Health Metrics
              </h2>
              <div className="space-y-3">
                {healthMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center mr-3`}>
                          <metric.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{metric.name}</h3>
                          <p className="text-xs text-gray-500">{metric.description}</p>
                        </div>
                      </div>
                      <FiInfo className={`w-4 h-4 text-gray-400 transition-transform ${
                        selectedMetric === metric.id ? 'rotate-180' : ''
                      }`} />
                    </div>

                    <AnimatePresence>
                      {selectedMetric === metric.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-100"
                        >
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Why It Matters:</h4>
                              <p className="text-sm text-gray-600">{metric.whyImportant}</p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">How We Collect It:</h4>
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <FiSmartphone className="w-4 h-4 text-blue-500 mt-0.5 mr-2" />
                                  <div>
                                    <span className="text-xs font-medium text-blue-600">Automatic: </span>
                                    <span className="text-xs text-gray-600">{metric.howToCollect.automatic}</span>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <FiEdit3 className="w-4 h-4 text-purple-500 mt-0.5 mr-2" />
                                  <div>
                                    <span className="text-xs font-medium text-purple-600">Manual: </span>
                                    <span className="text-xs text-gray-600">{metric.howToCollect.manual}</span>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <FiClock className="w-4 h-4 text-green-500 mt-0.5 mr-2" />
                                  <div>
                                    <span className="text-xs font-medium text-green-600">Frequency: </span>
                                    <span className="text-xs text-gray-600">{metric.howToCollect.frequency}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Healthy Ranges:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(metric.normalRanges).map(([level, range]) => (
                                  <div key={level} className={`p-2 rounded-lg text-xs ${
                                    level === 'excellent' ? 'bg-green-100 text-green-700' :
                                    level === 'good' ? 'bg-blue-100 text-blue-700' :
                                    level === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    <div className="font-medium capitalize">{level}</div>
                                    <div>{range}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Ready to Start Tracking?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Now that you understand the options, choose your preferred method to log your health data
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.href = '#/manual-entry'}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    <span>Start Manual Entry</span>
                  </button>
                  <button
                    onClick={() => window.location.href = '#/my-health'}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FiSmartphone className="w-4 h-4" />
                    <span>Try Smart Tracking</span>
                  </button>
                </div>
              </div>
            </div>
        </div>
    </div>
  );
};

export default HealthMetricsHub;
