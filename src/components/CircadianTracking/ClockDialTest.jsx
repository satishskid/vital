import React, { useState } from 'react';
import CircadianClockDial from './CircadianClockDial';

const ClockDialTest = () => {
  const [logs, setLogs] = useState({
    light: [],
    meals: [],
    blueLight: [],
    sleep: []
  });

  const handleLogActivity = (activityType, time) => {
    console.log('Test logging:', { activityType, time });
    
    const newLog = {
      hour: time.hour,
      minute: time.minute,
      timestamp: new Date().toISOString()
    };

    setLogs(prev => ({
      ...prev,
      [activityType]: [...(prev[activityType] || []), newLog]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Clock Dial Test</h1>
        
        <CircadianClockDial
          onLogActivity={handleLogActivity}
          todayLogs={logs}
        />
        
        <div className="mt-8 bg-white p-4 rounded-lg">
          <h3 className="font-bold mb-4">Logged Activities:</h3>
          <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(logs, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ClockDialTest;
