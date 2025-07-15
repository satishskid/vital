import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { useReminders } from '../../context/ReminderContext';
import SafeIcon from '../../common/SafeIcon';

const { FiBell, FiTrash2, FiEdit2, FiToggleLeft, FiToggleRight } = FiIcons;

const ReminderList = () => {
  const { reminders, updateReminder, deleteReminder, loading } = useReminders();
  
  const formatTime = (timeString) => {
    // Format time from 24h to 12h format (e.g., "14:30" to "2:30 PM")
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const formatDays = (daysArray) => {
    if (daysArray.length === 7) return 'Every day';
    if (daysArray.includes('monday') && 
        daysArray.includes('tuesday') && 
        daysArray.includes('wednesday') && 
        daysArray.includes('thursday') && 
        daysArray.includes('friday') && 
        !daysArray.includes('saturday') && 
        !daysArray.includes('sunday')) {
      return 'Weekdays';
    }
    
    if (!daysArray.includes('monday') && 
        !daysArray.includes('tuesday') && 
        !daysArray.includes('wednesday') && 
        !daysArray.includes('thursday') && 
        !daysArray.includes('friday') && 
        daysArray.includes('saturday') && 
        daysArray.includes('sunday')) {
      return 'Weekends';
    }
    
    return daysArray
      .map(day => day.charAt(0).toUpperCase() + day.slice(1, 3))
      .join(', ');
  };
  
  const toggleReminderStatus = async (reminder) => {
    await updateReminder(reminder.id, { is_active: !reminder.is_active });
  };
  
  const handleDeleteReminder = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      await deleteReminder(id);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (reminders.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiBell} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No reminders set yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <motion.div
          key={reminder.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
            reminder.is_active ? 'border-emerald-500' : 'border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`mt-1 p-2 rounded-full ${
                reminder.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
              }`}>
                <SafeIcon icon={FiBell} className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-medium ${
                  reminder.is_active ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {reminder.title}
                </h3>
                <p className="text-sm text-gray-600">{reminder.description}</p>
                <div className="flex items-center mt-1 space-x-4">
                  <span className="text-xs text-gray-500">{formatTime(reminder.time)}</span>
                  <span className="text-xs text-gray-500">{formatDays(reminder.days)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleReminderStatus(reminder)}
                className="text-gray-500 hover:text-gray-700"
              >
                <SafeIcon 
                  icon={reminder.is_active ? FiToggleRight : FiToggleLeft} 
                  className={`w-6 h-6 ${reminder.is_active ? 'text-emerald-500' : ''}`} 
                />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <SafeIcon icon={FiEdit2} className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleDeleteReminder(reminder.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <SafeIcon icon={FiTrash2} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ReminderList;