/**
 * Comprehensive Test Suite for Vita Notification Intelligence
 * Tests parsing accuracy across various health apps and notification formats
 */

import VitaNotificationIntelligence from '../services/NotificationIntelligence';

class NotificationParserTests {
  constructor() {
    this.testResults = [];
    this.parser = new VitaNotificationIntelligence();
  }

  /**
   * Comprehensive test cases covering various health apps and formats
   */
  getTestCases() {
    return [
      // Apple Health variations
      {
        category: 'Apple Health',
        tests: [
          {
            title: 'Health',
            body: 'You walked 8,432 steps today! Great job staying active.',
            expected: { steps: 8432 }
          },
          {
            title: 'Apple Health',
            body: 'Daily summary: 12,847 steps, 7h 23m sleep',
            expected: { steps: 12847, sleep: { hours: 7, minutes: 23, duration: 443 } }
          },
          {
            title: 'Health',
            body: 'You walked 1,234 steps and slept 8h 15m last night',
            expected: { steps: 1234, sleep: { hours: 8, minutes: 15, duration: 495 } }
          }
        ]
      },

      // Google Fit variations
      {
        category: 'Google Fit',
        tests: [
          {
            title: 'Google Fit',
            body: '10,567 steps today - you\'re doing great!',
            expected: { steps: 10567 }
          },
          {
            title: 'Fit',
            body: 'You were active for 45 minutes today',
            expected: { activity: 45 }
          },
          {
            title: 'Google Fit',
            body: 'Daily goal achieved! 15,234 steps, 67 minutes active',
            expected: { steps: 15234, activity: 67 }
          }
        ]
      },

      // Samsung Health variations
      {
        category: 'Samsung Health',
        tests: [
          {
            title: 'Samsung Health',
            body: 'Today: 9,876 steps, 8h 30m sleep, 72 BPM avg',
            expected: { 
              steps: 9876, 
              sleep: { hours: 8, minutes: 30, duration: 510 },
              heartRate: 72 
            }
          },
          {
            title: 'S Health',
            body: 'Sleep summary: 7h 45m with good quality',
            expected: { sleep: { hours: 7, minutes: 45, duration: 465 } }
          }
        ]
      },

      // Fitbit variations
      {
        category: 'Fitbit',
        tests: [
          {
            title: 'Fitbit',
            body: 'Your resting heart rate today: 58 BPM (Excellent)',
            expected: { heartRate: 58 }
          },
          {
            title: 'Fitbit',
            body: 'Great job! 11,234 steps and 8h 12m sleep',
            expected: { 
              steps: 11234,
              sleep: { hours: 8, minutes: 12, duration: 492 }
            }
          },
          {
            title: 'Fitbit',
            body: 'Weekly summary: Avg 65 BPM, 8,432 steps daily',
            expected: { heartRate: 65, steps: 8432 }
          }
        ]
      },

      // Sleep Cycle variations
      {
        category: 'Sleep Cycle',
        tests: [
          {
            title: 'Sleep Cycle',
            body: 'You slept 7h 23m last night with 85% sleep quality',
            expected: { sleep: { hours: 7, minutes: 23, duration: 443 } }
          },
          {
            title: 'Sleep Cycle',
            body: 'Good morning! Sleep: 8h 45m, Quality: 92%',
            expected: { sleep: { hours: 8, minutes: 45, duration: 525 } }
          },
          {
            title: 'Sleep Cycle',
            body: 'Sleep analysis complete: 6h 30m total sleep',
            expected: { sleep: { hours: 6, minutes: 30, duration: 390 } }
          }
        ]
      },

      // Strava variations
      {
        category: 'Strava',
        tests: [
          {
            title: 'Strava',
            body: 'Morning run complete! 35 min workout, 420 calories',
            expected: { activity: 35, calories: 420 }
          },
          {
            title: 'Strava',
            body: 'Weekly summary: 180 minutes active, 1,250 calories burned',
            expected: { activity: 180, calories: 1250 }
          }
        ]
      },

      // MyFitnessPal variations
      {
        category: 'MyFitnessPal',
        tests: [
          {
            title: 'MyFitnessPal',
            body: 'Daily goal reached! 1,850 calories logged',
            expected: { calories: 1850 }
          },
          {
            title: 'MyFitnessPal',
            body: 'You\'ve burned 520 calories today - great work!',
            expected: { calories: 520 }
          }
        ]
      },

      // Edge cases and variations
      {
        category: 'Edge Cases',
        tests: [
          {
            title: 'Unknown App',
            body: 'You walked 5,000 steps and your heart rate was 68 BPM',
            expected: { steps: 5000, heartRate: 68 }
          },
          {
            title: 'Mixed Format',
            body: 'Daily: 12345 step, slept 7h30m, HR: 65bpm, 45min active',
            expected: { 
              steps: 12345,
              sleep: { hours: 7, minutes: 30, duration: 450 },
              heartRate: 65,
              activity: 45
            }
          },
          {
            title: 'Comma Separated',
            body: 'Health summary: 15,678 steps, 8h 20m sleep, 72 BPM',
            expected: { 
              steps: 15678,
              sleep: { hours: 8, minutes: 20, duration: 500 },
              heartRate: 72
            }
          },
          {
            title: 'No Data',
            body: 'Welcome to the health app! Get started today.',
            expected: {}
          },
          {
            title: 'Invalid Data',
            body: 'You walked -500 steps and slept 25 hours',
            expected: {} // Should be filtered out by validation
          }
        ]
      }
    ];
  }

  /**
   * Run all test cases
   */
  async runAllTests() {
    console.log('🧪 Starting Comprehensive Notification Parser Tests...');
    
    const testCases = this.getTestCases();
    let totalTests = 0;
    let passedTests = 0;
    
    for (const category of testCases) {
      console.log(`\n📱 Testing ${category.category}...`);
      
      for (const test of category.tests) {
        totalTests++;
        const result = await this.runSingleTest(test, category.category);
        
        if (result.passed) {
          passedTests++;
          console.log(`  ✅ ${test.title}: PASS`);
        } else {
          console.log(`  ❌ ${test.title}: FAIL`);
          console.log(`     Expected: ${JSON.stringify(test.expected)}`);
          console.log(`     Got: ${JSON.stringify(result.parsed)}`);
        }
        
        this.testResults.push(result);
      }
    }
    
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log(`\n📊 Test Results Summary:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${passedTests}`);
    console.log(`   Failed: ${totalTests - passedTests}`);
    console.log(`   Success Rate: ${successRate}%`);
    
    return {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      successRate: parseFloat(successRate),
      results: this.testResults
    };
  }

  /**
   * Run a single test case
   */
  async runSingleTest(test, category) {
    try {
      const parsed = this.parser.testNotificationParsing(test.title, test.body);
      const passed = this.compareResults(test.expected, parsed);
      
      return {
        category,
        title: test.title,
        body: test.body,
        expected: test.expected,
        parsed,
        passed,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        category,
        title: test.title,
        body: test.body,
        expected: test.expected,
        parsed: null,
        passed: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Compare expected vs actual results
   */
  compareResults(expected, parsed) {
    // Handle empty expected results
    if (Object.keys(expected).length === 0) {
      return Object.keys(parsed || {}).length === 0;
    }
    
    if (!parsed) return false;
    
    // Check steps
    if (expected.steps !== undefined && parsed.steps !== expected.steps) {
      return false;
    }
    
    // Check heart rate
    if (expected.heartRate !== undefined && parsed.heartRate !== expected.heartRate) {
      return false;
    }
    
    // Check activity
    if (expected.activity !== undefined && parsed.activity !== expected.activity) {
      return false;
    }
    
    // Check calories
    if (expected.calories !== undefined && parsed.calories !== expected.calories) {
      return false;
    }
    
    // Check sleep (more complex comparison)
    if (expected.sleep !== undefined) {
      if (!parsed.sleep) return false;
      
      if (expected.sleep.hours !== undefined && 
          parsed.sleep.hours !== expected.sleep.hours) {
        return false;
      }
      
      if (expected.sleep.minutes !== undefined && 
          parsed.sleep.minutes !== expected.sleep.minutes) {
        return false;
      }
      
      if (expected.sleep.duration !== undefined && 
          parsed.sleep.duration !== expected.sleep.duration) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Generate detailed test report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.getSummary(),
      byCategory: this.getResultsByCategory(),
      failedTests: this.getFailedTests(),
      recommendations: this.getRecommendations()
    };
    
    return report;
  }

  getSummary() {
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = total - passed;
    
    return {
      totalTests: total,
      passedTests: passed,
      failedTests: failed,
      successRate: total > 0 ? ((passed / total) * 100).toFixed(1) : 0
    };
  }

  getResultsByCategory() {
    const categories = {};
    
    this.testResults.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = {
          total: 0,
          passed: 0,
          failed: 0
        };
      }
      
      categories[result.category].total++;
      if (result.passed) {
        categories[result.category].passed++;
      } else {
        categories[result.category].failed++;
      }
    });
    
    // Calculate success rates
    Object.keys(categories).forEach(category => {
      const cat = categories[category];
      cat.successRate = ((cat.passed / cat.total) * 100).toFixed(1);
    });
    
    return categories;
  }

  getFailedTests() {
    return this.testResults.filter(r => !r.passed);
  }

  getRecommendations() {
    const failed = this.getFailedTests();
    const recommendations = [];
    
    if (failed.length === 0) {
      recommendations.push('🎉 All tests passed! The notification parser is working excellently.');
      return recommendations;
    }
    
    // Analyze failure patterns
    const failuresByType = {};
    failed.forEach(test => {
      const expectedKeys = Object.keys(test.expected);
      expectedKeys.forEach(key => {
        if (!failuresByType[key]) failuresByType[key] = 0;
        failuresByType[key]++;
      });
    });
    
    Object.keys(failuresByType).forEach(type => {
      recommendations.push(
        `⚠️ ${failuresByType[type]} ${type} parsing failures detected. ` +
        `Consider improving ${type} extraction patterns.`
      );
    });
    
    return recommendations;
  }
}

export default NotificationParserTests;
