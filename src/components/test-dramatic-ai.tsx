'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AIChatWidget } from './ai-chat-widget';
import { ScoreCardEntry } from './scorecard/ScoreCardEntry';
import { AssessmentFlow } from './scorecard/AssessmentFlow';
import { URLAnalyzer } from './url-analyzer/URLAnalyzer';

interface SuggestionCard {
  title: string;
  prompt: string;
  icon: string;
  color: string;
}

// Interactive Tools (launch special modes)
const INTERACTIVE_TOOLS: SuggestionCard[] = [
  {
    title: "Analyze My Website",
    prompt: "URL_ANALYZER_MODE",
    icon: "🎯",
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "Business Readiness Score",
    prompt: "BUSINESS_ANALYZER_MODE",
    icon: "⚡",
    color: "from-blue-500 to-purple-500"
  }
];

// Chat Starters (business-value focused)
const CHAT_STARTERS: SuggestionCard[] = [
  {
    title: "Show me a $50k automation",
    prompt: "Show me a specific automation project you built that saved a client $50k+ annually. I want to see the before/after, technical approach, and exact ROI calculations.",
    icon: "🧠",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "What's broken in my process?",
    prompt: "I'll describe my current business process and you tell me exactly what's inefficient, what's costing me money, and what should be automated first.",
    icon: "🎯",
    color: "from-red-500 to-orange-500"
  },
  {
    title: "How much time could I save?",
    prompt: "Help me calculate how much time and money I'm losing on manual processes. I want specific numbers and a priority list of what to automate.",
    icon: "⚡",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Challenge my biggest assumption",
    prompt: "I'll tell you my biggest business assumption and you challenge it with data, alternative approaches, and show me what I might be missing.",
    icon: "💻",
    color: "from-purple-500 to-pink-500"
  }
];

export function TestDramaticAI() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showURLAnalyzer, setShowURLAnalyzer] = useState(false);
  const [suggestionsCollapsed, setSuggestionsCollapsed] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadEmail, setLeadEmail] = useState('');
  const chatRef = useRef<{ sendMessage: (message: string) => void }>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSuggestionClick = (prompt: string) => {
    if (prompt === 'URL_ANALYZER_MODE') {
      setShowURLAnalyzer(true);
      return;
    }
    
    if (prompt === 'BUSINESS_ANALYZER_MODE') {
      setShowScorecard(true);
      return;
    }
    
    setSelectedPrompt(prompt);
    setMessageCount(prev => prev + 1);
    
    // Trigger lead capture after 3 messages
    if (messageCount >= 2 && !leadCaptured) {
      setTimeout(() => {
        setShowLeadCapture(true);
      }, 5000); // Show after 5 seconds of engagement
    }
    
    if (chatRef.current) {
      chatRef.current.sendMessage(prompt);
    }
  };

  const handleLeadCapture = async () => {
    if (!leadEmail.trim()) return;
    
    try {
      // Save to Supabase
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('leads').insert([{
        email: leadEmail,
        source: 'ai_widget_engagement',
        message: `Engaged with AI widget. Message count: ${messageCount}. Last prompt: ${selectedPrompt.substring(0, 100)}...`,
        status: 'hot'
      }]);
      
      setLeadCaptured(true);
      setShowLeadCapture(false);
      
      // Send follow-up message through chat
      if (chatRef.current) {
        chatRef.current.sendMessage("Thanks for your email! I'll send you a personalized automation audit within 24 hours. What's your biggest time-waster right now?");
      }
    } catch (error) {
      console.error('Lead capture failed:', error);
    }
  };

  const handleStartAssessment = () => {
    setShowScorecard(false);
    setShowAssessment(true);
  };

  const handleAssessmentComplete = (results: any) => {
    console.log('Assessment completed:', results);
  };

  const handleURLAnalysisComplete = (results: any) => {
    console.log('URL analysis completed:', results);
  };

  const handleBackToChat = () => {
    setShowScorecard(false);
    setShowAssessment(false);
    setShowURLAnalyzer(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSelectedPrompt('');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Floating Widget - Initial State */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.button
              onClick={handleExpand}
              className="w-16 h-16 bg-gradient-to-r from-accent to-purple-500 rounded-full shadow-2xl flex items-center justify-center group hover:shadow-accent/50 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-8 h-8 text-black group-hover:animate-pulse" />
              
              {/* Pulsing Ring Effect */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-accent"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded AI Command Center */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={handleClose}
            />

            {/* Main Container */}
            <motion.div
              initial={{ 
                scale: 0.1, 
                x: "calc(100vw - 100px)", 
                y: "calc(100vh - 100px)",
                opacity: 0 
              }}
              animate={{ 
                scale: 1, 
                x: 0, 
                y: 0,
                opacity: 1 
              }}
              exit={{ 
                scale: 0.1, 
                x: "calc(100vw - 100px)", 
                y: "calc(100vh - 100px)",
                opacity: 0 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 25,
                duration: 0.6 
              }}
              className="fixed inset-2 sm:inset-4 md:inset-8 z-50 flex gap-2 md:gap-4 max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)]"
            >
              {/* Main Chat Area - ChatGPT Style */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-1 bg-black/95 border border-accent/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-full"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-accent/20 to-purple-500/20 p-4 md:p-6 border-b border-accent/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-accent glitch" data-text="AI COMMAND CENTER">
                        AI COMMAND CENTER
                      </h2>
                      <p className="text-gray-400 mt-1 text-sm md:text-base">
                        Direct line to Ahmad Basheer's AI systems
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-10 h-10 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Chat Content Area - ChatGPT Style */}
                <div className="flex-1 flex flex-col">
                  {showURLAnalyzer ? (
                    <div className="flex-1 p-6">
                      <URLAnalyzer 
                        onAnalysisComplete={handleURLAnalysisComplete}
                        onBack={handleBackToChat}
                      />
                    </div>
                  ) : showAssessment ? (
                    <div className="flex-1 p-6">
                      <AssessmentFlow 
                        onComplete={handleAssessmentComplete}
                        onBack={handleBackToChat}
                      />
                    </div>
                  ) : showScorecard ? (
                    <div className="flex-1 flex items-center justify-center p-6">
                      <ScoreCardEntry onStartAssessment={handleStartAssessment} />
                    </div>
                  ) : (
                    <>
                      {/* Chat Messages Area */}
                      <div className="flex-1 overflow-y-auto min-h-0">
                        <div className="max-w-4xl mx-auto p-4">
                          <AIChatWidget 
                            ref={chatRef}
                            personalityId="business"
                            initialPrompt={selectedPrompt}
                            embedded={true}
                            className="w-full border-0 bg-transparent"
                          />
                        </div>
                      </div>
                      
                      {/* Lead Capture Overlay */}
                      <AnimatePresence>
                        {showLeadCapture && !leadCaptured && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-10"
                          >
                            <div className="bg-gray-900 border border-accent/30 rounded-xl p-6 max-w-md mx-4">
                              <div className="text-center mb-4">
                                <div className="text-2xl mb-2">🎯</div>
                                <h3 className="text-xl font-bold text-accent mb-2">You're asking great questions!</h3>
                                <p className="text-gray-300 text-sm">
                                  Want a personalized automation audit for your business? 
                                  I'll analyze your processes and send you a custom roadmap.
                                </p>
                              </div>
                              
                              <div className="space-y-3">
                                <input
                                  type="email"
                                  value={leadEmail}
                                  onChange={(e) => setLeadEmail(e.target.value)}
                                  placeholder="your@email.com"
                                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleLeadCapture();
                                    }
                                  }}
                                />
                                
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleLeadCapture}
                                    disabled={!leadEmail.trim()}
                                    className="flex-1 bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-500/90 text-black py-3 rounded-lg font-bold transition-all disabled:opacity-50"
                                  >
                                    Send My Free Audit
                                  </button>
                                  <button
                                    onClick={() => setShowLeadCapture(false)}
                                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-all"
                                  >
                                    Maybe Later
                                  </button>
                                </div>
                                
                                <p className="text-xs text-gray-400 text-center">
                                  No spam. Just a personalized analysis of your automation opportunities.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Chat Starters - Inside Chat Area */}
                      <div className="border-t border-accent/20 p-4">
                        <div className="max-w-3xl mx-auto">
                          <p className="text-gray-400 text-sm mb-3 text-center">Quick starters:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {CHAT_STARTERS.map((starter, index) => {
                              return (
                                <motion.button
                                  key={starter.title}
                                  initial={{ y: 10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.1 * index }}
                                  onClick={() => handleSuggestionClick(starter.prompt)}
                                  className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-accent/50 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-2"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <span className="text-accent">{starter.icon}</span>
                                  {starter.title}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Interactive Tools Sidebar - Simplified */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  width: suggestionsCollapsed ? '60px' : '280px'
                }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="flex flex-col max-h-full hidden md:flex"
              >
                <div className="bg-black/90 border border-accent/30 rounded-2xl flex-1 flex flex-col overflow-hidden">
                  {suggestionsCollapsed ? (
                    /* Collapsed State */
                    <div className="flex flex-col items-center p-4 space-y-4">
                      <button
                        onClick={() => setSuggestionsCollapsed(false)}
                        className="w-10 h-10 bg-accent/20 hover:bg-accent/30 rounded-lg flex items-center justify-center transition-colors"
                        title="Expand tools"
                      >
                        <ChevronRight className="w-5 h-5 text-accent" />
                      </button>
                      
                      <div className="flex flex-col space-y-3">
                        {INTERACTIVE_TOOLS.map((tool, index) => (
                          <button
                            key={tool.title}
                            onClick={() => handleSuggestionClick(tool.prompt)}
                            className="w-10 h-10 bg-gradient-to-r hover:from-accent/20 hover:to-purple-500/20 border border-accent/30 hover:border-accent/50 rounded-lg flex items-center justify-center transition-all group"
                            title={tool.title}
                          >
                            <div className={`w-5 h-5 bg-gradient-to-r ${tool.color} rounded flex items-center justify-center`}>
                              {tool.icon}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Expanded State */
                    <>
                      <div className="border-b border-accent/20 flex items-center justify-between p-4">
                        <div>
                          <h3 className="text-lg font-bold text-accent mb-1 uppercase tracking-wide">
                            Interactive Tools
                          </h3>
                          <p className="text-gray-400 text-xs">
                            Launch specialized analyzers
                          </p>
                        </div>
                        <button
                          onClick={() => setSuggestionsCollapsed(true)}
                          className="w-8 h-8 bg-accent/20 hover:bg-accent/30 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                          title="Collapse tools"
                        >
                          <ChevronLeft className="w-4 h-4 text-accent" />
                        </button>
                      </div>
                  
                      <div className="flex-1 p-4 space-y-3">
                        {INTERACTIVE_TOOLS.map((tool, index) => (
                          <motion.button
                            key={tool.title}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            onClick={() => handleSuggestionClick(tool.prompt)}
                            className="w-full p-4 bg-gradient-to-r hover:from-accent/20 hover:to-purple-500/20 border border-accent/30 hover:border-accent/50 rounded-lg text-left transition-all duration-300 group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-8 h-8 bg-gradient-to-r ${tool.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                {tool.icon}
                              </div>
                              <h4 className="font-semibold text-white group-hover:text-accent transition-colors text-sm">
                                {tool.title}
                              </h4>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed">
                              Launch interactive analysis tool
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}