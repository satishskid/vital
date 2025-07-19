import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiMicOff, FiPlay, FiPause, FiHeart, FiStar, FiRefreshCw } from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const VoiceGuidedJournal = ({ onJournalEntry, todayEntries = [] }) => {
  const [showJournal, setShowJournal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [journalMode, setJournalMode] = useState('guided'); // 'guided' or 'free'
  const [autoDeleteEnabled, setAutoDeleteEnabled] = useState(true);
  const [deleteAfterHours, setDeleteAfterHours] = useState(24);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  // Voice-guided prompts for positive self-narrative
  const guidedPrompts = [
    {
      id: 'gratitude',
      title: 'Gratitude Reflection',
      prompt: 'Take a moment to think about three things you\'re grateful for today. They can be big or small. What made you feel thankful?',
      followUp: 'How did focusing on gratitude change how you feel right now?'
    },
    {
      id: 'accomplishment',
      title: 'Daily Wins',
      prompt: 'What\'s one thing you accomplished today that you\'re proud of? It doesn\'t have to be huge - even small progress counts.',
      followUp: 'What strengths or qualities helped you achieve this?'
    },
    {
      id: 'self-compassion',
      title: 'Self-Compassion',
      prompt: 'If you\'re being hard on yourself about something, imagine what you\'d say to a good friend in the same situation. What kind words would you offer?',
      followUp: 'How can you extend that same compassion to yourself?'
    },
    {
      id: 'growth',
      title: 'Growth Mindset',
      prompt: 'Think about a challenge you faced today. What did you learn from it? How did it help you grow?',
      followUp: 'What would you tell your past self about handling similar challenges?'
    },
    {
      id: 'future-self',
      title: 'Future Self Wisdom',
      prompt: 'Imagine your wisest, most confident future self. What advice would they give you about your current situation?',
      followUp: 'What small step can you take tomorrow to move toward becoming that person?'
    },
    {
      id: 'values',
      title: 'Values Alignment',
      prompt: 'What values are most important to you? How did you honor those values today?',
      followUp: 'How can you align your actions even more closely with your values tomorrow?'
    }
  ];

  useEffect(() => {
    // Select a random prompt when journal opens
    if (showJournal && !currentPrompt) {
      const randomPrompt = guidedPrompts[Math.floor(Math.random() * guidedPrompts.length)];
      setCurrentPrompt(randomPrompt);
    }
  }, [showJournal]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        
        // Simulate transcription (in production, use speech-to-text API)
        simulateTranscription();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const simulateTranscription = () => {
    // Simulate transcription delay
    setTimeout(() => {
      const mockTranscriptions = [
        "I'm grateful for the warm sunshine today, my morning coffee, and the encouraging text from my friend. Focusing on these things makes me feel more centered and positive.",
        "I'm proud that I completed my work presentation today even though I was nervous. It shows that I can push through discomfort and deliver when it matters.",
        "I would tell a friend that it's okay to make mistakes and that they're learning. I should remember that I'm human too and treat myself with the same kindness.",
        "The challenge with my project taught me to break big tasks into smaller steps. I'm becoming more organized and patient with myself.",
        "My future self would remind me that this difficult period is temporary and that I'm building resilience. Take it one day at a time.",
        "I value authenticity and kindness. Today I honored these by being honest in my conversation and helping a colleague with their work."
      ];
      
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      setTranscription(randomTranscription);
    }, 1500);
  };

  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const saveJournalEntry = () => {
    const entryData = {
      type: 'voice-journal',
      mode: journalMode,
      prompt: currentPrompt,
      transcription: transcription,
      audioBlob: audioBlob,
      timestamp: new Date(),
      mood: 'positive', // Could be enhanced with sentiment analysis
      privacy: 'high',
      autoDelete: autoDeleteEnabled,
      deleteAfter: deleteAfterHours
    };

    onJournalEntry(entryData);

    // Schedule auto-deletion if enabled
    if (autoDeleteEnabled) {
      scheduleAutoDeletion(entryData);
    }

    resetJournal();
  };

  const scheduleAutoDeletion = (entryData) => {
    const deleteTime = deleteAfterHours * 60 * 60 * 1000; // Convert hours to milliseconds

    setTimeout(() => {
      // In a real app, this would remove from database
      console.log(`Auto-deleting journal entry from ${entryData.timestamp}`);
    }, deleteTime);
  };

  const resetJournal = () => {
    setShowJournal(false);
    setIsRecording(false);
    setIsPlaying(false);
    setCurrentPrompt(null);
    setAudioBlob(null);
    setTranscription('');
  };

  const getNewPrompt = () => {
    const availablePrompts = guidedPrompts.filter(p => p.id !== currentPrompt?.id);
    const newPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
    setCurrentPrompt(newPrompt);
    setAudioBlob(null);
    setTranscription('');
  };

  return (
    <>
      <button
        onClick={() => setShowJournal(true)}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
      >
        <SafeIcon icon={FiMic} className="w-4 h-4" />
        <span>🎙️ Voice Journal</span>
      </button>

      <AnimatePresence>
        {showJournal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={resetJournal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Voice-Guided Journal
                </h3>
                <p className="text-sm text-gray-600">
                  Reflect on your day with guided prompts for positive self-narrative
                </p>
              </div>

              {/* Mode Selection */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setJournalMode('guided')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    journalMode === 'guided'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Guided
                </button>
                <button
                  onClick={() => setJournalMode('free')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    journalMode === 'free'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Free Form
                </button>
              </div>

              {/* Privacy Settings */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg">🔒</span>
                  <h4 className="font-medium text-yellow-800">Privacy Protection</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700">Auto-delete recordings</span>
                    <button
                      onClick={() => setAutoDeleteEnabled(!autoDeleteEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        autoDeleteEnabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        autoDeleteEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  {autoDeleteEnabled && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-700">Delete after:</span>
                      <select
                        value={deleteAfterHours}
                        onChange={(e) => setDeleteAfterHours(Number(e.target.value))}
                        className="text-sm bg-white border border-yellow-300 rounded px-2 py-1"
                      >
                        <option value={1}>1 hour</option>
                        <option value={6}>6 hours</option>
                        <option value={24}>24 hours</option>
                        <option value={168}>1 week</option>
                      </select>
                    </div>
                  )}

                  <p className="text-xs text-yellow-600">
                    {autoDeleteEnabled
                      ? `Your recordings will be automatically deleted after ${deleteAfterHours} hour${deleteAfterHours !== 1 ? 's' : ''} for maximum privacy.`
                      : 'Recordings will be stored until manually deleted.'
                    }
                  </p>
                </div>
              </div>

              {/* Guided Prompt */}
              {journalMode === 'guided' && currentPrompt && (
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-pink-800">{currentPrompt.title}</h4>
                    <button
                      onClick={getNewPrompt}
                      className="text-pink-600 hover:text-pink-800"
                    >
                      <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-pink-700 mb-3">{currentPrompt.prompt}</p>
                  {currentPrompt.followUp && (
                    <p className="text-xs text-pink-600 italic">{currentPrompt.followUp}</p>
                  )}
                </div>
              )}

              {/* Free Form Prompt */}
              {journalMode === 'free' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">Free Reflection</h4>
                  <p className="text-sm text-blue-700">
                    Share whatever is on your mind. What went well today? What are you feeling grateful for? 
                    What would you like to remember about this moment?
                  </p>
                </div>
              )}

              {/* Recording Controls */}
              <div className="text-center mb-6">
                {!isRecording && !audioBlob && (
                  <button
                    onClick={startRecording}
                    className="w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <SafeIcon icon={FiMic} className="w-8 h-8" />
                  </button>
                )}

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center animate-pulse"
                  >
                    <SafeIcon icon={FiMicOff} className="w-8 h-8" />
                  </button>
                )}

                {audioBlob && (
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={isPlaying ? pauseRecording : playRecording}
                      className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-5 h-5" />
                    </button>
                    <button
                      onClick={startRecording}
                      className="w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
              </div>

              {/* Recording Status */}
              <div className="text-center mb-4">
                {isRecording && (
                  <p className="text-red-600 font-medium">🔴 Recording... Tap to stop</p>
                )}
                {audioBlob && !transcription && (
                  <p className="text-blue-600">Processing your reflection...</p>
                )}
              </div>

              {/* Transcription */}
              {transcription && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">Your Reflection</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{transcription}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={resetJournal}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                {transcription && (
                  <button
                    onClick={saveJournalEntry}
                    className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-600 transition-colors"
                  >
                    Save Reflection
                  </button>
                )}
              </div>

              {/* Today's Entries Count */}
              {todayEntries.length > 0 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    ✨ {todayEntries.length} reflection{todayEntries.length !== 1 ? 's' : ''} today
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceGuidedJournal;
