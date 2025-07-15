import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSmartphone, FiDownload, FiUpload, FiShield, FiExternalLink } from 'react-icons/fi';

const SafeIcon = ({ icon: Icon, ...props }) => {
  if (!Icon) return <div {...props} />;
  return <Icon {...props} />;
};

const ImportGuide = () => {
  const [selectedApp, setSelectedApp] = useState('apple_health');

  const importGuides = {
    apple_health: {
      title: "Apple Health",
      icon: "🍎",
      platform: "iOS",
      steps: [
        "Open the Health app on your iPhone",
        "Tap your profile picture in the top right corner",
        "Scroll down and tap 'Export All Health Data'",
        "Choose 'Export' and save the file to your device",
        "Open the exported file and look for these key metrics:",
        "• Heart Rate: Look for 'HKQuantityTypeIdentifierHeartRate'",
        "• HRV: Look for 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN'",
        "• Steps: Look for 'HKQuantityTypeIdentifierStepCount'",
        "• Sleep: Look for 'HKCategoryTypeIdentifierSleepAnalysis'",
        "Use the daily averages to manually enter your data into Vita"
      ],
      tips: [
        "Export data weekly to get the most recent information",
        "The export file is in XML format - you can open it in any text editor",
        "Look for 'value' attributes to find your actual health metrics",
        "Focus on recent data (last 7-30 days) for manual entry"
      ]
    },
    google_fit: {
      title: "Google Fit",
      icon: "🏃‍♂️",
      platform: "Android/Web",
      steps: [
        "Open Google Fit app or visit fit.google.com",
        "Tap the menu (three lines) and go to 'Settings'",
        "Select 'Export data' or 'Download your data'",
        "Choose 'Google Fit' and click 'Next step'",
        "Select your preferred file format (JSON recommended)",
        "Download the archive when ready",
        "Extract the files and look for:",
        "• Heart rate data in 'heart_rate.json'",
        "• Step data in 'activities.json'",
        "• Sleep data in 'sleep.json'",
        "Use the daily summaries for manual entry"
      ],
      tips: [
        "JSON files are easier to read than CSV for health data",
        "Look for 'fpVal' (floating point values) for metrics like heart rate",
        "Step data is usually in 'intVal' (integer values)",
        "Check timestamps to ensure you're using recent data"
      ]
    },
    samsung_health: {
      title: "Samsung Health",
      icon: "📱",
      platform: "Android",
      steps: [
        "Open Samsung Health app on your device",
        "Tap the menu (three lines) in the bottom right",
        "Go to 'Settings' > 'Download personal data'",
        "Tap 'Request data download'",
        "Enter your Samsung account password",
        "Wait for the email with download link (can take up to 30 days)",
        "Download and extract the ZIP file",
        "Look for CSV files containing:",
        "• Heart rate data",
        "• Step count data",
        "• Sleep data",
        "Use spreadsheet software to view and extract daily values"
      ],
      tips: [
        "Data export can take several days to process",
        "CSV files can be opened in Excel or Google Sheets",
        "Focus on the most recent 30 days of data",
        "Look for daily summary rows rather than minute-by-minute data"
      ]
    },
    fitbit: {
      title: "Fitbit",
      icon: "⌚",
      platform: "Cross-platform",
      steps: [
        "Log into your Fitbit account at fitbit.com",
        "Go to 'Data Export' in your account settings",
        "Select the date range you want to export",
        "Choose the data types you need:",
        "• Heart Rate",
        "• Sleep",
        "• Activities",
        "Request the export and wait for the email",
        "Download the ZIP file when ready",
        "Extract and open the CSV files",
        "Use daily summary data for manual entry"
      ],
      tips: [
        "Fitbit provides clean, daily summary data",
        "Heart rate data includes resting HR which is most useful",
        "Sleep data includes duration and efficiency scores",
        "Activity data shows steps and active minutes"
      ]
    }
  };

  const currentGuide = importGuides[selectedApp];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiDownload} className="w-6 h-6 text-emerald-500 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">Import Your Existing Health Data</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Already tracking health data with another app? Here's how to get your existing data into Vita Health App. 
          We'll guide you through exporting your data and manually entering the key metrics.
        </p>

        {/* Privacy Notice */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <SafeIcon icon={FiShield} className="w-5 h-5 text-emerald-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-800 mb-1">Privacy First Approach</h4>
              <p className="text-emerald-700 text-sm">
                We don't automatically sync or access your health app data. You manually enter only what you want to track, 
                and everything stays secure in your Vita account. This gives you complete control over your health information.
              </p>
            </div>
          </div>
        </div>

        {/* App Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(importGuides).map(([key, guide]) => (
            <button
              key={key}
              onClick={() => setSelectedApp(key)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                selectedApp === key 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-3xl mb-2">{guide.icon}</span>
              <span className="font-medium text-sm text-center">{guide.title}</span>
              <span className="text-xs text-gray-500 mt-1">{guide.platform}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Import Instructions */}
      <motion.div
        key={selectedApp}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            How to export from {currentGuide.title}
          </h3>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
            {currentGuide.platform}
          </span>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Step-by-step instructions:</h4>
            <ol className="space-y-3">
              {currentGuide.steps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-emerald-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-3">💡 Pro Tips:</h4>
            <ul className="space-y-2">
              {currentGuide.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-blue-700 text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Quick Entry Suggestions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Entry Suggestions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">❤️ Heart Health</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Enter your morning resting heart rate</li>
              <li>• Add HRV if your device measures it</li>
              <li>• Focus on daily averages, not individual readings</li>
            </ul>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4">
            <h4 className="font-medium text-emerald-800 mb-2">🏃‍♂️ Activity</h4>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• Daily step count is the most important metric</li>
              <li>• Choose activity level based on your most active period</li>
              <li>• Include both planned exercise and daily movement</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">😴 Sleep</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Total sleep time is more important than exact timing</li>
              <li>• Rate quality based on how rested you feel</li>
              <li>• Include naps in your total if they're significant</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">📝 Best Practices</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Enter data at the same time each day</li>
              <li>• Start with the last 7 days of data</li>
              <li>• Focus on trends rather than perfect accuracy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Alternative Methods */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Alternative Methods</h3>
        
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-gray-50 rounded-lg">
            <SafeIcon icon={FiSmartphone} className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-800">Use Your Phone's Built-in Health App</h4>
              <p className="text-gray-600 text-sm mt-1">
                Most smartphones have built-in health tracking. Check your iPhone Health app or Android's Google Fit 
                for basic step counting and health data that you can manually reference.
              </p>
            </div>
          </div>

          <div className="flex items-start p-4 bg-gray-50 rounded-lg">
            <SafeIcon icon={FiUpload} className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-800">Screenshot Method</h4>
              <p className="text-gray-600 text-sm mt-1">
                Take screenshots of your health app's daily summaries and use them as reference when manually 
                entering data into Vita. This works well for quick daily entries.
              </p>
            </div>
          </div>

          <div className="flex items-start p-4 bg-gray-50 rounded-lg">
            <SafeIcon icon={FiExternalLink} className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-800">Wearable Device Apps</h4>
              <p className="text-gray-600 text-sm mt-1">
                If you use a smartwatch or fitness tracker, check the companion app on your phone. 
                Most provide daily summaries that are perfect for manual entry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportGuide;
