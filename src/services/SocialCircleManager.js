/**
 * Vita Social Circle Manager
 * Privacy-first social wellness tracking and management
 */

import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/supabase';

class VitaSocialCircleManager {
  constructor(userId) {
    this.userId = userId;
    this.socialCircle = [];
    this.socialInteractions = [];
    this.privacySettings = {
      socialTrackingEnabled: false,
      allowedApps: [],
      trackingLevel: 'basic', // basic, detailed, full
      dataRetentionDays: 30
    };
    
    // Relationship types
    this.relationshipTypes = [
      { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', priority: 1 },
      { id: 'partner', label: 'Partner/Spouse', icon: '💕', priority: 1 },
      { id: 'close_friend', label: 'Close Friend', icon: '👥', priority: 2 },
      { id: 'friend', label: 'Friend', icon: '🤝', priority: 3 },
      { id: 'colleague', label: 'Colleague', icon: '💼', priority: 4 },
      { id: 'acquaintance', label: 'Acquaintance', icon: '👋', priority: 5 },
      { id: 'other', label: 'Other', icon: '👤', priority: 6 }
    ];
    
    this.loadData();
  }

  /**
   * Load social circle data from Firebase
   */
  async loadData() {
    try {
      // Load social circle
      const circleRef = collection(db, 'users', this.userId, 'social_circle');
      const circleSnapshot = await getDocs(query(circleRef, orderBy('createdAt', 'desc')));
      
      this.socialCircle = circleSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        lastContact: doc.data().lastContact?.toDate()
      }));

      // Load privacy settings
      const settingsRef = collection(db, 'users', this.userId, 'privacy_settings');
      const settingsSnapshot = await getDocs(settingsRef);
      
      if (!settingsSnapshot.empty) {
        const settingsDoc = settingsSnapshot.docs[0];
        this.privacySettings = { ...this.privacySettings, ...settingsDoc.data() };
      }

      console.log('Social circle data loaded:', this.socialCircle.length, 'contacts');
    } catch (error) {
      console.error('Error loading social circle data:', error);
    }
  }

  /**
   * Add a new person to the social circle
   */
  async addContact(contactData) {
    try {
      const contact = {
        name: contactData.name,
        nickname: contactData.nickname || contactData.name,
        relationship: contactData.relationship,
        phone: contactData.phone || '',
        email: contactData.email || '',
        socialHandles: contactData.socialHandles || {},
        privacyLevel: contactData.privacyLevel || 'standard', // minimal, standard, detailed
        trackingEnabled: contactData.trackingEnabled !== false,
        notes: contactData.notes || '',
        createdAt: new Date(),
        lastContact: null,
        interactionCount: 0,
        userId: this.userId
      };

      const circleRef = collection(db, 'users', this.userId, 'social_circle');
      const docRef = await addDoc(circleRef, contact);
      
      contact.id = docRef.id;
      this.socialCircle.push(contact);
      
      console.log('Contact added to social circle:', contact.name);
      return contact;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  }

  /**
   * Update an existing contact
   */
  async updateContact(contactId, updates) {
    try {
      const contactRef = doc(db, 'users', this.userId, 'social_circle', contactId);
      await updateDoc(contactRef, {
        ...updates,
        updatedAt: new Date()
      });

      // Update local data
      const contactIndex = this.socialCircle.findIndex(c => c.id === contactId);
      if (contactIndex !== -1) {
        this.socialCircle[contactIndex] = { ...this.socialCircle[contactIndex], ...updates };
      }

      console.log('Contact updated:', contactId);
      return this.socialCircle[contactIndex];
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  /**
   * Remove a contact from the social circle
   */
  async removeContact(contactId) {
    try {
      const contactRef = doc(db, 'users', this.userId, 'social_circle', contactId);
      await deleteDoc(contactRef);

      // Remove from local data
      this.socialCircle = this.socialCircle.filter(c => c.id !== contactId);
      
      console.log('Contact removed from social circle:', contactId);
    } catch (error) {
      console.error('Error removing contact:', error);
      throw error;
    }
  }

  /**
   * Record a social interaction
   */
  async recordInteraction(interactionData) {
    try {
      const interaction = {
        contactId: interactionData.contactId,
        contactName: interactionData.contactName,
        type: interactionData.type, // call, message, video_call, social_media
        app: interactionData.app, // whatsapp, imessage, facetime, etc.
        duration: interactionData.duration || null,
        timestamp: interactionData.timestamp || new Date(),
        metadata: interactionData.metadata || {},
        userId: this.userId
      };

      const interactionsRef = collection(db, 'users', this.userId, 'social_interactions');
      const docRef = await addDoc(interactionsRef, interaction);
      
      interaction.id = docRef.id;
      this.socialInteractions.push(interaction);

      // Update contact's last contact time and interaction count
      const contact = this.socialCircle.find(c => c.id === interactionData.contactId);
      if (contact) {
        await this.updateContact(contact.id, {
          lastContact: interaction.timestamp,
          interactionCount: (contact.interactionCount || 0) + 1
        });
      }

      console.log('Social interaction recorded:', interaction.type, 'with', interaction.contactName);
      return interaction;
    } catch (error) {
      console.error('Error recording interaction:', error);
      throw error;
    }
  }

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(newSettings) {
    try {
      this.privacySettings = { ...this.privacySettings, ...newSettings };
      
      const settingsRef = collection(db, 'users', this.userId, 'privacy_settings');
      const settingsSnapshot = await getDocs(settingsRef);
      
      if (settingsSnapshot.empty) {
        await addDoc(settingsRef, this.privacySettings);
      } else {
        const settingsDoc = settingsSnapshot.docs[0];
        await updateDoc(doc(db, 'users', this.userId, 'privacy_settings', settingsDoc.id), this.privacySettings);
      }

      console.log('Privacy settings updated');
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw error;
    }
  }

  /**
   * Get social circle with filtering and sorting
   */
  getSocialCircle(filters = {}) {
    let filtered = [...this.socialCircle];

    // Filter by relationship type
    if (filters.relationship) {
      filtered = filtered.filter(c => c.relationship === filters.relationship);
    }

    // Filter by tracking enabled
    if (filters.trackingEnabled !== undefined) {
      filtered = filtered.filter(c => c.trackingEnabled === filters.trackingEnabled);
    }

    // Sort by priority (relationship type) and last contact
    filtered.sort((a, b) => {
      const aType = this.relationshipTypes.find(r => r.id === a.relationship);
      const bType = this.relationshipTypes.find(r => r.id === b.relationship);
      
      const aPriority = aType ? aType.priority : 999;
      const bPriority = bType ? bType.priority : 999;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Secondary sort by last contact (most recent first)
      const aLastContact = a.lastContact || new Date(0);
      const bLastContact = b.lastContact || new Date(0);
      return bLastContact - aLastContact;
    });

    return filtered;
  }

  /**
   * Get recent social interactions
   */
  getRecentInteractions(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.socialInteractions
      .filter(i => i.timestamp >= cutoffDate)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get social wellness metrics
   */
  getSocialWellnessMetrics(days = 7) {
    const recentInteractions = this.getRecentInteractions(days);
    const uniqueContacts = new Set(recentInteractions.map(i => i.contactId));
    
    // Calculate interaction types
    const interactionTypes = recentInteractions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {});

    // Calculate daily averages
    const dailyInteractions = recentInteractions.length / days;
    const dailyUniqueContacts = uniqueContacts.size / days;

    // Get contacts not contacted recently
    const staleContacts = this.socialCircle.filter(contact => {
      if (!contact.lastContact) return true;
      const daysSinceContact = (new Date() - contact.lastContact) / (1000 * 60 * 60 * 24);
      return daysSinceContact > 7; // Haven't contacted in a week
    });

    return {
      totalInteractions: recentInteractions.length,
      uniqueContactsReached: uniqueContacts.size,
      dailyAverageInteractions: Math.round(dailyInteractions * 10) / 10,
      dailyAverageContacts: Math.round(dailyUniqueContacts * 10) / 10,
      interactionTypes,
      staleContacts: staleContacts.slice(0, 5), // Top 5 to reconnect with
      socialWellnessScore: this.calculateSocialWellnessScore(recentInteractions, uniqueContacts.size)
    };
  }

  /**
   * Calculate social wellness score (0-100)
   */
  calculateSocialWellnessScore(interactions, uniqueContacts) {
    // Base score factors
    const interactionFrequency = Math.min(interactions.length / 7, 5) * 20; // Up to 20 points for frequency
    const contactDiversity = Math.min(uniqueContacts, 5) * 15; // Up to 15 points for diversity
    
    // Quality factors
    const qualityInteractions = interactions.filter(i => 
      i.type === 'call' || i.type === 'video_call' || 
      (i.type === 'message' && i.duration > 60000) // Long conversations
    ).length;
    const qualityScore = Math.min(qualityInteractions / 3, 1) * 25; // Up to 25 points for quality
    
    // Consistency factor (interactions spread across days)
    const daysWithInteractions = new Set(
      interactions.map(i => i.timestamp.toDateString())
    ).size;
    const consistencyScore = Math.min(daysWithInteractions / 7, 1) * 20; // Up to 20 points for consistency
    
    // Family/close friend bonus
    const closeInteractions = interactions.filter(i => {
      const contact = this.socialCircle.find(c => c.id === i.contactId);
      return contact && ['family', 'partner', 'close_friend'].includes(contact.relationship);
    }).length;
    const closeContactBonus = Math.min(closeInteractions / 5, 1) * 20; // Up to 20 points for close contacts
    
    const totalScore = Math.min(
      interactionFrequency + contactDiversity + qualityScore + consistencyScore + closeContactBonus,
      100
    );
    
    return Math.round(totalScore);
  }

  /**
   * Get relationship type info
   */
  getRelationshipType(relationshipId) {
    return this.relationshipTypes.find(r => r.id === relationshipId);
  }

  /**
   * Get suggestions for people to contact
   */
  getContactSuggestions() {
    const now = new Date();
    const suggestions = [];

    this.socialCircle.forEach(contact => {
      if (!contact.trackingEnabled) return;

      const daysSinceContact = contact.lastContact 
        ? (now - contact.lastContact) / (1000 * 60 * 60 * 24)
        : 999;

      const relationshipType = this.getRelationshipType(contact.relationship);
      const priority = relationshipType ? relationshipType.priority : 999;

      // Suggest based on relationship priority and time since last contact
      let suggestionReason = '';
      let urgency = 'low';

      if (priority <= 2 && daysSinceContact > 3) { // Family/Partner
        suggestionReason = 'Haven\'t connected with close family/partner recently';
        urgency = daysSinceContact > 7 ? 'high' : 'medium';
      } else if (priority <= 3 && daysSinceContact > 7) { // Close friends
        suggestionReason = 'It\'s been a while since you connected';
        urgency = daysSinceContact > 14 ? 'medium' : 'low';
      } else if (daysSinceContact > 30) { // Anyone after a month
        suggestionReason = 'Long time no contact - might be worth reaching out';
        urgency = 'low';
      }

      if (suggestionReason) {
        suggestions.push({
          contact,
          reason: suggestionReason,
          urgency,
          daysSinceContact: Math.round(daysSinceContact),
          priority
        });
      }
    });

    // Sort by urgency and priority
    suggestions.sort((a, b) => {
      const urgencyOrder = { high: 3, medium: 2, low: 1 };
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      }
      return a.priority - b.priority;
    });

    return suggestions.slice(0, 5); // Top 5 suggestions
  }

  /**
   * Export social data (for user download)
   */
  exportSocialData() {
    return {
      socialCircle: this.socialCircle.map(contact => ({
        name: contact.name,
        relationship: contact.relationship,
        lastContact: contact.lastContact,
        interactionCount: contact.interactionCount
      })),
      privacySettings: this.privacySettings,
      exportDate: new Date().toISOString()
    };
  }
}

export default VitaSocialCircleManager;
