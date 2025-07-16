import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../lib/supabase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './FirebaseAuthContext';

const SocialContext = createContext();

export const useSocial = () => useContext(SocialContext);

export const SocialProvider = ({ children }) => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch social connections from database or use mock data
  useEffect(() => {
    const fetchConnections = async () => {
      if (!user?.uid) {
        setConnections([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Firebase fetch
        const q = query(
          collection(db, 'social_circle'),
          where('user_id', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const connectionData = [];
        querySnapshot.forEach((doc) => {
          connectionData.push({ id: doc.id, ...doc.data() });
        });

        // Sort by created_at
        connectionData.sort((a, b) => {
          const aTime = a.created_at?.toDate?.() || new Date(0);
          const bTime = b.created_at?.toDate?.() || new Date(0);
          return bTime - aTime;
        });

        setConnections(connectionData);
      } catch (error) {
        console.error('Error fetching social connections:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnections();
  }, [user?.uid]);
  
  // Add a connection
  const addConnection = async (email, relationshipType = 'friend') => {
    try {
      if (!user?.uid) throw new Error('User must be logged in');

      // Create new connection in Firebase
      const newConnection = {
        user_id: user.uid,
        email,
        relationship_type: relationshipType,
        status: 'active',
        created_at: new Date(),
        name: email.split('@')[0], // Use email prefix as default name
        last_interaction: new Date(),
        interaction_count: 0
      };

      const docRef = await addDoc(collection(db, 'social_circle'), newConnection);
      const connectionWithId = { id: docRef.id, ...newConnection };

      setConnections(prev => [connectionWithId, ...prev]);
      return { data: connectionWithId, error: null };
    } catch (error) {
      console.error('Add connection error:', error);
      return { data: null, error };
    }
  };
  
  // Update a connection
  const updateConnection = async (id, connectionData) => {
    try {
      if (!user?.uid) throw new Error('User must be logged in');

      // Update in Firebase
      const docRef = doc(db, 'social_circle', id);
      await updateDoc(docRef, {
        ...connectionData,
        updated_at: new Date()
      });

      // Update local state
      const updatedConnections = connections.map(conn =>
        conn.id === id
          ? { ...conn, ...connectionData }
          : conn
      );
      setConnections(updatedConnections);
      return { data: updatedConnections.find(c => c.id === id), error: null };
    } catch (error) {
      console.error('Update connection error:', error);
      return { data: null, error };
    }
  };
  
  // Remove a connection
  const removeConnection = async (id) => {
    try {
      if (!user?.uid) throw new Error('User must be logged in');

      // Delete from Firebase
      await deleteDoc(doc(db, 'social_circle', id));

      // Update local state
      const updatedConnections = connections.filter(conn => conn.id !== id);
      setConnections(updatedConnections);
      return { error: null };
    } catch (error) {
      console.error('Remove connection error:', error);
      return { error };
    }
  };
  
  // Filter connections by relationship type
  const getConnectionsByType = (type) => {
    return connections.filter(conn => conn.relationshipType === type);
  };
  
  // Get family connections
  const getFamilyConnections = () => {
    return getConnectionsByType('family');
  };
  
  // Get friend connections
  const getFriendConnections = () => {
    return getConnectionsByType('friend');
  };
  
  // Get active connections (online now)
  const getActiveConnections = () => {
    return connections.filter(conn => 
      conn.profile && conn.profile.status === 'active'
    );
  };
  
  const value = {
    connections,
    loading,
    addConnection,
    updateConnection,
    removeConnection,
    getConnectionsByType,
    getFamilyConnections,
    getFriendConnections,
    getActiveConnections
  };
  
  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
};

export default SocialContext;