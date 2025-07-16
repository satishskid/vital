// Heart Rate Suggestions (common resting heart rates)
export const heartRateSuggestions = [
  { value: 60, label: '60 BPM', description: 'Athletic/Very fit' },
  { value: 65, label: '65 BPM', description: 'Excellent fitness' },
  { value: 70, label: '70 BPM', description: 'Good fitness' },
  { value: 75, label: '75 BPM', description: 'Average fitness' },
  { value: 80, label: '80 BPM', description: 'Fair fitness' },
  { value: 85, label: '85 BPM', description: 'Below average' },
  { value: 90, label: '90 BPM', description: 'Poor fitness' },
  { value: 95, label: '95 BPM', description: 'Poor fitness' },
  { value: 100, label: '100 BPM', description: 'Poor fitness' }
];

// HRV Suggestions (common RMSSD values)
export const hrvSuggestions = [
  { value: 15, label: '15 ms', description: 'Low recovery' },
  { value: 20, label: '20 ms', description: 'Below average' },
  { value: 25, label: '25 ms', description: 'Fair recovery' },
  { value: 30, label: '30 ms', description: 'Good recovery' },
  { value: 35, label: '35 ms', description: 'Very good' },
  { value: 40, label: '40 ms', description: 'Excellent' },
  { value: 45, label: '45 ms', description: 'Outstanding' },
  { value: 50, label: '50 ms', description: 'Elite level' }
];

// Sleep Duration Suggestions (common sleep durations)
export const sleepDurationSuggestions = [
  { value: 6, label: '6 hours', description: 'Minimum recommended' },
  { value: 6.5, label: '6.5 hours', description: 'Short sleep' },
  { value: 7, label: '7 hours', description: 'Recommended minimum' },
  { value: 7.5, label: '7.5 hours', description: 'Good sleep' },
  { value: 8, label: '8 hours', description: 'Optimal sleep' },
  { value: 8.5, label: '8.5 hours', description: 'Extended sleep' },
  { value: 9, label: '9 hours', description: 'Long sleep' },
  { value: 9.5, label: '9.5 hours', description: 'Very long sleep' }
];

// Steps Suggestions (common daily step counts)
export const stepsSuggestions = [
  { value: 2000, label: '2,000 steps', description: 'Sedentary day' },
  { value: 5000, label: '5,000 steps', description: 'Low activity' },
  { value: 7500, label: '7,500 steps', description: 'Somewhat active' },
  { value: 10000, label: '10,000 steps', description: 'Active (recommended)' },
  { value: 12500, label: '12,500 steps', description: 'Highly active' },
  { value: 15000, label: '15,000 steps', description: 'Very active' },
  { value: 20000, label: '20,000 steps', description: 'Extremely active' }
];

// Activity Level Options
export const activityLevelOptions = [
  { 
    value: 'sedentary', 
    label: 'Sedentary', 
    description: 'Mostly sitting, minimal movement' 
  },
  { 
    value: 'light', 
    label: 'Light Activity', 
    description: 'Some walking, light household tasks' 
  },
  { 
    value: 'moderate', 
    label: 'Moderate Activity', 
    description: 'Regular movement, some exercise' 
  },
  { 
    value: 'vigorous', 
    label: 'Vigorous Activity', 
    description: 'Intense exercise, high activity level' 
  }
];

// Sleep Quality Options (1-10 scale with descriptions)
export const sleepQualityOptions = [
  { value: 1, label: '1 - Terrible', description: 'Couldn\'t sleep, very restless' },
  { value: 2, label: '2 - Very Poor', description: 'Frequent wake-ups, tired' },
  { value: 3, label: '3 - Poor', description: 'Restless sleep, not refreshed' },
  { value: 4, label: '4 - Below Average', description: 'Some interruptions' },
  { value: 5, label: '5 - Average', description: 'Okay sleep, somewhat rested' },
  { value: 6, label: '6 - Good', description: 'Decent sleep, mostly rested' },
  { value: 7, label: '7 - Very Good', description: 'Good sleep, well rested' },
  { value: 8, label: '8 - Excellent', description: 'Great sleep, very refreshed' },
  { value: 9, label: '9 - Outstanding', description: 'Amazing sleep, fully energized' },
  { value: 10, label: '10 - Perfect', description: 'Perfect sleep, completely restored' }
];

// Mood Rating Options (1-10 scale with descriptions)
export const moodRatingOptions = [
  { value: 1, label: '1 - Very Low', description: 'Depressed, very sad' },
  { value: 2, label: '2 - Low', description: 'Down, unhappy' },
  { value: 3, label: '3 - Poor', description: 'Somewhat sad, low energy' },
  { value: 4, label: '4 - Below Average', description: 'Not great, slightly down' },
  { value: 5, label: '5 - Neutral', description: 'Okay, neither good nor bad' },
  { value: 6, label: '6 - Good', description: 'Pleasant, positive' },
  { value: 7, label: '7 - Very Good', description: 'Happy, energetic' },
  { value: 8, label: '8 - Excellent', description: 'Very happy, great mood' },
  { value: 9, label: '9 - Outstanding', description: 'Fantastic, very energized' },
  { value: 10, label: '10 - Perfect', description: 'Amazing, peak happiness' }
];
