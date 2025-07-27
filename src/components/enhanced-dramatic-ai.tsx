'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Zap, Brain, Code, Rocket, Target, ChevronLeft, ChevronRight, ThumbsUp, Zap as MindBlown, DollarSign, Phone, Calendar, Send } from 'lucide-react';
import { AIChatWidget } from './ai-chat-widget';
import { ScoreCardEntry } from './scorecard/ScoreCardEntry';
import { AssessmentFlow } from './scorecard/AssessmentFlow';
import { URLAnalyzer } from './url-analyzer/URLAnalyzer';
import { supabase } from '@/lib/supabase';

interface SuggestionCard {
    title: string;
    prompt: string;
    icon: React.ReactNode;
    color: string;
    businessValue: string;
}

interface LeadCaptureData {
    email: string;
    name: string;
    interest: string;
}

// Interactive Tools
const INTERACTIVE_TOOLS: SuggestionCard[] = [
    {
        title: "Analyze My Website",
        prompt: "URL_ANALYZER_MODE",
        icon: <Target className="w-4 h-4" />,
        color: "from-cyan-500 to-blue-500",
        businessValue: "Find automation opportunities"
    },
    {
        title: "Business Readiness Score",
        prompt: "BUSINESS_ANALYZER_MODE",
        icon: <Zap className="w-4 h-4" />,
        color: "from-blue-500 to-purple-500",
        businessValue: "Assess automation potential"
    }
];

// Business-Value Focused Starters
const BUSINESS_STARTERS: SuggestionCard[] = [
    {
        title: "Show me a $50k automation",
        prompt: "Show me a specific automation project you built that saved a client $50,000+ annually. I want to see the before/after, technical approach, and exact ROI calculations.",
        icon: <DollarSign className="w-4 h-4" />,
        color: "from-green-500 to-emerald-500",
        businessValue: "See proven ROI"
    },
    {
        title: "What's broken in my process?",
        prompt: "I'll describe my current business process and you tell me exactly what's inefficient, what's costing me money, and what should be automated first. Be brutally honest.",
        icon: <Brain className="w-4 h-4" />,
        color: "from-red-500 to-orange-500",
        businessValue: "Identify pain points"
    },
    {
        title: "How much time could I save?",
        prompt: "Help me calculate how much time and money I could save with automation. I'll tell you my current manual processes and you estimate the savings.",
        icon: <Zap className="w-4 h-4" />,
        color: "from-purple-500 to-blue-500",
        businessValue: "Calculate savings"
    },
    {
        title: "Challenge my biggest assumption",
        prompt: "I'll tell you my biggest business assumption or strategy, and you challenge it with data, alternative approaches, and potential blind spots I'm missing.",
        icon: <Rocket className="w-4 h-4" />,
        color: "from-yellow-500 to-orange-500",
        businessValue: "Strategic insights"
    }
];

// Message Reactions
const MESSAGE_REACTIONS = [
    { icon: <ThumbsUp className="w-3 h-3" />, label: "Helpful", action: "helpful" },
    { icon: <MindBlown className="w-3 h-3" />, label: "Mind blown", action: "impressed" },
    { icon: <DollarSign className="w-3 h-3" />, label: "Show pricing", action: "pricing" },
    { icon: <Phone className="w-3 h-3" />, label: "Let's talk", action: "contact" }
];

export function EnhancedDramaticAI() {
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
    const [userType, setUserType] = useState<'business' | 'technical' | 'unknown'>('unknown');
    const [conversationContext, setConversationContext] = useState<string[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const chatRef = useRef<{ sendMessage: (message: string) => void }>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Smart lead capture trigger
    useEffect(() => {
        if (messageCount > 3 && !leadCaptured && !showLeadCapture) {
            setShowLeadCapture(true);
        }
    }, [messageCount, leadCaptured, showLeadCapture]);

    // Dynamic personality adaptation
    const adaptPersonality = (message: string) => {
        const businessKeywords = ['budget', 'roi', 'cost', 'save', 'money', 'revenue'];
        const technicalKeywords = ['api', 'code', 'technical', 'integration', 'system'];

        const lowerMessage = message.toLowerCase();

        if (businessKeywords.some(keyword => lowerMessage.includes(keyword))) {
            setUserType('business');
        } else if (technicalKeywords.some(keyword => lowerMessage.includes(keyword))) {
            setUserType('technical');
        }
    };

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
        adaptPersonality(prompt);
        setConversationContext(prev => [...prev, prompt]);

        if (chatRef.current) {
            chatRef.current.sendMessage(prompt);
        }
    };

    const handleReaction = async (action: string, messageIndex: number) => {
        switch (action) {
            case 'helpful':
                // Track positive feedback
                break;
            case 'impressed':
                // Show lead capture or next steps
                setShowLeadCapture(true);
                break;
            case 'pricing':
                // Show pricing information
                if (chatRef.current) {
                    chatRef.current.sendMessage("Show me your pricing for automation projects like this.");
                }
                break;
            case 'contact':
                // Show calendar booking
                setShowCalendar(true);
                break;
        }
    };

    const handleLeadCapture = async (data: LeadCaptureData) => {
        try {
            await supabase.from('leads').insert([{
                name: data.name,
                email: data.email,
                message: `Interested in: ${data.interest}. Captured from AI chat after ${messageCount} messages.`,
                source: 'ai_chat_widget',
                status: 'hot'
            }]);

            setLeadCaptured(true);
            setShowLeadCapture(false);

            // Send personalized follow-up message
            if (chatRef.current) {
                chatRef.current.sendMessage(`Thanks ${data.name}! I'll send you a detailed analysis of ${data.interest} within 24 hours. What specific challenges are you facing right now?`);
            }
        } catch (error) {
            console.error('Lead capture failed:', error);
        }
    };

    const generateFollowUpPrompts = (lastMessage: string) => {
        // Context-aware follow-up suggestions
        if (lastMessage.includes('scam') || lastMessage.includes('detection')) {
            return ["Want me to audit YOUR proposals for free?"];
        }
        if (lastMessage.includes('technical') || lastMessage.includes('automation')) {
            return ["Should I analyze your current workflow?"];
        }
        if (lastMessage.includes('ROI') || lastMessage.includes('savings')) {
            return ["Ready to see your custom automation plan?"];
        }
        return [];
    };

    const handleStartAssessment = () => {
        setShowScorecard(false);
        setShowAssessment(true);
    };

    const handleAssessmentComplete = (results: any) => {
        console.log('Assessment completed:', results);
        setShowLeadCapture(true);
    };

    const handleURLAnalysisComplete = (results: any) => {
        console.log('URL analysis completed:', results);
        setShowLeadCapture(true);
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

            {/* Lead Capture Modal */}
            <AnimatePresence>
                {showLeadCapture && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-black border border-accent/30 rounded-xl p-6 max-w-md w-full"
                        >
                            <h3 className="text-xl font-bold text-accent mb-4">Get Your Free Analysis</h3>
                            <p className="text-gray-300 mb-6">
                                You seem interested in automation. Let me send you a personalized analysis of your biggest opportunity.
                            </p>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                handleLeadCapture({
                                    name: formData.get('name') as string,
                                    email: formData.get('email') as string,
                                    interest: formData.get('interest') as string
                                });
                            }}>
                                <div className="space-y-4">
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Your name"
                                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                                        required
                                    />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                                        required
                                    />
                                    <select
                                        name="interest"
                                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                                        required
                                    >
                                        <option value="">What interests you most?</option>
                                        <option value="email_automation">Email automation</option>
                                        <option value="lead_generation">Lead generation</option>
                                        <option value="data_processing">Data processing</option>
                                        <option value="workflow_optimization">Workflow optimization</option>
                                        <option value="custom_solution">Custom solution</option>
                                    </select>

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-accent to-purple-500 text-black py-3 rounded-lg font-bold hover:from-accent/90 hover:to-purple-500/90 transition-all"
                                        >
                                            Send My Analysis
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowLeadCapture(false)}
                                            className="px-4 py-3 border border-gray-600 text-gray-400 rounded-lg hover:text-white hover:border-gray-500 transition-all"
                                        >
                                            Later
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Calendar Booking Modal */}
            <AnimatePresence>
                {showCalendar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-black border border-accent/30 rounded-xl p-6 max-w-md w-full"
                        >
                            <h3 className="text-xl font-bold text-accent mb-4">Book a 15-Minute Call</h3>
                            <p className="text-gray-300 mb-6">
                                Let's discuss your automation project. I'll show you exactly what I'd build and give you a timeline.
                            </p>

                            <div className="space-y-4">
                                <a
                                    href="mailto:ahmad@yourdomain.com?subject=15-Minute Automation Call&body=I'd like to schedule a call to discuss my automation project."
                                    className="block w-full bg-gradient-to-r from-accent to-purple-500 text-black py-3 rounded-lg font-bold text-center hover:from-accent/90 hover:to-purple-500/90 transition-all"
                                >
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Schedule Call
                                </a>
                                <button
                                    onClick={() => setShowCalendar(false)}
                                    className="w-full px-4 py-3 border border-gray-600 text-gray-400 rounded-lg hover:text-white hover:border-gray-500 transition-all"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Interface - Same as before but with enhancements */}
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
                                                {userType === 'business' ? 'Business automation specialist' :
                                                    userType === 'technical' ? 'Technical implementation expert' :
                                                        'Direct line to Ahmad Basheer\'s AI systems'}
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

                                {/* Chat Content Area */}
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
                                            <div className="flex-1 overflow-y-auto">
                                                <div className="max-w-3xl mx-auto p-6">
                                                    <AIChatWidget
                                                        ref={chatRef}
                                                        personalityId="business"
                                                        initialPrompt={selectedPrompt}
                                                        embedded={true}
                                                        className="h-full border-0 bg-transparent"
                                                    />
                                                </div>
                                            </div>

                                            {/* Business-Value Focused Starters */}
                                            <div className="border-t border-accent/20 p-4">
                                                <div className="max-w-3xl mx-auto">
                                                    <p className="text-gray-400 text-sm mb-3 text-center">
                                                        {userType === 'business' ? 'Business-focused questions:' :
                                                            userType === 'technical' ? 'Technical deep-dives:' :
                                                                'Quick starters:'}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 justify-center">
                                                        {BUSINESS_STARTERS.map((starter, index) => (
                                                            <motion.button
                                                                key={starter.title}
                                                                initial={{ y: 10, opacity: 0 }}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                transition={{ delay: 0.1 * index }}
                                                                onClick={() => handleSuggestionClick(starter.prompt)}
                                                                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-accent/50 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-2 group"
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                <span className="text-accent group-hover:text-white transition-colors">{starter.icon}</span>
                                                                <div className="text-left">
                                                                    <div>{starter.title}</div>
                                                                    <div className="text-xs text-gray-500 group-hover:text-gray-400">{starter.businessValue}</div>
                                                                </div>
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>

                            {/* Enhanced Interactive Tools Sidebar */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{
                                    x: 0,
                                    opacity: 1,
                                    width: suggestionsCollapsed ? '60px' : '300px'
                                }}
                                transition={{ delay: 0.4, duration: 0.3 }}
                                className="flex flex-col max-h-full"
                            >
                                <div className="bg-black/90 border border-accent/30 rounded-2xl flex-1 flex flex-col overflow-hidden">
                                    {suggestionsCollapsed ? (
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
                                        <>
                                            <div className="border-b border-accent/20 flex items-center justify-between p-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-accent mb-1 uppercase tracking-wide">
                                                        Live Analysis Tools
                                                    </h3>
                                                    <p className="text-gray-400 text-xs">
                                                        Get instant business insights
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
                                                            {tool.businessValue}
                                                        </p>
                                                    </motion.button>
                                                ))}

                                                {/* Quick Actions */}
                                                <div className="border-t border-accent/20 pt-4 mt-4">
                                                    <h4 className="text-sm font-semibold text-white mb-3">Quick Actions</h4>
                                                    <div className="space-y-2">
                                                        <button
                                                            onClick={() => setShowCalendar(true)}
                                                            className="w-full p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-left transition-all duration-200 group"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-green-400" />
                                                                <span className="text-sm text-green-300 group-hover:text-green-200">Book 15-min call</span>
                                                            </div>
                                                        </button>

                                                        <button
                                                            onClick={() => setShowLeadCapture(true)}
                                                            className="w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-left transition-all duration-200 group"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Send className="w-4 h-4 text-blue-400" />
                                                                <span className="text-sm text-blue-300 group-hover:text-blue-200">Get free analysis</span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
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