import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const VitalityInsights = ({ vitalityState }) => {
  const getPillarTrend = (pillarScore) => {
    if (pillarScore >= 80) return { icon: FiTrendingUp, color: 'text-green-600', label: 'Strong' };
    if (pillarScore >= 60) return { icon: FiMinus, color: 'text-yellow-600', label: 'Stable' };
    return { icon: FiTrendingDown, color: 'text-red-600', label: 'Needs Attention' };
  };

  const getPillarInsight = (pillarName, pillar) => {
    const insights = {
      recovery: {
        high: "Your recovery systems are functioning optimally. Great sleep and stress management!",
        medium: "Your recovery is adequate but could be improved with better sleep hygiene.",
        low: "Your body needs more recovery time. Focus on sleep quality and stress reduction."
      },
      resilience: {
        high: "Excellent physical and mental resilience. You're building strong adaptive capacity!",
        medium: "Good resilience foundation. Consider adding more varied physical activities.",
        low: "Your resilience could use strengthening through regular movement and mindfulness."
      },
      fuel: {
        high: "You're well-fueled with great nutrition, emotions, and social connections!",
        medium: "Good fuel levels. Pay attention to nutrition timing and social connections.",
        low: "Your fuel systems need attention. Focus on nutrition, mood, and relationships."
      }
    };

    const level = pillar.score >= 80 ? 'high' : pillar.score >= 60 ? 'medium' : 'low';
    return insights[pillarName][level];
  };

  const getStateAdvice = () => {
    const advice = {
      recovering: {
        title: "Recovery Mode Activated",
        description: "Your body is prioritizing restoration. This is a natural and important phase.",
        tips: [
          "Honor your body's need for rest",
          "Focus on gentle, restorative activities",
          "Maintain consistent sleep schedule",
          "Practice stress-reduction techniques"
        ]
      },
      balanced: {
        title: "Sustainable Rhythm",
        description: "You're in a healthy, maintainable state. Perfect for consistent progress.",
        tips: [
          "Maintain your current healthy habits",
          "Gradually introduce new challenges",
          "Stay consistent with your routine",
          "Monitor for signs of overexertion"
        ]
      },
      primed: {
        title: "Peak Performance Window",
        description: "You're optimally prepared for challenges and high performance.",
        tips: [
          "Great time for intense workouts",
          "Tackle challenging projects",
          "Try new activities or skills",
          "Push your comfort zone safely"
        ]
      }
    };

    return advice[vitalityState.overall.name] || advice.balanced;
  };

  const stateAdvice = getStateAdvice();

  return (
    <div className="space-y-6">
      {/* State Overview */}
      <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: vitalityState.overall.color }}
          >
            <SafeIcon icon={FiInfo} className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {stateAdvice.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {stateAdvice.description}
            </p>
            <div className="space-y-2">
              {stateAdvice.tips.map((tip, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pillar Breakdown */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">Pillar Analysis</h4>
        
        {Object.entries(vitalityState.pillars).map(([pillarName, pillar]) => {
          const trend = getPillarTrend(pillar.score);
          const insight = getPillarInsight(pillarName, pillar);
          
          return (
            <motion.div
              key={pillarName}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h5 className="font-medium text-gray-800 capitalize">
                    {pillarName}
                  </h5>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={trend.icon} className={`w-4 h-4 ${trend.color}`} />
                    <span className={`text-xs font-medium ${trend.color}`}>
                      {trend.label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">
                    {Math.round(pillar.score)}
                  </div>
                  <div className="text-xs text-gray-500">/ 100</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ 
                    backgroundColor: pillar.score >= 80 ? '#10B981' : 
                                   pillar.score >= 60 ? '#F59E0B' : '#EF4444'
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pillar.score}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              
              <p className="text-sm text-gray-600">
                {insight}
              </p>
              
              {/* Factor Breakdown */}
              {Object.keys(pillar.factors).length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(pillar.factors).map(([factorName, factor]) => (
                      <div key={factorName} className="flex justify-between text-xs">
                        <span className="text-gray-600">{factor.label}</span>
                        <span className="font-medium text-gray-800">
                          {Math.round(factor.score)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Areas Needing Attention */}
      {vitalityState.insights.pillarsNeedingAttention.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">
                Areas for Improvement
              </h4>
              <div className="space-y-3">
                {vitalityState.insights.pillarsNeedingAttention.map((pillar, index) => (
                  <div key={index}>
                    <h5 className="font-medium text-orange-700 capitalize mb-1">
                      {pillar.name} ({Math.round(pillar.score)}/100)
                    </h5>
                    <ul className="space-y-1">
                      {pillar.suggestions.slice(0, 2).map((suggestion, suggestionIndex) => (
                        <li key={suggestionIndex} className="text-sm text-orange-600 flex items-center space-x-2">
                          <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Context */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">
              Understanding Your Vitality
            </h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p>
                <strong>Recovery</strong> reflects your body's restoration capacity through sleep, 
                HRV, and stress management.
              </p>
              <p>
                <strong>Resilience</strong> measures your physical and mental adaptive capacity 
                through activity and mindfulness.
              </p>
              <p>
                <strong>Fuel</strong> represents the energy sources that power your vitality: 
                nutrition, emotions, and social connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalityInsights;
