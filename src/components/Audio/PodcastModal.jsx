import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import PodcastPlayer from './PodcastPlayer';

const PodcastModal = ({ isOpen, onClose, podcastInfo }) => {
  if (!isOpen || !podcastInfo) return null;

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
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiExternalLink} className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Science-Based Podcast</h2>
                  <p className="text-purple-100 text-sm">Understanding the foundation of vitality</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 p-1"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {podcastInfo.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                This podcast explains the scientific foundation behind Vita's six pillars of vitality. 
                Understanding these concepts will help you make informed decisions about your health journey.
              </p>
            </div>

            {/* Podcast Player */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <PodcastPlayer
                audioSrc={podcastInfo.src}
                title={podcastInfo.title}
                description="The scientific foundation for your vitality transformation"
                showProgress={true}
              />
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">🔬 What You'll Learn</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Evidence-based habits for longevity</li>
                  <li>• How the six pillars work together</li>
                  <li>• Scientific research behind recommendations</li>
                  <li>• Practical application in daily life</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Why This Matters</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Make informed health decisions</li>
                  <li>• Understand your vitality scores</li>
                  <li>• Follow recommendations with confidence</li>
                  <li>• Build trust through transparency</li>
                </ul>
              </div>
            </div>

            {/* Snippet Notification Info */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">📱 Helpful Reminders</h4>
              <p className="text-sm text-purple-700">
                We'll send you bite-sized insights from this podcast as gentle notifications 
                to guide your vitality journey. These science-based snippets help you understand 
                the "why" behind your health tracking.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span>🎧 Listen at your own pace • 📚 Science-backed content</span>
              </div>
              <button
                onClick={onClose}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PodcastModal;
