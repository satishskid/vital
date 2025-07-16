import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import VitaSocialCircleManager from '../../services/SocialCircleManager';

const { FiSmartphone, FiUsers, FiShield, FiCheck, FiX, FiHeart, FiUserPlus, FiInfo } = FiIcons;

const ContactImport = ({ onClose, onContactAdded, userId }) => {
  const [step, setStep] = useState('privacy'); // 'privacy', 'import', 'select', 'relationship'
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const socialManagerRef = useRef(null);

  const relationshipTypes = [
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', color: 'bg-red-500' },
    { id: 'partner', label: 'Partner/Spouse', icon: '💕', color: 'bg-pink-500' },
    { id: 'close_friend', label: 'Close Friend', icon: '👥', color: 'bg-blue-500' },
    { id: 'friend', label: 'Friend', icon: '🤝', color: 'bg-green-500' },
    { id: 'colleague', label: 'Colleague', icon: '💼', color: 'bg-purple-500' },
    { id: 'other', label: 'Other', icon: '👤', color: 'bg-gray-500' }
  ];

  const handlePrivacyAccept = () => {
    setStep('import');
    initializeSocialManager();
  };

  const initializeSocialManager = async () => {
    socialManagerRef.current = new VitaSocialCircleManager(userId);
    await socialManagerRef.current.loadData();
  };

  const handleImportContacts = async () => {
    setLoading(true);
    try {
      // Check if Contacts API is available (limited browser support)
      if ('contacts' in navigator && 'ContactsManager' in window) {
        const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: true });
        setPhoneContacts(contacts.map(contact => ({
          id: Math.random().toString(36),
          name: contact.name?.[0] || 'Unknown',
          phone: contact.tel?.[0] || '',
          selected: false
        })));
        setStep('select');
      } else {
        // Fallback: Manual contact entry
        setStep('manual');
      }
    } catch (error) {
      console.error('Error importing contacts:', error);
      // Fallback to manual entry
      setStep('manual');
    }
    setLoading(false);
  };

  const handleContactSelect = (contactId) => {
    setPhoneContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, selected: !contact.selected }
        : contact
    ));
  };

  const handleProceedToRelationship = () => {
    const selected = phoneContacts.filter(c => c.selected);
    setSelectedContacts(selected);
    if (selected.length > 0) {
      setCurrentContact(selected[0]);
      setStep('relationship');
    }
  };

  const handleRelationshipSelect = async (relationship) => {
    if (!currentContact) return;

    try {
      const contactData = {
        name: currentContact.name,
        phone: currentContact.phone,
        relationship: relationship,
        trackingEnabled: true,
        privacyLevel: 'standard'
      };

      await socialManagerRef.current.addContact(contactData);
      onContactAdded?.(contactData);

      // Move to next contact or finish
      const remainingContacts = selectedContacts.filter(c => c.id !== currentContact.id);
      if (remainingContacts.length > 0) {
        setCurrentContact(remainingContacts[0]);
        setSelectedContacts(remainingContacts);
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleManualAdd = () => {
    setStep('manual');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'privacy' && (
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SafeIcon icon={FiShield} className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Privacy-First Contact Import</h3>
            <div className="text-left space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">Contacts are stored with anonymous avatars</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">Only interaction frequency is tracked</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">No message content is ever stored</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-600">You control all tracking settings</p>
              </div>
            </div>
            <div className="space-y-3">
              <motion.button
                onClick={handlePrivacyAccept}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
                whileTap={{ scale: 0.95 }}
              >
                I Understand - Continue
              </motion.button>
              <motion.button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        )}

        {step === 'import' && (
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SafeIcon icon={FiSmartphone} className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Import Contacts</h3>
            <p className="text-sm text-gray-600 mb-6">
              Choose how you'd like to add contacts to your social circle.
            </p>
            <div className="space-y-3">
              <motion.button
                onClick={handleImportContacts}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiSmartphone} className="w-5 h-5" />
                <span>{loading ? 'Importing...' : 'Import from Phone'}</span>
              </motion.button>
              <motion.button
                onClick={handleManualAdd}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiUserPlus} className="w-5 h-5" />
                <span>Add Manually</span>
              </motion.button>
              <motion.button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        )}

        {step === 'select' && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Select Contacts</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose which contacts to add to your social wellness circle.
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {phoneContacts.map(contact => (
                <motion.div
                  key={contact.id}
                  onClick={() => handleContactSelect(contact.id)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    contact.selected ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    contact.selected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {contact.selected ? <SafeIcon icon={FiCheck} className="w-4 h-4" /> : contact.name[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{contact.name}</h4>
                    {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="space-y-3">
              <motion.button
                onClick={handleProceedToRelationship}
                disabled={!phoneContacts.some(c => c.selected)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium disabled:opacity-50"
                whileTap={{ scale: 0.95 }}
              >
                Continue ({phoneContacts.filter(c => c.selected).length} selected)
              </motion.button>
              <motion.button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        )}

        {step === 'relationship' && currentContact && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Set Relationship</h3>
            <p className="text-sm text-gray-600 mb-4">
              How would you describe your relationship with <strong>{currentContact.name}</strong>?
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {relationshipTypes.map(type => (
                <motion.button
                  key={type.id}
                  onClick={() => handleRelationshipSelect(type.id)}
                  className={`${type.color} text-white p-4 rounded-lg text-center`}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
              whileTap={{ scale: 0.95 }}
            >
              Skip This Contact
            </motion.button>
          </div>
        )}

        {step === 'manual' && (
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <SafeIcon icon={FiUserPlus} className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Manual Contact Entry</h3>
            <p className="text-sm text-gray-600 mb-6">
              Contact import isn't available on this device. You can add contacts manually through the main interface.
            </p>
            <motion.button
              onClick={onClose}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium"
              whileTap={{ scale: 0.95 }}
            >
              Got It
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ContactImport;
