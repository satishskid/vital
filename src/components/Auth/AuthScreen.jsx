import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';
import SignUp from './SignUp';

const AuthScreen = () => {
  const [showLogin, setShowLogin] = useState(true);
  
  const toggleForm = () => {
    setShowLogin(prev => !prev);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">Vita</h1>
          <p className="text-emerald-50">Your Health Journey</p>
        </div>
        
        <AnimatePresence mode="wait">
          {showLogin ? (
            <Login key="login" onToggleForm={toggleForm} />
          ) : (
            <SignUp key="signup" onToggleForm={toggleForm} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthScreen;