import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiClock, FiEye, FiEyeOff, FiZap, FiSmile } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import SmartFoodLogger from './SmartFoodLogger';

const CircadianClockDial = ({ onLogActivity, todayLogs = {}, sensorData = {} }) => {
  const [selectedActivity, setSelectedActivity] = useState('light');
  const [selectedTime, setSelectedTime] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [dragAngle, setDragAngle] = useState(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState('');
  const clockRef = useRef(null);

  // Auto-update from sensor data
  useEffect(() => {
    checkForAutoUpdates();
  }, [sensorData]);

  const checkForAutoUpdates = () => {
    const now = new Date();
    const currentHour = now.getHours();

    // Check for automatic achievements
    const achievements = [];

    // Movement detection (from accelerometer)
    if (sensorData.movement?.steps > 0 && currentHour >= 6 && currentHour <= 10) {
      achievements.push({
        type: 'movement',
        message: `🚶‍♀️ Great! ${sensorData.movement.steps} steps detected during optimal morning hours!`,
        activity: 'light' // Morning movement often includes light exposure
      });
    }

    // Sleep quality detection
    if (sensorData.sleep?.quality > 75) {
      achievements.push({
        type: 'sleep',
        message: `😴 Excellent sleep quality detected: ${sensorData.sleep.quality}%! Your circadian rhythm is on track.`,
        activity: 'sleep'
      });
    }

    // Heart rate variability (stress resilience)
    if (sensorData.hrv?.value > 40) {
      achievements.push({
        type: 'hrv',
        message: `❤️ Outstanding HRV: ${sensorData.hrv.value}ms! Your stress resilience is excellent.`,
        activity: 'blueLight' // Good HRV often correlates with good screen habits
      });
    }

    // Auto-log activities based on sensor data
    if (achievements.length > 0) {
      const latestAchievement = achievements[0];
      showCongratulationsMessage(latestAchievement.message);

      // Auto-log the activity
      if (latestAchievement.activity && onLogActivity) {
        setTimeout(() => {
          onLogActivity(latestAchievement.activity, {
            hour: currentHour,
            minute: now.getMinutes(),
            autoDetected: true,
            sensorData: sensorData
          });
        }, 1000);
      }
    }
  };

  const showCongratulationsMessage = (message) => {
    setCongratsMessage(message);
    setShowCongratulations(true);
    setTimeout(() => setShowCongratulations(false), 5000);
  };

  const activities = {
    light: {
      name: 'Morning Light',
      icon: FiSun,
      color: '#F59E0B',
      timeRange: [6, 10],
      description: 'Log sunlight exposure',
      challenges: [
        { name: '10-Minute Sun Gaze', description: 'Face east and get 10 minutes of direct morning sunlight' },
        { name: 'Golden Hour Walk', description: 'Take a 15-minute walk during sunrise or sunset' },
        { name: 'Light Therapy', description: 'Use bright light (10,000 lux) for 20-30 minutes if no sun' },
        { name: 'Window Workspace', description: 'Work near a window for natural light exposure' }
      ]
    },
    meals: {
      name: 'Meal Timing',
      icon: FiClock,
      color: '#10B981',
      timeRange: [8, 20],
      description: 'Track eating windows',
      challenges: [
        { name: '12-Hour Fast', description: 'Maintain 12-hour eating window (e.g., 8 AM - 8 PM)' },
        { name: 'Protein First', description: 'Start each meal with 20-30g of protein' },
        { name: 'Rainbow Plate', description: 'Include 5 different colored foods in one meal' },
        { name: 'Mindful Eating', description: 'Eat one meal without distractions (no phone/TV)' }
      ]
    },
    blueLight: {
      name: 'Blue Light Avoidance',
      icon: FiEyeOff,
      color: '#8B5CF6',
      timeRange: [19, 23],
      description: 'Screen-free time',
      challenges: [
        { name: 'Digital Sunset', description: 'No screens 2 hours before bedtime' },
        { name: 'Blue Light Glasses', description: 'Wear blue light blocking glasses after 7 PM' },
        { name: 'Analog Evening', description: 'Replace screen time with reading or journaling' },
        { name: 'Phone Bedroom Ban', description: 'Keep phone out of bedroom overnight' }
      ]
    },
    sleep: {
      name: 'Sleep Schedule',
      icon: FiMoon,
      color: '#6366F1',
      timeRange: [22, 6],
      description: 'Bedtime & wake time',
      challenges: [
        { name: 'Consistent Schedule', description: 'Same bedtime and wake time for 7 days straight' },
        { name: 'Cool Cave', description: 'Sleep in 65-68°F (18-20°C) temperature' },
        { name: 'Dark Sanctuary', description: 'Complete darkness - blackout curtains or eye mask' },
        { name: '4-7-8 Breathing', description: 'Practice 4-7-8 breathing technique before sleep' }
      ]
    }
  };

  // Convert 24-hour time to angle (12 o'clock = 0°)
  const timeToAngle = (hour, minute = 0) => {
    // 24-hour clock: each hour is 15 degrees (360/24)
    return ((hour % 24) + minute / 60) * 15 - 90;
  };

  // Convert angle to 24-hour time
  const angleToTime = (angle) => {
    const normalizedAngle = (angle + 90 + 360) % 360;
    const hour = Math.floor(normalizedAngle / 15);
    const minute = Math.round((normalizedAngle % 15) * 4);
    return {
      hour: hour === 0 ? 24 : hour,
      minute: minute >= 60 ? 0 : minute
    };
  };

  // Handle clock interaction
  const handleClockClick = (event) => {
    if (!clockRef.current) return;

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = event.clientX - centerX;
    const y = event.clientY - centerY;

    const angle = Math.atan2(y, x) * (180 / Math.PI);
    const time = angleToTime(angle);

    setSelectedTime(time);
    setShowLogModal(true);
  };

  // Generate 24-hour markers (show every 2 hours for clarity)
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const hour = i * 2; // 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22
    const angle = timeToAngle(hour);
    return { hour, angle };
  });

  // Get activity zones for current selected activity
  const getActivityZone = (activity) => {
    const [startHour, endHour] = activities[activity].timeRange;
    const startAngle = timeToAngle(startHour);
    const endAngle = timeToAngle(endHour);

    return {
      startAngle,
      endAngle,
      color: activities[activity].color
    };
  };

  // Create SVG arc path
  const createArcPath = (startAngle, endAngle, radius = 100) => {
    const start = {
      x: 120 + Math.cos((startAngle * Math.PI) / 180) * radius,
      y: 120 + Math.sin((startAngle * Math.PI) / 180) * radius
    };
    const end = {
      x: 120 + Math.cos((endAngle * Math.PI) / 180) * radius,
      y: 120 + Math.sin((endAngle * Math.PI) / 180) * radius
    };

    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

    return `M 120 120 L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
  };

  // Create day/night gradient zones
  const createDayNightGradients = () => {
    return (
      <defs>
        {/* Sunrise gradient (5-7 AM) */}
        <radialGradient id="sunriseGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FCD34D" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
        </radialGradient>

        {/* Daylight gradient (7 AM - 6 PM) */}
        <radialGradient id="daylightGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FEF08A" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#EAB308" stopOpacity="0.5" />
        </radialGradient>

        {/* Sunset gradient (6-8 PM) */}
        <radialGradient id="sunsetGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FB923C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0.4" />
        </radialGradient>

        {/* Night gradient (8 PM - 5 AM) */}
        <radialGradient id="nightGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#312E81" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.5" />
        </radialGradient>

        {/* Clock boundary clip path */}
        <clipPath id="clockClip">
          <circle cx="120" cy="120" r="110" />
        </clipPath>
      </defs>
    );
  };

  // Get time-based background zones (24-hour format)
  const getTimeZones = () => {
    return [
      // Night (0-6 hours)
      { startHour: 0, endHour: 6, gradient: 'nightGradient', name: 'night' },
      // Sunrise (6-8 hours)
      { startHour: 6, endHour: 8, gradient: 'sunriseGradient', name: 'sunrise' },
      // Daylight (8-18 hours)
      { startHour: 8, endHour: 18, gradient: 'daylightGradient', name: 'daylight' },
      // Sunset (18-20 hours)
      { startHour: 18, endHour: 20, gradient: 'sunsetGradient', name: 'sunset' },
      // Night (20-24 hours)
      { startHour: 20, endHour: 24, gradient: 'nightGradient', name: 'night' }
    ];
  };

  // Get time-appropriate nudges
  const getCurrentTimeNudges = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const nudges = [];

    // Sensor-based achievements (priority nudges)
    if (sensorData.movement?.steps > 0 && currentHour >= 6 && currentHour < 10) {
      nudges.push({
        id: 'movement-detected',
        activity: 'light',
        title: `🎉 ${sensorData.movement.steps} steps detected!`,
        description: 'Great morning activity! This movement likely included beneficial light exposure.',
        urgency: 'achievement',
        icon: FiActivity,
        type: 'achievement'
      });
    }

    if (sensorData.sleep?.quality > 75) {
      nudges.push({
        id: 'sleep-achievement',
        activity: 'sleep',
        title: `🏆 Excellent sleep quality: ${sensorData.sleep.quality}%!`,
        description: 'Your circadian rhythm optimization is working perfectly.',
        urgency: 'achievement',
        icon: FiMoon,
        type: 'achievement'
      });
    }

    if (sensorData.hrv?.value > 40) {
      nudges.push({
        id: 'hrv-achievement',
        activity: 'blueLight',
        title: `💪 Outstanding HRV: ${sensorData.hrv.value}ms!`,
        description: 'Your stress resilience and recovery are excellent.',
        urgency: 'achievement',
        icon: FiZap,
        type: 'achievement'
      });
    }

    // Morning light exposure (6-10 AM)
    if (currentHour >= 6 && currentHour < 10 && !sensorData.movement?.steps) {
      nudges.push({
        id: 'morning-light',
        activity: 'light',
        title: '🌅 Perfect time for morning sunlight!',
        description: 'Get 10-20 minutes of natural light to optimize your circadian rhythm',
        urgency: currentHour <= 8 ? 'high' : 'medium',
        icon: FiSun
      });
    }

    // Smart meal timing reminders
    if (currentHour === 8 && currentMinute < 30) {
      nudges.push({
        id: 'breakfast-time',
        activity: 'meals',
        title: '🍳 Optimal breakfast window',
        description: 'Break your overnight fast with brain-boosting nutrients',
        urgency: 'medium',
        icon: FiClock,
        smartFood: true,
        mealContext: 'breakfast'
      });
    }

    if (currentHour === 12 && currentMinute < 30) {
      nudges.push({
        id: 'lunch-time',
        activity: 'meals',
        title: '🥗 Peak metabolism window',
        description: 'Your largest meal when your body can best process nutrients',
        urgency: 'medium',
        icon: FiClock,
        smartFood: true,
        mealContext: 'lunch'
      });
    }

    if (currentHour >= 18 && currentHour < 20) {
      nudges.push({
        id: 'dinner-window',
        activity: 'meals',
        title: '🍽️ Evening nourishment',
        description: 'Light, sleep-supporting foods for optimal recovery',
        urgency: 'medium',
        icon: FiClock,
        smartFood: true,
        mealContext: 'dinner'
      });
    }

    // Blue light avoidance (evening)
    if (currentHour >= 19 && currentHour < 23) {
      nudges.push({
        id: 'blue-light-avoid',
        activity: 'blueLight',
        title: '📱 Time to reduce screen exposure',
        description: 'Switch to night mode or take a screen break',
        urgency: currentHour >= 21 ? 'high' : 'medium',
        icon: FiEyeOff
      });
    }

    // Sleep preparation
    if (currentHour >= 21 && currentHour < 24) {
      nudges.push({
        id: 'sleep-prep',
        activity: 'sleep',
        title: '🌙 Wind down for better sleep',
        description: 'Start your bedtime routine for optimal recovery',
        urgency: currentHour >= 22 ? 'high' : 'medium',
        icon: FiMoon
      });
    }

    // Late night warning
    if (currentHour >= 0 && currentHour < 6) {
      nudges.push({
        id: 'late-night',
        activity: 'sleep',
        title: '😴 Late night detected',
        description: 'Consider getting rest for better tomorrow',
        urgency: 'high',
        icon: FiMoon
      });
    }

    return nudges;
  };

  // Render activity logs on clock
  const renderActivityLogs = () => {
    return Object.entries(todayLogs).map(([activityType, logs]) => {
      if (!logs || logs.length === 0) return null;

      return logs.map((log, index) => {
        const angle = timeToAngle(log.hour, log.minute);
        const activity = activities[activityType];
        const isAutoDetected = log.autoDetected;
        const hasNutrientData = log.nutrientScore !== undefined;
        const isHighNutrient = hasNutrientData && log.nutrientScore >= 70;

        return (
          <g key={`${activityType}-${index}`}>
            {/* Main activity dot */}
            <motion.circle
              cx={120 + Math.cos((angle * Math.PI) / 180) * 90}
              cy={120 + Math.sin((angle * Math.PI) / 180) * 90}
              r={isAutoDetected ? "8" : hasNutrientData ? "7" : "6"}
              fill={activity.color}
              stroke={isAutoDetected ? "#10B981" : isHighNutrient ? "#F59E0B" : "none"}
              strokeWidth={isAutoDetected || isHighNutrient ? "2" : "0"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />

            {/* Auto-detection indicator */}
            {isAutoDetected && (
              <motion.circle
                cx={120 + Math.cos((angle * Math.PI) / 180) * 90}
                cy={120 + Math.sin((angle * Math.PI) / 180) * 90}
                r="12"
                fill="none"
                stroke="#10B981"
                strokeWidth="1"
                strokeDasharray="2,2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.7 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              />
            )}

            {/* Nutrient quality indicator for meals */}
            {hasNutrientData && activityType === 'meals' && (
              <motion.circle
                cx={120 + Math.cos((angle * Math.PI) / 180) * 90}
                cy={120 + Math.sin((angle * Math.PI) / 180) * 90}
                r="10"
                fill="none"
                stroke={isHighNutrient ? "#F59E0B" : "#6B7280"}
                strokeWidth="1"
                strokeDasharray={isHighNutrient ? "1,1" : "2,2"}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              />
            )}

            {/* Sensor data indicator */}
            {isAutoDetected && (
              <motion.text
                x={120 + Math.cos((angle * Math.PI) / 180) * 90}
                y={120 + Math.sin((angle * Math.PI) / 180) * 90 - 15}
                textAnchor="middle"
                className="text-xs font-bold fill-green-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                📱
              </motion.text>
            )}

            {/* Nutrient score indicator for high-quality meals */}
            {isHighNutrient && activityType === 'meals' && (
              <motion.text
                x={120 + Math.cos((angle * Math.PI) / 180) * 90}
                y={120 + Math.sin((angle * Math.PI) / 180) * 90 - 15}
                textAnchor="middle"
                className="text-xs font-bold fill-yellow-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                🌟
              </motion.text>
            )}
          </g>
        );
      });
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Circadian Clock</h3>
        <p className="text-sm text-gray-600">Tap the clock to log activities at specific times</p>
      </div>

      {/* Activity Selector */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {Object.entries(activities).map(([key, activity]) => (
          <button
            key={key}
            onClick={() => setSelectedActivity(key)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedActivity === key
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <SafeIcon 
                icon={activity.icon} 
                className="w-4 h-4"
                style={{ color: activity.color }}
              />
              <span className="text-sm font-medium">{activity.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Clock Dial */}
      <div className="relative mx-auto w-64 h-64">
        <svg
          ref={clockRef}
          width="240"
          height="240"
          viewBox="0 0 240 240"
          className="cursor-pointer"
          onClick={handleClockClick}
        >
          {/* Gradients */}
          {createDayNightGradients()}

          {/* Clock Face Base */}
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="white"
            stroke="#E5E7EB"
            strokeWidth="2"
          />

          {/* Day/Night Background Zones */}
          {getTimeZones().map((zone, index) => {
            const startAngle = timeToAngle(zone.startHour);
            const endAngle = timeToAngle(zone.endHour);

            return (
              <motion.path
                key={`${zone.name}-${index}`}
                d={createArcPath(startAngle, endAngle, 108)}
                fill={`url(#${zone.gradient})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                clipPath="url(#clockClip)"
              />
            );
          })}

          {/* Activity Zone */}
          {selectedActivity && (
            <motion.path
              d={createArcPath(
                getActivityZone(selectedActivity).startAngle,
                getActivityZone(selectedActivity).endAngle
              )}
              fill={getActivityZone(selectedActivity).color}
              fillOpacity="0.2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}

          {/* 24-Hour Markers */}
          {hourMarkers.map(({ hour, angle }) => {
            // Determine if this is night time (20-6) or day time (6-20)
            const isNightTime = hour >= 20 || hour <= 6;
            const textColor = isNightTime ? "#F3F4F6" : "#374151";
            const strokeColor = isNightTime ? "#F9FAFB" : "#6B7280";

            return (
              <g key={hour}>
                {/* Hour marker line */}
                <line
                  x1={120 + Math.cos((angle * Math.PI) / 180) * 95}
                  y1={120 + Math.sin((angle * Math.PI) / 180) * 95}
                  x2={120 + Math.cos((angle * Math.PI) / 180) * 105}
                  y2={120 + Math.sin((angle * Math.PI) / 180) * 105}
                  stroke={strokeColor}
                  strokeWidth="2"
                />

                {/* Hour number with background for visibility */}
                <circle
                  cx={120 + Math.cos((angle * Math.PI) / 180) * 80}
                  cy={120 + Math.sin((angle * Math.PI) / 180) * 80}
                  r="10"
                  fill={isNightTime ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)"}
                  stroke={strokeColor}
                  strokeWidth="1"
                />

                <text
                  x={120 + Math.cos((angle * Math.PI) / 180) * 80}
                  y={120 + Math.sin((angle * Math.PI) / 180) * 80}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold"
                  fill={textColor}
                >
                  {hour.toString().padStart(2, '0')}
                </text>
              </g>
            );
          })}

          {/* Activity Logs */}
          {renderActivityLogs()}

          {/* Sun and Moon Icons */}
          {/* Sun icon at 12:00 (noon) */}
          <g transform={`translate(${120 + Math.cos((timeToAngle(12) * Math.PI) / 180) * 60}, ${120 + Math.sin((timeToAngle(12) * Math.PI) / 180) * 60})`}>
            <circle cx="0" cy="0" r="5" fill="#FCD34D" />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <line
                key={angle}
                x1={Math.cos((angle * Math.PI) / 180) * 6}
                y1={Math.sin((angle * Math.PI) / 180) * 6}
                x2={Math.cos((angle * Math.PI) / 180) * 9}
                y2={Math.sin((angle * Math.PI) / 180) * 9}
                stroke="#F59E0B"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Moon icon at 00:00 (midnight) */}
          <g transform={`translate(${120 + Math.cos((timeToAngle(0) * Math.PI) / 180) * 60}, ${120 + Math.sin((timeToAngle(0) * Math.PI) / 180) * 60})`}>
            <circle cx="0" cy="0" r="5" fill="#E5E7EB" />
            <circle cx="2" cy="-1" r="3" fill="#1F2937" />
            {/* Stars */}
            <circle cx="-6" cy="-4" r="0.5" fill="#F3F4F6" />
            <circle cx="5" cy="-3" r="0.5" fill="#F3F4F6" />
            <circle cx="-4" cy="5" r="0.5" fill="#F3F4F6" />
          </g>

          {/* Current Time Hands */}
          {(() => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const hourAngle = timeToAngle(currentHour, currentMinute);
            const minuteAngle = (currentMinute * 6) - 90; // 6 degrees per minute

            return (
              <g>
                {/* Hour hand */}
                <line
                  x1="120"
                  y1="120"
                  x2={120 + Math.cos((hourAngle * Math.PI) / 180) * 60}
                  y2={120 + Math.sin((hourAngle * Math.PI) / 180) * 60}
                  stroke="#EF4444"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Minute hand */}
                <line
                  x1="120"
                  y1="120"
                  x2={120 + Math.cos((minuteAngle * Math.PI) / 180) * 85}
                  y2={120 + Math.sin((minuteAngle * Math.PI) / 180) * 85}
                  stroke="#DC2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Minute markers (every 15 minutes) */}
                {[0, 15, 30, 45].map(minute => {
                  const angle = (minute * 6) - 90;
                  return (
                    <line
                      key={minute}
                      x1={120 + Math.cos((angle * Math.PI) / 180) * 100}
                      y1={120 + Math.sin((angle * Math.PI) / 180) * 100}
                      x2={120 + Math.cos((angle * Math.PI) / 180) * 107}
                      y2={120 + Math.sin((angle * Math.PI) / 180) * 107}
                      stroke="#6B7280"
                      strokeWidth="1"
                    />
                  );
                })}
              </g>
            );
          })()}

          {/* Center Dot */}
          <circle cx="120" cy="120" r="4" fill="#374151" />
        </svg>


      </div>

      {/* Time-Appropriate Nudges */}
      {(() => {
        const currentNudges = getCurrentTimeNudges();

        if (currentNudges.length === 0) return null;

        return (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center space-x-2">
              <SafeIcon icon={FiZap} className="w-4 h-4 text-blue-500" />
              <span>Right Now</span>
            </h4>

            {currentNudges.map((nudge) => (
              <motion.div
                key={nudge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-l-4 ${
                  nudge.urgency === 'achievement'
                    ? 'bg-green-50 border-green-400'
                    : nudge.urgency === 'high'
                    ? 'bg-red-50 border-red-400'
                    : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <SafeIcon
                        icon={nudge.icon}
                        className={`w-4 h-4 ${
                          nudge.urgency === 'achievement'
                            ? 'text-green-600'
                            : nudge.urgency === 'high'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`}
                      />
                      <h5 className="font-medium text-gray-800">{nudge.title}</h5>
                      {nudge.urgency === 'achievement' && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          🎉 Achievement
                        </span>
                      )}
                      {nudge.urgency === 'high' && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{nudge.description}</p>
                  </div>
                </div>

                {nudge.type === 'achievement' ? (
                  <div className="bg-green-100 p-3 rounded-lg text-center">
                    <p className="text-sm text-green-700 font-medium">
                      🎉 Automatically logged from sensor data!
                    </p>
                  </div>
                ) : nudge.smartFood ? (
                  <SmartFoodLogger
                    onLogMeal={(mealData) => {
                      onLogActivity('meals', {
                        hour: mealData.time.hour,
                        minute: mealData.time.minute,
                        foods: mealData.foods,
                        nutrientScore: mealData.nutrientScore,
                        mealType: mealData.mealType,
                        circadianOptimal: mealData.circadianOptimal
                      });
                    }}
                    currentTime={{
                      hour: new Date().getHours(),
                      minute: new Date().getMinutes()
                    }}
                    recentMeals={todayLogs.meals || []}
                  />
                ) : (
                  <button
                    onClick={() => {
                      const now = new Date();
                      const currentTime = {
                        hour: now.getHours(),
                        minute: now.getMinutes()
                      };
                      onLogActivity(nudge.activity, currentTime);
                    }}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      nudge.urgency === 'high'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Log {activities[nudge.activity].name} Now
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        );
      })()}

      {/* Activity Legend */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800">
            {activities[selectedActivity].name}
          </h4>
          <div className="flex items-center space-x-1 text-xs">
            <SafeIcon
              icon={(() => {
                const hour = new Date().getHours();
                return hour >= 6 && hour < 20 ? FiSun : FiMoon;
              })()}
              className="w-3 h-3 text-gray-500"
            />
            <span className="text-gray-500">
              {(() => {
                const hour = new Date().getHours();
                return hour >= 6 && hour < 20 ? 'Daylight' : 'Nighttime';
              })()}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          {activities[selectedActivity].description}
        </p>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">
            Optimal: {activities[selectedActivity].timeRange[0]}:00 - {activities[selectedActivity].timeRange[1]}:00
          </span>
          <span className={`px-2 py-1 rounded-full font-medium ${
            (() => {
              const hour = new Date().getHours();
              const [start, end] = activities[selectedActivity].timeRange;
              const isOptimalTime = hour >= start && hour <= end;
              return isOptimalTime
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600';
            })()
          }`}>
            {(() => {
              const hour = new Date().getHours();
              const [start, end] = activities[selectedActivity].timeRange;
              const isOptimalTime = hour >= start && hour <= end;
              return isOptimalTime ? 'Optimal Now' : 'Not Optimal';
            })()}
          </span>
        </div>
      </div>

      {/* Log Modal */}
      <AnimatePresence>
        {showLogModal && selectedTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowLogModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 m-4 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <SafeIcon 
                  icon={activities[selectedActivity].icon}
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: activities[selectedActivity].color }}
                />
                <h3 className="font-bold text-gray-800">
                  Log {activities[selectedActivity].name}
                </h3>
                <p className="text-sm text-gray-600">
                  Time: {selectedTime.hour}:{selectedTime.minute.toString().padStart(2, '0')}
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    onLogActivity(selectedActivity, selectedTime);
                    setShowLogModal(false);
                  }}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Log Activity
                </button>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Congratulations Modal */}
      <AnimatePresence>
        {showCongratulations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowCongratulations(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 m-4 max-w-sm w-full border-4 border-green-400"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Achievement Unlocked!
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {congratsMessage}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowCongratulations(false)}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    Awesome! 🚀
                  </button>

                  <p className="text-xs text-gray-500">
                    Keep up the great work with your circadian optimization!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CircadianClockDial;
