import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiActivity, FiMoon, FiTrendingUp, FiInfo, FiBookOpen } from 'react-icons/fi';

const SafeIcon = ({ icon: Icon, ...props }) => {
  if (!Icon) return <div {...props} />;
  return <Icon {...props} />;
};

const HealthMetricInfo = ({ metric, onMarkAsRead }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const metricInfo = {
    heart_rate: {
      title: "Heart Rate",
      icon: FiHeart,
      color: "red",
      description: "Your heart rate is the number of times your heart beats per minute (BPM).",
      importance: "Resting heart rate is a key indicator of cardiovascular fitness and overall health. A lower resting heart rate often indicates better cardiovascular fitness.",
      overview: {
        what: "Heart rate measures how many times your heart beats in one minute. Your resting heart rate is measured when you're calm and relaxed.",
        why: "It's one of the most important vital signs. Changes in your resting heart rate can indicate improvements in fitness, stress levels, illness, or other health changes.",
        when: "Best measured first thing in the morning, before getting out of bed, when you're most relaxed."
      },
      ranges: {
        excellent: { range: "50-60 BPM", description: "Athletic level fitness" },
        good: { range: "61-70 BPM", description: "Above average fitness" },
        average: { range: "71-80 BPM", description: "Average fitness level" },
        belowAverage: { range: "81-100 BPM", description: "Below average, consider improving fitness" }
      },
      tips: [
        "Measure first thing in the morning for most accurate resting HR",
        "Regular cardio exercise can lower your resting heart rate over time",
        "Stress, caffeine, and illness can temporarily elevate heart rate",
        "Track trends over weeks/months rather than daily fluctuations",
        "Consult a doctor if your resting HR is consistently above 100 BPM"
      ],
      factors: [
        "Age (heart rate generally increases with age)",
        "Fitness level (fitter people have lower resting rates)",
        "Medications (some can affect heart rate)",
        "Temperature (heat can increase heart rate)",
        "Emotions and stress levels"
      ]
    },
    hrv: {
      title: "Heart Rate Variability (HRV)",
      icon: FiTrendingUp,
      color: "blue",
      description: "HRV measures the variation in time between heartbeats, indicating how well your autonomic nervous system is functioning.",
      importance: "Higher HRV typically indicates better recovery, stress resilience, and overall health. It's considered one of the best markers of autonomic nervous system health.",
      overview: {
        what: "HRV measures the tiny variations in time between each heartbeat. A healthy heart doesn't beat like a metronome - there should be natural variation.",
        why: "It reflects your body's ability to adapt to stress and recover. Higher HRV generally means better stress resilience and recovery capacity.",
        when: "Best measured in the morning, in a consistent position (sitting or lying down), for 1-5 minutes."
      },
      ranges: {
        excellent: { range: "40+ ms", description: "Excellent recovery and stress resilience" },
        good: { range: "30-40 ms", description: "Good autonomic function" },
        average: { range: "20-30 ms", description: "Average autonomic function" },
        belowAverage: { range: "Below 20 ms", description: "May indicate stress or poor recovery" }
      },
      tips: [
        "HRV is highly individual - track your personal trends over time",
        "Stress, poor sleep, and overtraining can lower HRV",
        "Meditation, good sleep, and proper recovery can improve HRV",
        "Don't compare your HRV to others - focus on your own patterns",
        "Consider lifestyle factors when interpreting HRV changes"
      ],
      factors: [
        "Sleep quality and duration",
        "Stress levels (physical and mental)",
        "Training load and recovery",
        "Alcohol consumption",
        "Hydration status"
      ]
    },
    steps: {
      title: "Daily Steps",
      icon: FiActivity,
      color: "emerald",
      description: "The total number of steps you take throughout the day, measured by your phone or wearable device.",
      importance: "Step count is a simple but effective measure of daily activity. Regular walking has numerous health benefits including improved cardiovascular health, weight management, and mental wellbeing.",
      overview: {
        what: "Daily steps count every step you take during the day, from walking around your home to dedicated exercise walks.",
        why: "It's an easy way to track your daily movement and ensure you're getting enough physical activity for good health.",
        when: "Tracked continuously throughout the day. Most accurate when carrying your phone or wearing a fitness tracker."
      },
      ranges: {
        excellent: { range: "12,000+ steps", description: "Very active lifestyle" },
        good: { range: "10,000-12,000 steps", description: "Active lifestyle, meeting health guidelines" },
        average: { range: "7,000-10,000 steps", description: "Moderately active" },
        belowAverage: { range: "Below 7,000 steps", description: "Sedentary, consider increasing activity" }
      },
      tips: [
        "Aim for at least 10,000 steps per day for general health",
        "Take stairs instead of elevators when possible",
        "Park farther away or get off transit one stop early",
        "Take walking meetings or phone calls",
        "Set hourly reminders to get up and move"
      ],
      factors: [
        "Job type (desk job vs. active work)",
        "Transportation method (walking vs. driving)",
        "Weather conditions",
        "Available time for exercise",
        "Physical limitations or injuries"
      ]
    },
    sleep: {
      title: "Sleep Quality & Duration",
      icon: FiMoon,
      color: "purple",
      description: "The amount and quality of sleep you get each night, crucial for physical and mental recovery.",
      importance: "Quality sleep is essential for physical recovery, mental health, immune function, and overall wellbeing. Poor sleep affects every aspect of health.",
      overview: {
        what: "Sleep duration is the total time spent sleeping, while sleep quality reflects how restful and restorative your sleep was.",
        why: "Sleep is when your body repairs itself, consolidates memories, and prepares for the next day. Both duration and quality matter.",
        when: "Typically measured from bedtime to wake time, with quality assessed based on how rested you feel."
      },
      ranges: {
        excellent: { range: "7-9 hours, high quality", description: "Optimal sleep for most adults" },
        good: { range: "6.5-7 hours, good quality", description: "Adequate sleep for some people" },
        average: { range: "6-6.5 hours, fair quality", description: "Below optimal, may affect performance" },
        belowAverage: { range: "Less than 6 hours, poor quality", description: "Insufficient sleep, health risks" }
      },
      tips: [
        "Maintain a consistent sleep schedule, even on weekends",
        "Create a relaxing bedtime routine",
        "Keep your bedroom cool, dark, and quiet",
        "Avoid screens for 1 hour before bedtime",
        "Limit caffeine after 2 PM and alcohol before bed"
      ],
      factors: [
        "Stress and anxiety levels",
        "Caffeine and alcohol consumption",
        "Screen time before bed",
        "Room temperature and environment",
        "Exercise timing and intensity"
      ]
    }
  };

  const info = metricInfo[metric];
  if (!info) return null;

  const colorClasses = {
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "text-red-500",
      button: "bg-red-500 hover:bg-red-600"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "text-blue-500",
      button: "bg-blue-500 hover:bg-blue-600"
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-800",
      icon: "text-emerald-500",
      button: "bg-emerald-500 hover:bg-emerald-600"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-800",
      icon: "text-purple-500",
      button: "bg-purple-500 hover:bg-purple-600"
    }
  };

  const colors = colorClasses[info.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className={`${colors.bg} ${colors.border} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SafeIcon icon={info.icon} className={`w-6 h-6 ${colors.icon} mr-3`} />
            <h2 className={`text-xl font-semibold ${colors.text}`}>{info.title}</h2>
          </div>
          <SafeIcon icon={FiBookOpen} className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <p className={`${colors.text} mt-2 text-sm`}>{info.description}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'ranges', label: 'Normal Ranges' },
            { id: 'tips', label: 'Tips' },
            { id: 'factors', label: 'Factors' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? `border-${info.color}-500 text-${info.color}-600`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">What is it?</h3>
              <p className="text-gray-600">{info.overview.what}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Why it matters</h3>
              <p className="text-gray-600">{info.overview.why}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">When to measure</h3>
              <p className="text-gray-600">{info.overview.when}</p>
            </div>

            <div className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
              <div className="flex items-start">
                <SafeIcon icon={FiInfo} className={`w-5 h-5 ${colors.icon} mr-3 mt-0.5`} />
                <div>
                  <h4 className={`font-semibold ${colors.text} mb-1`}>Why this matters for your health</h4>
                  <p className={`${colors.text} text-sm`}>{info.importance}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ranges' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Normal Ranges & What They Mean</h3>
            <div className="grid gap-4">
              {Object.entries(info.ranges).map(([level, data]) => (
                <div key={level} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 capitalize">
                      {level.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className={`font-semibold ${colors.text}`}>{data.range}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{data.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> These ranges are general guidelines. Individual variations are normal, 
                and you should focus on your personal trends over time rather than comparing to others.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Tips for Improvement</h3>
            <div className="space-y-3">
              {info.tips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <span className={`${colors.icon} mr-3 mt-1`}>•</span>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'factors' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Factors That Affect {info.title}</h3>
            <div className="space-y-3">
              {info.factors.map((factor, index) => (
                <div key={index} className="flex items-start">
                  <span className={`${colors.icon} mr-3 mt-1`}>•</span>
                  <p className="text-gray-700">{factor}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Remember</h4>
              <p className="text-gray-600 text-sm">
                Many factors can influence your {info.title.toLowerCase()}. Focus on the factors you can control, 
                and don't worry too much about day-to-day variations. Look for patterns over weeks and months instead.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      {onMarkAsRead && (
        <div className="px-6 pb-6">
          <button
            onClick={() => onMarkAsRead(metric)}
            className={`w-full ${colors.button} text-white py-3 rounded-lg font-medium transition-colors`}
          >
            Mark as Read
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default HealthMetricInfo;
