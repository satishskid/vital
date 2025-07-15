import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { useReminders } from '../../context/ReminderContext';
import SafeIcon from '../../common/SafeIcon';

const { FiBell, FiClock, FiCalendar, FiX, FiCheck, FiPlus } = FiIcons;

const ReminderForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '08:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  });
  const [loading, setLoading] = useState(false);
  
  const { addReminder } = useReminders();
  
  const daysOfWeek = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDayToggle = (day) => {
    setFormData(prev => {
      const days = [...prev.days];
      if (days.includes(day)) {
        return { ...prev, days: days.filter(d => d !== day) };
      } else {
        return { ...prev, days: [...days, day] };
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addReminder({
        ...formData,
        is_active: true
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding reminder:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePresets = (preset) => {
    switch (preset) {
      case 'morning':
        setFormData(prev => ({ ...prev, time: '07:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }));
        break;
      case 'evening':
        setFormData(prev => ({ ...prev, time: '18:00', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }));
        break;
      case 'weekdays':
        setFormData(prev => ({ ...prev, days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }));
        break;
      case 'weekends':
        setFormData(prev => ({ ...prev, days: ['saturday', 'sunday'] }));
        break;
      case 'everyday':
        setFormData(prev => ({ ...prev, days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }));
        break;
      default:
        break;
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4 sm:items-center"
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Add Reminder</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Morning HRV Check"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Check your HRV to plan your day"
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preset Times
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePresets('morning')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                Morning (7 AM)
              </button>
              <button
                type="button"
                onClick={() => handlePresets('evening')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                Evening (6 PM)
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Days
            </label>
            <div className="flex justify-between mb-2">
              {daysOfWeek.map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                    formData.days.includes(day.value)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {day.label.charAt(0)}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePresets('weekdays')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                Weekdays
              </button>
              <button
                type="button"
                onClick={() => handlePresets('weekends')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                Weekends
              </button>
              <button
                type="button"
                onClick={() => handlePresets('everyday')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                Every Day
              </button>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading || formData.days.length === 0}
              className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <SafeIcon icon={FiCheck} className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ReminderForm;