import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/FirebaseAuthContext';
import VitaSocialCircleManager from '../../services/SocialCircleManager';

const PeerAvatars = () => {
  const { user } = useAuth();
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSocialCircle();
    } else {
      setPeers([]);
      setLoading(false);
    }
  }, [user]);

  const loadSocialCircle = async () => {
    try {
      const socialManager = new VitaSocialCircleManager(user.uid);
      await socialManager.loadData();
      const socialCircle = socialManager.getSocialCircle();

      // Convert social circle to peer format for display
      const formattedPeers = socialCircle.slice(0, 4).map((contact, index) => ({
        id: contact.id,
        name: contact.nickname || contact.name,
        status: getRandomStatus(),
        color: getColorForIndex(index),
        mood: getRandomMood()
      }));

      setPeers(formattedPeers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading social circle:', error);
      setPeers([]);
      setLoading(false);
    }
  };

  const getRandomStatus = () => {
    const statuses = ['active', 'resting', 'focused', 'exercising'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getColorForIndex = (index) => {
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  };

  const getRandomMood = () => {
    const moods = ['😊', '😌', '💪', '🧘', '🎯', '✨'];
    return moods[Math.floor(Math.random() * moods.length)];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Your Support Circle</h3>
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (peers.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">Your Support Circle</h3>
        <div className="text-center py-4">
          <div className="text-gray-400 text-4xl mb-2">👥</div>
          <p className="text-gray-500 text-sm">Add friends to see them here</p>
          <p className="text-gray-400 text-xs mt-1">Go to Social → Add Contact</p>
        </div>
      </div>
    );
  }

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