import React, { createContext, useState, useEffect, useContext } from 'react';

const TimeContext = createContext();

export const useTime = () => useContext(TimeContext);

export const TimeProvider = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeOfDay, setTimeOfDay] = useState('');
  const [greeting, setGreeting] = useState('');
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      updateTimeContexts(now);
    }, 60000); // Update every minute
    
    // Initialize on mount
    updateTimeContexts(currentTime);
    
    return () => clearInterval(timer);
  }, []);
  
  const updateTimeContexts = (time) => {
    const hour = time.getHours();
    
    // Set time of day
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon');
    } else if (hour >= 17 && hour < 21) {
      setTimeOfDay('evening');
    } else {
      setTimeOfDay('night');
    }
    
    // Set greeting
    if (hour >= 5 && hour < 12) {
      setGreeting('Good Morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good Evening');
    } else {
      setGreeting('Good Night');
    }
  };
  
  // Determine if it's a specific part of the day
  const isMorning = timeOfDay === 'morning';
  const isAfternoon = timeOfDay === 'afternoon';
  const isEvening = timeOfDay === 'evening';
  const isNight = timeOfDay === 'night';
  
  // Get formatted times
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
  
  // Calculate sunset/sunrise time (simplified)
  const getSunriseTime = () => {
    // This is a simplified approach - in a real app you'd use geolocation and a proper algorithm
    const month = currentTime.getMonth();
    // Rough sunrise times by month (Northern Hemisphere)
    const sunriseTimes = [
      '7:30 AM', '7:00 AM', '6:30 AM', '6:00 AM', '5:30 AM', '5:15 AM',
      '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM'
    ];
    return sunriseTimes[month];
  };
  
  const getSunsetTime = () => {
    // Simplified approach
    const month = currentTime.getMonth();
    // Rough sunset times by month (Northern Hemisphere)
    const sunsetTimes = [
      '5:00 PM', '5:30 PM', '6:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
      '8:30 PM', '8:00 PM', '7:30 PM', '6:30 PM', '5:00 PM', '4:30 PM'
    ];
    return sunsetTimes[month];
  };
  
  const value = {
    currentTime,
    formattedTime,
    formattedDate,
    timeOfDay,
    greeting,
    isMorning,
    isAfternoon,
    isEvening,
    isNight,
    sunriseTime: getSunriseTime(),
    sunsetTime: getSunsetTime()
  };
  
  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
};

export default TimeContext;