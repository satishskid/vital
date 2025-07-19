import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCheck, FiZap, FiHeart, FiTarget, FiSun } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const SmartFoodLogger = ({ onLogMeal, currentTime, recentMeals = [] }) => {
  const [showFoodLogger, setShowFoodLogger] = useState(false);
  const [mealInput, setMealInput] = useState('');
  const [suggestedMeals, setSuggestedMeals] = useState([]);
  const [mealContext, setMealContext] = useState(null);
  const [nutrientAnalysis, setNutrientAnalysis] = useState(null);

  useEffect(() => {
    if (showFoodLogger) {
      analyzeMealContext();
      generateSmartSuggestions();
    }
  }, [showFoodLogger, currentTime]);

  // Analyze meal context based on time and recent meals
  const analyzeMealContext = () => {
    const hour = currentTime.hour;
    const lastMeal = recentMeals[recentMeals.length - 1];
    const timeSinceLastMeal = lastMeal ? 
      (currentTime.hour - lastMeal.hour + (currentTime.minute - lastMeal.minute) / 60) : null;

    let context = {
      mealType: getMealType(hour),
      circadianPhase: getCircadianPhase(hour),
      timingOptimal: isOptimalTiming(hour, timeSinceLastMeal),
      fastingWindow: timeSinceLastMeal,
      recommendations: []
    };

    // Add context-specific recommendations
    if (hour >= 6 && hour <= 10) {
      context.recommendations.push("Break your overnight fast with protein and healthy fats");
      context.recommendations.push("Include foods that support morning cortisol rhythm");
    } else if (hour >= 11 && hour <= 15) {
      context.recommendations.push("Largest meal of the day - your metabolism is highest");
      context.recommendations.push("Include complex carbs for sustained afternoon energy");
    } else if (hour >= 16 && hour <= 20) {
      context.recommendations.push("Lighter meal to support evening wind-down");
      context.recommendations.push("Avoid heavy proteins that require energy to digest");
    } else {
      context.recommendations.push("Late eating may disrupt circadian rhythm");
      context.recommendations.push("Consider light, easily digestible options");
    }

    setMealContext(context);
  };

  const getMealType = (hour) => {
    if (hour >= 6 && hour <= 10) return "Breakfast";
    if (hour >= 11 && hour <= 15) return "Lunch";
    if (hour >= 16 && hour <= 20) return "Dinner";
    return "Snack";
  };

  const getCircadianPhase = (hour) => {
    if (hour >= 6 && hour <= 12) return "Morning Activation";
    if (hour >= 12 && hour <= 18) return "Peak Performance";
    if (hour >= 18 && hour <= 22) return "Evening Wind-down";
    return "Rest Phase";
  };

  const isOptimalTiming = (hour, timeSinceLastMeal) => {
    // Optimal eating window: 8 AM - 8 PM
    const inEatingWindow = hour >= 8 && hour <= 20;
    // At least 3 hours since last meal
    const adequateGap = !timeSinceLastMeal || timeSinceLastMeal >= 3;
    return inEatingWindow && adequateGap;
  };

  // Generate smart meal suggestions based on context
  const generateSmartSuggestions = () => {
    const hour = currentTime.hour;
    let suggestions = [];

    if (hour >= 6 && hour <= 10) {
      suggestions = [
        { 
          name: "Brain-Boosting Breakfast",
          foods: ["Eggs", "Avocado", "Berries", "Nuts"],
          benefits: "Protein + healthy fats for sustained energy",
          nutrients: "Choline, Omega-3, Antioxidants"
        },
        {
          name: "Circadian Sync Bowl",
          foods: ["Greek yogurt", "Walnuts", "Blueberries", "Chia seeds"],
          benefits: "Supports morning cortisol rhythm",
          nutrients: "Protein, Melatonin precursors, Fiber"
        }
      ];
    } else if (hour >= 11 && hour <= 15) {
      suggestions = [
        {
          name: "Peak Performance Plate",
          foods: ["Salmon", "Quinoa", "Leafy greens", "Sweet potato"],
          benefits: "Largest meal when metabolism is highest",
          nutrients: "Omega-3, Complex carbs, B-vitamins"
        },
        {
          name: "Cognitive Power Lunch",
          foods: ["Chicken", "Brown rice", "Broccoli", "Olive oil"],
          benefits: "Sustained afternoon focus and energy",
          nutrients: "Lean protein, Fiber, Healthy fats"
        }
      ];
    } else if (hour >= 16 && hour <= 20) {
      suggestions = [
        {
          name: "Evening Wind-down",
          foods: ["Light fish", "Steamed vegetables", "Herbal tea"],
          benefits: "Easy digestion for better sleep",
          nutrients: "Light protein, Magnesium, Antioxidants"
        },
        {
          name: "Sleep-Supporting Dinner",
          foods: ["Turkey", "Tart cherries", "Leafy greens", "Almonds"],
          benefits: "Natural melatonin and tryptophan",
          nutrients: "Tryptophan, Natural melatonin, Magnesium"
        }
      ];
    }

    setSuggestedMeals(suggestions);
  };

  // Analyze nutrient density of user input
  const analyzeNutrientDensity = (input) => {
    const brainFoods = ['salmon', 'blueberries', 'walnuts', 'avocado', 'eggs', 'spinach', 'broccoli'];
    const processedFoods = ['pizza', 'burger', 'fries', 'soda', 'chips', 'candy'];
    
    const inputLower = input.toLowerCase();
    const brainFoodCount = brainFoods.filter(food => inputLower.includes(food)).length;
    const processedFoodCount = processedFoods.filter(food => inputLower.includes(food)).length;
    
    let score = 50; // Base score
    score += brainFoodCount * 15; // +15 for each brain food
    score -= processedFoodCount * 20; // -20 for each processed food
    score = Math.max(0, Math.min(100, score)); // Clamp between 0-100

    return {
      score,
      brainFoods: brainFoodCount,
      processedFoods: processedFoodCount,
      suggestions: generateNutrientSuggestions(inputLower, score)
    };
  };

  const generateNutrientSuggestions = (input, score) => {
    const suggestions = [];
    
    if (score < 60) {
      suggestions.push("💡 Consider adding leafy greens for brain health");
      suggestions.push("🥑 Add healthy fats like avocado or nuts");
    }
    
    if (!input.includes('protein')) {
      suggestions.push("🥩 Include lean protein for sustained energy");
    }
    
    if (!input.includes('fiber')) {
      suggestions.push("🥬 Add fiber-rich vegetables for gut health");
    }

    return suggestions;
  };

  const handleInputChange = (value) => {
    setMealInput(value);
    if (value.length > 3) {
      const analysis = analyzeNutrientDensity(value);
      setNutrientAnalysis(analysis);
    } else {
      setNutrientAnalysis(null);
    }
  };

  const handleLogMeal = (mealData = null) => {
    const logData = mealData || {
      foods: mealInput,
      time: currentTime,
      mealType: mealContext?.mealType,
      nutrientScore: nutrientAnalysis?.score || 50,
      circadianOptimal: mealContext?.timingOptimal
    };

    onLogMeal(logData);
    setShowFoodLogger(false);
    setMealInput('');
    setNutrientAnalysis(null);
  };

  return (
    <>
      <button
        onClick={() => setShowFoodLogger(true)}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
      >
        🍽️ Smart Food Log
      </button>

      <AnimatePresence>
        {showFoodLogger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFoodLogger(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Smart Food Logger
                </h3>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <SafeIcon icon={FiClock} className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">
                    {currentTime.hour.toString().padStart(2, '0')}:{currentTime.minute.toString().padStart(2, '0')} - {mealContext?.mealType}
                  </span>
                </div>
              </div>

              {/* Meal Context */}
              {mealContext && (
                <div className={`p-4 rounded-lg mb-4 ${
                  mealContext.timingOptimal ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <SafeIcon icon={mealContext.timingOptimal ? FiCheck : FiClock} 
                      className={`w-4 h-4 ${mealContext.timingOptimal ? 'text-green-600' : 'text-yellow-600'}`} />
                    <span className="font-medium text-gray-800">
                      {mealContext.circadianPhase}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {mealContext.recommendations.map((rec, index) => (
                      <div key={index}>• {rec}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Smart Suggestions */}
              {suggestedMeals.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                    <SafeIcon icon={FiTarget} className="w-4 h-4 text-purple-500" />
                    <span>Smart Suggestions</span>
                  </h4>
                  <div className="space-y-2">
                    {suggestedMeals.map((meal, index) => (
                      <div
                        key={index}
                        className="p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                        onClick={() => handleLogMeal({
                          foods: meal.foods.join(', '),
                          time: currentTime,
                          mealType: mealContext?.mealType,
                          nutrientScore: 85,
                          circadianOptimal: true,
                          suggested: true
                        })}
                      >
                        <div className="font-medium text-gray-800">{meal.name}</div>
                        <div className="text-sm text-gray-600">{meal.foods.join(' • ')}</div>
                        <div className="text-xs text-purple-600 mt-1">{meal.benefits}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What did you eat?
                </label>
                <textarea
                  value={mealInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="e.g., Grilled salmon with quinoa and steamed broccoli..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              {/* Nutrient Analysis */}
              {nutrientAnalysis && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">Nutrient Density Score</span>
                    <span className={`font-bold ${
                      nutrientAnalysis.score >= 70 ? 'text-green-600' : 
                      nutrientAnalysis.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {nutrientAnalysis.score}/100
                    </span>
                  </div>
                  {nutrientAnalysis.suggestions.length > 0 && (
                    <div className="text-sm text-gray-600 space-y-1">
                      {nutrientAnalysis.suggestions.map((suggestion, index) => (
                        <div key={index}>{suggestion}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFoodLogger(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleLogMeal()}
                  disabled={!mealInput.trim()}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Log Meal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartFoodLogger;
