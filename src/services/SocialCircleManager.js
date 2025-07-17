/**
 * Vita Social Circle Manager
 * Privacy-first social wellness tracking and management
 */

import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
      { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', priority: 1, type: 'social' },
      { id: 'partner', label: 'Partner/Spouse', icon: '💕', priority: 1, type: 'social' },
      { id: 'close_friend', label: 'Close Friend', icon: '👥', priority: 2, type: 'social' },
      { id: 'friend', label: 'Friend', icon: '🤝', priority: 3, type: 'social' },
      { id: 'colleague', label: 'Colleague', icon: '💼', priority: 4, type: 'social' },
      { id: 'acquaintance', label: 'Acquaintance', icon: '👋', priority: 5, type: 'social' },
      { id: 'other', label: 'Other', icon: '👤', priority: 6, type: 'social' },
      // Self-connection types
      { id: 'hobby', label: 'Hobby/Passion', icon: '🎨', priority: 7, type: 'self' },
      { id: 'me_time', label: 'Me Time', icon: '🧘', priority: 8, type: 'self' }
    ];

    // Hobby/Passion categories
    this.hobbyCategories = [
      { id: 'creative', label: 'Creative Arts', icon: '🎨', activities: ['painting', 'drawing', 'writing', 'photography', 'crafting', 'music'] },
      { id: 'physical', label: 'Physical Activities', icon: '🏃', activities: ['running', 'yoga', 'dancing', 'hiking', 'cycling', 'swimming'] },
      { id: 'intellectual', label: 'Learning & Growth', icon: '📚', activities: ['reading', 'studying', 'puzzles', 'languages', 'coding', 'research'] },
      { id: 'nature', label: 'Nature & Outdoors', icon: '🌱', activities: ['gardening', 'birdwatching', 'camping', 'fishing', 'astronomy', 'hiking'] },
      { id: 'mindful', label: 'Mindfulness & Wellness', icon: '🧘', activities: ['meditation', 'journaling', 'breathing', 'stretching', 'spa', 'reflection'] },
      { id: 'social_hobbies', label: 'Social Hobbies', icon: '🎲', activities: ['board_games', 'volunteering', 'clubs', 'sports', 'cooking', 'travel'] },
      { id: 'technical', label: 'Technical & Building', icon: '🔧', activities: ['woodworking', 'electronics', 'programming', 'mechanics', '3d_printing', 'robotics'] },
      { id: 'entertainment', label: 'Entertainment', icon: '🎬', activities: ['movies', 'tv_shows', 'podcasts', 'gaming', 'concerts', 'theater'] }
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
        userId: this.userId,
        type: 'social' // social, hobby, me_time
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
   * Add a hobby/passion as a virtual contact
   */
  async addHobby(hobbyData) {
    try {
      const hobby = {
        name: hobbyData.name,
        nickname: hobbyData.nickname || hobbyData.name,
        relationship: 'hobby',
        category: hobbyData.category,
        description: hobbyData.description || '',
        benefits: hobbyData.benefits || [],
        privacyLevel: 'private', // Always private for hobbies
        trackingEnabled: true,
        notes: hobbyData.notes || '',
        createdAt: new Date(),
        lastActivity: null,
        activityCount: 0,
        totalTimeSpent: 0, // in minutes
        userId: this.userId,
        type: 'hobby',
        icon: hobbyData.icon || '🎨'
      };

      const circleRef = collection(db, 'users', this.userId, 'social_circle');
      const docRef = await addDoc(circleRef, hobby);

      hobby.id = docRef.id;
      this.socialCircle.push(hobby);

      console.log('Hobby added to social circle:', hobby.name);
      return hobby;
    } catch (error) {
      console.error('Error adding hobby:', error);
      throw error;
    }
  }

  /**
   * Add Me Time as a virtual contact
   */
  async addMeTime() {
    try {
      const meTime = {
        name: 'Me Time',
        nickname: 'Personal Wellness Time',
        relationship: 'me_time',
        description: 'Private time for personal wellness and self-care',
        privacyLevel: 'private',
        trackingEnabled: true,
        notes: 'Completely private - no details shared',
        createdAt: new Date(),
        lastActivity: null,
        activityCount: 0,
        totalTimeSpent: 0,
        userId: this.userId,
        type: 'me_time',
        icon: '🧘'
      };

      const circleRef = collection(db, 'users', this.userId, 'social_circle');
      const docRef = await addDoc(circleRef, meTime);

      meTime.id = docRef.id;
      this.socialCircle.push(meTime);

      console.log('Me Time added to social circle');
      return meTime;
    } catch (error) {
      console.error('Error adding Me Time:', error);
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
   * Log self-connection activity (hobby or me-time)
   */
  async logSelfActivity(activityData) {
    try {
      const activity = {
        contactId: activityData.contactId, // hobby or me-time contact ID
        contactName: activityData.contactName,
        type: activityData.type, // 'hobby_time', 'me_time'
        duration: activityData.duration, // in minutes
        timestamp: activityData.timestamp || new Date(),
        quality: activityData.quality || 'good', // poor, okay, good, excellent
        mood: activityData.mood || 'neutral', // before/after mood
        notes: activityData.notes || '',
        benefits: activityData.benefits || [], // selected benefits experienced
        private: activityData.type === 'me_time', // me-time is always private
        userId: this.userId
      };

      const interactionsRef = collection(db, 'users', this.userId, 'social_interactions');
      const docRef = await addDoc(interactionsRef, activity);

      activity.id = docRef.id;
      this.socialInteractions.push(activity);

      // Update hobby/me-time contact stats
      const contact = this.socialCircle.find(c => c.id === activityData.contactId);
      if (contact) {
        const newTotalTime = (contact.totalTimeSpent || 0) + activityData.duration;
        await this.updateContact(contact.id, {
          lastActivity: activity.timestamp,
          activityCount: (contact.activityCount || 0) + 1,
          totalTimeSpent: newTotalTime
        });
      }

      console.log('Self-connection activity logged:', activity.type, 'for', activity.duration, 'minutes');
      return activity;
    } catch (error) {
      console.error('Error logging self activity:', error);
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
   * Get only social contacts (people)
   */
  getSocialContacts() {
    return this.socialCircle.filter(c => c.type === 'social' || !c.type);
  }

  /**
   * Get only hobbies/passions
   */
  getHobbies() {
    return this.socialCircle.filter(c => c.type === 'hobby');
  }

  /**
   * Get me-time entries
   */
  getMeTime() {
    return this.socialCircle.filter(c => c.type === 'me_time');
  }

  /**
   * Get all self-connection activities (hobbies + me-time)
   */
  getSelfConnectionActivities() {
    return this.socialCircle.filter(c => c.type === 'hobby' || c.type === 'me_time');
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
   * Get social wellness metrics including self-connection
   */
  getSocialWellnessMetrics(days = 7) {
    const recentInteractions = this.getRecentInteractions(days);
    const socialInteractions = recentInteractions.filter(i => !['hobby_time', 'me_time'].includes(i.type));
    const selfInteractions = recentInteractions.filter(i => ['hobby_time', 'me_time'].includes(i.type));

    const uniqueContacts = new Set(socialInteractions.map(i => i.contactId));
    const uniqueHobbies = new Set(selfInteractions.map(i => i.contactId));

    // Calculate interaction types
    const interactionTypes = recentInteractions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {});

    // Calculate daily averages
    const dailySocialInteractions = socialInteractions.length / days;
    const dailySelfInteractions = selfInteractions.length / days;
    const dailyUniqueContacts = uniqueContacts.size / days;

    // Calculate self-connection time
    const totalSelfTime = selfInteractions.reduce((total, interaction) =>
      total + (interaction.duration || 0), 0);
    const dailySelfTime = totalSelfTime / days;

    // Get contacts not contacted recently (social only)
    const staleContacts = this.getSocialContacts().filter(contact => {
      if (!contact.lastContact) return true;
      const daysSinceContact = (new Date() - contact.lastContact) / (1000 * 60 * 60 * 24);
      return daysSinceContact > 7; // Haven't contacted in a week
    });

    // Get neglected hobbies
    const neglectedHobbies = this.getHobbies().filter(hobby => {
      if (!hobby.lastActivity) return true;
      const daysSinceActivity = (new Date() - hobby.lastActivity) / (1000 * 60 * 60 * 24);
      return daysSinceActivity > 14; // Haven't done in 2 weeks
    });

    return {
      totalInteractions: recentInteractions.length,
      socialInteractions: socialInteractions.length,
      selfInteractions: selfInteractions.length,
      uniqueContactsReached: uniqueContacts.size,
      uniqueHobbiesEngaged: uniqueHobbies.size,
      dailyAverageSocial: Math.round(dailySocialInteractions * 10) / 10,
      dailyAverageSelf: Math.round(dailySelfInteractions * 10) / 10,
      dailyAverageContacts: Math.round(dailyUniqueContacts * 10) / 10,
      dailySelfTimeMinutes: Math.round(dailySelfTime),
      interactionTypes,
      staleContacts: staleContacts.slice(0, 5),
      neglectedHobbies: neglectedHobbies.slice(0, 3),
      socialWellnessScore: this.calculateHolisticWellnessScore(socialInteractions, selfInteractions, uniqueContacts.size, uniqueHobbies.size),
      balance: this.calculateSocialSelfBalance(socialInteractions.length, selfInteractions.length)
    };
  }

  /**
   * Calculate holistic wellness score including self-connection (0-100)
   */
  calculateHolisticWellnessScore(socialInteractions, selfInteractions, uniqueContacts, uniqueHobbies) {
    // Social connection score (0-50)
    const socialScore = this.calculateSocialWellnessScore(socialInteractions, uniqueContacts) * 0.5;

    // Self-connection score (0-50)
    const selfScore = this.calculateSelfConnectionScore(selfInteractions, uniqueHobbies);

    return Math.round(socialScore + selfScore);
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
   * Calculate self-connection score (0-50)
   */
  calculateSelfConnectionScore(selfInteractions, uniqueHobbies) {
    // Frequency score (0-15)
    const frequencyScore = Math.min(selfInteractions.length / 7, 3) * 5; // Up to 15 points for 3+ activities per week

    // Diversity score (0-10)
    const diversityScore = Math.min(uniqueHobbies, 2) * 5; // Up to 10 points for 2+ different hobbies

    // Duration/quality score (0-15)
    const totalDuration = selfInteractions.reduce((total, activity) => total + (activity.duration || 0), 0);
    const averageDuration = selfInteractions.length > 0 ? totalDuration / selfInteractions.length : 0;
    const durationScore = Math.min(averageDuration / 30, 1) * 15; // Up to 15 points for 30+ min average

    // Consistency score (0-10)
    const daysWithSelfTime = new Set(
      selfInteractions.map(i => i.timestamp.toDateString())
    ).size;
    const consistencyScore = Math.min(daysWithSelfTime / 7, 1) * 10; // Up to 10 points for daily self-time

    return Math.round(frequencyScore + diversityScore + durationScore + consistencyScore);
  }

  /**
   * Calculate balance between social and self-connection
   */
  calculateSocialSelfBalance(socialCount, selfCount) {
    const total = socialCount + selfCount;
    if (total === 0) return { status: 'inactive', socialRatio: 0, selfRatio: 0 };

    const socialRatio = socialCount / total;
    const selfRatio = selfCount / total;

    let status = 'balanced';
    if (socialRatio > 0.8) status = 'social_heavy';
    else if (selfRatio > 0.8) status = 'self_heavy';
    else if (socialRatio < 0.2) status = 'needs_social';
    else if (selfRatio < 0.2) status = 'needs_self_time';

    return {
      status,
      socialRatio: Math.round(socialRatio * 100),
      selfRatio: Math.round(selfRatio * 100),
      recommendation: this.getBalanceRecommendation(status)
    };
  }

  /**
   * Get balance recommendation based on status
   */
  getBalanceRecommendation(status) {
    const recommendations = {
      balanced: 'Great balance between social connections and personal time!',
      social_heavy: 'Consider scheduling some personal time for hobbies or self-care.',
      self_heavy: 'You might benefit from reaching out to friends or family.',
      needs_social: 'Try connecting with someone you care about today.',
      needs_self_time: 'Make time for activities you enjoy or some peaceful moments.',
      inactive: 'Start with either a quick check-in with someone or a few minutes for yourself.'
    };
    return recommendations[status] || recommendations.balanced;
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
