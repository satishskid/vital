import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../lib/supabase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './FirebaseAuthContext';
import { useTime } from './TimeContext';

const ReminderContext = createContext();

export const useReminders = () => useContext(ReminderContext);

export const ReminderProvider = ({ children }) => {
  const { user } = useAuth();
  const { timeOfDay, currentTime } = useTime();
  const [reminders, setReminders] = useState([]);
  const [contextualMessage, setContextualMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch reminders from Firebase
  useEffect(() => {
    const fetchReminders = async () => {
      if (!user?.uid) {
        setReminders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Firebase fetch
        const q = query(
          collection(db, 'reminders'),
          where('user_id', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const reminderData = [];
        querySnapshot.forEach((doc) => {
          reminderData.push({ id: doc.id, ...doc.data() });
        });

        // Sort by time
        reminderData.sort((a, b) => a.time.localeCompare(b.time));

        setReminders(reminderData);
      } catch (error) {
        console.error('Error fetching reminders:', error);
        setReminders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [user?.uid]);
  
  // Update contextual message based on time of day
  useEffect(() => {
    if (!user) return;
    
    const hour = currentTime.getHours();
    const messages = {
      morning: [
        "Start your day with a 10-minute walk to reset your circadian rhythm",
        "Morning is the perfect time for a protein-rich breakfast",
        "A short morning breath session can set the tone for your day",
        "HRV check in the morning helps you plan your day's intensity"
      ],
      afternoon: [
        "Have you taken a movement break in the last hour?",
        "Afternoon slump? Try a 2-minute breathing exercise",
        "Stay hydrated! Water boosts cognitive function",
        "A brief exposure to natural light can reset your energy levels"
      ],
      evening: [
        "As the sun sets, so should your plate - time for your last meal",
        "Evening is perfect for a gentle mobility or yoga session",
        "Dim the lights to signal your body it's time to wind down",
        "Consider a short evening reflection practice"
      ],
      night: [
        "Screens off! Blue light disrupts your sleep quality",
        "Time for a sleep-promoting breathing exercise",
        "Keep your bedroom cool for optimal sleep",
        "A quick body scan meditation can help you drift off easily"
      ]
    };
    
    // Select a contextual message based on time of day
    const timeMessages = messages[timeOfDay] || messages.morning;
    const selectedMessage = timeMessages[Math.floor(Math.random() * timeMessages.length)];
    
    // Add special messages for specific times
    if (hour === 7) {
      setContextualMessage("Perfect time for your morning HRV check");
    } else if (hour === 12) {
      setContextualMessage("Take a midday movement break to reset your focus");
    } else if (hour === 18) {
      setContextualMessage("As the sun sets, so should your plate - time for your last meal");
    } else if (hour === 22) {
      setContextualMessage("Time to wind down. How about a breathing exercise?");
    } else {
      setContextualMessage(selectedMessage);
    }
  }, [timeOfDay, currentTime, user]);
  
  // Add a reminder
  const addReminder = async (reminderData) => {
    try {
      if (!user) throw new Error('User must be logged in');
      
      // Firebase add
      const newReminder = {
        user_id: user.uid,
        ...reminderData,
        created_at: new Date()
      };

      const docRef = await addDoc(collection(db, 'reminders'), newReminder);
      const reminderWithId = { id: docRef.id, ...newReminder };

      setReminders(prev => [...prev, reminderWithId]);
      return { data: reminderWithId, error: null };
    } catch (error) {
      console.error('Add reminder error:', error);
      return { data: null, error };
    }
  };
  
  // Update a reminder
  const updateReminder = async (id, reminderData) => {
    try {
      if (!user) throw new Error('User must be logged in');
      
      // Firebase update
      const docRef = doc(db, 'reminders', id);
      await updateDoc(docRef, {
        ...reminderData,
        updated_at: new Date()
      });

      const updatedReminders = reminders.map(reminder =>
        reminder.id === id
          ? { ...reminder, ...reminderData, updated_at: new Date() }
          : reminder
      );
      setReminders(updatedReminders);
      return { data: updatedReminders.find(r => r.id === id), error: null };
    } catch (error) {
      console.error('Update reminder error:', error);
      return { data: null, error };
    }
  };
  
  // Delete a reminder
  const deleteReminder = async (id) => {
    try {
      if (!user) throw new Error('User must be logged in');
      
      // Firebase delete
      await deleteDoc(doc(db, 'reminders', id));

      setReminders(prev => prev.filter(reminder => reminder.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Delete reminder error:', error);
      return { error };
    }
  };
  
  const value = {
    reminders,
    contextualMessage,
    loading,
    addReminder,
    updateReminder,
    deleteReminder
  };
  
  return <ReminderContext.Provider value={value}>{children}</ReminderContext.Provider>;
};

export default ReminderContext;