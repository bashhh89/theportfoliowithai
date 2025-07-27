'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  onBack: () => void;
}

export function ProgressIndicator({ current, total, onBack }: ProgressIndicatorProps) {
  const progress = (current / total) * 100;

  return (
    <div className="flex items-center gap-4 mb-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      {/* Progress Bar */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            Question {current} of {total}
          </span>
          <span className="text-sm text-accent font-semibold">
            {Math.round(progress)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Phase Indicator */}
      <div className="text-right">
        <div className="text-xs text-gray-400 mb-1">Phase</div>
        <div className="text-sm font-semibold text-white">
          {getPhase(current)}
        </div>
      </div>
    </div>
  );
}

function getPhase(questionNumber: number): string {
  if (questionNumber <= 3) return "Foundation";
  if (questionNumber <= 8) return "Operations";
  if (questionNumber <= 12) return "Technology";
  if (questionNumber <= 16) return "Goals";
  return "Investment";
}