'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Zap, Calendar, Database, Mail } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  toolCalls?: any[];
}

interface LeadData {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  budget?: string;
  timeline?: string;
  needs: string[];
  score: number;
  source: string;
}

export default function AgentTestPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: "Hi! I'm Ahmad's Lead Qualification Agent. I help businesses discover automation opportunities that can save time and increase efficiency. What type of business do you run?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({
    needs: [],
    score: 0,
    source: 'agent-test'
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare messages for API
      const apiMessages = [...messages, userMessage].map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }));

      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          leadData,
          agentId: 'lead-qualification-v1'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get agent response');
      }

      const data = await response.json();

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: data.response,
        timestamp: new Date(),
        toolCalls: data.toolCalls
      };

      setMessages(prev => [...prev, agentMessage]);
      
      // Update lead data if provided
      if (data.updatedLeadData) {
        setLeadData(data.updatedLeadData);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getToolIcon = (toolId: string) => {
    switch (toolId) {
      case 'book_meeting': return <Calendar className="w-4 h-4" />;
      case 'add_to_crm': return <Database className="w-4 h-4" />;
      case 'send_follow_up': return <Mail className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Test Your Lead Qualification Agent</h1>
          <p className="text-gray-400">Try having a conversation with your AI agent</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-black/50 border border-accent/30 rounded-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-accent/10 border-b border-accent/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent to-purple-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Lead Qualification Agent</h3>
                      <p className="text-sm text-gray-400">Online • Ready to help</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'agent' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-accent to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-black" />
                        </div>
                      )}
                      
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                        message.role === 'user'
                          ? 'bg-accent text-black'
                          : 'bg-gray-800 text-white'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        
                        {/* Tool Calls */}
                        {message.toolCalls && message.toolCalls.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.toolCalls.map((toolCall, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs bg-black/20 rounded px-2 py-1">
                                {getToolIcon(toolCall.tool)}
                                <span>Used {toolCall.tool.replace('_', ' ')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-accent to-purple-500 rounded-lg flex items-center justify-center">
                        <Bot className="w-4 h-4 text-black" />
                      </div>
                      <div className="bg-gray-800 rounded-xl px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-accent/20 p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:border-accent focus:outline-none"
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="bg-accent text-black px-4 py-2 rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Data Panel */}
            <div className="space-y-6">
              <div className="bg-black/50 border border-accent/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-accent">Lead Data</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="ml-2">{leadData.name || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <span className="ml-2">{leadData.email || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Company:</span>
                    <span className="ml-2">{leadData.company || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Score:</span>
                    <span className="ml-2">{leadData.score}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Needs:</span>
                    <div className="ml-2 mt-1">
                      {leadData.needs.length > 0 ? (
                        leadData.needs.map((need, index) => (
                          <div key={index} className="text-xs bg-accent/20 text-accent px-2 py-1 rounded mb-1">
                            {need}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500">None identified yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-accent/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-accent">Agent Tools</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span>Meeting Booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    <span>CRM Integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-500" />
                    <span>Email Follow-up</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>ROI Calculator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}