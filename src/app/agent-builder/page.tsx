'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Settings, Play, CheckCircle } from 'lucide-react';

export default function AgentBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildComplete, setBuildComplete] = useState(false);

  const handleBuildAgent = async () => {
    setIsBuilding(true);
    
    // Simulate building process with real steps
    const steps = [
      'Analyzing your requirements...',
      'Selecting optimal AI model...',
      'Installing lead qualification tools...',
      'Connecting calendar integration...',
      'Setting up CRM pipeline...',
      'Testing agent responses...',
      'Your agent is ready!'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // We'll add real progress updates here
    }
    
    setIsBuilding(false);
    setBuildComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
            Build Your Lead Qualification Agent
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Let me help you create the perfect AI agent to qualify leads and book meetings automatically
          </p>
        </div>

        {/* Agent Preview */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-black/50 border border-accent/30 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-purple-500 rounded-xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Lead Qualification Agent</h2>
                  <p className="text-gray-400">Recommended for your business</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">$89/month</div>
                <div className="text-sm text-gray-400">Saves $2,400/month</div>
              </div>
            </div>

            {/* Agent Capabilities */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-accent">What It Does:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Qualifies website visitors in real-time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Books meetings automatically</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Adds leads to your CRM</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Sends follow-up emails</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-accent">Powered By:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span>GPT-4 Turbo (Best for sales conversations)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>Calendar Integration (Calendly/Google)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-blue-500" />
                    <span>CRM Integration (HubSpot/Pipedrive)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Build Button */}
            <div className="text-center">
              {!buildComplete ? (
                <motion.button
                  onClick={handleBuildAgent}
                  disabled={isBuilding}
                  className={`px-12 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto transition-all duration-200 ${
                    isBuilding
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-accent to-purple-500 text-black hover:from-accent/90 hover:to-purple-500/90'
                  }`}
                  whileHover={!isBuilding ? { scale: 1.05 } : {}}
                  whileTap={!isBuilding ? { scale: 0.95 } : {}}
                >
                  {isBuilding ? (
                    <>
                      <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Building Your Agent...
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6" />
                      Build My Agent Now
                    </>
                  )}
                </motion.button>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-500 mb-2">Agent Ready!</h3>
                  <p className="text-gray-400 mb-6">Your lead qualification agent is built and ready to deploy</p>
                  <div className="flex gap-4 justify-center">
                    <a 
                      href="/agent-builder/test" 
                      className="px-6 py-3 bg-accent text-black rounded-xl font-semibold hover:bg-accent/90 inline-block"
                    >
                      Test Agent
                    </a>
                    <button className="px-6 py-3 border border-accent text-accent rounded-xl font-semibold hover:bg-accent/10">
                      Deploy to Website
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Why This Setup */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-accent mb-4">🧠 Ahmad's Expert Recommendation:</h3>
            <p className="text-gray-300 leading-relaxed">
              "For lead qualification, I'm recommending GPT-4 Turbo because it excels at sales conversations and understanding buyer intent. 
              The calendar integration will book meetings instantly, and the CRM connection ensures no leads fall through the cracks. 
              I've built 50+ similar setups - this configuration converts 23% better than basic chatbots."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}