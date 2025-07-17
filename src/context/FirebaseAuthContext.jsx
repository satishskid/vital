import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state change:', firebaseUser?.email);
      
      if (firebaseUser) {
        // Get user profile data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));
          const profile = userDoc.exists() ? userDoc.data() : {};
          
          setUser({
            ...firebaseUser,
            profile
          });
        } catch (err) {
          console.error('Error fetching profile:', err);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create auth user
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create profile document in Firestore
      await setDoc(doc(db, 'profiles', firebaseUser.uid), {
        first_name: userData.first_name,
        last_name: userData.last_name,
        goals: userData.goals || [],
        created_at: new Date(),
        updated_at: new Date()
      });

      // Create initial streak record
      await setDoc(doc(db, 'streaks', firebaseUser.uid), {
        current_streak: 0,
        longest_streak: 0,
        last_entry_date: null,
        updated_at: new Date()
      });

      // Send email verification
      await sendEmailVerification(firebaseUser);
      
      return { success: true, data: firebaseUser };
    } catch (err) {
      console.error('Error signing up:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, data: firebaseUser };
    } catch (err) {
      console.error('Error signing in:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Check if this is a new user and create profile if needed
      const userDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid));

      if (!userDoc.exists()) {
        // Create profile for new Google user
        const profileData = {
          first_name: firebaseUser.displayName?.split(' ')[0] || '',
          last_name: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          email: firebaseUser.email,
          created_at: new Date(),
          auth_provider: 'google',
          goals: []
        };

        await setDoc(doc(db, 'profiles', firebaseUser.uid), profileData);
      }

      return { success: true, data: firebaseUser };
    } catch (err) {
      console.error('Error signing in with Google:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      return { success: true };
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) throw new Error('No user logged in');

      await setDoc(doc(db, 'profiles', user.uid), {
        ...profileData,
        updated_at: new Date()
      }, { merge: true });

      // Update local user state
      setUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...profileData
        }
      }));

      return { success: true, data: profileData };
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Save health data
  const saveHealthData = async (healthData) => {
    try {
      if (!user) throw new Error('No user logged in');

      const docRef = await addDoc(collection(db, 'health_entries'), {
        user_id: user.uid,
        entry_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        entry_type: 'manual',
        source: 'manual_entry',
        ...healthData,
        created_at: new Date(),
        updated_at: new Date()
      });

      return { success: true, data: { id: docRef.id, ...healthData } };
    } catch (err) {
      console.error('Error saving health data:', err);
      return { success: false, error: err.message };
    }
  };

  // Get recent health entries
  const getRecentHealthEntries = async (limitCount = 7) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' };

      const q = query(
        collection(db, 'health_entries'),
        where('user_id', '==', user.uid),
        orderBy('entry_date', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: entries };
    } catch (err) {
      console.error('Error fetching health entries:', err);
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut: signOutUser,
    updateProfile,
    saveHealthData,
    getRecentHealthEntries
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
