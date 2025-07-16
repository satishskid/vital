import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiActivity, FiSun, FiMoon, FiZap, FiTrendingUp, FiBook, FiInfo, FiHeadphones } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import PodcastPlayer from '../Audio/PodcastPlayer';

const VitalityScience = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiInfo },
    { id: 'recovery', label: 'Recovery', icon: FiMoon },
    { id: 'resilience', label: 'Resilience', icon: FiActivity },
    { id: 'fuel', label: 'Fuel', icon: FiSun },
    { id: 'podcast', label: 'Podcast', icon: FiHeadphones }
  ];

  const scienceContent = {
    overview: {
      title: 'The Science Behind Your Vitality Rings',
      content: [
        {
          subtitle: 'Evidence-Based Health Monitoring',
          text: 'Your Vitality Orb is built on decades of peer-reviewed research in chronobiology, autonomic nervous system function, and behavioral psychology. Each ring represents a fundamental pillar of human vitality backed by scientific evidence.',
          source: 'Multiple peer-reviewed studies'
        },
        {
          subtitle: 'Holistic Health Assessment',
          text: 'Unlike single-metric trackers, Vita uses a multi-dimensional approach that mirrors how your body actually works - as an interconnected system where sleep affects performance, movement influences recovery, and nutrition impacts mood.',
          source: 'Systems Biology Research'
        },
        {
          subtitle: 'Personalized Insights',
          text: 'The rings adapt to your individual patterns and provide personalized recommendations based on your unique physiological responses and lifestyle factors.',
          source: 'Precision Medicine Principles'
        }
      ]
    },
    recovery: {
      title: 'Recovery Ring: Your Restoration System',
      content: [
        {
          subtitle: 'Heart Rate Variability (HRV) Science',
          text: 'HRV measures the variation between heartbeats, reflecting your autonomic nervous system health. Higher HRV indicates better stress resilience and recovery capacity. This biomarker is considered one of the most reliable indicators of overall health and readiness.',
          source: 'Thayer & Lane (2009), Neuroscience & Biobehavioral Reviews'
        },
        {
          subtitle: 'Sleep and Cellular Repair',
          text: 'During sleep, your body activates cellular repair mechanisms, consolidates memories, and clears metabolic waste from the brain. Quality sleep is when your body literally rebuilds itself at the molecular level.',
          source: 'Walker (2017), Why We Sleep; Xie et al. (2013), Science'
        },
        {
          subtitle: 'Stress Recovery Mechanisms',
          text: 'Your recovery ring tracks how well your parasympathetic nervous system (rest-and-digest) balances your sympathetic system (fight-or-flight). This balance is crucial for long-term health and performance.',
          source: 'Porges (2011), Polyvagal Theory'
        }
      ]
    },
    resilience: {
      title: 'Resilience Ring: Your Adaptive Capacity',
      content: [
        {
          subtitle: 'Movement as Medicine',
          text: 'Physical activity triggers the release of BDNF (brain-derived neurotrophic factor), which promotes neuroplasticity and cognitive function. Regular movement literally grows new brain cells and strengthens neural connections.',
          source: 'Voss et al. (2013), Nature Reviews Neuroscience'
        },
        {
          subtitle: 'Hormetic Stress Response',
          text: 'Exercise creates beneficial stress (hormesis) that strengthens your body\'s adaptive systems. This controlled stress improves your ability to handle life\'s challenges both physically and mentally.',
          source: 'Mattson (2008), Ageing Research Reviews'
        },
        {
          subtitle: 'Mind-Body Integration',
          text: 'Mindfulness and breathing practices activate the vagus nerve, improving heart rate variability and reducing inflammation. These practices literally rewire your brain for better stress resilience.',
          source: 'Pascoe et al. (2017), Nature Scientific Reports'
        }
      ]
    },
    fuel: {
      title: 'Fuel Ring: Your Energy Systems',
      content: [
        {
          subtitle: 'Circadian Nutrition Timing',
          text: 'Nearly every cell contains a molecular clock that regulates metabolism. When you eat affects how your body processes nutrients. Proper meal timing optimizes energy production and cellular repair.',
          source: 'Panda (2017), Cell; Chaix et al. (2019), Cell Metabolism'
        },
        {
          subtitle: 'Social Connection and Health',
          text: 'Strong social connections reduce inflammation, boost immune function, and increase longevity. Social isolation has health impacts equivalent to smoking 15 cigarettes daily.',
          source: 'Holt-Lunstad et al. (2015), Perspectives on Psychological Science'
        },
        {
          subtitle: 'Emotional Regulation and Physiology',
          text: 'Your emotional state directly affects your immune system, hormone production, and cellular function. Positive emotions trigger beneficial biochemical cascades throughout your body.',
          source: 'Fredrickson et al. (2013), Psychological Science'
        }
      ]
    },
    podcast: {
      title: 'Listen: Six Golden Habits for Enduring Youth',
      content: [
        {
          subtitle: 'Science-Backed Longevity Insights',
          text: 'Discover the six fundamental habits that research shows can significantly extend healthspan and promote enduring youth. This podcast explores the scientific evidence behind lifestyle interventions that support the same vitality pillars measured by your Vita rings.',
          source: 'Vita Health Research'
        },
        {
          subtitle: 'Connecting Habits to Your Vitality Rings',
          text: 'Learn how the golden habits directly relate to your Recovery, Resilience, and Fuel rings. Understanding these connections helps you make informed decisions about which lifestyle changes will have the greatest impact on your measured vitality.',
          source: 'Evidence-Based Health Optimization'
        }
      ]
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiBook} className="w-6 h-6" />
                <h2 className="text-xl font-bold">The Science Behind Vita</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 p-1"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {scienceContent[activeTab].title}
              </h3>
              
              <div className="space-y-6">
                {scienceContent[activeTab].content.map((section, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {section.subtitle}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {section.text}
                    </p>
                    <div className="bg-white rounded px-3 py-2 border-l-4 border-blue-500">
                      <p className="text-xs text-gray-600">
                        <strong>Source:</strong> {section.source}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Podcast Player for podcast tab */}
                {activeTab === 'podcast' && (
                  <PodcastPlayer
                    audioSrc="/audio/Six Golden Habits for Enduring Youth.wav"
                    title="Six Golden Habits for Enduring Youth"
                    description="Discover the science-backed habits that promote longevity and vitality"
                    className="mt-6"
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
                <span>Evidence-based health insights</span>
              </div>
              <button
                onClick={onClose}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VitalityScience;
