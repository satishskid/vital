import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiPlay, FiPause, FiX, FiHeart, FiInfo, FiCheckCircle } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const CameraHRV = ({ onComplete, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [heartRate, setHeartRate] = useState(null);
  const [hrv, setHrv] = useState(null);
  const [phase, setPhase] = useState('permission'); // permission, recording, processing, complete
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const dataRef = useRef([]);
  const startTimeRef = useRef(null);

  const RECORDING_DURATION = 60; // 60 seconds for accurate HRV

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setHasPermission(true);
      setPhase('ready');
      setError(null);
    } catch (err) {
      console.error('Camera permission denied:', err);
      setError('Camera access is required for HRV measurement. Please allow camera access and try again.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startRecording = () => {
    if (!hasPermission) return;
    
    setIsRecording(true);
    setPhase('recording');
    setProgress(0);
    dataRef.current = [];
    startTimeRef.current = Date.now();
    
    // Start capturing frames for rPPG analysis
    intervalRef.current = setInterval(() => {
      captureFrame();
      
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const newProgress = Math.min((elapsed / RECORDING_DURATION) * 100, 100);
      setProgress(newProgress);
      
      if (elapsed >= RECORDING_DURATION) {
        stopRecording();
      }
    }, 100); // Capture at ~10 FPS
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setPhase('processing');
    processHRVData();
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Extract color data from center region (face area)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const regionSize = Math.min(canvas.width, canvas.height) * 0.3;
    
    const imageData = ctx.getImageData(
      centerX - regionSize / 2,
      centerY - regionSize / 2,
      regionSize,
      regionSize
    );
    
    // Calculate average RGB values
    let r = 0, g = 0, b = 0;
    const pixels = imageData.data;
    const pixelCount = pixels.length / 4;
    
    for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i];
      g += pixels[i + 1];
      b += pixels[i + 2];
    }
    
    r /= pixelCount;
    g /= pixelCount;
    b /= pixelCount;
    
    // Store data point with timestamp
    dataRef.current.push({
      timestamp: Date.now(),
      r, g, b
    });
  };

  const processHRVData = () => {
    const data = dataRef.current;
    if (data.length < 100) {
      setError('Insufficient data captured. Please try again.');
      setPhase('ready');
      return;
    }

    // Simple rPPG processing using green channel (most sensitive to blood volume changes)
    const greenSignal = data.map(d => d.g);
    
    // Apply simple moving average filter
    const filteredSignal = applyMovingAverage(greenSignal, 5);
    
    // Find peaks to calculate heart rate
    const peaks = findPeaks(filteredSignal);
    
    if (peaks.length < 10) {
      setError('Could not detect reliable pulse signal. Please ensure good lighting and keep still.');
      setPhase('ready');
      return;
    }
    
    // Calculate heart rate from peak intervals
    const intervals = [];
    for (let i = 1; i < peaks.length; i++) {
      const interval = (data[peaks[i]].timestamp - data[peaks[i-1]].timestamp) / 1000; // seconds
      if (interval > 0.4 && interval < 2.0) { // Filter reasonable intervals (30-150 BPM)
        intervals.push(interval);
      }
    }
    
    if (intervals.length < 5) {
      setError('Could not detect consistent pulse rhythm. Please try again.');
      setPhase('ready');
      return;
    }
    
    // Calculate average heart rate
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const calculatedHR = Math.round(60 / avgInterval);
    
    // Calculate HRV (RMSSD - Root Mean Square of Successive Differences)
    let sumSquaredDiffs = 0;
    for (let i = 1; i < intervals.length; i++) {
      const diff = intervals[i] - intervals[i-1];
      sumSquaredDiffs += diff * diff;
    }
    const rmssd = Math.sqrt(sumSquaredDiffs / (intervals.length - 1)) * 1000; // Convert to ms
    
    setHeartRate(calculatedHR);
    setHrv(Math.round(rmssd));
    setPhase('complete');
    
    // Auto-complete after showing results
    setTimeout(() => {
      if (onComplete) {
        onComplete({
          heartRate: calculatedHR,
          hrv: Math.round(rmssd),
          timestamp: new Date().toISOString()
        });
      }
    }, 3000);
  };

  const applyMovingAverage = (signal, windowSize) => {
    const filtered = [];
    for (let i = 0; i < signal.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(signal.length, i + Math.floor(windowSize / 2) + 1);
      const sum = signal.slice(start, end).reduce((a, b) => a + b, 0);
      filtered.push(sum / (end - start));
    }
    return filtered;
  };

  const findPeaks = (signal) => {
    const peaks = [];
    const threshold = Math.max(...signal) * 0.6; // 60% of max value
    
    for (let i = 1; i < signal.length - 1; i++) {
      if (signal[i] > signal[i-1] && 
          signal[i] > signal[i+1] && 
          signal[i] > threshold) {
        // Ensure minimum distance between peaks (avoid double detection)
        if (peaks.length === 0 || i - peaks[peaks.length - 1] > 10) {
          peaks.push(i);
        }
      }
    }
    
    return peaks;
  };

  const renderPermissionScreen = () => (
    <div className="text-center">
      <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
        <SafeIcon icon={FiCamera} className="w-16 h-16 text-blue-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Camera Access Required</h3>
      <p className="text-gray-600 mb-6">
        We need access to your camera to measure your heart rate and HRV using your face.
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-left">
            <h4 className="font-medium text-blue-800 mb-1">Privacy First</h4>
            <p className="text-sm text-blue-700">
              • No images or videos are saved<br/>
              • Processing happens locally on your device<br/>
              • Data never leaves your browser
            </p>
          </div>
        </div>
      </div>
      
      <motion.button
        onClick={requestCameraPermission}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium mb-4"
        whileTap={{ scale: 0.98 }}
      >
        Enable Camera Access
      </motion.button>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );

  const renderReadyScreen = () => (
    <div className="text-center">
      <div className="relative mb-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to Measure</h3>
      <p className="text-gray-600 mb-6">
        Position your face in the camera view and stay still for 60 seconds.
      </p>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-yellow-800 mb-2">For Best Results:</h4>
        <ul className="text-sm text-yellow-700 text-left space-y-1">
          <li>• Ensure good lighting on your face</li>
          <li>• Stay as still as possible</li>
          <li>• Look directly at the camera</li>
          <li>• Avoid talking or moving</li>
        </ul>
      </div>
      
      <motion.button
        onClick={startRecording}
        className="w-full bg-green-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
        whileTap={{ scale: 0.98 }}
      >
        <SafeIcon icon={FiPlay} className="w-5 h-5" />
        <span>Start Measurement</span>
      </motion.button>
    </div>
  );

  const renderRecordingScreen = () => (
    <div className="text-center">
      <div className="relative mb-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Recording indicator */}
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Recording</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Measuring HRV...</h3>
      <p className="text-gray-600 mb-6">
        Stay still and breathe normally. {Math.round((RECORDING_DURATION * (100 - progress)) / 100)} seconds remaining.
      </p>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <motion.div
          className="bg-green-500 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <motion.button
        onClick={stopRecording}
        className="w-full bg-red-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
        whileTap={{ scale: 0.98 }}
      >
        <SafeIcon icon={FiPause} className="w-5 h-5" />
        <span>Stop Early</span>
      </motion.button>
    </div>
  );

  const renderProcessingScreen = () => (
    <div className="text-center">
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
        <SafeIcon icon={FiHeart} className="w-16 h-16 text-purple-600 animate-pulse" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Processing Data...</h3>
      <p className="text-gray-600 mb-6">
        Analyzing your pulse signal to calculate heart rate and HRV.
      </p>
      
      <div className="flex justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  const renderCompleteScreen = () => (
    <div className="text-center">
      <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
        <SafeIcon icon={FiCheckCircle} className="w-16 h-16 text-green-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Measurement Complete!</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <SafeIcon icon={FiHeart} className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-600">{heartRate}</div>
          <div className="text-sm text-gray-600">BPM</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-white text-xs font-bold">HRV</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{hrv}</div>
          <div className="text-sm text-gray-600">ms</div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Your results will be automatically saved to your health log.
      </p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Camera HRV Measurement</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {phase === 'permission' && renderPermissionScreen()}
          {phase === 'ready' && renderReadyScreen()}
          {phase === 'recording' && renderRecordingScreen()}
          {phase === 'processing' && renderProcessingScreen()}
          {phase === 'complete' && renderCompleteScreen()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CameraHRV;
