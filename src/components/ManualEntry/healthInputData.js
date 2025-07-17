/**
 * Neuroscience-Backed Longevity Habits Data Input Structure
 * Aligned with "Neuroscience Secrets for Longevity" framework
 */

// ===== 1. CIRCADIAN RHYTHM OPTIMIZATION =====

// Morning Light Exposure (within 2 hours of waking)
export const morningLightSuggestions = [
  { value: 5, label: '5 minutes', description: 'Quick exposure' },
  { value: 10, label: '10 minutes', description: 'Minimum effective' },
  { value: 15, label: '15 minutes', description: 'Good exposure' },
  { value: 20, label: '20 minutes', description: 'Optimal exposure' },
  { value: 30, label: '30 minutes', description: 'Extended exposure' },
  { value: 45, label: '45 minutes', description: 'Maximum benefit' }
];

// Meal Timing Windows (circadian-aligned eating)
export const mealTimingOptions = [
  { value: 95, label: 'Early Window (6am-4pm)', description: 'Optimal circadian alignment' },
  { value: 85, label: 'Standard Window (7am-6pm)', description: 'Good circadian alignment' },
  { value: 75, label: 'Extended Window (8am-8pm)', description: 'Fair circadian alignment' },
  { value: 60, label: 'Late Window (10am-10pm)', description: 'Poor circadian alignment' },
  { value: 40, label: 'Night Eating', description: 'Disrupts circadian rhythm' }
];

// Sleep-Wake Consistency
export const sleepConsistencyOptions = [
  { value: 95, label: 'Same time ±15min', description: 'Excellent consistency' },
  { value: 85, label: 'Same time ±30min', description: 'Good consistency' },
  { value: 70, label: 'Same time ±1hr', description: 'Fair consistency' },
  { value: 50, label: 'Same time ±2hr', description: 'Poor consistency' },
  { value: 30, label: 'Irregular schedule', description: 'Very poor consistency' }
];

// ===== 2. INTENTIONAL MOVEMENT =====

// Movement Breaks (every 30-60 minutes for cognitive enhancement)
export const movementBreaksSuggestions = [
  { value: 2, label: '2 breaks', description: 'Minimal movement' },
  { value: 4, label: '4 breaks', description: 'Some movement' },
  { value: 6, label: '6 breaks', description: 'Good movement' },
  { value: 8, label: '8 breaks', description: 'Optimal movement' },
  { value: 10, label: '10 breaks', description: 'Excellent movement' },
  { value: 12, label: '12+ breaks', description: 'Maximum movement' }
];

// Purposeful Exercise Types
export const exerciseTypeOptions = [
  { value: 90, label: 'Strength Training', description: 'Builds resilience & bone density' },
  { value: 85, label: 'HIIT/Interval', description: 'Cardiovascular & metabolic health' },
  { value: 80, label: 'Yoga/Pilates', description: 'Flexibility & mind-body connection' },
  { value: 75, label: 'Walking/Hiking', description: 'Low-impact cardiovascular' },
  { value: 70, label: 'Swimming', description: 'Full-body low-impact' },
  { value: 85, label: 'Dancing/Martial Arts', description: 'Cognitive-physical integration' }
];

// Cognitive-Physical Integration Activities
export const cognitivePhysicalOptions = [
  { value: 95, label: 'Dancing', description: 'Music + movement + memory' },
  { value: 90, label: 'Martial Arts', description: 'Coordination + focus + strength' },
  { value: 85, label: 'Rock Climbing', description: 'Problem-solving + strength' },
  { value: 80, label: 'Tennis/Racquet Sports', description: 'Reaction time + strategy' },
  { value: 75, label: 'Balance Training', description: 'Proprioception + stability' },
  { value: 70, label: 'Complex Movement Patterns', description: 'Multi-plane coordination' }
];

// ===== 3. CONTROLLED STRESS FOR RESILIENCE =====

// HRV-Based Stress Resilience (qualitative assessment)
export const hrvResilienceOptions = [
  { value: 90, label: 'Highly Resilient', description: 'Excellent stress recovery' },
  { value: 75, label: 'Resilient', description: 'Good stress recovery' },
  { value: 60, label: 'Moderately Resilient', description: 'Fair stress recovery' },
  { value: 45, label: 'Low Resilience', description: 'Poor stress recovery' },
  { value: 30, label: 'Very Low Resilience', description: 'Very poor stress recovery' }
];

// Strategic Stress Exposure Types
export const strategicStressOptions = [
  { value: 90, label: 'Cold Exposure', description: 'Cold shower, ice bath, cryotherapy' },
  { value: 85, label: 'Heat Exposure', description: 'Sauna, hot bath, heat training' },
  { value: 80, label: 'Fasting', description: 'Intermittent or time-restricted eating' },
  { value: 75, label: 'Intense Exercise', description: 'HIIT, sprint intervals, heavy lifting' },
  { value: 70, label: 'Altitude/Hypoxia', description: 'Altitude training, breath work' },
  { value: 65, label: 'Mental Challenge', description: 'Learning, problem-solving, focus tasks' }
];

// Recovery Practices
export const recoveryPracticeOptions = [
  { value: 90, label: 'Meditation', description: 'Mindfulness, focused attention' },
  { value: 85, label: 'Breathwork', description: 'Controlled breathing techniques' },
  { value: 80, label: 'Nature Exposure', description: 'Forest bathing, outdoor time' },
  { value: 75, label: 'Massage/Bodywork', description: 'Tissue manipulation, fascia release' },
  { value: 70, label: 'Contrast Therapy', description: 'Hot/cold alternation' },
  { value: 65, label: 'Gentle Movement', description: 'Walking, stretching, tai chi' }
];

// ===== 4. QUALITY SLEEP FOR BRAIN DETOXIFICATION =====

// Sleep Duration for Brain Detox (7-9 hours optimal)
export const sleepDurationSuggestions = [
  { value: 5, label: '5 hours', description: 'Insufficient for brain detox' },
  { value: 6, label: '6 hours', description: 'Minimal brain detox' },
  { value: 7, label: '7 hours', description: 'Good brain detox' },
  { value: 8, label: '8 hours', description: 'Optimal brain detox' },
  { value: 9, label: '9 hours', description: 'Maximum brain detox' },
  { value: 10, label: '10+ hours', description: 'Extended recovery sleep' }
];

// Sleep Environment Optimization
export const sleepEnvironmentOptions = [
  { value: 95, label: 'All Optimized', description: 'Cool, dark, quiet, comfortable' },
  { value: 85, label: 'Cool Temperature', description: '65-68°F for deep sleep' },
  { value: 80, label: 'Blackout Dark', description: 'No light pollution' },
  { value: 75, label: 'Quiet/White Noise', description: 'Sound optimization' },
  { value: 70, label: 'Comfortable Bedding', description: 'Quality mattress/pillows' },
  { value: 60, label: 'Some Optimization', description: 'Partial environment control' },
  { value: 40, label: 'Poor Environment', description: 'Suboptimal conditions' }
];

// Brain Detox Quality (how you wake up)
export const brainDetoxQualityOptions = [
  { value: 90, label: 'Refreshed & Alert', description: 'Excellent brain detoxification' },
  { value: 75, label: 'Rested & Clear', description: 'Good brain detoxification' },
  { value: 60, label: 'Somewhat Rested', description: 'Fair brain detoxification' },
  { value: 45, label: 'Groggy', description: 'Poor brain detoxification' },
  { value: 30, label: 'Exhausted', description: 'Very poor brain detoxification' }
];

// ===== 5. NUTRIENT-DENSE EATING =====

// Brain-Supporting Foods
export const brainFoodOptions = [
  { value: 95, label: 'Omega-3 Rich', description: 'Fish, walnuts, flax seeds' },
  { value: 90, label: 'Antioxidant Rich', description: 'Berries, dark leafy greens' },
  { value: 85, label: 'Polyphenol Rich', description: 'Green tea, dark chocolate, herbs' },
  { value: 80, label: 'Whole Foods', description: 'Unprocessed, nutrient-dense' },
  { value: 70, label: 'Some Processed', description: 'Mix of whole and processed' },
  { value: 50, label: 'Mostly Processed', description: 'Limited nutrient density' },
  { value: 30, label: 'Highly Processed', description: 'Poor nutrient density' }
];

// Nutrient Density vs Calorie Density
export const nutrientDensityOptions = [
  { value: 90, label: 'High Nutrient/Low Calorie', description: 'Vegetables, lean proteins' },
  { value: 80, label: 'High Nutrient/Moderate Calorie', description: 'Nuts, seeds, fruits' },
  { value: 70, label: 'Moderate Nutrient/Moderate Calorie', description: 'Whole grains, legumes' },
  { value: 60, label: 'Moderate Nutrient/High Calorie', description: 'Some processed foods' },
  { value: 40, label: 'Low Nutrient/High Calorie', description: 'Refined foods, sugar' }
];

// Eating Patterns (intermittent fasting, meal timing)
export const eatingPatternOptions = [
  { value: 90, label: '16:8 Intermittent Fasting', description: 'Optimal metabolic benefits' },
  { value: 85, label: '14:10 Time-Restricted', description: 'Good metabolic benefits' },
  { value: 80, label: '12:12 Balanced', description: 'Moderate metabolic benefits' },
  { value: 70, label: 'Three Regular Meals', description: 'Traditional eating pattern' },
  { value: 60, label: 'Frequent Small Meals', description: 'Grazing pattern' },
  { value: 40, label: 'Irregular Eating', description: 'Poor metabolic timing' }
];

// ===== 6. POSITIVE SELF-NARRATIVE =====

// Growth Mindset Indicators
export const growthMindsetOptions = [
  { value: 90, label: 'Embracing Challenges', description: 'Actively seeking growth opportunities' },
  { value: 80, label: 'Learning from Setbacks', description: 'Viewing failures as learning' },
  { value: 70, label: 'Effort-Focused', description: 'Valuing process over outcome' },
  { value: 60, label: 'Open to Feedback', description: 'Receptive to constructive input' },
  { value: 50, label: 'Mixed Mindset', description: 'Sometimes growth, sometimes fixed' },
  { value: 40, label: 'Avoiding Challenges', description: 'Preferring comfort zone' }
];

// Self-Compassion Practices
export const selfCompassionOptions = [
  { value: 90, label: 'Kind Self-Talk', description: 'Treating yourself with kindness' },
  { value: 85, label: 'Mindful Awareness', description: 'Observing thoughts without judgment' },
  { value: 80, label: 'Common Humanity', description: 'Recognizing shared human experience' },
  { value: 70, label: 'Self-Forgiveness', description: 'Letting go of self-criticism' },
  { value: 60, label: 'Some Self-Compassion', description: 'Occasional kind self-treatment' },
  { value: 40, label: 'Self-Critical', description: 'Harsh inner dialogue' }
];

// Purpose and Meaning Cultivation
export const purposeOptions = [
  { value: 90, label: 'Clear Life Purpose', description: 'Strong sense of meaning and direction' },
  { value: 80, label: 'Values-Aligned Living', description: 'Actions match personal values' },
  { value: 70, label: 'Contributing to Others', description: 'Finding meaning through service' },
  { value: 60, label: 'Personal Growth Focus', description: 'Committed to self-development' },
  { value: 50, label: 'Seeking Purpose', description: 'Exploring meaning and direction' },
  { value: 40, label: 'Feeling Lost', description: 'Unclear about life direction' }
];

// Social Connection Quality
export const socialQualityOptions = [
  { value: 90, label: 'Deep Meaningful Connections', description: 'Strong, supportive relationships' },
  { value: 80, label: 'Regular Quality Time', description: 'Consistent meaningful interactions' },
  { value: 70, label: 'Good Social Support', description: 'Reliable network of friends/family' },
  { value: 60, label: 'Some Social Connection', description: 'Occasional meaningful interactions' },
  { value: 50, label: 'Limited Social Contact', description: 'Minimal social engagement' },
  { value: 40, label: 'Socially Isolated', description: 'Very limited social connections' }
];

// ===== LEGACY COMPATIBILITY =====
// Keep some original options for backward compatibility

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

// Legacy exports for backward compatibility with existing HealthDataForm
export const heartRateSuggestions = [
  { value: 60, label: '60 BPM', description: 'Athletic/Very fit' },
  { value: 65, label: '65 BPM', description: 'Excellent fitness' },
  { value: 70, label: '70 BPM', description: 'Good fitness' },
  { value: 75, label: '75 BPM', description: 'Average fitness' },
  { value: 80, label: '80 BPM', description: 'Fair fitness' },
  { value: 85, label: '85 BPM', description: 'Below average' },
  { value: 90, label: '90 BPM', description: 'Poor fitness' }
];

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

export const stepsSuggestions = [
  { value: 2000, label: '2,000 steps', description: 'Sedentary day' },
  { value: 5000, label: '5,000 steps', description: 'Low activity' },
  { value: 7500, label: '7,500 steps', description: 'Somewhat active' },
  { value: 10000, label: '10,000 steps', description: 'Active (recommended)' },
  { value: 12500, label: '12,500 steps', description: 'Highly active' },
  { value: 15000, label: '15,000 steps', description: 'Very active' },
  { value: 20000, label: '20,000 steps', description: 'Extremely active' }
];

export const activityLevelOptions = [
  { value: 'sedentary', label: 'Sedentary', description: 'Mostly sitting, minimal movement' },
  { value: 'light', label: 'Light Activity', description: 'Some walking, light household tasks' },
  { value: 'moderate', label: 'Moderate Activity', description: 'Regular movement, some exercise' },
  { value: 'vigorous', label: 'Vigorous Activity', description: 'Intense exercise, high activity level' }
];

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
