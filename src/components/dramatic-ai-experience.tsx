'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Zap, Brain, Code, Rocket, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { AIChatWidget } from './ai-chat-widget';
import { ScoreCardEntry } from './scorecard/ScoreCardEntry';
import { AssessmentFlow } from './scorecard/AssessmentFlow';
import { URLAnalyzer } from './url-analyzer/URLAnalyzer';

interface SuggestionCard {
  title: string;
  prompt: string;
  icon: React.ReactNode;
  color: string;
}

// Interactive Tools (launch special modes)
const INTERACTIVE_TOOLS: SuggestionCard[] = [
  {
    title: "Analyze My Website",
    prompt: "URL_ANALYZER_MODE",
    icon: <Target className="w-5 h-5" />,
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "Business Readiness Score",
    prompt: "BUSINESS_ANALYZER_MODE",
    icon: <Zap className="w-5 h-5" />,
    color: "from-blue-500 to-purple-500"
  }
];

// Chat Starters (send prompts to AI)
const CHAT_STARTERS: SuggestionCard[] = [
  {
    title: "Challenge My Idea",
    prompt: "I have a business idea that I think could work. Can you challenge it and help me see potential flaws or improvements? Be direct and honest about what might not work.",
    icon: <Brain className="w-5 h-5" />,
    color: "from-red-500 to-orange-500"
  },
  {
    title: "Technical Deep Dive",
    prompt: "Show me a complex technical automation you've built. I want to understand the architecture, challenges you faced, and how you solved them.",
    icon: <Code className="w-5 h-5" />,
    color: "from-purple-500 to-blue-500"
  },
  {
    title: "What Makes You Different",
    prompt: "What makes your approach to AI automation different from other developers? I want to understand your unique methodology and philosophy.",
    icon: <Zap className="w-5 h-5" />,
    color: "from-yellow-500 to-green-500"
  },
  {
    title: "Automation Opportunity",
    prompt: "I'll describe my business process and you tell me if it's worth automating. Be honest - if it's not worth the effort, tell me why.",
    icon: <Rocket className="w-5 h-5" />,
    color: "from-green-500 to-teal-500"
  }
];

export function DramaticAIExperience() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showURLAnalyzer, setShowURLAnalyzer] = useState(false);
  const [suggestionsCollapsed, setSuggestionsCollapsed] = useState(false);
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
    // We'll need to pass this to the chat widget
    if (chatRef.current) {
      chatRef.current.sendMessage(prompt);
    }
  };

  const handleStartAssessment = () => {
    setShowScorecard(false);
    setShowAssessment(true);
  };

  const handleAssessmentComplete = (results: any) => {
    // Handle assessment completion
    console.log('Assessment completed:', results);
  };

  const handleURLAnalysisComplete = (results: any) => {
    // Handle URL analysis completion
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
              className="fixed inset-4 md:inset-8 z-50 flex gap-6 h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]"
            >
              {/* Main Chat Area */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-1 bg-black/90 border border-accent/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-accent/20 to-purple-500/20 p-6 border-b border-accent/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-accent glitch" data-text="AI COMMAND CENTER">
                        AI COMMAND CENTER
                      </h2>
                      <p className="text-gray-400 mt-1">
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

                {/* Main Content Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {showURLAnalyzer ? (
                    <URLAnalyzer 
                      onAnalysisComplete={handleURLAnalysisComplete}
                      onBack={handleBackToChat}
                    />
                  ) : showAssessment ? (
                    <AssessmentFlow 
                      onComplete={handleAssessmentComplete}
                      onBack={handleBackToChat}
                    />
                  ) : showScorecard ? (
                    <div className="h-full flex items-center justify-center">
                      <ScoreCardEntry onStartAssessment={handleStartAssessment} />
                    </div>
                  ) : (
                    <div className="h-full max-w-4xl mx-auto">
                      <AIChatWidget 
                        ref={chatRef}
                        personalityId="business"
                        initialPrompt={selectedPrompt}
                        embedded={true}
                        className="h-full border-0 bg-transparent"
                      />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Suggestions Sidebar */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  width: suggestionsCollapsed ? '60px' : '384px'
                }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="flex flex-col max-h-full"
              >
                {/* Suggestions Container with Scroll */}
                <div className="bg-black/90 border border-accent/30 rounded-2xl flex-1 flex flex-col overflow-hidden">
                  {suggestionsCollapsed ? (
                    /* Collapsed State - Vertical Icons */
                    <div className="flex flex-col items-center p-4 space-y-4">
                      <button
                        onClick={() => setSuggestionsCollapsed(false)}
                        className="w-10 h-10 bg-accent/20 hover:bg-accent/30 rounded-lg flex items-center justify-center transition-colors"
                        title="Expand suggestions"
                      >
                        <ChevronRight className="w-5 h-5 text-accent" />
                      </button>
                      
                      {/* Quick Access Icons */}
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
                      {/* Header with Toggle */}
                      <div className="border-b border-accent/20 flex items-center justify-between p-6">
                        <div>
                          <h3 className="text-lg font-bold text-accent mb-1 uppercase tracking-wide">
                            Quick Start
                          </h3>
                          <p className="text-gray-400 text-xs">
                            Tools & conversation starters
                          </p>
                        </div>
                        <button
                          onClick={() => setSuggestionsCollapsed(true)}
                          className="w-8 h-8 bg-accent/20 hover:bg-accent/30 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                          title="Collapse suggestions"
                        >
                          <ChevronLeft className="w-4 h-4 text-accent" />
                        </button>
                      </div>
                  
                      {/* Scrollable Suggestions */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-accent/30 scrollbar-track-transparent">
                    {/* Interactive Tools Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                        <Target className="w-4 h-4 text-accent" />
                        Interactive Tools
                      </h4>
                      <div className="space-y-2">
                        {INTERACTIVE_TOOLS.map((tool, index) => (
                          <motion.button
                            key={tool.title}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            onClick={() => handleSuggestionClick(tool.prompt)}
                            className="w-full p-3 bg-gradient-to-r hover:from-accent/20 hover:to-purple-500/20 border border-accent/30 hover:border-accent/50 rounded-lg text-left transition-all duration-300 group"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-6 h-6 bg-gradient-to-r ${tool.color} rounded-md flex items-center justify-center flex-shrink-0`}>
                                {tool.icon}
                              </div>
                              <h4 className="font-semibold text-white group-hover:text-accent transition-colors text-xs">
                                {tool.title}
                              </h4>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed ml-8">
                              Launch interactive tool
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Chat Starters Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-accent" />
                        Ask Ahmad
                      </h4>
                      <div className="space-y-2">
                        {CHAT_STARTERS.map((suggestion, index) => (
                          <motion.button
                            key={suggestion.title}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            onClick={() => handleSuggestionClick(suggestion.prompt)}
                            className="w-full p-3 bg-gradient-to-r hover:from-accent/20 hover:to-purple-500/20 border border-white/10 hover:border-accent/50 rounded-lg text-left transition-all duration-300 group"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-6 h-6 bg-gradient-to-r ${suggestion.color} rounded-md flex items-center justify-center flex-shrink-0`}>
                                {suggestion.icon}
                              </div>
                              <h4 className="font-semibold text-white group-hover:text-accent transition-colors text-xs">
                                {suggestion.title}
                              </h4>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed ml-8">
                              {suggestion.prompt.substring(0, 60)}...
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Status Indicator */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-black/90 border border-green-500/30 rounded-2xl p-4 mt-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div>
                      <p className="text-green-400 font-semibold text-sm">AI SYSTEMS ONLINE</p>
                      <p className="text-gray-400 text-xs">Mistral + Gemini Fallback Active</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}