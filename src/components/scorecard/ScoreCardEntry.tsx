'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, TrendingUp, Clock } from 'lucide-react';

interface ScoreCardEntryProps {
  onStartAssessment: () => void;
}

export function ScoreCardEntry({ onStartAssessment }: ScoreCardEntryProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">AI Automation Readiness</h3>
          <p className="text-blue-300 text-sm">Get Your Business Scorecard</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-6 leading-relaxed">
        Discover your automation opportunities with a personalized assessment. 
        Get specific recommendations, ROI projections, and a clear roadmap for your business.
      </p>

      {/* Features */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">Instant Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-300">ROI Projections</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-300">Custom Roadmap</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-gray-300">5-7 Minutes</span>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={onStartAssessment}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Target className="w-5 h-5" />
        Start My Assessment
        {isHovered && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 'auto' }}
            className="overflow-hidden"
          >
            <span className="ml-2">→</span>
          </motion.div>
        )}
      </motion.button>

      {/* Trust Indicators */}
      <div className="mt-4 pt-4 border-t border-blue-500/20">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>✓ No spam, ever</span>
          <span>✓ Instant results</span>
          <span>✓ Professional report</span>
        </div>
      </div>
    </motion.div>
  );
}