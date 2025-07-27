'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionCard } from './QuestionCard';
import { ProgressIndicator } from './ProgressIndicator';
import { ResultsDisplay } from './ResultsDisplay';
import { ASSESSMENT_QUESTIONS } from './questions';

interface AssessmentAnswer {
  questionId: string;
  answer: string | string[] | number;
  category: string;
  weight: number;
}

interface AssessmentFlowProps {
  onComplete: (results: any) => void;
  onBack: () => void;
}

export function AssessmentFlow({ onComplete, onBack }: AssessmentFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === ASSESSMENT_QUESTIONS.length - 1;

  const handleAnswer = (answer: string | string[] | number) => {
    const newAnswer: AssessmentAnswer = {
      questionId: currentQuestion.id,
      answer,
      category: currentQuestion.category,
      weight: currentQuestion.weight
    };

    const updatedAnswers = [...answers.filter(a => a.questionId !== currentQuestion.id), newAnswer];
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      // Start analysis
      setIsAnalyzing(true);
      analyzeResults(updatedAnswers);
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const analyzeResults = async (finalAnswers: AssessmentAnswer[]) => {
    // Simulate analysis time for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Calculate score based on answers
    const score = calculateScore(finalAnswers);
    const recommendations = generateRecommendations(score, finalAnswers);
    
    const results = {
      totalScore: score.total,
      categoryScores: score.categories,
      maturityLevel: getMaturityLevel(score.total),
      recommendations,
      answers: finalAnswers
    };

    setResults(results);
    setIsAnalyzing(false);
    onComplete(results);
  };

  const calculateScore = (answers: AssessmentAnswer[]) => {
    let totalScore = 0;
    const categories = {
      foundation: 0,
      operations: 0,
      technology: 0,
      goals: 0,
      investment: 0
    };

    answers.forEach(answer => {
      let points = 0;
      
      // Score based on answer type and content
      if (typeof answer.answer === 'number') {
        points = answer.answer * answer.weight;
      } else if (Array.isArray(answer.answer)) {
        points = answer.answer.length * answer.weight;
      } else {
        // Score text answers based on keywords and sophistication
        points = scoreTextAnswer(answer.answer, answer.questionId) * answer.weight;
      }

      totalScore += points;
      categories[answer.category as keyof typeof categories] += points;
    });

    return {
      total: Math.min(100, totalScore),
      categories
    };
  };

  const scoreTextAnswer = (answer: string, questionId: string): number => {
    // Simple scoring logic - can be enhanced with AI
    const sophisticatedKeywords = ['automation', 'ai', 'integration', 'workflow', 'api', 'crm', 'analytics'];
    const basicKeywords = ['manual', 'spreadsheet', 'email', 'phone', 'paper'];
    
    const lowerAnswer = answer.toLowerCase();
    let score = 5; // Base score
    
    sophisticatedKeywords.forEach(keyword => {
      if (lowerAnswer.includes(keyword)) score += 2;
    });
    
    basicKeywords.forEach(keyword => {
      if (lowerAnswer.includes(keyword)) score -= 1;
    });
    
    return Math.max(0, Math.min(10, score));
  };

  const getMaturityLevel = (score: number): string => {
    if (score <= 40) return 'manual';
    if (score <= 70) return 'getting-started';
    return 'ai-ready';
  };

  const generateRecommendations = (score: any, answers: AssessmentAnswer[]) => {
    // Generate recommendations based on score and specific answers
    const recommendations = [];
    
    if (score.total <= 40) {
      recommendations.push({
        title: 'Start with Basic Workflow Automation',
        description: 'Implement simple automation tools like Zapier to connect your existing apps.',
        priority: 'high',
        timeframe: '2-4 weeks',
        roi: '200-400%'
      });
    }
    
    // Add more sophisticated recommendation logic here
    
    return recommendations;
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      onBack();
    }
  };

  if (results) {
    return <ResultsDisplay results={results} />;
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        />
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Business...</h3>
          <p className="text-gray-400">Processing your responses and generating personalized recommendations</p>
        </div>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProgressIndicator 
        current={currentQuestionIndex + 1} 
        total={ASSESSMENT_QUESTIONS.length}
        onBack={goBack}
      />
      
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswer={handleAnswer}
          canGoBack={currentQuestionIndex > 0}
          previousAnswers={answers}
        />
      </AnimatePresence>
    </div>
  );
}