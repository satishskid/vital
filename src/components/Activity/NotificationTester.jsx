import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiCheck, FiInfo } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import VitaNotificationIntelligence from '../../services/NotificationIntelligence';

const NotificationTester = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const notificationRef = useRef(null);

  // Sample notification texts for testing
  const testNotifications = [
    {
      title: "Apple Health",
      body: "You walked 8,432 steps today! Great job staying active.",
      expected: { steps: 8432 }
    },
    {
      title: "Sleep Cycle",
      body: "You slept 7h 23m last night with 85% sleep quality",
      expected: { sleep: { hours: 7, minutes: 23, duration: 443 } }
    },
    {
      title: "Fitbit",
      body: "Your resting heart rate today: 62 BPM (Excellent)",
      expected: { heartRate: 62 }
    },
    {
      title: "Google Fit",
      body: "You were active for 45 minutes today and burned 320 calories",
      expected: { activity: 45, calories: 320 }
    },
    {
      title: "Samsung Health",
      body: "Daily summary: 12,847 steps, 8h 15m sleep, 68 BPM avg HR",
      expected: { steps: 12847, sleep: { hours: 8, minutes: 15 }, heartRate: 68 }
    }
  ];

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);

    // Initialize notification intelligence if not already done
    if (!notificationRef.current) {
      notificationRef.current = new VitaNotificationIntelligence();
    }

    const results = [];

    for (const test of testNotifications) {
      try {
        // Test the parsing logic
        const parsed = notificationRef.current.testNotificationParsing(test.title, test.body);
        
        // Check results
        const result = {
          title: test.title,
          body: test.body,
          expected: test.expected,
          parsed: parsed,
          success: compareResults(test.expected, parsed)
        };

        results.push(result);
        
        // Add delay for visual effect
        await new Promise(resolve => setTimeout(resolve, 500));
        setTestResults([...results]);

      } catch (error) {
        results.push({
          title: test.title,
          body: test.body,
          expected: test.expected,
          parsed: null,
          success: false,
          error: error.message
        });
      }
    }

    setIsLoading(false);
  };

  const compareResults = (expected, parsed) => {
    // Simple comparison logic
    if (expected.steps && parsed.steps !== expected.steps) return false;
    if (expected.heartRate && parsed.heartRate !== expected.heartRate) return false;
    if (expected.sleep && (!parsed.sleep || 
        parsed.sleep.hours !== expected.sleep.hours || 
        parsed.sleep.minutes !== expected.sleep.minutes)) return false;
    if (expected.activity && parsed.activity !== expected.activity) return false;
    if (expected.calories && parsed.calories !== expected.calories) return false;
    
    return true;
  };

  const formatParsedData = (data) => {
    if (!data) return 'No data parsed';
    
    const parts = [];
    if (data.steps) parts.push(`${data.steps} steps`);
    if (data.heartRate) parts.push(`${data.heartRate} BPM`);
    if (data.sleep) parts.push(`${data.sleep.hours}h ${data.sleep.minutes}m sleep`);
    if (data.activity) parts.push(`${data.activity} min active`);
    if (data.calories) parts.push(`${data.calories} calories`);
    
    return parts.length > 0 ? parts.join(', ') : 'No data parsed';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Notification Intelligence Tester</h2>
        <SafeIcon icon={FiInfo} className="w-6 h-6 text-blue-500" />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 mb-1">Test the Parser</h3>
            <p className="text-sm text-blue-700">
              This tests how well our notification intelligence system can extract health data 
              from various health app notifications. Click "Run Tests" to see the results.
            </p>
          </div>
        </div>
      </div>

      <motion.button
        onClick={runTests}
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 mb-6 disabled:opacity-50"
        whileTap={{ scale: 0.98 }}
      >
        <SafeIcon icon={FiPlay} className="w-5 h-5" />
        <span>{isLoading ? 'Running Tests...' : 'Run Tests'}</span>
      </motion.button>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Test Results</h3>
          
          {testResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${
                result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <SafeIcon 
                    icon={FiCheck} 
                    className={`w-5 h-5 ${result.success ? 'text-green-600' : 'text-red-600'}`} 
                  />
                  <span className="font-medium text-gray-800">{result.title}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {result.success ? 'PASS' : 'FAIL'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                <strong>Notification:</strong> "{result.body}"
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong className="text-gray-700">Expected:</strong>
                  <div className="text-gray-600 mt-1">
                    {formatParsedData(result.expected)}
                  </div>
                </div>
                <div>
                  <strong className="text-gray-700">Parsed:</strong>
                  <div className="text-gray-600 mt-1">
                    {formatParsedData(result.parsed)}
                  </div>
                </div>
              </div>
              
              {result.error && (
                <div className="mt-3 text-sm text-red-600">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </motion.div>
          ))}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.length}
                </div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {testResults.filter(r => r.success).length}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {testResults.filter(r => !r.success).length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationTester;
