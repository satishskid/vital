import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiX, FiBookOpen, FiExternalLink } = FiIcons;

const WhyCard = ({ data, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-white rounded-xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <SafeIcon icon={FiBookOpen} className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Why This Matters</h2>
          </div>
          <motion.button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{data.title}</h3>
          
          <div className="prose prose-sm text-gray-700 mb-6">
            <p>{data.content}</p>
          </div>

          {/* Source */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiExternalLink} className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Research Source</span>
            </div>
            <p className="text-sm text-gray-600">{data.source}</p>
          </div>

          {/* Key Benefits */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Key Benefits</h4>
            <div className="space-y-2">
              {getBenefits(data.title).map((benefit, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
            whileTap={{ scale: 0.98 }}
          >
            Got It!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const getBenefits = (title) => {
  const benefitsMap = {
    'Heart Rate Variability': [
      'Indicates autonomic nervous system balance',
      'Reflects stress resilience and recovery capacity',
      'Helps optimize training and rest periods',
      'Correlates with overall health and longevity'
    ],
    'Movement & Exercise': [
      'Increases BDNF for brain health',
      'Improves cardiovascular function',
      'Enhances mood through endorphin release',
      'Strengthens muscles and bones'
    ],
    'Mindful Nutrition': [
      'Stabilizes blood sugar levels',
      'Supports neurotransmitter production',
      'Reduces inflammation in the body',
      'Improves energy and mental clarity'
    ],
    'Mindfulness Practice': [
      'Increases gray matter density',
      'Reduces stress hormone levels',
      'Improves emotional regulation',
      'Enhances focus and attention'
    ],
    'Breathwork & Meditation': [
      'Activates parasympathetic nervous system',
      'Reduces cortisol and stress markers',
      'Improves heart rate variability',
      'Enhances cognitive function'
    ],
    'Social Support & Health': [
      'Increases longevity by up to 50%',
      'Reduces risk of depression and anxiety',
      'Boosts immune system function',
      'Improves stress resilience'
    ]
  };

  return benefitsMap[title] || [
    'Supports overall wellness',
    'Improves quality of life',
    'Enhances physical health',
    'Promotes mental well-being'
  ];
};

export default WhyCard;