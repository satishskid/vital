import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiX, FiBookOpen } = FiIcons;

const ScienceCard = ({ data, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-40 max-h-[70vh] overflow-y-auto"
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <div className="sticky top-0 bg-white p-4 border-b border-gray-100 rounded-t-2xl z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-100 p-2 rounded-full">
              <SafeIcon icon={FiBookOpen} className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Science Insight</span>
          </div>
          <motion.button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="p-6 pt-2">
        <h3 className="text-lg font-bold text-gray-800 mb-3">{data.title}</h3>
        <p className="text-sm text-gray-700 mb-4">{data.content}</p>
        
        {data.source && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-600">Source: {data.source}</p>
          </div>
        )}
        
        <motion.button
          onClick={onClose}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium"
          whileTap={{ scale: 0.98 }}
        >
          Got It
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ScienceCard;