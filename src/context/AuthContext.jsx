import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../lib/supabase';
import { mockUserData } from '../data/mockData';

// Import SUPABASE_URL for mock data checks
const SUPABASE_URL = 'https://<PROJECT-ID>.supabase.co';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we're using mock data (no Supabase connection)
        if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co') {
          // Check if user is stored in localStorage
          const savedUser = localStorage.getItem('vita-user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
          setLoading(false);
          return;
        }

        // Real Supabase session check
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session?.user) {
          // Get user profile data from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
          }

          setUser({
            ...session.user,
            profile: profile || {}
          });
        }
      } catch (error) {
        console.error('Session error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser({
            ...session.user,
            profile: profile || {}
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, userData) => {
    setLoading(true);
    try {
      // Mock signup if no Supabase connection
      if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co') {
        const mockUser = {
          id: `mock-${Date.now()}`,
          email,
          profile: {
            ...userData,
            created_at: new Date().toISOString()
          }
        };
        setUser(mockUser);
        localStorage.setItem('vita-user', JSON.stringify(mockUser));
        setLoading(false);
        return { data: mockUser, error: null };
      }

      // Real Supabase signup
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;

      if (data?.user) {
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              ...userData,
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) throw profileError;
      }

      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      // Mock signin if no Supabase connection
      if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co') {
        // For demo, just use first mock user
        const mockUser = mockUserData;
        setUser(mockUser);
        localStorage.setItem('vita-user', JSON.stringify(mockUser));
        setLoading(false);
        return { data: mockUser, error: null };
      }

      // Real Supabase signin
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // Mock signout if no Supabase connection
      if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co') {
        setUser(null);
        localStorage.removeItem('vita-user');
        return { error: null };
      }

      // Real Supabase signout
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      // Mock update if no Supabase connection
      if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co') {
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            ...profileData,
            updated_at: new Date().toISOString()
          }
        };
        setUser(updatedUser);
        localStorage.setItem('vita-user', JSON.stringify(updatedUser));
        return { data: updatedUser.profile, error: null };
      }

      // Real Supabase update
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local user state
      setUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...data
        }
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;