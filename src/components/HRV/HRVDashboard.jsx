import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiHeart, FiTrendingUp, FiCalendar, FiPlus, FiInfo } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import CameraHRV from './CameraHRV';
import { useAuth } from '../../context/FirebaseAuthContext';
import { collection, addDoc, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const HRVDashboard = () => {
  const { user } = useAuth();
  const [showCameraHRV, setShowCameraHRV] = useState(false);
  const [recentMeasurements, setRecentMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todaysMeasurement, setTodaysMeasurement] = useState(null);

  useEffect(() => {
    if (user) {
      loadRecentMeasurements();
    }
  }, [user]);

  const loadRecentMeasurements = async () => {
    try {
      setLoading(true);
      
      // Get recent measurements
      const measurementsRef = collection(db, 'users', user.uid, 'hrv_measurements');
      const recentQuery = query(measurementsRef, orderBy('timestamp', 'desc'), limit(7));
      const recentSnapshot = await getDocs(recentQuery);
      
      const measurements = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(doc.data().timestamp)
      }));
      
      setRecentMeasurements(measurements);
      
      // Check if there's a measurement from today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayQuery = query(
        measurementsRef,
        where('timestamp', '>=', today),
        where('timestamp', '<', tomorrow),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      
      const todaySnapshot = await getDocs(todayQuery);
      if (!todaySnapshot.empty) {
        const todayData = todaySnapshot.docs[0].data();
        setTodaysMeasurement({
          id: todaySnapshot.docs[0].id,
          ...todayData,
          timestamp: todayData.timestamp?.toDate() || new Date(todayData.timestamp)
        });
      }
      
    } catch (error) {
      console.error('Error loading HRV measurements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMeasurementComplete = async (data) => {
    try {
      // Save to Firebase
      const measurementData = {
        heartRate: data.heartRate,
        hrv: data.hrv,
        timestamp: new Date(),
        method: 'camera_rppg',
        userId: user.uid
      };
      
      const measurementsRef = collection(db, 'users', user.uid, 'hrv_measurements');
      await addDoc(measurementsRef, measurementData);
      
      // Refresh the data
      await loadRecentMeasurements();
      
      setShowCameraHRV(false);
    } catch (error) {
      console.error('Error saving HRV measurement:', error);
    }
  };

  const getHRVStatus = (hrv) => {
    if (hrv >= 50) return { status: 'Excellent', color: 'green', description: 'Great recovery' };
    if (hrv >= 30) return { status: 'Good', color: 'blue', description: 'Well recovered' };
    if (hrv >= 20) return { status: 'Fair', color: 'yellow', description: 'Moderate recovery' };
    return { status: 'Low', color: 'red', description: 'Consider rest' };
  };

  const getHeartRateStatus = (hr) => {
    if (hr >= 60 && hr <= 100) return { status: 'Normal', color: 'green' };
    if (hr < 60) return { status: 'Low', color: 'blue' };
    return { status: 'High', color: 'red' };
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">HRV Monitoring</h1>
          <p className="text-gray-600">Track your heart rate variability with camera-based measurement</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Today's Measurement Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Today's Reading</h2>
            <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-500" />
          </div>

          {todaysMeasurement ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <SafeIcon icon={FiHeart} className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Heart Rate</h3>
                    <p className="text-sm text-gray-600">{formatDate(todaysMeasurement.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-red-600">{todaysMeasurement.heartRate}</span>
                  <span className="text-gray-600">BPM</span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${getHeartRateStatus(todaysMeasurement.heartRate).color}-100 text-${getHeartRateStatus(todaysMeasurement.heartRate).color}-700`}>
                    {getHeartRateStatus(todaysMeasurement.heartRate).status}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">HRV</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Heart Rate Variability</h3>
                    <p className="text-sm text-gray-600">RMSSD</p>
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-blue-600">{todaysMeasurement.hrv}</span>
                  <span className="text-gray-600">ms</span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${getHRVStatus(todaysMeasurement.hrv).color}-100 text-${getHRVStatus(todaysMeasurement.hrv).color}-700`}>
                    {getHRVStatus(todaysMeasurement.hrv).status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{getHRVStatus(todaysMeasurement.hrv).description}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <SafeIcon icon={FiCamera} className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No measurement today</h3>
              <p className="text-gray-600 mb-6">Take your daily HRV measurement to track your recovery</p>
              <motion.button
                onClick={() => setShowCameraHRV(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto"
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiCamera} className="w-5 h-5" />
                <span>Measure HRV</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Quick Action */}
        {todaysMeasurement && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Take Another Measurement</h3>
                <p className="text-sm text-gray-600">Multiple readings can provide better insights</p>
              </div>
              <motion.button
                onClick={() => setShowCameraHRV(true)}
                className="bg-emerald-500 text-white p-3 rounded-lg"
                whileTap={{ scale: 0.98 }}
              >
                <SafeIcon icon={FiPlus} className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        )}

        {/* Recent Measurements */}
        {recentMeasurements.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Measurements</h2>
              <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-gray-500" />
            </div>

            <div className="space-y-4">
              {recentMeasurements.map((measurement) => (
                <div key={measurement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiHeart} className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{formatDate(measurement.timestamp)}</p>
                      <p className="text-sm text-gray-600">Camera measurement</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-gray-600">HR</p>
                        <p className="font-semibold text-red-600">{measurement.heartRate} BPM</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">HRV</p>
                        <p className="font-semibold text-blue-600">{measurement.hrv} ms</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 mb-2">About Camera-based HRV</h3>
              <p className="text-sm text-blue-700 mb-3">
                This feature uses your device camera to detect subtle color changes in your face caused by blood flow, 
                allowing measurement of heart rate and heart rate variability without any wearable devices.
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Best measured in the morning for consistency</li>
                <li>• Requires good lighting and staying still</li>
                <li>• Higher HRV generally indicates better recovery</li>
                <li>• Track trends over time rather than single readings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Camera HRV Modal */}
      <AnimatePresence>
        {showCameraHRV && (
          <CameraHRV
            onComplete={handleMeasurementComplete}
            onClose={() => setShowCameraHRV(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HRVDashboard;
