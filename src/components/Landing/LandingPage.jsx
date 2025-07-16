import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShield, FiZap, FiUsers, FiStar, FiArrowRight, FiPlay, FiCheck, FiMoon, FiSun, FiActivity } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const LandingPage = ({ onGetStarted, onSignIn }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const features = [
    {
      icon: FiHeart,
      title: 'Science-Based Vitality',
      description: 'Track six interconnected pillars of health backed by peer-reviewed research',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: FiShield,
      title: 'Privacy First',
      description: 'Your health data stays private and secure, processed locally on your device',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FiZap,
      title: 'Smart Integration',
      description: 'Automatically capture data from your existing health apps or enter manually',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: FiUsers,
      title: 'Holistic Approach',
      description: 'Unlike single-metric apps, Vita understands the synergy between all health aspects',
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Wellness Researcher',
      content: 'Finally, a health app that respects both science and privacy. The six-pillar approach is revolutionary.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Fitness Enthusiast',
      content: 'Vita helped me understand how my sleep affects my workouts. The insights are incredible.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      role: 'Busy Professional',
      content: 'Love that I can track manually or let it work automatically. Perfect for my lifestyle.',
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Essential',
      price: 'Free',
      period: 'Forever',
      features: [
        'Manual health data entry',
        'Basic vitality tracking',
        'Six pillar insights',
        'Privacy-first approach',
        'Community support'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Vita Pro',
      price: '$9.99',
      period: 'per month',
      features: [
        'Everything in Essential',
        'Smart health app integration',
        'Advanced analytics',
        'Personalized recommendations',
        'Priority support',
        'Export your data'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Vita Family',
      price: '$19.99',
      period: 'per month',
      features: [
        'Everything in Vita Pro',
        'Up to 6 family members',
        'Family health insights',
        'Shared goals and challenges',
        'Family privacy controls',
        'Dedicated family support'
      ],
      cta: 'Start Free Trial',
      popular: false
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      // Here you would typically send the email to your backend
      console.log('Subscribed:', email);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiHeart} className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Vita</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onSignIn}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Build Enduring
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Vitality</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                The first science-based health app that respects your privacy while tracking six interconnected pillars of vitality for lasting wellness transformation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Start Your Journey</span>
                  <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium text-lg hover:border-gray-400 transition-all flex items-center justify-center space-x-2">
                  <SafeIcon icon={FiPlay} className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiShield} className="w-4 h-4" />
                  <span>Privacy First</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiHeart} className="w-4 h-4" />
                  <span>Science-Based</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUsers} className="w-4 h-4" />
                  <span>10,000+ Beta Users</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Vita is Different</h2>
            <p className="text-xl text-gray-600">
              Most health apps focus on single metrics. Vita understands that true vitality comes from the synergy between all aspects of your health.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center`}>
                  <SafeIcon icon={feature.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Six Pillars Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Six Pillars of Vitality</h2>
            <p className="text-xl text-gray-600">
              Based on decades of longevity research, Vita tracks the six most important aspects of human vitality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FiMoon, title: 'Recovery', color: 'from-yellow-400 to-orange-500' },
              { icon: FiActivity, title: 'Movement', color: 'from-green-400 to-emerald-500' },
              { icon: FiHeart, title: 'Nutrition', color: 'from-red-400 to-pink-500' },
              { icon: FiSun, title: 'Mindfulness', color: 'from-purple-400 to-indigo-500' },
              { icon: FiZap, title: 'Hydration', color: 'from-blue-400 to-cyan-500' },
              { icon: FiUsers, title: 'Connection', color: 'from-pink-400 to-rose-500' }
            ].map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${pillar.color} rounded-full flex items-center justify-center`}>
                  <SafeIcon icon={pillar.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">{pillar.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Loved by Health Enthusiasts</h2>
            <p className="text-xl text-gray-600">
              Join thousands who have transformed their vitality with Vita's science-based approach.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <SafeIcon key={i} icon={FiStar} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">
              Start free and upgrade when you're ready for advanced features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-8 shadow-sm ${
                  plan.popular ? 'ring-2 ring-purple-600 relative' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                    {plan.price !== 'Free' && <span className="text-gray-600">/{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-purple-100 mb-8">
              Get the latest insights on vitality science and be the first to know about new features.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <SafeIcon icon={FiCheck} className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white font-medium">Thank you for subscribing!</p>
                <p className="text-purple-100 text-sm">You'll receive updates about Vita's journey.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiHeart} className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Vita</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Vita Health. All rights reserved. Built with science, privacy, and care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
