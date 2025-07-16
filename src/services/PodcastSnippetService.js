/**
 * Vita Health App - Podcast Snippet Service
 * Delivers science-based insights from the Six Golden Habits podcast as notifications
 */

class PodcastSnippetService {
  constructor() {
    this.snippets = [
      {
        id: 'sleep-foundation',
        title: '🌙 Sleep: The Foundation of Vitality',
        message: 'Quality sleep isn\'t just rest - it\'s when your body repairs, consolidates memories, and resets your immune system.',
        science: 'Research shows 7-9 hours of quality sleep improves HRV by 15-20% and cognitive performance by 25%.',
        pillar: 'recovery',
        timing: 'evening',
        duration: 3 // days after onboarding
      },
      {
        id: 'hrv-autonomic',
        title: '❤️ HRV: Your Autonomic Nervous System Window',
        message: 'Heart Rate Variability reflects your body\'s ability to adapt to stress. Higher HRV = better recovery capacity.',
        science: 'Studies show HRV training can reduce stress by 23% and improve decision-making under pressure.',
        pillar: 'recovery',
        timing: 'morning',
        duration: 5
      },
      {
        id: 'movement-medicine',
        title: '🏃‍♂️ Movement as Medicine',
        message: 'Just 150 minutes of moderate activity per week can add 3-7 years to your lifespan.',
        science: 'Exercise triggers BDNF production, literally growing new brain cells and improving neuroplasticity.',
        pillar: 'movement',
        timing: 'morning',
        duration: 7
      },
      {
        id: 'nutrition-timing',
        title: '🍽️ When You Eat Matters',
        message: 'Eating within a 10-12 hour window aligns with your circadian rhythm and optimizes metabolism.',
        science: 'Time-restricted eating can improve insulin sensitivity by 20% and reduce inflammation markers.',
        pillar: 'nutrition',
        timing: 'morning',
        duration: 10
      },
      {
        id: 'mindfulness-brain',
        title: '🧘‍♀️ Mindfulness Rewires Your Brain',
        message: 'Just 8 weeks of mindfulness practice physically changes brain structure, increasing gray matter density.',
        science: 'Meditation increases cortical thickness in areas associated with attention and emotional processing.',
        pillar: 'mindfulness',
        timing: 'afternoon',
        duration: 12
      },
      {
        id: 'hydration-performance',
        title: '💧 Hydration and Cognitive Performance',
        message: 'Even 2% dehydration can impair cognitive performance, mood, and physical endurance.',
        science: 'Proper hydration maintains blood volume, supporting nutrient delivery and waste removal.',
        pillar: 'hydration',
        timing: 'morning',
        duration: 14
      },
      {
        id: 'social-longevity',
        title: '👥 Social Connection = Longevity',
        message: 'Strong social relationships increase survival odds by 50% - equivalent to quitting smoking.',
        science: 'Social isolation triggers chronic inflammation, while connection boosts immune function.',
        pillar: 'connection',
        timing: 'evening',
        duration: 16
      },
      {
        id: 'synergy-pillars',
        title: '🌟 The Power of Synergy',
        message: 'The six pillars work together - improving one enhances all others. This is why Vita tracks them holistically.',
        science: 'Systems biology shows health emerges from interconnected processes, not isolated metrics.',
        pillar: 'all',
        timing: 'afternoon',
        duration: 20
      }
    ];
    
    this.userPreferences = {
      enableSnippets: true,
      preferredTiming: ['morning', 'afternoon', 'evening'],
      frequency: 'every-2-days' // daily, every-2-days, weekly
    };
  }

  /**
   * Initialize snippet notifications for a new user
   */
  async initializeForUser(userId) {
    try {
      // Check if user has opted in for notifications
      const hasPermission = await this.requestNotificationPermission();
      if (!hasPermission) {
        console.log('User declined notification permission');
        return false;
      }

      // Schedule initial snippets
      this.scheduleSnippets(userId);
      
      // Store user's snippet preferences
      localStorage.setItem(`vita-snippets-${userId}`, JSON.stringify({
        enabled: true,
        startDate: new Date().toISOString(),
        lastSnippet: null,
        preferences: this.userPreferences
      }));

      return true;
    } catch (error) {
      console.error('Error initializing podcast snippets:', error);
      return false;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Schedule snippet notifications based on user preferences
   */
  scheduleSnippets(userId) {
    const userSettings = this.getUserSettings(userId);
    if (!userSettings.enabled) return;

    this.snippets.forEach(snippet => {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + snippet.duration);
      
      // Set time based on snippet timing preference
      const timeMap = {
        morning: { hour: 9, minute: 0 },
        afternoon: { hour: 14, minute: 30 },
        evening: { hour: 19, minute: 0 }
      };
      
      const time = timeMap[snippet.timing] || timeMap.morning;
      deliveryDate.setHours(time.hour, time.minute, 0, 0);

      // Schedule the notification
      this.scheduleNotification(snippet, deliveryDate, userId);
    });
  }

  /**
   * Schedule a single notification
   */
  scheduleNotification(snippet, deliveryDate, userId) {
    const now = new Date();
    const delay = deliveryDate.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        this.showSnippetNotification(snippet, userId);
      }, delay);
    }
  }

  /**
   * Show snippet notification to user
   */
  showSnippetNotification(snippet, userId) {
    const userSettings = this.getUserSettings(userId);
    if (!userSettings.enabled) return;

    // Create notification
    const notification = new Notification(snippet.title, {
      body: snippet.message,
      icon: '/icons/vita-icon-192.png',
      badge: '/icons/vita-badge-72.png',
      tag: `vita-snippet-${snippet.id}`,
      data: {
        snippetId: snippet.id,
        userId: userId,
        type: 'podcast-snippet'
      },
      actions: [
        {
          action: 'learn-more',
          title: 'Learn More'
        },
        {
          action: 'listen-podcast',
          title: 'Listen to Full Podcast'
        }
      ]
    });

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      this.handleSnippetClick(snippet, userId);
      notification.close();
    };

    // Update user's last snippet
    userSettings.lastSnippet = {
      id: snippet.id,
      deliveredAt: new Date().toISOString()
    };
    localStorage.setItem(`vita-snippets-${userId}`, JSON.stringify(userSettings));
  }

  /**
   * Handle when user clicks on a snippet notification
   */
  handleSnippetClick(snippet, userId) {
    // Open app to relevant section
    const routes = {
      recovery: '/dashboard?focus=recovery',
      movement: '/dashboard?focus=movement',
      nutrition: '/dashboard?focus=nutrition',
      mindfulness: '/dashboard?focus=mindfulness',
      hydration: '/dashboard?focus=hydration',
      connection: '/dashboard?focus=connection',
      all: '/dashboard'
    };

    const route = routes[snippet.pillar] || '/dashboard';
    
    // If app is already open, navigate
    if (window.location.pathname !== route) {
      window.location.href = route;
    }

    // Show detailed snippet information
    this.showSnippetDetails(snippet);
  }

  /**
   * Show detailed snippet information in app
   */
  showSnippetDetails(snippet) {
    // This would integrate with the app's modal system
    const event = new CustomEvent('show-snippet-details', {
      detail: {
        title: snippet.title,
        message: snippet.message,
        science: snippet.science,
        pillar: snippet.pillar,
        actions: [
          {
            label: 'Listen to Full Podcast',
            action: () => this.openPodcast()
          },
          {
            label: 'Learn More About This Pillar',
            action: () => this.openPillarInfo(snippet.pillar)
          }
        ]
      }
    });
    
    window.dispatchEvent(event);
  }

  /**
   * Open the full podcast
   */
  openPodcast() {
    const podcastLink = localStorage.getItem('vita-podcast-link');
    const podcastTitle = localStorage.getItem('vita-podcast-title');
    
    if (podcastLink) {
      // Open podcast player modal or navigate to podcast page
      const event = new CustomEvent('open-podcast', {
        detail: {
          src: podcastLink,
          title: podcastTitle || 'Six Golden Habits for Enduring Youth'
        }
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * Open pillar-specific information
   */
  openPillarInfo(pillar) {
    const event = new CustomEvent('open-pillar-info', {
      detail: { pillar }
    });
    window.dispatchEvent(event);
  }

  /**
   * Get user's snippet settings
   */
  getUserSettings(userId) {
    const stored = localStorage.getItem(`vita-snippets-${userId}`);
    return stored ? JSON.parse(stored) : {
      enabled: true,
      startDate: new Date().toISOString(),
      lastSnippet: null,
      preferences: this.userPreferences
    };
  }

  /**
   * Update user's snippet preferences
   */
  updateUserPreferences(userId, preferences) {
    const settings = this.getUserSettings(userId);
    settings.preferences = { ...settings.preferences, ...preferences };
    localStorage.setItem(`vita-snippets-${userId}`, JSON.stringify(settings));
  }

  /**
   * Disable snippets for user
   */
  disableSnippets(userId) {
    const settings = this.getUserSettings(userId);
    settings.enabled = false;
    localStorage.setItem(`vita-snippets-${userId}`, JSON.stringify(settings));
  }

  /**
   * Get next scheduled snippet for user
   */
  getNextSnippet(userId) {
    const settings = this.getUserSettings(userId);
    if (!settings.enabled) return null;

    const startDate = new Date(settings.startDate);
    const daysSinceStart = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));
    
    return this.snippets.find(snippet => 
      snippet.duration > daysSinceStart && 
      (!settings.lastSnippet || settings.lastSnippet.id !== snippet.id)
    );
  }
}

export default PodcastSnippetService;
