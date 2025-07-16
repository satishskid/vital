import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit3, FiTrash2, FiUsers, FiHeart, FiPhone, FiMail, FiSettings, FiShield } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/FirebaseAuthContext';
import VitaSocialCircleManager from '../../services/SocialCircleManager';

const SocialCircleManager = () => {
  const { user } = useAuth();
  const [socialCircle, setSocialCircle] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const socialManagerRef = useRef(null);

  useEffect(() => {
    if (user) {
      initializeSocialManager();
    }
  }, [user]);

  const initializeSocialManager = async () => {
    try {
      socialManagerRef.current = new VitaSocialCircleManager(user.uid);
      await socialManagerRef.current.loadData();
      setSocialCircle(socialManagerRef.current.getSocialCircle());
      setLoading(false);
    } catch (error) {
      console.error('Error initializing social manager:', error);
      setLoading(false);
    }
  };

  const handleAddContact = async (contactData) => {
    try {
      const newContact = await socialManagerRef.current.addContact(contactData);
      setSocialCircle(socialManagerRef.current.getSocialCircle());
      setShowAddContact(false);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleUpdateContact = async (contactId, updates) => {
    try {
      await socialManagerRef.current.updateContact(contactId, updates);
      setSocialCircle(socialManagerRef.current.getSocialCircle());
      setEditingContact(null);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to remove this contact from your social circle?')) {
      try {
        await socialManagerRef.current.removeContact(contactId);
        setSocialCircle(socialManagerRef.current.getSocialCircle());
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const getFilteredContacts = () => {
    if (filter === 'all') return socialCircle;
    return socialCircle.filter(contact => contact.relationship === filter);
  };

  const getRelationshipIcon = (relationship) => {
    const icons = {
      family: '👨‍👩‍👧‍👦',
      partner: '💕',
      close_friend: '👥',
      friend: '🤝',
      colleague: '💼',
      acquaintance: '👋',
      other: '👤'
    };
    return icons[relationship] || '👤';
  };

  const formatLastContact = (lastContact) => {
    if (!lastContact) return 'Never';
    
    const now = new Date();
    const diff = now - lastContact;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Social Circle</h1>
              <p className="text-gray-600">Manage your caring connections for better health outcomes</p>
            </div>
            <motion.button
              onClick={() => setShowAddContact(true)}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4" />
              <span>Add Contact</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{socialCircle.length}</div>
            <div className="text-sm text-gray-600">Total Contacts</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {socialCircle.filter(c => ['family', 'partner'].includes(c.relationship)).length}
            </div>
            <div className="text-sm text-gray-600">Close Family</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {socialCircle.filter(c => c.trackingEnabled).length}
            </div>
            <div className="text-sm text-gray-600">Tracking Enabled</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {socialCircle.filter(c => c.lastContact && (new Date() - c.lastContact) < 7 * 24 * 60 * 60 * 1000).length}
            </div>
            <div className="text-sm text-gray-600">Recent Contact</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Filter by Relationship</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Contacts', count: socialCircle.length },
              { id: 'family', label: 'Family', count: socialCircle.filter(c => c.relationship === 'family').length },
              { id: 'partner', label: 'Partner', count: socialCircle.filter(c => c.relationship === 'partner').length },
              { id: 'close_friend', label: 'Close Friends', count: socialCircle.filter(c => c.relationship === 'close_friend').length },
              { id: 'friend', label: 'Friends', count: socialCircle.filter(c => c.relationship === 'friend').length }
            ].map(filterOption => (
              <motion.button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.id
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                {filterOption.label} ({filterOption.count})
              </motion.button>
            ))}
          </div>
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-6">Your Social Circle</h3>
          
          {getFilteredContacts().length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No contacts found</h4>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? 'Start building your social circle by adding your first contact'
                  : `No contacts found in the ${filter.replace('_', ' ')} category`
                }
              </p>
              {filter === 'all' && (
                <motion.button
                  onClick={() => setShowAddContact(true)}
                  className="bg-pink-500 text-white px-6 py-3 rounded-lg font-medium"
                  whileTap={{ scale: 0.98 }}
                >
                  Add Your First Contact
                </motion.button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredContacts().map(contact => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {getRelationshipIcon(contact.relationship)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {contact.name}
                          {contact.nickname && contact.nickname !== contact.name && (
                            <span className="text-gray-500 ml-2">({contact.nickname})</span>
                          )}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="capitalize">{contact.relationship.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>Last contact: {formatLastContact(contact.lastContact)}</span>
                          {contact.interactionCount > 0 && (
                            <>
                              <span>•</span>
                              <span>{contact.interactionCount} interactions</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {contact.trackingEnabled && (
                        <div className="flex items-center space-x-1 text-green-600 text-xs">
                          <SafeIcon icon={FiShield} className="w-3 h-3" />
                          <span>Tracking</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1">
                        {contact.phone && (
                          <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-400" />
                        )}
                        {contact.email && (
                          <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      
                      <motion.button
                        onClick={() => setEditingContact(contact)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        whileTap={{ scale: 0.98 }}
                      >
                        <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        whileTap={{ scale: 0.98 }}
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiShield} className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Privacy & Social Wellness</h3>
              <p className="text-sm text-blue-700 mb-3">
                Your social circle helps us understand your connection patterns for better health insights. 
                All social tracking is optional and processed locally on your device.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Contact information stays private and secure</li>
                <li>• Social interaction tracking requires explicit consent</li>
                <li>• You control which apps and contacts to monitor</li>
                <li>• Data is used only for your personal health insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Contact Modal */}
      <AnimatePresence>
        {(showAddContact || editingContact) && (
          <ContactModal
            contact={editingContact}
            onSave={editingContact ? 
              (updates) => handleUpdateContact(editingContact.id, updates) : 
              handleAddContact
            }
            onClose={() => {
              setShowAddContact(false);
              setEditingContact(null);
            }}
            relationshipTypes={socialManagerRef.current?.relationshipTypes || []}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Contact Modal Component (simplified for space)
const ContactModal = ({ contact, onSave, onClose, relationshipTypes }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    nickname: contact?.nickname || '',
    relationship: contact?.relationship || 'friend',
    phone: contact?.phone || '',
    email: contact?.email || '',
    trackingEnabled: contact?.trackingEnabled !== false,
    privacyLevel: contact?.privacyLevel || 'standard',
    notes: contact?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {contact ? 'Edit Contact' : 'Add New Contact'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nickname</label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              >
                {relationshipTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="trackingEnabled"
                checked={formData.trackingEnabled}
                onChange={(e) => setFormData({...formData, trackingEnabled: e.target.checked})}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="trackingEnabled" className="text-sm text-gray-700">
                Enable social interaction tracking for this contact
              </label>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                {contact ? 'Update' : 'Add'} Contact
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SocialCircleManager;
