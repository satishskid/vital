// Mock user data for demo purposes
export const mockUserData = {
  id: 'mock-user-1',
  email: 'anjali.patel@example.com',
  profile: {
    first_name: 'Anjali',
    last_name: 'Patel',
    age: 55,
    join_date: 'March 2024',
    avatar_url: null,
    goals: ['Manage Pre-diabetes', 'Improve Sleep', 'Reduce Stress'],
    health_metrics: {
      avg_hrv: 72,
      avg_steps: 7842,
      streak: 12
    }
  }
};

// Mock reminders
export const mockReminders = [
  {
    id: 'reminder-1',
    user_id: 'mock-user-1',
    title: 'Morning HRV Check',
    description: 'Check your HRV to plan your day',
    time: '07:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    is_active: true,
    created_at: '2024-04-01T08:00:00Z'
  },
  {
    id: 'reminder-2',
    user_id: 'mock-user-1',
    title: 'Midday Movement',
    description: 'Take a 5-minute movement break',
    time: '12:30',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    is_active: true,
    created_at: '2024-04-01T08:05:00Z'
  },
  {
    id: 'reminder-3',
    user_id: 'mock-user-1',
    title: 'Evening Breathwork',
    description: '10-minute breathing session',
    time: '19:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    is_active: true,
    created_at: '2024-04-01T08:10:00Z'
  },
  {
    id: 'reminder-4',
    user_id: 'mock-user-1',
    title: 'Last Meal Cutoff',
    description: 'As the sun sets, so should your plate',
    time: '18:30',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    is_active: true,
    created_at: '2024-04-01T08:15:00Z'
  }
];

// Mock social circle connections
export const mockSocialCircle = [
  {
    id: 'connection-1',
    userId: 'mock-user-1',
    connectionId: 'mock-user-2',
    relationshipType: 'family',
    status: 'active',
    createdAt: '2024-04-01T10:00:00Z',
    profile: {
      id: 'mock-user-2',
      email: 'sarah.m@example.com',
      first_name: 'Sarah',
      last_name: 'M',
      avatar_url: null,
      status: 'active',
      mood: '😊',
      last_activity: 'Completed morning walk'
    }
  },
  {
    id: 'connection-2',
    userId: 'mock-user-1',
    connectionId: 'mock-user-3',
    relationshipType: 'friend',
    status: 'active',
    createdAt: '2024-04-01T10:05:00Z',
    profile: {
      id: 'mock-user-3',
      email: 'mike.r@example.com',
      first_name: 'Mike',
      last_name: 'R',
      avatar_url: null,
      status: 'resting',
      mood: '😌',
      last_activity: 'Finished meditation session'
    }
  },
  {
    id: 'connection-3',
    userId: 'mock-user-1',
    connectionId: 'mock-user-4',
    relationshipType: 'family',
    status: 'active',
    createdAt: '2024-04-01T10:10:00Z',
    profile: {
      id: 'mock-user-4',
      email: 'lisa.k@example.com',
      first_name: 'Lisa',
      last_name: 'K',
      avatar_url: null,
      status: 'active',
      mood: '💪',
      last_activity: 'Logged healthy lunch'
    }
  },
  {
    id: 'connection-4',
    userId: 'mock-user-1',
    connectionId: 'mock-user-5',
    relationshipType: 'friend',
    status: 'active',
    createdAt: '2024-04-01T10:15:00Z',
    profile: {
      id: 'mock-user-5',
      email: 'john.d@example.com',
      first_name: 'John',
      last_name: 'D',
      avatar_url: null,
      status: 'focused',
      mood: '🧘',
      last_activity: 'Started breathing session'
    }
  }
];

// Mock progress data
export const mockProgressData = {
  daily: {
    movement: 65,
    nutrition: 40,
    mindfulness: 80
  },
  weekly: [
    { day: 'Mon', hrv: 68, mood: 'Good', activity: 85 },
    { day: 'Tue', hrv: 72, mood: 'Great', activity: 92 },
    { day: 'Wed', hrv: 70, mood: 'Good', activity: 78 },
    { day: 'Thu', hrv: 75, mood: 'Excellent', activity: 95 },
    { day: 'Fri', hrv: 73, mood: 'Good', activity: 88 },
    { day: 'Sat', hrv: 71, mood: 'Great', activity: 90 },
    { day: 'Sun', hrv: 74, mood: 'Good', activity: 83 }
  ],
  monthly: {
    trends: {
      hrv: '+15%',
      activity: '+8%',
      sleep: '+10%'
    },
    achievements: [
      { title: 'First Steps', date: 'March 15' },
      { title: 'Week Warrior', date: 'March 22' },
      { title: 'HRV Hero', date: 'April 5' },
      { title: 'Community Member', date: 'March 18' }
    ]
  }
};