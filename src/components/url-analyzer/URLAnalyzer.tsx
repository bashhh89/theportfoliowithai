'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Zap, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface URLAnalyzerProps {
  onAnalysisComplete: (results: any) => void;
  onBack: () => void;
}

interface AnalysisResult {
  url: string;
  businessType: string;
  currentAutomation: string[];
  opportunities: AutomationOpportunity[];
  urgencyScore: number;
  estimatedSavings: string;
  nextSteps: string[];
}

interface AutomationOpportunity {
  area: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeToImplement: string;
  estimatedROI: string;
}

export function URLAnalyzer({ onAnalysisComplete, onBack }: URLAnalyzerProps) {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    // Validate URL
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      setError('Please enter a valid website URL');
      return;
    }

    setError('');
    setIsAnalyzing(true);

    try {
      // Call our analysis API
      const response = await fetch('/api/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.startsWith('http') ? url : `https://${url}` }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const analysisResults = await response.json();
      setResults(analysisResults);
      onAnalysisComplete(analysisResults);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Unable to analyze website. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnalyzing) {
      handleAnalyze();
    }
  };

  if (results) {
    return <AnalysisResults results={results} onBack={onBack} />;
  }

  if (isAnalyzing) {
    return <AnalyzingAnimation url={url} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Chat
        </button>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
          <Globe className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Website Automation Analysis</h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Enter your website URL and I'll analyze your current setup, identify automation opportunities, 
          and show you exactly how to save time and increase efficiency.
        </p>
      </div>

      {/* URL Input */}
      <div className="bg-black/90 border border-accent/30 rounded-2xl p-8 space-y-6">
        <div>
          <label className="block text-white font-semibold mb-3">
            Your Website URL
          </label>
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="example.com or https://example.com"
              className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-accent focus:outline-none pr-12"
            />
            <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>

        {/* What We'll Analyze */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-white font-semibold mb-4">What I'll analyze:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Current automation tools',
              'Customer interaction flows',
              'Lead capture processes',
              'Content management setup',
              'E-commerce automation',
              'Support system efficiency',
              'Marketing automation gaps',
              'Integration opportunities'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <motion.button
          onClick={handleAnalyze}
          disabled={!url.trim() || isAnalyzing}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
            url.trim() && !isAnalyzing
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={url.trim() && !isAnalyzing ? { scale: 1.02 } : {}}
          whileTap={url.trim() && !isAnalyzing ? { scale: 0.98 } : {}}
        >
          <Search className="w-5 h-5" />
          Analyze My Website
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Trust Indicators */}
        <div className="text-center pt-4 border-t border-white/10">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              Instant analysis
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              No data stored
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              Actionable insights
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnalyzingAnimation({ url }: { url: string }) {
  const steps = [
    'Scanning website structure...',
    'Analyzing current automation...',
    'Identifying opportunities...',
    'Calculating potential savings...',
    'Generating recommendations...'
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 1500);

    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-96 space-y-8">
      {/* Animated Scanner */}
      <div className="relative">
        <div className="w-32 h-32 border-4 border-cyan-500/30 rounded-full flex items-center justify-center">
          <Globe className="w-16 h-16 text-cyan-500" />
        </div>
        <motion.div
          className="absolute inset-0 border-4 border-cyan-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 25%, 0 25%)' }}
        />
      </div>

      {/* URL Being Analyzed */}
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-2">Analyzing</p>
        <p className="text-white font-semibold text-lg">{url}</p>
      </div>

      {/* Current Step */}
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-cyan-400 font-medium"
          >
            {steps[currentStep]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="flex space-x-2">
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index <= currentStep ? 'bg-cyan-500' : 'bg-gray-600'
            }`}
            animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}

function AnalysisResults({ results, onBack }: { results: AnalysisResult; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Back Button */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Chat
        </button>
      </div>

      {/* Results Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Analysis Complete!</h2>
        <p className="text-gray-400">Here's what I found for {results.url}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/90 border border-green-500/30 rounded-xl p-4 text-center">
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{results.estimatedSavings}</div>
          <div className="text-sm text-gray-400">Potential Monthly Savings</div>
        </div>
        <div className="bg-black/90 border border-blue-500/30 rounded-xl p-4 text-center">
          <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{results.opportunities.length}</div>
          <div className="text-sm text-gray-400">Automation Opportunities</div>
        </div>
        <div className="bg-black/90 border border-orange-500/30 rounded-xl p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{results.urgencyScore}/10</div>
          <div className="text-sm text-gray-400">Urgency Score</div>
        </div>
      </div>

      {/* Opportunities */}
      <div className="bg-black/90 border border-accent/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Top Automation Opportunities</h3>
        <div className="space-y-4">
          {results.opportunities.map((opp, index) => (
            <div key={index} className="border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white">{opp.area}</h4>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  opp.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                  opp.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {opp.impact} impact
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{opp.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>⏱️ {opp.timeToImplement}</span>
                <span>💰 {opp.estimatedROI} ROI</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recommended Next Steps</h3>
        <div className="space-y-2">
          {results.nextSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-black text-sm font-bold">
                {index + 1}
              </div>
              <span className="text-gray-300">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button className="bg-gradient-to-r from-accent to-purple-500 text-black font-semibold py-3 px-8 rounded-xl hover:from-accent/90 hover:to-purple-500/90 transition-all">
          Get Implementation Plan
        </button>
      </div>
    </motion.div>
  );
}