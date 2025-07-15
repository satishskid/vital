import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { useSocial } from '../../context/SocialContext';
import SafeIcon from '../../common/SafeIcon';

const { FiMail, FiUsers, FiHeart, FiX, FiCheck } = FiIcons;

const ConnectionForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [relationshipType, setRelationshipType] = useState('friend');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { addConnection } = useSocial();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await addConnection(email, relationshipType);
      
      if (error) {
        if (error.message.includes('not found')) {
          // If user not found but invite sent, show success message
          setSuccess(true);
        } else {
          throw error;
        }
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error adding connection:', error);
      setError(error.message || 'Failed to add connection');
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
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
          className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl max-w-md w-full"
        >
          <div className="p-6 text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Invitation Sent!</h2>
            <p className="text-gray-600 mb-6">
              {relationshipType === 'family' ? 'Family member' : 'Friend'} will be added to your support circle once they accept the invitation.
            </p>
            <motion.button
              onClick={onClose}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium"
              whileTap={{ scale: 0.98 }}
            >
              Done
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }
  
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
        className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl max-w-md w-full"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Add to Support Circle</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 mx-4 mt-4 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="their.email@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRelationshipType('friend')}
                className={`p-3 rounded-lg flex flex-col items-center space-y-2 ${
                  relationshipType === 'friend'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <SafeIcon icon={FiUsers} className="w-6 h-6" />
                <span className="text-sm font-medium">Friend</span>
              </button>
              
              <button
                type="button"
                onClick={() => setRelationshipType('family')}
                className={`p-3 rounded-lg flex flex-col items-center space-y-2 ${
                  relationshipType === 'family'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <SafeIcon icon={FiHeart} className="w-6 h-6" />
                <span className="text-sm font-medium">Family</span>
              </button>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-sm text-gray-600 mb-4">
              This person will receive an invitation to join your support circle. They'll need to create a Vita account if they don't already have one.
            </p>
            <motion.button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium disabled:bg-emerald-300 flex items-center justify-center space-x-2"
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Send Invitation</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ConnectionForm;