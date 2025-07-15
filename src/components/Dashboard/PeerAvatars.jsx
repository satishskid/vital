import React from 'react';
import { motion } from 'framer-motion';

const PeerAvatars = () => {
  const peers = [
    { id: 1, name: 'Sarah', status: 'active', color: 'bg-green-500', mood: '😊' },
    { id: 2, name: 'Mike', status: 'resting', color: 'bg-blue-500', mood: '😌' },
    { id: 3, name: 'Lisa', status: 'active', color: 'bg-purple-500', mood: '💪' },
    { id: 4, name: 'John', status: 'focused', color: 'bg-orange-500', mood: '🧘' }
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3">Your Support Circle</h3>
      <div className="flex justify-center space-x-4">
        {peers.map((peer, index) => (
          <motion.div
            key={peer.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className={`w-12 h-12 ${peer.color} rounded-full flex items-center justify-center text-white font-semibold peer-avatar`}>
                {peer.name[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 text-lg">
                {peer.mood}
              </div>
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                peer.status === 'active' ? 'bg-green-500' : 
                peer.status === 'resting' ? 'bg-gray-400' : 'bg-blue-500'
              }`}></div>
            </div>
            <span className="text-xs text-gray-600 mt-1">{peer.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PeerAvatars;