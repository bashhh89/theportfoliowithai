'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Clock, DollarSign, Download, Mail, Calendar } from 'lucide-react';

interface ResultsDisplayProps {
  results: {
    totalScore: number;
    maturityLevel: string;
    recommendations: any[];
    categoryScores: any;
    answers: any[];
  };
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [showLeadCapture, setShowLeadCapture] = useState(false);

  const getMaturityInfo = (level: string) => {
    switch (level) {
      case 'manual':
        return {
          title: 'Manual Mode',
          color: 'from-red-500 to-orange-500',
          icon: '🟥',
          description: 'Most processes are done manually. High potential for automation gains.',
          nextLevel: 'Getting Started'
        };
      case 'getting-started':
        return {
          title: 'Getting Started',
          color: 'from-yellow-500 to-orange-500',
          icon: '🟨',
          description: 'Some automation in place. Ready for more sophisticated solutions.',
          nextLevel: 'AI-Ready'
        };
      case 'ai-ready':
        return {
          title: 'AI-Ready',
          color: 'from-green-500 to-teal-500',
          icon: '🟩',
          description: 'Sophisticated operations. Perfect for advanced AI automation.',
          nextLevel: 'AI-Native'
        };
      default:
        return {
          title: 'Unknown',
          color: 'from-gray-500 to-gray-600',
          icon: '⚪',
          description: 'Assessment incomplete.',
          nextLevel: 'Next Level'
        };
    }
  };

  const maturityInfo = getMaturityInfo(results.maturityLevel);

  return (
    <div className="space-y-8">
      {/* Score Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-3 bg-black/90 border border-accent/30 rounded-2xl p-6">
          <Trophy className="w-8 h-8 text-accent" />
          <div>
            <h2 className="text-3xl font-bold text-white">
              {results.totalScore}/100
            </h2>
            <p className="text-gray-400">Automation Readiness Score</p>
          </div>
        </div>
      </motion.div>

      {/* Maturity Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-black/90 border border-accent/30 rounded-2xl p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 bg-gradient-to-r ${maturityInfo.color} rounded-2xl flex items-center justify-center text-2xl`}>
            {maturityInfo.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{maturityInfo.title}</h3>
            <p className="text-gray-400">{maturityInfo.description}</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(results.categoryScores).map(([category, score]) => (
            <div key={category} className="text-center">
              <div className="text-2xl font-bold text-accent">{score as number}</div>
              <div className="text-xs text-gray-400 capitalize">{category}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black/90 border border-accent/30 rounded-2xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Your Automation Opportunities
        </h3>

        <div className="space-y-4">
          {getRecommendationsForScore(results.totalScore, results.maturityLevel).map((rec, index) => (
            <div key={index} className="border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white">{rec.title}</h4>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {rec.priority} priority
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{rec.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {rec.timeframe}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {rec.roi} ROI
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 rounded-2xl p-8"
      >
        <h3 className="text-xl font-bold text-white mb-4">Ready to Get Started?</h3>
        <p className="text-gray-300 mb-6">
          Get a detailed implementation roadmap and custom proposal based on your assessment results.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowLeadCapture(true)}
            className="flex-1 bg-gradient-to-r from-accent to-purple-500 text-black font-semibold py-3 px-6 rounded-xl hover:from-accent/90 hover:to-purple-500/90 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Get Detailed Report
          </button>
          <button className="flex-1 border border-accent text-accent font-semibold py-3 px-6 rounded-xl hover:bg-accent/10 transition-all flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Book Strategy Call
          </button>
        </div>
      </motion.div>

      {/* Lead Capture Modal */}
      {showLeadCapture && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border border-accent/30 rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4">Get Your Detailed Report</h3>
            <p className="text-gray-400 mb-6">
              Enter your email to receive a comprehensive automation roadmap with specific recommendations and ROI projections.
            </p>
            
            <form className="space-y-4">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full p-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-accent focus:outline-none"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-accent to-purple-500 text-black font-semibold py-3 rounded-xl hover:from-accent/90 hover:to-purple-500/90 transition-all"
                >
                  Send Report
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeadCapture(false)}
                  className="px-4 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function getRecommendationsForScore(score: number, level: string) {
  if (score <= 40) {
    return [
      {
        title: 'Start with Basic Workflow Automation',
        description: 'Connect your existing tools with Zapier or Make.com to eliminate manual data entry.',
        priority: 'high',
        timeframe: '2-4 weeks',
        roi: '200-400%'
      },
      {
        title: 'Implement Simple Email Automation',
        description: 'Set up automated email sequences for customer onboarding and follow-ups.',
        priority: 'high',
        timeframe: '1-2 weeks',
        roi: '150-300%'
      },
      {
        title: 'Basic CRM Setup',
        description: 'Organize your customer data and automate basic sales processes.',
        priority: 'medium',
        timeframe: '3-4 weeks',
        roi: '100-250%'
      }
    ];
  } else if (score <= 70) {
    return [
      {
        title: 'Advanced Workflow Integration',
        description: 'Create sophisticated multi-step automations with conditional logic.',
        priority: 'high',
        timeframe: '4-6 weeks',
        roi: '300-500%'
      },
      {
        title: 'AI-Powered Customer Support',
        description: 'Implement intelligent chatbots and automated ticket routing.',
        priority: 'high',
        timeframe: '3-5 weeks',
        roi: '250-400%'
      },
      {
        title: 'Lead Scoring & Nurturing',
        description: 'Automatically qualify and nurture leads based on behavior and engagement.',
        priority: 'medium',
        timeframe: '2-4 weeks',
        roi: '200-350%'
      }
    ];
  } else {
    return [
      {
        title: 'Custom AI Agents',
        description: 'Deploy specialized AI agents for complex business functions.',
        priority: 'high',
        timeframe: '6-10 weeks',
        roi: '400-700%'
      },
      {
        title: 'Advanced Analytics Automation',
        description: 'Automated reporting and predictive analytics for business intelligence.',
        priority: 'high',
        timeframe: '4-8 weeks',
        roi: '300-600%'
      },
      {
        title: 'Voice AI Integration',
        description: 'Implement voice-based customer interactions and internal processes.',
        priority: 'medium',
        timeframe: '8-12 weeks',
        roi: '250-500%'
      }
    ];
  }
}