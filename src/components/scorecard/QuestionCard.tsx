'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, MessageSquare, Brain } from 'lucide-react';
import { AssessmentQuestion } from './questions';

interface QuestionCardProps {
  question: AssessmentQuestion;
  onAnswer: (answer: string | string[] | number) => void;
  canGoBack: boolean;
  previousAnswers?: any[];
}

export function QuestionCard({ question, onAnswer, canGoBack, previousAnswers = [] }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | number>('');
  const [textAnswer, setTextAnswer] = useState('');
  const [scaleValue, setScaleValue] = useState(5);
  const [reasoning, setReasoning] = useState<string>('');
  const [showReasoning, setShowReasoning] = useState(false);

  useEffect(() => {
    // Generate reasoning for this question
    const generateReasoning = async () => {
      try {
        const response = await fetch('/api/generate-reasoning', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionText: question.question,
            questionType: question.type,
            previousAnswers: previousAnswers
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setReasoning(data.reasoning);
        }
      } catch (error) {
        console.error('Failed to generate reasoning:', error);
        setReasoning('This question helps me understand your automation opportunities better.');
      }
    };

    generateReasoning();
  }, [question, previousAnswers]);

  const handleSubmit = () => {
    let answer: string | string[] | number = '';
    
    switch (question.type) {
      case 'single-choice':
        answer = selectedAnswer as string;
        break;
      case 'multiple-choice':
        answer = selectedAnswer as string[];
        break;
      case 'text':
        answer = textAnswer;
        break;
      case 'scale':
        answer = scaleValue;
        break;
    }
    
    if (answer && (typeof answer !== 'string' || answer.trim())) {
      onAnswer(answer);
    }
  };

  const isAnswerValid = () => {
    switch (question.type) {
      case 'single-choice':
        return selectedAnswer !== '';
      case 'multiple-choice':
        return Array.isArray(selectedAnswer) && selectedAnswer.length > 0;
      case 'text':
        return textAnswer.trim().length > 0;
      case 'scale':
        return true; // Scale always has a value
      default:
        return false;
    }
  };

  const handleMultipleChoice = (option: string) => {
    const current = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    if (current.includes(option)) {
      setSelectedAnswer(current.filter(item => item !== option));
    } else {
      setSelectedAnswer([...current, option]);
    }
  };

  const getDefaultReasoning = (questionId: string): string => {
    const reasoningMap: Record<string, string> = {
      'business-type': "I'm asking this because different business types have unique automation opportunities. E-commerce needs different solutions than service businesses.",
      'team-size': "I'm asking this because team size affects both automation complexity and ROI potential. Larger teams often have more processes to automate.",
      'biggest-time-waster': "I'm asking this because identifying your biggest time drain helps me prioritize which automation will give you the most immediate impact.",
      'customer-inquiries': "I'm asking this because customer support automation can dramatically improve response times and free up your team for higher-value work.",
      'lead-management': "I'm asking this because lead management automation is often the highest ROI investment for growing businesses.",
      'repetitive-tasks': "I'm asking this because repetitive tasks are the easiest wins for automation - quick to implement with immediate time savings.",
      'biggest-bottleneck': "I'm asking this because bottlenecks limit your growth potential. Automating around bottlenecks can unlock significant scaling opportunities.",
      'current-tools': "I'm asking this because understanding your current tech stack helps me recommend integrations that work with what you already have.",
      'automation-priority': "I'm asking this because knowing your top priority helps me focus recommendations on what matters most to your business right now.",
      'success-metric': "I'm asking this because understanding how you define success helps me tailor recommendations to your specific goals and KPIs.",
      'current-tool-spend': "I'm asking this because your current tool budget indicates your comfort level with automation investments and helps me suggest appropriate solutions.",
      'implementation-timeline': "I'm asking this because your timeline affects which solutions I recommend - some can be implemented quickly while others need more planning."
    };
    
    return reasoningMap[questionId] || "I'm asking this because it helps me understand your business better and provide more targeted automation recommendations.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-black/90 border border-accent/30 rounded-2xl p-8 max-w-2xl mx-auto"
    >
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-accent to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            <MessageSquare className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">
              {question.question}
            </h3>
            {question.description && (
              <p className="text-gray-400 text-sm leading-relaxed">
                {question.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ahmad's Reasoning */}
      <div className="mb-6">
        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm"
        >
          <Brain className="w-4 h-4" />
          {showReasoning ? 'Hide' : 'Show'} Ahmad's reasoning
        </button>
        
        {showReasoning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-4 bg-accent/10 border border-accent/20 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-accent font-semibold text-sm mb-1">Why I'm asking this:</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {reasoning || getDefaultReasoning(question.id)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Answer Input */}
      <div className="mb-8">
        {question.type === 'single-choice' && (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full p-4 text-left rounded-xl border transition-all duration-200 ${
                  selectedAnswer === option
                    ? 'border-accent bg-accent/10 text-white'
                    : 'border-white/20 hover:border-accent/50 text-gray-300 hover:text-white'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option ? 'border-accent' : 'border-gray-500'
                  }`}>
                    {selectedAnswer === option && (
                      <div className="w-2 h-2 bg-accent rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {question.type === 'multiple-choice' && (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleMultipleChoice(option)}
                className={`w-full p-4 text-left rounded-xl border transition-all duration-200 ${
                  Array.isArray(selectedAnswer) && selectedAnswer.includes(option)
                    ? 'border-accent bg-accent/10 text-white'
                    : 'border-white/20 hover:border-accent/50 text-gray-300 hover:text-white'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    Array.isArray(selectedAnswer) && selectedAnswer.includes(option) 
                      ? 'border-accent bg-accent' 
                      : 'border-gray-500'
                  }`}>
                    {Array.isArray(selectedAnswer) && selectedAnswer.includes(option) && (
                      <div className="w-2 h-2 bg-black rounded-sm" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {question.type === 'text' && (
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-accent focus:outline-none resize-none"
            rows={4}
          />
        )}

        {question.type === 'scale' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>1</span>
              <span className="text-white font-semibold">{scaleValue}</span>
              <span>10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={scaleValue}
              onChange={(e) => setScaleValue(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Not important</span>
              <span>Extremely important</span>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <motion.button
          onClick={handleSubmit}
          disabled={!isAnswerValid()}
          className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 ${
            isAnswerValid()
              ? 'bg-gradient-to-r from-accent to-purple-500 text-black hover:from-accent/90 hover:to-purple-500/90'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={isAnswerValid() ? { scale: 1.05 } : {}}
          whileTap={isAnswerValid() ? { scale: 0.95 } : {}}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}