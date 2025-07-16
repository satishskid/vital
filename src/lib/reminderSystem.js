import { db } from './supabase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  setDoc
} from 'firebase/firestore';

class ReminderSystem {
  constructor() {
    this.isInitialized = false;
    this.notificationPermission = null;
    this.serviceWorkerRegistration = null;
  }

  async initialize() {
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
      }

      // Request notification permission
      this.notificationPermission = await Notification.requestPermission();
      
      if (this.notificationPermission === 'granted') {
        // Register service worker for notifications
        await this.registerServiceWorker();
        this.isInitialized = true;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error initializing reminder system:', error);
      return false;
    }
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async scheduleReminder(reminder) {
    if (!this.isInitialized) {
      console.warn('Reminder system not initialized');
      return false;
    }

    try {
      // Calculate next notification time
      const nextTime = this.calculateNextReminderTime(reminder);
      
      if (!nextTime) {
        console.warn('Could not calculate next reminder time');
        return false;
      }

      // Schedule the notification
      const delay = nextTime.getTime() - Date.now();
      
      if (delay > 0) {
        setTimeout(() => {
          this.showNotification(reminder);
          // Reschedule for next occurrence
          this.scheduleReminder(reminder);
        }, delay);
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      return false;
    }
  }

  calculateNextReminderTime(reminder) {
    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);
    
    // Find the next occurrence
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() + i);
      checkDate.setHours(hours, minutes, 0, 0);
      
      // Check if this day is in the reminder's days array
      const dayName = checkDate.toLocaleDateString('en', { weekday: 'lowercase' });
      
      if (reminder.days.includes(dayName) && checkDate > now) {
        return checkDate;
      }
    }
    
    return null;
  }

  async showNotification(reminder) {
    if (!this.serviceWorkerRegistration) {
      // Fallback to basic notification
      new Notification(reminder.title, {
        body: reminder.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png'
      });
      return;
    }

    // Show notification through service worker
    await this.serviceWorkerRegistration.showNotification(reminder.title, {
      body: reminder.message,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: `reminder-${reminder.id}`,
      requireInteraction: false,
      actions: [
        {
          action: 'log_data',
          title: 'Log Health Data',
          icon: '/icons/log-data.png'
        },
        {
          action: 'snooze',
          title: 'Remind Later',
          icon: '/icons/snooze.png'
        }
      ],
      data: {
        reminderId: reminder.id,
        url: '/dashboard'
      }
    });
  }

  async getUserReminders(userId) {
    try {
      // Firebase implementation - simplified for now
      const q = query(
        collection(db, 'reminders'),
        where('user_id', '==', userId),
        where('is_active', '==', true)
      );

      const querySnapshot = await getDocs(q);
      const reminders = [];
      querySnapshot.forEach((doc) => {
        reminders.push({ id: doc.id, ...doc.data() });
      });

      return reminders;
    } catch (error) {
      console.error('Error fetching user reminders:', error);
      return [];
    }
  }

  async createDefaultReminders(userId) {
    const defaultReminders = [
      {
        user_id: userId,
        title: 'Morning Health Check',
        message: 'Good morning! How did you sleep? Take a moment to log your health data.',
        time: '08:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        is_active: true
      },
      {
        user_id: userId,
        title: 'Evening Reflection',
        message: 'How was your day? Log your activity and wellness data.',
        time: '20:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        is_active: true
      }
    ];

    try {
      // Firebase implementation - create reminders
      const createdReminders = [];
      for (const reminder of defaultReminders) {
        const docRef = await addDoc(collection(db, 'reminders'), reminder);
        createdReminders.push({ id: docRef.id, ...reminder });
      }
      return createdReminders;
    } catch (error) {
      console.error('Error creating default reminders:', error);
      return [];
    }
  }

  async scheduleAllUserReminders(userId) {
    try {
      const reminders = await this.getUserReminders(userId);
      
      for (const reminder of reminders) {
        await this.scheduleReminder(reminder);
      }
      
      console.log(`Scheduled ${reminders.length} reminders for user ${userId}`);
    } catch (error) {
      console.error('Error scheduling user reminders:', error);
    }
  }

  async calculateUserStreak(userId) {
    // Simplified streak calculation for Firebase
    // For now, return basic streak data
    // TODO: Implement full Firebase-based streak calculation
    return { currentStreak: 0, longestStreak: 0 };
  }

  async getAchievements(userId) {
    try {
      const { currentStreak, longestStreak } = await this.calculateUserStreak(userId);
      const achievements = [];

      // Streak achievements
      if (currentStreak >= 3) {
        achievements.push({
          title: 'Getting Started',
          description: '3-day logging streak',
          icon: '🌱',
          type: 'streak',
          unlocked: true
        });
      }

      if (currentStreak >= 7) {
        achievements.push({
          title: 'Week Warrior',
          description: '7-day logging streak',
          icon: '🏆',
          type: 'streak',
          unlocked: true
        });
      }

      if (currentStreak >= 30) {
        achievements.push({
          title: 'Monthly Master',
          description: '30-day logging streak',
          icon: '🎯',
          type: 'streak',
          unlocked: true
        });
      }

      if (longestStreak >= 100) {
        achievements.push({
          title: 'Consistency Champion',
          description: '100-day streak achieved',
          icon: '👑',
          type: 'streak',
          unlocked: true
        });
      }

      // Add locked achievements for motivation
      const lockedAchievements = [
        { title: 'Week Warrior', threshold: 7, icon: '🏆' },
        { title: 'Monthly Master', threshold: 30, icon: '🎯' },
        { title: 'Consistency Champion', threshold: 100, icon: '👑' }
      ].filter(ach => currentStreak < ach.threshold);

      lockedAchievements.forEach(ach => {
        achievements.push({
          title: ach.title,
          description: `${ach.threshold}-day logging streak`,
          icon: ach.icon,
          type: 'streak',
          unlocked: false,
          progress: currentStreak,
          target: ach.threshold
        });
      });

      return achievements;
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  async getMotivationalMessage(userId) {
    try {
      const { currentStreak } = await this.calculateUserStreak(userId);
      
      const messages = {
        0: "Start your health journey today! Every expert was once a beginner.",
        1: "Great start! You've taken the first step towards better health.",
        2: "Two days in a row! You're building a healthy habit.",
        3: "Three days strong! Consistency is key to lasting change.",
        7: "One week complete! You're developing a powerful routine.",
        14: "Two weeks of dedication! Your commitment is inspiring.",
        30: "One month of consistent tracking! You're a health champion!",
        60: "Two months of excellence! Your dedication is remarkable.",
        100: "100 days! You've achieved something truly special!"
      };

      // Find the appropriate message
      const milestones = Object.keys(messages).map(Number).sort((a, b) => b - a);
      const milestone = milestones.find(m => currentStreak >= m) || 0;
      
      return {
        message: messages[milestone],
        streak: currentStreak,
        nextMilestone: milestones.find(m => m > currentStreak) || null
      };
    } catch (error) {
      console.error('Error getting motivational message:', error);
      return {
        message: "Keep up the great work with your health tracking!",
        streak: 0,
        nextMilestone: null
      };
    }
  }

  // Handle notification clicks
  handleNotificationClick(event) {
    event.notification.close();

    if (event.action === 'log_data') {
      // Open the app to log data
      window.open('/dashboard', '_blank');
    } else if (event.action === 'snooze') {
      // Reschedule notification for 1 hour later
      const reminder = {
        id: event.notification.data.reminderId,
        title: event.notification.title,
        message: event.notification.body,
        time: new Date(Date.now() + 60 * 60 * 1000).toTimeString().slice(0, 5), // 1 hour from now
        days: [new Date().toLocaleDateString('en', { weekday: 'lowercase' })]
      };
      
      setTimeout(() => {
        this.showNotification(reminder);
      }, 60 * 60 * 1000); // 1 hour
    } else {
      // Default action - open the app
      window.open('/dashboard', '_blank');
    }
  }
}

export const reminderSystem = new ReminderSystem();
