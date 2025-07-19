import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiChevronDown, FiChevronUp, FiDroplet, FiStar } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const WeeklyProgressGarden = ({ todayLogs = {}, weeklyData = [] }) => {
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Calculate overall progress for UbiFit Garden visualization
  const calculateOverallProgress = () => {
    const sixPillars = [
      'circadianRhythm', 'intentionalMovement', 'controlledStress',
      'qualitySleep', 'nutrientDenseEating', 'positiveSelfNarrative'
    ];
    
    // Calculate today's completion
    const todayCompletion = sixPillars.reduce((sum, pillar) => {
      const logs = todayLogs[pillar] || [];
      return sum + (logs.length > 0 ? 1 : 0);
    }, 0);
    
    // Calculate weekly completion from real data
    const weeklyCompletion = Array.from({ length: 7 }, (_, dayIndex) => {
      // Get data for this day from weeklyData prop
      const dayData = weeklyData && weeklyData[dayIndex];
      if (!dayData) return 0;

      return sixPillars.reduce((sum, pillar) => {
        const hasActivity = dayData[pillar] && dayData[pillar].length > 0;
        return sum + (hasActivity ? 1 : 0);
      }, 0);
    });
    
    const weeklyAverage = weeklyCompletion.reduce((sum, day) => sum + day, 0) / 7;
    
    return {
      today: todayCompletion,
      todayPercentage: Math.round((todayCompletion / 6) * 100),
      weeklyAverage: Math.round(weeklyAverage),
      weeklyPercentage: Math.round((weeklyAverage / 6) * 100),
      weeklyData: weeklyCompletion
    };
  };

  const progress = calculateOverallProgress();

  // Garden status messages based on natural progression
  const getGardenStatus = (percentage) => {
    if (percentage >= 100) return "Rainbow paradise - exceeding all goals! 🌈";
    if (percentage >= 85) return "Fruit-bearing garden - abundant harvest 🍎";
    if (percentage >= 70) return "Butterfly garden - attracting life 🦋";
    if (percentage >= 55) return "Multiple flowers blooming 🌺";
    if (percentage >= 40) return "Beautiful flowers emerging 🌸";
    if (percentage >= 25) return "Young saplings growing 🌱";
    if (percentage >= 10) return "Fresh grass sprouting 🌿";
    return "Rich soil ready for planting 🌱";
  };

  // UbiFit Garden-inspired flower visualization

  const FlowerGarden = ({ weeklyData }) => {
    // Natural progression gradient: 0=empty, 1=grass, 2=sapling, 3=flower, 4=multiple flowers, 5=butterfly, 6=fruit, 7+=rainbow
    const getGardenStage = (dayCompletion) => {
      if (dayCompletion === 0) return { emoji: '', description: 'Empty soil' };
      if (dayCompletion === 1) return { emoji: '🌿', description: 'Fresh grass' };
      if (dayCompletion === 2) return { emoji: '🌱', description: 'Young sapling' };
      if (dayCompletion === 3) return { emoji: '🌸', description: 'Beautiful flower' };
      if (dayCompletion === 4) return { emoji: '🌺', description: 'Multiple flowers' };
      if (dayCompletion === 5) return { emoji: '🦋', description: 'Butterfly garden' };
      if (dayCompletion === 6) return { emoji: '🍎', description: 'Fruit bearing' };
      return { emoji: '🌈', description: 'Rainbow paradise' }; // 7+ exceeding target
    };

    return (
      <div className="flex items-end justify-center space-x-3 h-28 px-4">
        {weeklyData.map((dayCompletion, index) => {
          const stage = getGardenStage(dayCompletion);
          const height = Math.max(16, Math.min(dayCompletion * 12, 80)); // Progressive height
          const stemHeight = dayCompletion >= 2 ? Math.max(8, height * 0.4) : 0; // Only show stem for sapling+
          const isToday = index === new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

          return (
            <motion.div
              key={index}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
              className={`flex flex-col items-center cursor-pointer hover:scale-110 transition-transform ${
                isToday ? 'ring-2 ring-yellow-400 ring-opacity-50 rounded-lg p-1' : ''
              }`}
              whileHover={{ scale: 1.1 }}
              title={`${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index]} - ${stage.description}`}
            >
              {/* Garden Stage */}
              <div
                className="flex items-end justify-center text-2xl relative"
                style={{ height: `${height}px` }}
              >
                <motion.div
                  animate={{
                    rotate: dayCompletion >= 3 ? [0, 2, -2, 0] : 0,
                    scale: dayCompletion >= 3 ? [1, 1.05, 1] : 1
                  }}
                  transition={{
                    duration: dayCompletion === 5 ? 2 : 3, // Butterfly moves faster
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {stage.emoji}
                </motion.div>

                {/* Special effects for advanced stages */}
                {dayCompletion === 5 && ( // Butterfly sparkles
                  <motion.div
                    className="absolute -top-2 -left-2 text-xs"
                    animate={{
                      x: [0, 8, 0, -8, 0],
                      y: [0, -4, 0, -2, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    ✨
                  </motion.div>
                )}

                {dayCompletion >= 7 && ( // Rainbow sparkles
                  <>
                    <motion.div
                      className="absolute -top-1 -right-1 text-xs"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.2
                      }}
                    >
                      ⭐
                    </motion.div>
                    <motion.div
                      className="absolute -top-1 -left-1 text-xs"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.2 + 0.3
                      }}
                    >
                      ✨
                    </motion.div>
                  </>
                )}
              </div>

              {/* Stem (only for sapling and above) */}
              {stemHeight > 0 && (
                <motion.div
                  className="bg-gradient-to-t from-green-600 to-green-400 rounded-full"
                  style={{
                    width: dayCompletion >= 4 ? '6px' : '4px', // Thicker stem for advanced stages
                    height: `${stemHeight}px`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${stemHeight}px` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                />
              )}

              {/* Ground/Soil - changes color based on richness */}
              <div
                className={`w-8 h-1 rounded-full shadow-sm ${
                  dayCompletion >= 6 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : // Rich golden soil
                  dayCompletion >= 4 ? 'bg-gradient-to-r from-amber-600 to-amber-500' : // Fertile soil
                  dayCompletion >= 2 ? 'bg-gradient-to-r from-amber-700 to-amber-600' : // Regular soil
                  dayCompletion >= 1 ? 'bg-gradient-to-r from-stone-600 to-stone-500' : // Basic soil
                  'bg-gradient-to-r from-gray-400 to-gray-500' // Empty soil
                }`}
              />

              {/* Day Label */}
              <div className={`text-xs mt-2 font-medium ${
                isToday ? 'text-yellow-600 font-bold' : 'text-gray-600'
              }`}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const BrickProgress = ({ weeklyData }) => {
    const sixPillars = [
      { name: 'Circadian', color: '#F59E0B', key: 'circadianRhythm' },
      { name: 'Movement', color: '#10B981', key: 'intentionalMovement' },
      { name: 'Stress', color: '#EF4444', key: 'controlledStress' },
      { name: 'Sleep', color: '#6366F1', key: 'qualitySleep' },
      { name: 'Nutrition', color: '#8B5CF6', key: 'nutrientDenseEating' },
      { name: 'Mindset', color: '#EC4899', key: 'positiveSelfNarrative' }
    ];

    return (
      <div className="space-y-3">
        {sixPillars.map(pillar => (
          <div key={pillar.key} className="flex items-center space-x-3">
            <div className="w-16 text-xs font-medium text-gray-700">
              {pillar.name}
            </div>
            <div className="flex-1 grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }, (_, dayIndex) => {
                // Mock data - in real app, would come from actual logs
                const hasActivity = Math.random() > 0.3;
                const intensity = hasActivity ? Math.random() * 0.8 + 0.2 : 0;
                
                return (
                  <motion.div
                    key={dayIndex}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: dayIndex * 0.05 }}
                    className="h-4 rounded-sm border cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: hasActivity 
                        ? `${pillar.color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}` 
                        : '#F3F4F6',
                      borderColor: hasActivity ? pillar.color : '#E5E7EB'
                    }}
                    title={`${pillar.name} - ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex]}`}
                  />
                );
              })}
            </div>
            <div className="w-8 text-xs text-gray-500 text-center">
              {Math.floor(Math.random() * 7)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Header with Overall Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-800">Weekly Wellness Garden</h3>
        </div>
        
        <button
          onClick={() => setShowDetailedView(!showDetailedView)}
          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>{showDetailedView ? 'Simple View' : 'Detailed View'}</span>
          <SafeIcon icon={showDetailedView ? FiChevronUp : FiChevronDown} className="w-4 h-4" />
        </button>
      </div>

      {/* Flower Garden Progress Overview */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-gradient-to-b from-blue-100 to-green-100 rounded-xl p-6 w-full max-w-md">
          <FlowerGarden weeklyData={progress.weeklyData} />
          <div className="text-center mt-4">
            <div className="text-lg font-bold text-gray-800">Your Wellness Garden</div>
            <div className="text-sm text-gray-600">
              {progress.today}/6 pillars blooming today
            </div>
          </div>
        </div>
      </div>

      {/* Garden Progress Summary */}
      <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-800">
              🌱 Garden Status: {getGardenStatus(progress.todayPercentage)}
            </div>
            <div className="text-xs text-gray-600">
              Weekly growth: {progress.weeklyAverage}/6 pillars blooming daily
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {progress.todayPercentage >= 100 && (
              <div className="flex items-center space-x-1">
                <span className="text-lg">🌈</span>
                <span className="text-xs text-purple-600 font-medium">Rainbow!</span>
              </div>
            )}
            {progress.todayPercentage >= 85 && progress.todayPercentage < 100 && (
              <div className="flex items-center space-x-1">
                <span className="text-lg">🍎</span>
                <span className="text-xs text-red-600 font-medium">Fruitful!</span>
              </div>
            )}
            {progress.todayPercentage >= 70 && progress.todayPercentage < 85 && (
              <div className="flex items-center space-x-1">
                <span className="text-lg">🦋</span>
                <span className="text-xs text-blue-600 font-medium">Butterfly!</span>
              </div>
            )}
            {progress.todayPercentage >= 55 && progress.todayPercentage < 70 && (
              <div className="flex items-center space-x-1">
                <span className="text-lg">🌺</span>
                <span className="text-xs text-purple-600 font-medium">Blooming!</span>
              </div>
            )}
            {progress.todayPercentage >= 40 && progress.todayPercentage < 55 && (
              <div className="flex items-center space-x-1">
                <span className="text-lg">🌸</span>
                <span className="text-xs text-pink-600 font-medium">Flowering</span>
              </div>
            )}
            {progress.todayPercentage >= 25 && progress.todayPercentage < 40 && (
              <div className="flex items-center space-x-1">
                <span className="text-lg">🌱</span>
                <span className="text-xs text-green-600 font-medium">Growing</span>
              </div>
            )}
            {progress.todayPercentage >= 10 && progress.todayPercentage < 25 && (
              <div className="flex items-center space-x-1">
                <span className="text-lg">🌿</span>
                <span className="text-xs text-green-500 font-medium">Sprouting</span>
              </div>
            )}
            {progress.todayPercentage < 10 && (
              <div className="flex items-center space-x-1">
                <span className="text-lg">🌱</span>
                <span className="text-xs text-amber-600 font-medium">Planting</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Detailed Brick View */}
      <AnimatePresence>
        {showDetailedView && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 pt-4">
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-3 ml-20">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Detailed Brick Progress */}
              <BrickProgress weeklyData={progress.weeklyData} />
              
              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Each brick represents daily pillar completion</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                      <span>No activity</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                      <span>Partial</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                      <span>Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeeklyProgressGarden;
