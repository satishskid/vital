import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import ReminderList from './ReminderList';
import ReminderForm from './ReminderForm';

const { FiBell, FiPlus } = FiIcons;

const RemindersScreen = () => {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div className="pb-20 min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reminders</h1>
            <p className="text-gray-600">Stay on track with gentle nudges</p>
          </div>
          <motion.button
            onClick={() => setShowForm(true)}
            className="bg-emerald-500 text-white p-3 rounded-full"
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiPlus} className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
      
      <div className="px-6 py-6">
        {/* Information Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <div className="flex items-start space-x-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <SafeIcon icon={FiBell} className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Contextual Reminders</h3>
              <p className="text-sm text-gray-600">
                Vita sends gentle nudges at the right time of day, aligned with your circadian rhythm and daily patterns.
              </p>
            </div>
          </div>
        </div>
        
        {/* Reminder List */}
        <ReminderList />
      </div>
      
      {/* Add Reminder Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ReminderForm onClose={() => setShowForm(false)} />
        )}
      </AnimatePresence>
      
      {/* Floating Action Button (Mobile) */}
      <motion.button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-6 bg-emerald-500 text-white p-4 rounded-full shadow-lg md:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <SafeIcon icon={FiPlus} className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default RemindersScreen;