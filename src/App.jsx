import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Context Providers
import { AuthProvider, useAuth } from './context/FirebaseAuthContext';
import { TimeProvider } from './context/TimeContext';
import { ReminderProvider } from './context/ReminderContext';
import { SocialProvider } from './context/SocialContext';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import AuthScreen from './components/Auth/AuthScreen';
import Onboarding from './components/Onboarding/Onboarding';
import Dashboard from './components/Dashboard/Dashboard';
import SimplifiedDashboard from './components/Dashboard/SimplifiedDashboard';
import LongevityOnboarding from './components/Onboarding/LongevityOnboarding';
import HRVCheck from './components/HRV/HRVCheck';
import MindBreathHub from './components/MindBreath/MindBreathHub';
import SocialHub from './components/Social/SocialHub';
import Profile from './components/Profile/Profile';
import Navigation from './components/Navigation/Navigation';
import WhyCard from './components/Education/WhyCard';
import ScienceHub from './components/Science/ScienceHub';
import ScienceCard from './components/Science/ScienceCard';
import RemindersScreen from './components/Reminders/RemindersScreen';
import ContextualMessage from './components/Dashboard/ContextualMessage';
import ManualEntryDashboard from './components/ManualEntry/ManualEntryDashboard';
import HealthAppsRecommendations from './components/HealthApps/HealthAppsRecommendations';
import HRVDashboard from './components/HRV/HRVDashboard';

import TestingDashboard from './components/Testing/TestingDashboard';
import SocialWellnessDashboard from './components/Social/SocialWellnessDashboard';
import SocialCircleManager from './components/Social/SocialCircleManager';
import WelcomeScreen from './components/Welcome/WelcomeScreen';
import LandingPage from './components/Landing/LandingPage';
import CircadianTracking from './components/CircadianTracking/CircadianTracking';
import HealthMetricsHub from './components/HealthMetrics/HealthMetricsHub';
import SelfConnectHub from './components/SelfConnect/SelfConnectHub';
import ClockDialTest from './components/CircadianTracking/ClockDialTest';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Main App Component
function AppContent() {
  const { user } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentWhyCard, setCurrentWhyCard] = useState(null);
  const [scienceCard, setScienceCard] = useState(null);
  const [scienceCardTimer, setScienceCardTimer] = useState(null);
  const [showLanding, setShowLanding] = useState(!user);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasCompletedWelcome, setHasCompletedWelcome] = useState(false);
  const [showLongevityOnboarding, setShowLongevityOnboarding] = useState(false);
  const [useSimplifiedDashboard, setUseSimplifiedDashboard] = useState(true);

  useEffect(() => {
    const onboarded = localStorage.getItem('vita-onboarded');
    const welcomeCompleted = localStorage.getItem('vita-welcome-completed');
    const longevityOnboarded = localStorage.getItem('vita-longevity-onboarded');
    const dashboardPreference = localStorage.getItem('vita-dashboard-preference');

    setIsOnboarded(onboarded === 'true');
    setHasCompletedWelcome(welcomeCompleted === 'true');
    setUseSimplifiedDashboard(dashboardPreference !== 'complex');

    // Show longevity onboarding for new users or those who haven't seen it
    if (user && !longevityOnboarded) {
      setShowLongevityOnboarding(true);
    }

    // Show welcome screen for new users after authentication
    if (user && !welcomeCompleted) {
      setShowWelcome(true);
      setShowLanding(false);
    } else if (user) {
      setShowLanding(false);
    }

    // Set up timed science cards if user is logged in and onboarded
    if (user && onboarded === 'true') {
      setScienceCardTimer(
        setTimeout(() => {
          showRandomScienceCard();
        }, 30000) // Show first card after 30 seconds
      );
    }

    return () => {
      if (scienceCardTimer) clearTimeout(scienceCardTimer);
    };
  }, [user]);

  // Handle longevity onboarding completion
  const handleLongevityOnboardingComplete = () => {
    localStorage.setItem('vita-longevity-onboarded', 'true');
    setShowLongevityOnboarding(false);
  };

  const scienceCardData = [
    {
      title: 'HRV and Stress Resilience',
      content: 'Heart Rate Variability (HRV) is a powerful biomarker of your autonomic nervous system. Higher variability indicates better stress recovery capacity and overall health. Regular measurement can help you optimize your daily activities.',
      source: 'Thayer & Lane (2009), Neuroscience & Biobehavioral Reviews'
    },
    {
      title: 'Circadian Rhythm and Health',
      content: 'Nearly every cell in your body contains a molecular clock that regulates thousands of genes involved in inflammation control, energy metabolism, and cellular repair. These clocks are cued by light, food timing, exercise, and temperature.',
      source: 'Cell (2017), Dr. Satchin Panda, Salk Institute'
    },
    {
      title: 'Movement and Brain Health',
      content: 'Even light physical activity increases BDNF (Brain-Derived Neurotrophic Factor), a protein that supports neuron survival, synapse growth, memory formation, mood regulation, and cognitive flexibility.',
      source: 'Neuroscience & Biobehavioral Reviews (2020)'
    },
    {
      title: 'Breathwork Benefits',
      content: 'Controlled breathing techniques like box breathing and physiological sighs directly influence your vagus nerve, activating the parasympathetic nervous system and reducing stress hormones like cortisol.',
      source: 'Zaccaro et al. (2018), Frontiers in Psychology'
    },
    {
      title: 'Social Connection and Longevity',
      content: 'Strong social connections can increase longevity by up to 50% and reduce the risk of depression, anxiety, and cognitive decline. Social support directly impacts immune function and stress response.',
      source: 'Holt-Lunstad et al. (2010), PLoS Medicine'
    }
  ];

  const showRandomScienceCard = () => {
    const randomIndex = Math.floor(Math.random() * scienceCardData.length);
    setScienceCard(scienceCardData[randomIndex]);
    
    // Schedule next card to appear after 3-5 minutes
    setScienceCardTimer(
      setTimeout(() => {
        showRandomScienceCard();
      }, Math.random() * (300000 - 180000) + 180000) // 3-5 minutes
    );
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('vita-onboarded', 'true');
    setIsOnboarded(true);

    // Set up science card timer after onboarding
    setScienceCardTimer(
      setTimeout(() => {
        showRandomScienceCard();
      }, 30000) // Show first card after 30 seconds
    );
  };

  const handleWelcomeComplete = () => {
    localStorage.setItem('vita-welcome-completed', 'true');
    setHasCompletedWelcome(true);
    setShowWelcome(false);
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    // This will trigger auth flow
  };

  const handleSignIn = () => {
    setShowLanding(false);
    // This will trigger auth flow
  };

  const showWhyCard = (cardData) => {
    setCurrentWhyCard(cardData);
  };

  const closeWhyCard = () => {
    setCurrentWhyCard(null);
  };
  
  const closeScienceCard = () => {
    setScienceCard(null);
  };

  // Show landing page for non-authenticated users
  if (!user && showLanding) {
    return (
      <LandingPage
        onGetStarted={handleGetStarted}
        onSignIn={handleSignIn}
      />
    );
  }

  // Show auth screen when user wants to sign in
  if (!user) {
    return <AuthScreen />;
  }

  // Show welcome screen for new authenticated users
  if (user && showWelcome && !hasCompletedWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  // Show longevity onboarding for users who haven't seen it
  if (user && showLongevityOnboarding) {
    return <LongevityOnboarding onComplete={handleLongevityOnboardingComplete} />;
  }

  if (user && !isOnboarded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 font-inter">
        <div className="max-w-md mx-auto bg-white shadow-xl min-h-screen relative">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                {useSimplifiedDashboard ? (
                  <SimplifiedDashboard />
                ) : (
                  <>
                    <div className="px-6 pt-4">
                      <ContextualMessage />
                    </div>
                    <Dashboard showWhyCard={showWhyCard} />
                  </>
                )}
              </ProtectedRoute>
            } />
            <Route path="/hrv" element={
              <ProtectedRoute>
                <HRVCheck showWhyCard={showWhyCard} />
              </ProtectedRoute>
            } />
            <Route path="/mind-breath" element={
              <ProtectedRoute>
                <MindBreathHub showWhyCard={showWhyCard} />
              </ProtectedRoute>
            } />
            <Route path="/social" element={
              <ProtectedRoute>
                <SocialHub showWhyCard={showWhyCard} />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/science" element={
              <ProtectedRoute>
                <ScienceHub showWhyCard={showWhyCard} />
              </ProtectedRoute>
            } />
            <Route path="/manual-entry" element={
              <ProtectedRoute>
                <ManualEntryDashboard />
              </ProtectedRoute>
            } />
            <Route path="/reminders" element={
              <ProtectedRoute>
                <RemindersScreen />
              </ProtectedRoute>
            } />
            <Route path="/health-apps" element={
              <ProtectedRoute>
                <HealthAppsRecommendations />
              </ProtectedRoute>
            } />
            <Route path="/camera-hrv" element={
              <ProtectedRoute>
                <HRVDashboard />
              </ProtectedRoute>
            } />
            <Route path="/testing" element={
              <ProtectedRoute>
                <TestingDashboard />
              </ProtectedRoute>
            } />
            <Route path="/social/manage" element={
              <ProtectedRoute>
                <SocialCircleManager />
              </ProtectedRoute>
            } />
            <Route path="/circadian-tracking" element={
              <ProtectedRoute>
                <CircadianTracking />
              </ProtectedRoute>
            } />
            <Route path="/health-metrics" element={
              <ProtectedRoute>
                <HealthMetricsHub />
              </ProtectedRoute>
            } />
            <Route path="/self-connect" element={
              <ProtectedRoute>
                <SelfConnectHub />
              </ProtectedRoute>
            } />
            <Route path="/clock-test" element={<ClockDialTest />} />
            <Route path="/auth" element={
              user ? <Navigate to="/" replace /> : <AuthScreen />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Navigation />
          
          <AnimatePresence>
            {currentWhyCard && (
              <WhyCard 
                data={currentWhyCard} 
                onClose={closeWhyCard}
              />
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {scienceCard && !currentWhyCard && (
              <ScienceCard
                data={scienceCard}
                onClose={closeScienceCard}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </Router>
  );
}

// Wrapped App with context providers
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TimeProvider>
          <ReminderProvider>
            <SocialProvider>
              <AppContent />
            </SocialProvider>
          </ReminderProvider>
        </TimeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;