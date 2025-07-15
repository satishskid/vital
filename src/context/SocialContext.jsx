import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../lib/supabase';
import { useAuth } from './AuthContext';
import { mockSocialCircle } from '../data/mockData';

// Import SUPABASE_URL for mock data checks
const SUPABASE_URL = 'https://<PROJECT-ID>.supabase.co';

const SocialContext = createContext();

export const useSocial = () => useContext(SocialContext);

export const SocialProvider = ({ children }) => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch social connections from database or use mock data
  useEffect(() => {
    const fetchConnections = async () => {
      if (!user) {
        setConnections([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Mock data if no Supabase connection
        if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co') {
          setConnections(mockSocialCircle);
          setLoading(false);
          return;
        }
        
        // Real Supabase fetch
        const { data, error } = await supabase
          .from('connections')
          .select('*, connection_profiles:connection_id(id, email, first_name, last_name, avatar_url, status, mood, last_activity)')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // Format the returned data
        const formattedConnections = data.map(conn => ({
          id: conn.id,
          userId: conn.user_id,
          connectionId: conn.connection_id,
          relationshipType: conn.relationship_type,
          status: conn.status,
          createdAt: conn.created_at,
          profile: conn.connection_profiles
        }));
        
        setConnections(formattedConnections || []);
      } catch (error) {
        console.error('Error fetching social connections:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnections();
  }, [user]);
  
  // Add a connection
  const addConnection = async (email, relationshipType = 'friend') => {
    try {
      if (!user) throw new Error('User must be logged in');
      
      // Mock add if no Supabase connection
      if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co') {
        const mockId = `mock-${Date.now()}`;
        const newConnection = {
          id: mockId,
          userId: user.id,
          connectionId: mockId,
          relationshipType,
          status: 'pending',
          createdAt: new Date().toISOString(),
          profile: {
            id: mockId,
            email,
            first_name: 'New',
            last_name: 'Contact',
            avatar_url: null,
            status: 'pending',
            mood: '😊',
            last_activity: 'Joined Vita'
          }
        };
        setConnections(prev => [...prev, newConnection]);
        return { data: newConnection, error: null };
      }
      
      // Real Supabase add
      // First check if the user exists
      const { data: userExists, error: userError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .single();
        
      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }
      
      if (!userExists) {
        // User doesn't exist, send an invite
        // This would typically involve an email service
        return { data: null, error: new Error('User not found. Invite sent.') };
      }
      
      // Add connection
      const { data, error } = await supabase
        .from('connections')
        .insert([
          {
            user_id: user.id,
            connection_id: userExists.id,
            relationship_type: relationshipType,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Also add reverse connection for the other user
      await supabase
        .from('connections')
        .insert([
          {
            user_id: userExists.id,
            connection_id: user.id,
            relationship_type: relationshipType,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);
      
      // Get the connection with profile info
      const { data: connectionWithProfile, error: profileError } = await supabase
        .from('connections')
        .select('*, connection_profiles:connection_id(id, email, first_name, last_name, avatar_url, status, mood, last_activity)')
        .eq('id', data[0].id)
        .single();
        
      if (profileError) throw profileError;
      
      // Format the connection
      const formattedConnection = {
        id: connectionWithProfile.id,
        userId: connectionWithProfile.user_id,
        connectionId: connectionWithProfile.connection_id,
        relationshipType: connectionWithProfile.relationship_type,
        status: connectionWithProfile.status,
        createdAt: connectionWithProfile.created_at,
        profile: connectionWithProfile.connection_profiles
      };
      
      setConnections(prev => [...prev, formattedConnection]);
      return { data: formattedConnection, error: null };
    } catch (error) {
      console.error('Add connection error:', error);
      return { data: null, error };
    }
  };
  
  // Update a connection
  const updateConnection = async (id, connectionData) => {
    try {
      if (!user) throw new Error('User must be logged in');
      
      // Mock update if no Supabase connection
      if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co') {
        const updatedConnections = connections.map(conn => 
          conn.id === id 
            ? { 
                ...conn, 
                ...connectionData, 
                relationshipType: connectionData.relationship_type || conn.relationshipType,
                status: connectionData.status || conn.status
              }
            : conn
        );
        setConnections(updatedConnections);
        return { data: updatedConnections.find(c => c.id === id), error: null };
      }
      
      // Real Supabase update
      const { data, error } = await supabase
        .from('connections')
        .update({
          relationship_type: connectionData.relationship_type,
          status: connectionData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select();
        
      if (error) throw error;
      
      // Get the updated connection with profile info
      const { data: connectionWithProfile, error: profileError } = await supabase
        .from('connections')
        .select('*, connection_profiles:connection_id(id, email, first_name, last_name, avatar_url, status, mood, last_activity)')
        .eq('id', id)
        .single();
        
      if (profileError) throw profileError;
      
      // Format the connection
      const formattedConnection = {
        id: connectionWithProfile.id,
        userId: connectionWithProfile.user_id,
        connectionId: connectionWithProfile.connection_id,
        relationshipType: connectionWithProfile.relationship_type,
        status: connectionWithProfile.status,
        createdAt: connectionWithProfile.created_at,
        profile: connectionWithProfile.connection_profiles
      };
      
      setConnections(prev => 
        prev.map(conn => conn.id === id ? formattedConnection : conn)
      );
      
      return { data: formattedConnection, error: null };
    } catch (error) {
      console.error('Update connection error:', error);
      return { data: null, error };
    }
  };
  
  // Remove a connection
  const removeConnection = async (id) => {
    try {
      if (!user) throw new Error('User must be logged in');
      
      // Mock remove if no Supabase connection
      if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co') {
        const updatedConnections = connections.filter(conn => conn.id !== id);
        setConnections(updatedConnections);
        return { error: null };
      }
      
      // Get the connection to find the other user's connection to delete
      const { data: connection, error: fetchError } = await supabase
        .from('connections')
        .select('connection_id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Delete this connection
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Find and delete the reciprocal connection
      await supabase
        .from('connections')
        .delete()
        .eq('user_id', connection.connection_id)
        .eq('connection_id', user.id);
      
      setConnections(prev => prev.filter(conn => conn.id !== id));
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