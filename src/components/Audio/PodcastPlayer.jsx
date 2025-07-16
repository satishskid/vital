import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiSkipBack, FiSkipForward } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const PodcastPlayer = ({ 
  audioSrc, 
  title = "Vita Science Podcast", 
  description = "Deep dive into the science behind your vitality",
  className = "" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 ${className}`}>
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div 
          className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => skipTime(-10)}
            className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
            whileTap={{ scale: 0.9 }}
            title="Skip back 10s"
          >
            <SafeIcon icon={FiSkipBack} className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={togglePlay}
            disabled={isLoading}
            className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-6 h-6" />
            )}
          </motion.button>

          <motion.button
            onClick={() => skipTime(10)}
            className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
            whileTap={{ scale: 0.9 }}
            title="Skip forward 10s"
          >
            <SafeIcon icon={FiSkipForward} className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={toggleMute}
            className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={isMuted ? FiVolumeX : FiVolume2} className="w-5 h-5" />
          </motion.button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Podcast Info */}
      <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg">
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Listen to learn the science behind your vitality rings</span>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;
