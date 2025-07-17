import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiActivity, FiZap, FiMoon, FiHeart, FiSmile, FiSave, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/FirebaseAuthContext';
import EnhancedInput from './EnhancedInput';
import {
  morningLightSuggestions,
  mealTimingOptions,
  sleepConsistencyOptions,
  movementBreaksSuggestions,
  exerciseTypeOptions,
  cognitivePhysicalOptions,
  hrvResilienceOptions,
  strategicStressOptions,
  recoveryPracticeOptions,
  sleepDurationSuggestions,
  sleepEnvironmentOptions,
  brainDetoxQualityOptions,
  brainFoodOptions,
  nutrientDensityOptions,
  eatingPatternOptions,
  growthMindsetOptions,
  selfCompassionOptions,
  purposeOptions,
  socialQualityOptions
} from './healthInputData';

const SafeIcon = ({ icon: Icon, ...props }) => {
  if (!Icon) return <div {...props} />;
  return <Icon {...props} />;
};

const LongevityHabitsForm = ({ onSuccess, initialData = null }) => {
  const { user, saveHealthData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('circadian');
  
  const [longevityData, setLongevityData] = useState({
    // Circadian Rhythm Optimization
    morningLight: initialData?.morningLight || '',
    mealTiming: initialData?.mealTiming || '',
    sleepConsistency: initialData?.sleepConsistency || '',
    
    // Intentional Movement
    movementBreaks: initialData?.movementBreaks || '',
    exerciseType: initialData?.exerciseType || '',
    cognitivePhysical: initialData?.cognitivePhysical || '',
    
    // Controlled Stress for Resilience
    hrvResilience: initialData?.hrvResilience || '',
    strategicStress: initialData?.strategicStress || '',
    recoveryPractice: initialData?.recoveryPractice || '',
    
    // Quality Sleep for Brain Detoxification
    sleepDuration: initialData?.sleepDuration || '',
    sleepEnvironment: initialData?.sleepEnvironment || '',
    brainDetoxQuality: initialData?.brainDetoxQuality || '',
    
    // Nutrient-Dense Eating
    brainFood: initialData?.brainFood || '',
    nutrientDensity: initialData?.nutrientDensity || '',
    eatingPattern: initialData?.eatingPattern || '',
    
    // Positive Self-Narrative
    growthMindset: initialData?.growthMindset || '',
    selfCompassion: initialData?.selfCompassion || '',
    purpose: initialData?.purpose || '',
    socialQuality: initialData?.socialQuality || '',
    
    notes: initialData?.notes || ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    // Add validation logic if needed
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      setError('Please sign in to save longevity data');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data for Firebase with longevity structure
      const dataToSave = {
        // Map to LongevityEngine expected format
        lightExposure: {
          morningLight: longevityData.morningLight,
          timestamp: new Date()
        },
        nutrition: {
          mealTiming: longevityData.mealTiming,
          brainFoods: longevityData.brainFood,
          nutrientDensity: longevityData.nutrientDensity,
          patterns: longevityData.eatingPattern,
          timestamp: new Date()
        },
        sleep: {
          duration: longevityData.sleepDuration * 60, // Convert to minutes
          environment: longevityData.sleepEnvironment,
          brainDetox: longevityData.brainDetoxQuality,
          consistency: longevityData.sleepConsistency,
          timestamp: new Date()
        },
        movement: {
          breaks: longevityData.movementBreaks,
          cognitiveIntegration: longevityData.cognitivePhysical,
          timestamp: new Date()
        },
        exercise: {
          purposeful: longevityData.exerciseType,
          timestamp: new Date()
        },
        hrv: {
          resilience: longevityData.hrvResilience,
          timestamp: new Date()
        },
        stress: {
          strategic: longevityData.strategicStress,
          timestamp: new Date()
        },
        recovery: {
          practices: longevityData.recoveryPractice,
          timestamp: new Date()
        },
        mindset: {
          growth: longevityData.growthMindset,
          selfCompassion: longevityData.selfCompassion,
          purpose: longevityData.purpose,
          timestamp: new Date()
        },
        social: {
          quality: longevityData.socialQuality,
          timestamp: new Date()
        },
        notes: longevityData.notes,
        timestamp: new Date(),
        type: 'longevity_habits'
      };

      await saveHealthData(dataToSave);
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess(dataToSave);
      }

      // Reset form after successful submission
      setTimeout(() => {
        setSuccess(false);
        setLongevityData({
          morningLight: '',
          mealTiming: '',
          sleepConsistency: '',
          movementBreaks: '',
          exerciseType: '',
          cognitivePhysical: '',
          hrvResilience: '',
          strategicStress: '',
          recoveryPractice: '',
          sleepDuration: '',
          sleepEnvironment: '',
          brainDetoxQuality: '',
          brainFood: '',
          nutrientDensity: '',
          eatingPattern: '',
          growthMindset: '',
          selfCompassion: '',
          purpose: '',
          socialQuality: '',
          notes: ''
        });
      }, 2000);

    } catch (error) {
      console.error('Error saving longevity data:', error);
      setError('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setLongevityData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const tabs = [
    { id: 'circadian', label: 'Circadian', icon: FiSun, color: 'yellow' },
    { id: 'movement', label: 'Movement', icon: FiActivity, color: 'green' },
    { id: 'stress', label: 'Stress', icon: FiZap, color: 'red' },
    { id: 'sleep', label: 'Sleep', icon: FiMoon, color: 'indigo' },
    { id: 'nutrition', label: 'Nutrition', icon: FiHeart, color: 'emerald' },
    { id: 'mindset', label: 'Mindset', icon: FiSmile, color: 'pink' }
  ];

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-8 shadow-sm text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Longevity Data Saved!</h3>
        <p className="text-gray-600 mb-4">
          Your neuroscience-backed longevity habits have been recorded for biological age optimization.
        </p>
        <div className="text-sm text-gray-500">
          Contributing to your brain renewal and age reversal journey...
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white p-6 rounded-t-xl">
        <h2 className="text-2xl font-bold mb-2">Longevity Habits Tracking</h2>
        <p className="text-purple-100">Six neuroscience-backed habits for biological age reversal</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? `border-${tab.color}-500 text-${tab.color}-600`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'circadian' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <SafeIcon icon={FiSun} className="w-5 h-5 text-yellow-600" />
                <span>Circadian Rhythm Optimization</span>
              </h3>
              
              <EnhancedInput
                label="Morning Light Exposure"
                value={longevityData.morningLight}
                onChange={(value) => handleInputChange('morningLight', value)}
                suggestions={morningLightSuggestions}
                placeholder="Minutes of morning sunlight"
                type="number"
                error={validationErrors.morningLight}
                helpText="Get sunlight within 2 hours of waking to set your circadian clock"
              />

              <EnhancedInput
                label="Meal Timing Pattern"
                value={longevityData.mealTiming}
                onChange={(value) => handleInputChange('mealTiming', value)}
                suggestions={mealTimingOptions}
                placeholder="Select eating window"
                type="select"
                error={validationErrors.mealTiming}
                helpText="Earlier eating windows align better with circadian metabolism"
              />

              <EnhancedInput
                label="Sleep-Wake Consistency"
                value={longevityData.sleepConsistency}
                onChange={(value) => handleInputChange('sleepConsistency', value)}
                suggestions={sleepConsistencyOptions}
                placeholder="How consistent is your sleep schedule?"
                type="select"
                error={validationErrors.sleepConsistency}
                helpText="Consistent timing strengthens your internal clock"
              />
            </motion.div>
          )}

          {/* Add other tab content sections here */}
          
        </div>

        {/* Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <SafeIcon icon={FiSave} className="w-5 h-5" />
                <span>Save Longevity Data</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LongevityHabitsForm;
