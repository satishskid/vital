import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../context/FirebaseAuthContext';
import VitaSocialCircleManager from '../../services/SocialCircleManager';

const { FiHeart, FiUsers, FiArrowRight, FiCheck, FiUserPlus } = FiIcons;

const Onboarding = ({ onComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedBarriers, setSelectedBarriers] = useState([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState('friend');
  const [inviteLoading, setInviteLoading] = useState(false);

  const steps = [
    {
      title: 'Welcome to Vita',
      subtitle: 'Your journey to better health starts here',
      type: 'welcome'
    },
    {
      title: 'What are your health goals?',
      subtitle: 'Select all that apply',
      type: 'goals'
    },
    {
      title: 'What challenges do you face?',
      subtitle: 'Help us understand your barriers',
      type: 'barriers'
    },
    {
      title: 'Set Up Your Support Circle',
      subtitle: 'Invite friends and family to join your journey',
      type: 'support'
    },
    {
      title: 'You\'re All Set!',
      subtitle: 'Ready to start your wellness journey',
      type: 'complete'
    }
  ];

  const goals = [
    'Manage Pre-diabetes',
    'Improve Sleep Quality',
    'Reduce Stress',
    'Increase Energy',
    'Better Heart Health',
    'Cognitive Wellness',
    'Weight Management',
    'Build Healthy Habits'
  ];

  const barriers = [
    'Lack of Time',
    'Feeling Overwhelmed',
    'No Motivation',
    'Physical Limitations',
    'Technology Confusion',
    'Lack of Support',
    'Previous Failures',
    'Too Much Information'
  ];

  const handleGoalToggle = (goal) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleBarrierToggle = (barrier) => {
    setSelectedBarriers(prev =>
      prev.includes(barrier)
        ? prev.filter(b => b !== barrier)
        : [...prev, barrier]
    );
  };

  const handleInviteFriend = async () => {
    if (!inviteEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    setInviteLoading(true);
    try {
      const socialManager = new VitaSocialCircleManager(user.uid);
      await socialManager.addContact({
        name: inviteEmail.split('@')[0], // Use email prefix as name
        email: inviteEmail,
        relationship: inviteRelationship,
        trackingEnabled: true,
        privacyLevel: 'standard'
      });

      alert('Friend invited successfully! They will appear in your support circle once they join.');
      setInviteEmail('');
      setShowInviteForm(false);
    } catch (error) {
      console.error('Error inviting friend:', error);
      alert('Failed to send invite. Please try again.');
    } finally {
      setInviteLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].type) {
      case 'goals':
        return selectedGoals.length > 0;
      case 'barriers':
        return selectedBarriers.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white">
      {/* Progress Bar */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm text-gray-600">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-emerald-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-600">
                {steps[currentStep].subtitle}
              </p>
            </div>

            {/* Step Content */}
            <div className="flex-1">
              {steps[currentStep].type === 'welcome' && (
                <div className="text-center">
                  <div className="bg-gradient-to-br from-emerald-100 to-blue-100 p-8 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                    <SafeIcon icon={FiHeart} className="w-16 h-16 text-emerald-600" />
                  </div>
                  <div className="space-y-4 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="bg-emerald-100 p-1 rounded-full mt-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Science-Based Approach</h3>
                        <p className="text-sm text-gray-600">Every feature backed by research</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-1 rounded-full mt-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Automated Tracking</h3>
                        <p className="text-sm text-gray-600">Less logging, more living</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-1 rounded-full mt-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Human Connection</h3>
                        <p className="text-sm text-gray-600">Build meaningful support networks</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {steps[currentStep].type === 'goals' && (
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <motion.button
                      key={goal}
                      onClick={() => handleGoalToggle(goal)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedGoals.includes(goal)
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{goal}</span>
                        {selectedGoals.includes(goal) && (
                          <SafeIcon icon={FiCheck} className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {steps[currentStep].type === 'barriers' && (
                <div className="space-y-3">
                  {barriers.map((barrier) => (
                    <motion.button
                      key={barrier}
                      onClick={() => handleBarrierToggle(barrier)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedBarriers.includes(barrier)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{barrier}</span>
                        {selectedBarriers.includes(barrier) && (
                          <SafeIcon icon={FiCheck} className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}



              {steps[currentStep].type === 'support' && (
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                    <SafeIcon icon={FiUsers} className="w-16 h-16 text-blue-600" />
                  </div>
                  <div className="space-y-4 mb-8">
                    <p className="text-gray-600">
                      Invite 1-3 close friends or family members to join your support circle.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Why Support Matters</h3>
                      <p className="text-sm text-gray-600">
                        Research shows that people with strong social support are 50% more likely to maintain healthy habits.
                      </p>
                    </div>
                  </div>

                  {!showInviteForm ? (
                    <motion.button
                      onClick={() => setShowInviteForm(true)}
                      className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium mb-4 flex items-center justify-center space-x-2"
                      whileTap={{ scale: 0.98 }}
                    >
                      <SafeIcon icon={FiUserPlus} className="w-5 h-5" />
                      <span>Invite Friends</span>
                    </motion.button>
                  ) : (
                    <div className="space-y-4 mb-4">
                      <div className="space-y-3">
                        <input
                          type="email"
                          placeholder="Friend's email address"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select
                          value={inviteRelationship}
                          onChange={(e) => setInviteRelationship(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="friend">Friend</option>
                          <option value="family">Family</option>
                          <option value="partner">Partner</option>
                          <option value="close_friend">Close Friend</option>
                        </select>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          onClick={handleInviteFriend}
                          disabled={inviteLoading}
                          className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium disabled:opacity-50"
                          whileTap={{ scale: 0.98 }}
                        >
                          {inviteLoading ? 'Sending...' : 'Send Invite'}
                        </motion.button>
                        <motion.button
                          onClick={() => setShowInviteForm(false)}
                          className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600"
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={nextStep}
                    className="text-gray-500 text-sm"
                  >
                    Skip for now
                  </button>
                </div>
              )}

              {steps[currentStep].type === 'complete' && (
                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                    <SafeIcon icon={FiCheck} className="w-16 h-16 text-green-600" />
                  </div>
                  <div className="space-y-4 mb-8">
                    <p className="text-gray-600">
                      You've completed the setup! Your personalized wellness journey is ready to begin.
                    </p>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">What's Next?</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Start with your first HRV check</li>
                        <li>• Explore breathing exercises</li>
                        <li>• Connect with your support circle</li>
                        <li>• Build your daily routine</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 pt-0">
        <motion.button
          onClick={nextStep}
          disabled={!canProceed()}
          className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors ${
            canProceed()
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          whileTap={canProceed() ? { scale: 0.98 } : {}}
        >
          <span>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
          </span>
          <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default Onboarding;