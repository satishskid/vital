/**
 * Vita Longevity Engine
 * Calculates biological age optimization based on six neuroscience-backed longevity habits
 * Framework: "Neuroscience Secrets for Longevity" - Brain renewal and biological age reversal
 */

class LongevityEngine {
  constructor() {
    this.currentState = null;
    
    // Six Neuroscience-Backed Longevity Habits
    this.longevityHabits = {
      circadianRhythm: { 
        score: 0, 
        factors: {}, 
        weight: 0.20,
        name: 'Circadian Rhythm Optimization',
        description: 'Light exposure and meal timing for hormonal balance'
      },
      intentionalMovement: { 
        score: 0, 
        factors: {}, 
        weight: 0.18,
        name: 'Intentional Movement',
        description: 'Frequent, purposeful activity for cognitive enhancement'
      },
      controlledStress: { 
        score: 0, 
        factors: {}, 
        weight: 0.16,
        name: 'Controlled Stress for Resilience',
        description: 'Strategic stress exposure and recovery cycles'
      },
      qualitySleep: { 
        score: 0, 
        factors: {}, 
        weight: 0.18,
        name: 'Quality Sleep for Brain Detoxification',
        description: 'Sleep optimization for hormonal balance and brain cleaning'
      },
      nutrientDenseEating: { 
        score: 0, 
        factors: {}, 
        weight: 0.16,
        name: 'Nutrient-Dense Eating',
        description: 'Brain-supporting nutrition choices'
      },
      positiveSelfNarrative: { 
        score: 0, 
        factors: {}, 
        weight: 0.12,
        name: 'Positive Self-Narrative',
        description: 'Mindset and psychological well-being cultivation'
      }
    };
    
    // Biological Age States (instead of vitality states)
    this.biologicalAgeStates = {
      acceleratedAging: {
        threshold: [0, 40],
        color: '#EF4444', // Red
        gradient: ['#FEE2E2', '#EF4444'],
        animation: 'warning-pulse',
        message: 'Your habits are accelerating biological aging',
        focus: 'Urgent: Implement brain-protective habits immediately',
        biologicalAge: '+5 to +10 years'
      },
      chronologicalAging: {
        threshold: [40, 70],
        color: '#F59E0B', // Amber
        gradient: ['#FEF3C7', '#F59E0B'],
        animation: 'steady-pulse',
        message: 'You\'re aging at your chronological rate',
        focus: 'Good foundation - optimize for brain renewal',
        biologicalAge: 'Chronological age'
      },
      slowedAging: {
        threshold: [70, 85],
        color: '#10B981', // Emerald
        gradient: ['#D1FAE5', '#10B981'],
        animation: 'healthy-glow',
        message: 'You\'re slowing your biological aging process',
        focus: 'Excellent progress - maintain these brain-healthy habits',
        biologicalAge: '-2 to -5 years'
      },
      reversedAging: {
        threshold: [85, 100],
        color: '#8B5CF6', // Violet
        gradient: ['#EDE9FE', '#8B5CF6'],
        animation: 'renewal-pulse',
        message: 'You\'re actively reversing biological aging',
        focus: 'Outstanding! Your brain is renewing itself',
        biologicalAge: '-5 to -10 years'
      }
    };
  }

  /**
   * Calculate longevity state from health data
   */
  calculateLongevityState(healthData) {
    // Calculate each habit score
    this.calculateCircadianRhythm(healthData);
    this.calculateIntentionalMovement(healthData);
    this.calculateControlledStress(healthData);
    this.calculateQualitySleep(healthData);
    this.calculateNutrientDenseEating(healthData);
    this.calculatePositiveSelfNarrative(healthData);
    
    // Calculate weighted overall longevity score
    const longevityScore = Object.values(this.longevityHabits).reduce((total, habit) => {
      return total + (habit.score * habit.weight);
    }, 0);
    
    // Determine biological age state
    const state = this.determineBiologicalAgeState(longevityScore);
    
    this.currentState = {
      overall: state,
      score: Math.round(longevityScore),
      habits: { ...this.longevityHabits },
      timestamp: new Date(),
      insights: this.generateLongevityInsights(state, longevityScore)
    };
    
    return this.currentState;
  }

  /**
   * Calculate Circadian Rhythm Optimization Score
   */
  calculateCircadianRhythm(healthData) {
    const factors = {};
    let score = 0;
    
    // Light exposure timing (morning light within 2 hours of waking)
    if (healthData.lightExposure?.morningLight) {
      factors.morningLight = Math.min(healthData.lightExposure.morningLight / 30, 100); // 30 min target
      score += factors.morningLight * 0.3;
    }
    
    // Meal timing consistency (eating within circadian windows)
    if (healthData.nutrition?.mealTiming) {
      factors.mealTiming = healthData.nutrition.mealTiming; // 0-100 based on timing consistency
      score += factors.mealTiming * 0.3;
    }
    
    // Evening light reduction (blue light management)
    if (healthData.lightExposure?.eveningReduction) {
      factors.eveningReduction = healthData.lightExposure.eveningReduction;
      score += factors.eveningReduction * 0.2;
    }
    
    // Sleep-wake consistency
    if (healthData.sleep?.consistency) {
      factors.sleepConsistency = healthData.sleep.consistency;
      score += factors.sleepConsistency * 0.2;
    }
    
    this.longevityHabits.circadianRhythm.score = Math.min(score, 100);
    this.longevityHabits.circadianRhythm.factors = factors;
  }

  /**
   * Calculate Intentional Movement Score
   */
  calculateIntentionalMovement(healthData) {
    const factors = {};
    let score = 0;
    
    // Frequent movement breaks (every 30-60 minutes)
    if (healthData.movement?.breaks) {
      factors.movementBreaks = Math.min(healthData.movement.breaks / 8, 100); // 8 breaks target
      score += factors.movementBreaks * 0.4;
    }
    
    // Purposeful exercise (strength, cardio, flexibility)
    if (healthData.exercise?.purposeful) {
      factors.purposefulExercise = healthData.exercise.purposeful;
      score += factors.purposefulExercise * 0.3;
    }
    
    // Cognitive-physical integration (dancing, martial arts, complex movements)
    if (healthData.movement?.cognitiveIntegration) {
      factors.cognitiveIntegration = healthData.movement.cognitiveIntegration;
      score += factors.cognitiveIntegration * 0.3;
    }
    
    this.longevityHabits.intentionalMovement.score = Math.min(score, 100);
    this.longevityHabits.intentionalMovement.factors = factors;
  }

  /**
   * Calculate Controlled Stress Score
   */
  calculateControlledStress(healthData) {
    const factors = {};
    let score = 0;
    
    // HRV-based stress resilience (qualitative assessment)
    if (healthData.hrv?.resilience) {
      factors.hrvResilience = healthData.hrv.resilience; // 0-100 qualitative score
      score += factors.hrvResilience * 0.4;
    }
    
    // Strategic stress exposure (cold, heat, exercise, fasting)
    if (healthData.stress?.strategic) {
      factors.strategicStress = healthData.stress.strategic;
      score += factors.strategicStress * 0.3;
    }
    
    // Recovery practices (meditation, breathwork, nature)
    if (healthData.recovery?.practices) {
      factors.recoveryPractices = healthData.recovery.practices;
      score += factors.recoveryPractices * 0.3;
    }
    
    this.longevityHabits.controlledStress.score = Math.min(score, 100);
    this.longevityHabits.controlledStress.factors = factors;
  }

  /**
   * Calculate Quality Sleep Score
   */
  calculateQualitySleep(healthData) {
    const factors = {};
    let score = 0;
    
    // Sleep duration (7-9 hours optimal)
    if (healthData.sleep?.duration) {
      const optimalRange = healthData.sleep.duration >= 420 && healthData.sleep.duration <= 540; // 7-9 hours
      factors.duration = optimalRange ? 100 : Math.max(0, 100 - Math.abs(480 - healthData.sleep.duration) / 2);
      score += factors.duration * 0.3;
    }
    
    // Sleep quality (deep sleep phases)
    if (healthData.sleep?.quality) {
      factors.quality = healthData.sleep.quality;
      score += factors.quality * 0.3;
    }
    
    // Sleep environment optimization
    if (healthData.sleep?.environment) {
      factors.environment = healthData.sleep.environment;
      score += factors.environment * 0.2;
    }
    
    // Sleep timing consistency
    if (healthData.sleep?.timing) {
      factors.timing = healthData.sleep.timing;
      score += factors.timing * 0.2;
    }
    
    this.longevityHabits.qualitySleep.score = Math.min(score, 100);
    this.longevityHabits.qualitySleep.factors = factors;
  }

  /**
   * Calculate Nutrient-Dense Eating Score
   */
  calculateNutrientDenseEating(healthData) {
    const factors = {};
    let score = 0;
    
    // Brain-supporting foods (omega-3, antioxidants, polyphenols)
    if (healthData.nutrition?.brainFoods) {
      factors.brainFoods = healthData.nutrition.brainFoods;
      score += factors.brainFoods * 0.4;
    }
    
    // Nutrient density vs calorie density ratio
    if (healthData.nutrition?.nutrientDensity) {
      factors.nutrientDensity = healthData.nutrition.nutrientDensity;
      score += factors.nutrientDensity * 0.3;
    }
    
    // Eating patterns (intermittent fasting, meal timing)
    if (healthData.nutrition?.patterns) {
      factors.eatingPatterns = healthData.nutrition.patterns;
      score += factors.eatingPatterns * 0.3;
    }
    
    this.longevityHabits.nutrientDenseEating.score = Math.min(score, 100);
    this.longevityHabits.nutrientDenseEating.factors = factors;
  }

  /**
   * Calculate Positive Self-Narrative Score
   */
  calculatePositiveSelfNarrative(healthData) {
    const factors = {};
    let score = 0;
    
    // Growth mindset indicators
    if (healthData.mindset?.growth) {
      factors.growthMindset = healthData.mindset.growth;
      score += factors.growthMindset * 0.3;
    }
    
    // Self-compassion practices
    if (healthData.mindset?.selfCompassion) {
      factors.selfCompassion = healthData.mindset.selfCompassion;
      score += factors.selfCompassion * 0.3;
    }
    
    // Purpose and meaning cultivation
    if (healthData.mindset?.purpose) {
      factors.purpose = healthData.mindset.purpose;
      score += factors.purpose * 0.2;
    }
    
    // Social connections quality
    if (healthData.social?.quality) {
      factors.socialQuality = healthData.social.quality;
      score += factors.socialQuality * 0.2;
    }
    
    this.longevityHabits.positiveSelfNarrative.score = Math.min(score, 100);
    this.longevityHabits.positiveSelfNarrative.factors = factors;
  }

  /**
   * Determine biological age state from longevity score
   */
  determineBiologicalAgeState(score) {
    for (const [stateName, stateData] of Object.entries(this.biologicalAgeStates)) {
      if (score >= stateData.threshold[0] && score < stateData.threshold[1]) {
        return { name: stateName, ...stateData };
      }
    }
    
    // Default to reversed aging if score is 100
    return { name: 'reversedAging', ...this.biologicalAgeStates.reversedAging };
  }

  /**
   * Generate longevity insights and recommendations
   */
  generateLongevityInsights(state, score) {
    const insights = {
      primary: state.message,
      focus: state.focus,
      biologicalAge: state.biologicalAge,
      recommendations: [],
      habitsNeedingAttention: []
    };
    
    // Identify habits needing attention (below 70)
    Object.entries(this.longevityHabits).forEach(([habitName, habit]) => {
      if (habit.score < 70) {
        insights.habitsNeedingAttention.push({
          name: habitName,
          score: habit.score,
          suggestions: this.getHabitSuggestions(habitName, habit)
        });
      }
    });
    
    // Generate state-specific recommendations
    insights.recommendations = this.getStateRecommendations(state.name, score);
    
    return insights;
  }

  /**
   * Get habit-specific suggestions
   */
  getHabitSuggestions(habitName, habit) {
    const suggestions = {
      circadianRhythm: [
        'Get 15-30 minutes of morning sunlight within 2 hours of waking',
        'Eat your largest meal earlier in the day',
        'Reduce blue light exposure 2 hours before bed',
        'Maintain consistent sleep-wake times'
      ],
      intentionalMovement: [
        'Take movement breaks every 30-60 minutes',
        'Include strength training 2-3 times per week',
        'Try cognitive-physical activities like dancing or martial arts',
        'Walk or bike for transportation when possible'
      ],
      controlledStress: [
        'Practice cold exposure (cold showers, ice baths)',
        'Try intermittent fasting for metabolic stress',
        'Include high-intensity interval training',
        'Practice breathwork for stress resilience'
      ],
      qualitySleep: [
        'Optimize sleep environment (cool, dark, quiet)',
        'Establish a consistent bedtime routine',
        'Avoid caffeine 8 hours before bed',
        'Use blackout curtains or eye mask'
      ],
      nutrientDenseEating: [
        'Include omega-3 rich foods (fish, walnuts, flax)',
        'Eat colorful vegetables and fruits daily',
        'Choose whole foods over processed options',
        'Consider time-restricted eating windows'
      ],
      positiveSelfNarrative: [
        'Practice daily gratitude journaling',
        'Cultivate growth mindset through learning',
        'Engage in meaningful social connections',
        'Develop self-compassion practices'
      ]
    };
    
    return suggestions[habitName] || [];
  }

  /**
   * Get state-specific recommendations
   */
  getStateRecommendations(stateName, score) {
    const recommendations = {
      acceleratedAging: [
        'Focus on sleep optimization as your top priority',
        'Start with 10 minutes of morning sunlight daily',
        'Begin with gentle movement breaks every hour',
        'Practice 5 minutes of deep breathing daily'
      ],
      chronologicalAging: [
        'Add strategic stress through cold exposure',
        'Increase nutrient-dense foods in your diet',
        'Establish consistent circadian rhythms',
        'Include strength training in your routine'
      ],
      slowedAging: [
        'Fine-tune your meal timing for optimal metabolism',
        'Add cognitive-physical challenges to your routine',
        'Deepen your mindfulness and self-narrative practices',
        'Optimize your sleep environment further'
      ],
      reversedAging: [
        'Maintain your excellent habits consistently',
        'Share your knowledge to help others',
        'Continue challenging yourself with new activities',
        'Monitor and adjust based on how you feel'
      ]
    };
    
    return recommendations[stateName] || [];
  }

  /**
   * Get current longevity state
   */
  getCurrentState() {
    return this.currentState;
  }

  /**
   * Get habit breakdown for detailed analysis
   */
  getHabitBreakdown() {
    return this.longevityHabits;
  }
}

export default LongevityEngine;
