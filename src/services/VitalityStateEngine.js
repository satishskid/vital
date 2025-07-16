/**
 * Vita Vitality State Engine
 * Calculates holistic vitality state from health data across three pillars
 */

class VitalityStateEngine {
  constructor() {
    this.currentState = null;
    this.pillars = {
      recovery: { score: 0, factors: {}, weight: 0.4 },
      resilience: { score: 0, factors: {}, weight: 0.35 },
      fuel: { score: 0, factors: {}, weight: 0.25 }
    };
    
    // Vitality states with thresholds and characteristics
    this.vitalityStates = {
      recovering: {
        threshold: [0, 60],
        color: '#F59E0B', // Amber
        gradient: ['#FEF3C7', '#F59E0B'],
        animation: 'gentle-pulse',
        message: 'Your body is asking for rest and recovery',
        focus: 'Prioritize gentle activities and restoration'
      },
      balanced: {
        threshold: [60, 80],
        color: '#10B981', // Emerald
        gradient: ['#D1FAE5', '#10B981'],
        animation: 'steady-glow',
        message: 'You\'re in a sustainable daily rhythm',
        focus: 'Maintain your current healthy patterns'
      },
      primed: {
        threshold: [80, 100],
        color: '#8B5CF6', // Violet
        gradient: ['#EDE9FE', '#8B5CF6'],
        animation: 'dynamic-pulse',
        message: 'You\'re primed for peak performance',
        focus: 'Great time for challenges and growth'
      }
    };
  }

  /**
   * Calculate overall vitality state from health data
   */
  calculateVitalityState(healthData) {
    // Calculate each pillar score
    this.calculateRecoveryPillar(healthData);
    this.calculateResiliencePillar(healthData);
    this.calculateFuelPillar(healthData);
    
    // Calculate weighted overall score
    const overallScore = 
      (this.pillars.recovery.score * this.pillars.recovery.weight) +
      (this.pillars.resilience.score * this.pillars.resilience.weight) +
      (this.pillars.fuel.score * this.pillars.fuel.weight);
    
    // Determine vitality state
    const state = this.determineVitalityState(overallScore);
    
    this.currentState = {
      overall: state,
      score: Math.round(overallScore),
      pillars: { ...this.pillars },
      timestamp: new Date(),
      insights: this.generateInsights(state, overallScore)
    };
    
    return this.currentState;
  }

  /**
   * Calculate Recovery Pillar (Sleep + HRV/Morning Readiness)
   */
  calculateRecoveryPillar(healthData) {
    const factors = {};
    let totalScore = 0;
    let factorCount = 0;

    // Sleep Quality (40% of recovery)
    if (healthData.sleep) {
      const sleepScore = this.calculateSleepScore(healthData.sleep);
      factors.sleep = { score: sleepScore, weight: 0.4, label: 'Sleep Quality' };
      totalScore += sleepScore * 0.4;
      factorCount += 0.4;
    }

    // HRV/Morning Readiness (35% of recovery)
    if (healthData.hrv) {
      const hrvScore = this.calculateHRVScore(healthData.hrv);
      factors.hrv = { score: hrvScore, weight: 0.35, label: 'Heart Rate Variability' };
      totalScore += hrvScore * 0.35;
      factorCount += 0.35;
    }

    // Stress/Recovery Indicators (25% of recovery)
    if (healthData.stress || healthData.mood) {
      const recoveryScore = this.calculateRecoveryIndicators(healthData);
      factors.recovery = { score: recoveryScore, weight: 0.25, label: 'Recovery Indicators' };
      totalScore += recoveryScore * 0.25;
      factorCount += 0.25;
    }

    this.pillars.recovery.score = factorCount > 0 ? (totalScore / factorCount) * 100 : 50;
    this.pillars.recovery.factors = factors;
  }

  /**
   * Calculate Resilience Pillar (Physical Activity + Mind-Body Practices)
   */
  calculateResiliencePillar(healthData) {
    const factors = {};
    let totalScore = 0;
    let factorCount = 0;

    // Physical Activity (60% of resilience)
    if (healthData.activity) {
      const activityScore = this.calculateActivityScore(healthData.activity);
      factors.activity = { score: activityScore, weight: 0.6, label: 'Physical Activity' };
      totalScore += activityScore * 0.6;
      factorCount += 0.6;
    }

    // Mind-Body Practices (40% of resilience)
    if (healthData.mindfulness || healthData.breathing) {
      const mindBodyScore = this.calculateMindBodyScore(healthData);
      factors.mindBody = { score: mindBodyScore, weight: 0.4, label: 'Mind-Body Practices' };
      totalScore += mindBodyScore * 0.4;
      factorCount += 0.4;
    }

    this.pillars.resilience.score = factorCount > 0 ? (totalScore / factorCount) * 100 : 50;
    this.pillars.resilience.factors = factors;
  }

  /**
   * Calculate Fuel Pillar (Nutrition + Emotions + Social Connections)
   */
  calculateFuelPillar(healthData) {
    const factors = {};
    let totalScore = 0;
    let factorCount = 0;

    // Nutrition (40% of fuel)
    if (healthData.nutrition) {
      const nutritionScore = this.calculateNutritionScore(healthData.nutrition);
      factors.nutrition = { score: nutritionScore, weight: 0.4, label: 'Nutrition' };
      totalScore += nutritionScore * 0.4;
      factorCount += 0.4;
    }

    // Emotional State (30% of fuel)
    if (healthData.mood || healthData.emotions) {
      const emotionalScore = this.calculateEmotionalScore(healthData);
      factors.emotions = { score: emotionalScore, weight: 0.3, label: 'Emotional State' };
      totalScore += emotionalScore * 0.3;
      factorCount += 0.3;
    }

    // Social Connections (30% of fuel)
    if (healthData.social) {
      const socialScore = this.calculateSocialScore(healthData.social);
      factors.social = { score: socialScore, weight: 0.3, label: 'Social Connections' };
      totalScore += socialScore * 0.3;
      factorCount += 0.3;
    }

    this.pillars.fuel.score = factorCount > 0 ? (totalScore / factorCount) * 100 : 50;
    this.pillars.fuel.factors = factors;
  }

  /**
   * Calculate sleep quality score (0-100)
   */
  calculateSleepScore(sleepData) {
    let score = 50; // Base score
    
    // Duration score (7-9 hours optimal)
    if (sleepData.duration) {
      const hours = sleepData.duration / 60;
      if (hours >= 7 && hours <= 9) {
        score += 25;
      } else if (hours >= 6 && hours <= 10) {
        score += 15;
      } else if (hours >= 5 && hours <= 11) {
        score += 5;
      }
    }
    
    // Quality indicators
    if (sleepData.quality) {
      score += (sleepData.quality / 100) * 25;
    }
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate HRV score (0-100)
   */
  calculateHRVScore(hrvData) {
    let score = 50;
    
    if (hrvData.readiness) {
      score = hrvData.readiness;
    } else if (hrvData.rmssd) {
      // Simplified HRV scoring based on RMSSD
      score = Math.min(100, Math.max(0, (hrvData.rmssd / 50) * 100));
    }
    
    return score;
  }

  /**
   * Calculate activity score (0-100)
   */
  calculateActivityScore(activityData) {
    let score = 0;
    
    // Steps contribution (40%)
    if (activityData.steps) {
      const stepScore = Math.min(100, (activityData.steps / 10000) * 100);
      score += stepScore * 0.4;
    }
    
    // Active minutes contribution (60%)
    if (activityData.activeMinutes) {
      const activeScore = Math.min(100, (activityData.activeMinutes / 30) * 100);
      score += activeScore * 0.6;
    }
    
    return Math.min(100, score);
  }

  /**
   * Calculate mind-body practices score (0-100)
   */
  calculateMindBodyScore(healthData) {
    let score = 0;
    let practices = 0;
    
    if (healthData.mindfulness && healthData.mindfulness.sessions > 0) {
      score += 50;
      practices++;
    }
    
    if (healthData.breathing && healthData.breathing.sessions > 0) {
      score += 50;
      practices++;
    }
    
    return practices > 0 ? score / practices : 0;
  }

  /**
   * Calculate nutrition score (0-100)
   */
  calculateNutritionScore(nutritionData) {
    let score = 50; // Base score
    
    if (nutritionData.mealsLogged >= 2) {
      score += 25;
    }
    
    if (nutritionData.waterIntake >= 8) {
      score += 25;
    }
    
    return Math.min(100, score);
  }

  /**
   * Calculate emotional state score (0-100)
   */
  calculateEmotionalScore(healthData) {
    let score = 50;
    
    if (healthData.mood) {
      score = (healthData.mood / 5) * 100;
    }
    
    return score;
  }

  /**
   * Calculate social connections score (0-100)
   */
  calculateSocialScore(socialData) {
    if (socialData.socialWellnessScore) {
      return socialData.socialWellnessScore;
    }
    
    // Fallback calculation
    let score = 0;
    if (socialData.interactions >= 3) score += 50;
    if (socialData.uniqueContacts >= 2) score += 50;
    
    return Math.min(100, score);
  }

  /**
   * Calculate recovery indicators score (0-100)
   */
  calculateRecoveryIndicators(healthData) {
    let score = 50;
    
    if (healthData.stress) {
      score = 100 - (healthData.stress / 10) * 100;
    }
    
    return Math.max(0, score);
  }

  /**
   * Determine vitality state from overall score
   */
  determineVitalityState(score) {
    for (const [stateName, stateData] of Object.entries(this.vitalityStates)) {
      if (score >= stateData.threshold[0] && score < stateData.threshold[1]) {
        return { name: stateName, ...stateData };
      }
    }
    
    // Default to primed if score is 100
    return { name: 'primed', ...this.vitalityStates.primed };
  }

  /**
   * Generate actionable insights based on vitality state
   */
  generateInsights(state, score) {
    const insights = {
      primary: state.message,
      focus: state.focus,
      recommendations: [],
      pillarsNeedingAttention: []
    };
    
    // Identify pillars needing attention (below 60)
    Object.entries(this.pillars).forEach(([pillarName, pillar]) => {
      if (pillar.score < 60) {
        insights.pillarsNeedingAttention.push({
          name: pillarName,
          score: pillar.score,
          suggestions: this.getPillarSuggestions(pillarName, pillar)
        });
      }
    });
    
    // Generate state-specific recommendations
    insights.recommendations = this.getStateRecommendations(state.name, score);
    
    return insights;
  }

  /**
   * Get pillar-specific suggestions
   */
  getPillarSuggestions(pillarName, pillar) {
    const suggestions = {
      recovery: [
        'Aim for 7-9 hours of quality sleep tonight',
        'Try a relaxing bedtime routine',
        'Consider a short meditation before sleep'
      ],
      resilience: [
        'Take a 10-minute walk outside',
        'Try 5 minutes of deep breathing',
        'Do some gentle stretching'
      ],
      fuel: [
        'Stay hydrated throughout the day',
        'Connect with a friend or family member',
        'Eat a balanced, nutritious meal'
      ]
    };
    
    return suggestions[pillarName] || [];
  }

  /**
   * Get state-specific recommendations
   */
  getStateRecommendations(stateName, score) {
    const recommendations = {
      recovering: [
        'Focus on gentle, restorative activities',
        'Prioritize sleep and stress reduction',
        'Avoid intense workouts today'
      ],
      balanced: [
        'Maintain your current healthy habits',
        'Consider adding one new wellness practice',
        'Stay consistent with your routine'
      ],
      primed: [
        'Great day for challenging workouts',
        'Tackle important projects',
        'Try something new and exciting'
      ]
    };
    
    return recommendations[stateName] || [];
  }

  /**
   * Get current vitality state
   */
  getCurrentState() {
    return this.currentState;
  }

  /**
   * Get pillar breakdown
   */
  getPillarBreakdown() {
    return this.pillars;
  }

  /**
   * DEPRECATED: Simulation removed - use real health data only
   * This method has been removed to ensure production readiness
   */
}

export default VitalityStateEngine;
