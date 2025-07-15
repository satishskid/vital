import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiBookOpen, FiBrain, FiClock, FiActivity, FiHeart, FiSun, FiMoon, FiInfo } = FiIcons;

const ScienceHub = ({ showWhyCard }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Research' },
    { id: 'circadian', label: 'Circadian Rhythm', icon: FiClock },
    { id: 'movement', label: 'Movement', icon: FiActivity },
    { id: 'stress', label: 'Controlled Stress', icon: FiBrain },
    { id: 'sleep', label: 'Sleep', icon: FiMoon },
    { id: 'nutrition', label: 'Nutrition', icon: FiSun }
  ];

  const researchCards = [
    {
      id: 1,
      category: 'circadian',
      title: 'Cellular Molecular Clocks',
      year: 2017,
      source: 'Cell',
      preview: 'Nearly every cell contains a molecular clock regulating thousands of genes involved in inflammation control, energy metabolism, and cellular repair.',
      content: 'A pivotal paper published in Cell outlines that nearly every cell in the body contains a molecular clock. These clocks regulate thousands of genes involved in inflammation control, energy metabolism, and cellular repair, all crucial for healthy ageing. These clocks are cued by light, food timing, exercise, and temperature.',
      icon: FiClock,
      researcher: 'Dr. Satchin Panda',
      institution: 'Salk Institute'
    },
    {
      id: 2,
      category: 'circadian',
      title: 'Time-Restricted Feeding Benefits',
      year: 2019,
      source: 'Cell Metabolism',
      preview: 'Eating within an 8-10 hour window during daylight resets circadian genes and improves metabolic health.',
      content: 'Dr. Satchin Panda\'s research at the Salk Institute has demonstrated that time-restricted feeding (limiting food intake to an 8-10 hour window during daylight) effectively resets circadian genes and significantly improves metabolic health, even without changes to diet composition.',
      icon: FiClock,
      researcher: 'Dr. Satchin Panda',
      institution: 'Salk Institute'
    },
    {
      id: 3,
      category: 'movement',
      title: 'BDNF and Brain Health',
      year: 2020,
      source: 'Neuroscience & Biobehavioral Reviews',
      preview: 'Physical activity increases BDNF, supporting neuron survival, synapse growth, memory, mood, and cognitive flexibility.',
      content: 'Regular physical activity increases Brain-Derived Neurotrophic Factor (BDNF), a protein that supports neuron survival, synapse growth, memory formation, mood regulation, and cognitive flexibility. Even light movement has been shown to effectively stimulate BDNF production.',
      icon: FiActivity,
      researcher: 'Meta-analysis',
      institution: 'Multiple institutions'
    },
    {
      id: 4,
      category: 'movement',
      title: 'Hippocampal Volume and Exercise',
      year: 2018,
      source: 'PNAS',
      preview: 'Regular physical activity increases hippocampal volume, counteracting age-related shrinkage.',
      content: 'A meta-analysis published in PNAS concludes that aerobic exercise can reshape aging brains to resemble younger ones, particularly in the hippocampus (critical for memory). Regular physical activity, even light activity, increases hippocampal volume, counteracting age-related shrinkage.',
      icon: FiActivity,
      researcher: 'Meta-analysis',
      institution: 'Multiple institutions'
    },
    {
      id: 5,
      category: 'stress',
      title: 'Controlled Stress and Brain Function',
      year: 2013,
      source: 'Frontiers in Human Neuroscience',
      preview: 'Short bouts of controlled stress boost prefrontal cortex activity, enhancing emotion regulation and executive function.',
      content: 'A study published in Frontiers in Human Neuroscience demonstrates that short bouts of controlled stress (e.g., public speaking, cold water immersion) boost activity in the prefrontal cortex, enhancing emotion regulation and executive function. This highlights stress as a training signal for the brain.',
      icon: FiBrain,
      researcher: 'Multiple researchers',
      institution: 'Multiple institutions'
    },
    {
      id: 6,
      category: 'stress',
      title: 'Cold Exposure and Dopamine',
      year: 2022,
      source: 'Neuroscience and Biobehavioral Reviews',
      preview: 'Short cold exposure increases dopamine by up to 250%, enhancing focus and stress tolerance.',
      content: 'A 2022 study published in Neuroscience and Biobehavioral Reviews shows that short cold exposure (e.g., 1-2 minute cold shower) increases dopamine levels by up to 250%, enhancing focus, motivation, and stress tolerance. The study suggests this as an accessible daily practice for cognitive enhancement.',
      icon: FiBrain,
      researcher: 'Multiple researchers',
      institution: 'Multiple institutions'
    },
    {
      id: 7,
      category: 'sleep',
      title: 'Sleep and the Glymphatic System',
      year: 2021,
      source: 'Science Advances',
      preview: 'Deep non-REM sleep activates the glymphatic system, flushing out metabolic byproducts linked to neurodegeneration.',
      content: 'Deep non-REM sleep is identified as crucial for the glymphatic system to flush out metabolic byproducts, including beta-amyloid, which is linked to Alzheimer\'s disease. This "brain cleaning" process is up to 10 times more active during deep sleep compared to wakefulness.',
      icon: FiMoon,
      researcher: 'Multiple researchers',
      institution: 'University of Rochester Medical Center'
    },
    {
      id: 8,
      category: 'sleep',
      title: 'Sleep and Hormonal Balance',
      year: 2019,
      source: 'Journal of Clinical Endocrinology & Metabolism',
      preview: 'Quality sleep is vital for growth hormone release, cortisol balance, and tissue regeneration.',
      content: 'Sleep is confirmed as vital for growth hormone release, cortisol balance, and muscle/tissue regeneration. Studies show that consistent sleep deficiency disrupts these hormonal patterns, accelerating biological aging and impairing cognitive function.',
      icon: FiMoon,
      researcher: 'Multiple researchers',
      institution: 'Multiple institutions'
    },
    {
      id: 9,
      category: 'nutrition',
      title: 'Omega-3s and Brain Volume',
      year: 2014,
      source: 'Neurology',
      preview: 'Higher omega-3 levels correlate with larger brain volume in aging adults, particularly in memory-related areas.',
      content: 'A meta-analysis published in Neurology finds a correlation between higher omega-3 levels and larger brain volume in aging adults, particularly in memory and cognition-related areas. The study suggests that adequate omega-3 intake may help maintain brain structure and function during aging.',
      icon: FiSun,
      researcher: 'Meta-analysis',
      institution: 'Multiple institutions'
    },
    {
      id: 10,
      category: 'nutrition',
      title: 'Polyphenols and Cognitive Function',
      year: 2020,
      source: 'Journal of Nutritional Biochemistry',
      preview: 'Polyphenols from berries, green tea, and dark chocolate have antioxidant and anti-inflammatory effects on brain function.',
      content: 'Polyphenols (found in berries, green tea, dark chocolate) are recognized for their antioxidant, anti-inflammatory, and brain-modulating effects on learning and memory. Regular consumption has been linked to improved cognitive performance and reduced risk of age-related cognitive decline.',
      icon: FiSun,
      researcher: 'Multiple researchers',
      institution: 'Multiple institutions'
    }
  ];

  const filteredCards = activeCategory === 'all' 
    ? researchCards 
    : researchCards.filter(card => card.category === activeCategory);

  const handleCardClick = (card) => {
    showWhyCard({
      title: card.title,
      content: card.content,
      source: `${card.researcher ? card.researcher + ', ' : ''}${card.year}, ${card.source}${card.institution ? ' (' + card.institution + ')' : ''}`
    });
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">How I Work</h1>
            <p className="text-gray-600">The science behind Vita</p>
          </div>
          <motion.button
            onClick={() => showWhyCard({
              title: 'Evidence-Based Approach',
              content: 'Vita is built on cutting-edge research in neuroscience, chronobiology, and behavioral psychology. Every feature and recommendation is grounded in peer-reviewed scientific studies from leading research institutions.',
              source: 'Vita Research Team'
            })}
            className="bg-indigo-100 text-indigo-600 p-3 rounded-full"
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiInfo} className="w-6 h-6" />
          </motion.button>
        </div>

        {/* The Golden Habits */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">The Six Golden Habits</h2>
          <p className="text-sm text-gray-700 mb-3">
            Research has identified six key habits that work synergistically to support healthy aging and cognitive function.
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Circadian', icon: FiClock },
              { label: 'Movement', icon: FiActivity },
              { label: 'Stress', icon: FiBrain },
              { label: 'Sleep', icon: FiMoon },
              { label: 'Nutrition', icon: FiSun },
              { label: 'Mindset', icon: FiHeart }
            ].map((habit, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="bg-amber-50 p-2 rounded-full mb-1">
                  <SafeIcon icon={habit.icon} className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-xs text-gray-700">{habit.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`py-2 px-3 rounded-md font-medium transition-colors text-xs whitespace-nowrap ${
                activeCategory === category.id 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {category.icon && (
                <SafeIcon icon={category.icon} className="w-3 h-3 inline-block mr-1" />
              )}
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="space-y-4">
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm"
              onClick={() => handleCardClick(card)}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  ${card.category === 'circadian' ? 'bg-blue-100 text-blue-600' : 
                    card.category === 'movement' ? 'bg-green-100 text-green-600' :
                    card.category === 'stress' ? 'bg-purple-100 text-purple-600' :
                    card.category === 'sleep' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-amber-100 text-amber-600'} 
                  p-3 rounded-full flex-shrink-0
                `}>
                  <SafeIcon icon={card.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">{card.title}</h3>
                    <span className="text-xs text-gray-500">{card.year}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{card.preview}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiBookOpen} className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{card.source}</span>
                    </div>
                    {card.researcher && (
                      <span className="text-xs text-gray-500">{card.researcher}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Researchers Section */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Key Researchers</h3>
          <div className="space-y-4">
            {[
              {
                name: 'Dr. Satchin Panda',
                institution: 'Salk Institute',
                focus: 'Circadian rhythm and time-restricted eating',
                icon: FiClock
              },
              {
                name: 'Dr. Alia Crum',
                institution: 'Stanford University',
                focus: 'Mindset science and stress reframing',
                icon: FiBrain
              },
              {
                name: 'Dr. Ethan Kross',
                institution: 'University of Michigan',
                focus: 'Self-distanced inner speech',
                icon: FiHeart
              },
              {
                name: 'Dr. Becca Levy',
                institution: 'Yale University',
                focus: 'Aging beliefs and longevity',
                icon: FiHeart
              }
            ].map((researcher, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`
                  ${researcher.icon === FiClock ? 'bg-blue-100 text-blue-600' : 
                    researcher.icon === FiBrain ? 'bg-purple-100 text-purple-600' :
                    'bg-rose-100 text-rose-600'} 
                  p-2 rounded-full
                `}>
                  <SafeIcon icon={researcher.icon} className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{researcher.name}</h4>
                  <p className="text-xs text-gray-500">{researcher.institution}</p>
                  <p className="text-sm text-gray-600 mt-1">{researcher.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Research Timeline</h3>
          <div className="relative pl-8 border-l-2 border-gray-200 space-y-8">
            {[
              {
                year: 2013,
                title: 'Controlled Stress Study',
                description: 'Research shows short bouts of controlled stress boost prefrontal cortex activity.'
              },
              {
                year: 2014,
                title: 'Omega-3s and Brain Volume',
                description: 'Meta-analysis links higher omega-3 levels with larger brain volume in aging adults.'
              },
              {
                year: 2017,
                title: 'Cellular Molecular Clocks',
                description: 'Pivotal paper outlines how molecular clocks in cells regulate genes crucial for healthy aging.'
              },
              {
                year: 2019,
                title: 'Time-Restricted Feeding',
                description: 'Dr. Panda demonstrates eating within an 8-10 hour window improves metabolic health.'
              },
              {
                year: 2022,
                title: 'Cold Exposure Research',
                description: 'Study shows short cold exposure increases dopamine by up to 250%.'
              }
            ].map((event, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-10 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                </div>
                <div className="mb-1 flex items-center">
                  <span className="text-sm font-semibold text-indigo-600">{event.year}</span>
                </div>
                <h4 className="text-base font-medium text-gray-800">{event.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScienceHub;