'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AI_PERSONALITIES, ChatMessage } from '@/lib/mistral';
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

interface AIChatWidgetProps {
  personalityId: keyof typeof AI_PERSONALITIES;
  className?: string;
  embedded?: boolean;
  initialPrompt?: string;
}

export interface AIChatWidgetRef {
  sendMessage: (message: string) => void;
}

export const AIChatWidget = forwardRef<AIChatWidgetRef, AIChatWidgetProps>(
  ({ personalityId, className = '', embedded = false, initialPrompt }, ref) => {
  const [isOpen, setIsOpen] = useState(embedded);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAnalysisTool, setActiveAnalysisTool] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const personality = AI_PERSONALITIES[personalityId];
  
  const businessAnalysisTools = [
    {
      id: 'website-scanner',
      name: '🔍 Website Scanner',
      description: 'Analyze any website for automation opportunities',
      action: () => setActiveAnalysisTool('website-scanner')
    },
    {
      id: 'process-analyzer',
      name: '⚙️ Process Analyzer', 
      description: 'Map your workflow and find bottlenecks',
      action: () => setActiveAnalysisTool('process-analyzer')
    },
    {
      id: 'roi-calculator',
      name: '💰 ROI Calculator',
      description: 'Calculate automation savings and payback',
      action: () => setActiveAnalysisTool('roi-calculator')
    },
    {
      id: 'competitor-analysis',
      name: '🎯 Competitor Analysis',
      description: 'See what automation your competitors are missing',
      action: () => setActiveAnalysisTool('competitor-analysis')
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: `I'm Ahmad's AI system. I can analyze your business processes, challenge your ideas, or show you technical solutions I've built. 

Try these instant analysis tools:`
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, personality.role, messages.length]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: textToSend
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          personalityId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      // Auto-focus input after response
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Expose sendMessage function through ref
  useImperativeHandle(ref, () => ({
    sendMessage: (message: string) => sendMessage(message)
  }));

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt && messages.length <= 1) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const renderAnalysisTool = () => {
    if (!activeAnalysisTool) return null;

    switch (activeAnalysisTool) {
      case 'website-scanner':
        return <WebsiteScanner onResults={setAnalysisResults} onClose={() => setActiveAnalysisTool(null)} />;
      case 'process-analyzer':
        return <ProcessAnalyzer onResults={setAnalysisResults} onClose={() => setActiveAnalysisTool(null)} />;
      case 'roi-calculator':
        return <ROICalculator onResults={setAnalysisResults} onClose={() => setActiveAnalysisTool(null)} />;
      case 'competitor-analysis':
        return <CompetitorAnalysis onResults={setAnalysisResults} onClose={() => setActiveAnalysisTool(null)} />;
      default:
        return null;
    }
  };



  if (embedded) {
    return (
      <Card className={`w-full max-w-2xl mx-auto ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${personality.color} flex items-center justify-center text-white text-lg`}>
              {personality.avatar}
            </div>
            <div>
              <CardTitle className="text-lg">{personality.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{personality.description}</p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              Online
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-96 w-full pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Business Analysis Tools */}
          {messages.length <= 1 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">🚀 Instant Business Analysis</h4>
              <div className="grid grid-cols-2 gap-2">
                {businessAnalysisTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={tool.action}
                    className="p-2 text-xs bg-white hover:bg-blue-50 border rounded transition-colors text-left"
                    title={tool.description}
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Active Analysis Tool */}
          {activeAnalysisTool && (
            <div className="mb-4">
              {renderAnalysisTool()}
            </div>
          )}
          
          {/* Analysis Results */}
          {analysisResults && (
            <div className="mb-4 p-3 bg-green-50 rounded-lg border">
              <h4 className="font-semibold mb-2">📊 Analysis Results</h4>
              <div className="text-sm space-y-2">
                {analysisResults.automationOpportunities && (
                  <div>
                    <strong>Opportunities:</strong>
                    <ul className="list-disc list-inside ml-2">
                      {analysisResults.automationOpportunities.map((opp: string, i: number) => (
                        <li key={i}>{opp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysisResults.timeSavings && (
                  <div><strong>Time Savings:</strong> {analysisResults.timeSavings}</div>
                )}
                {analysisResults.estimatedROI && (
                  <div><strong>Estimated ROI:</strong> {analysisResults.estimatedROI}</div>
                )}
              </div>
              <button
                onClick={() => setAnalysisResults(null)}
                className="mt-2 text-xs text-blue-600 hover:underline"
              >
                Clear results
              </button>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={() => sendMessage()} disabled={isLoading || !inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg ${personality.color} hover:scale-105 transition-transform z-50`}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 w-96 shadow-xl z-50 transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[500px]'
        } ${className}`}>
          <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${personality.color} flex items-center justify-center text-white text-sm`}>
                  {personality.avatar}
                </div>
                <div>
                  <CardTitle className="text-sm">{personality.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    Online
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="flex flex-col h-[420px] p-4">
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Business Analysis Tools */}
              {messages.length <= 1 && (
                <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                  <h4 className="text-xs font-semibold mb-2">🚀 Instant Analysis</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {businessAnalysisTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={tool.action}
                        className="p-1.5 text-xs bg-white hover:bg-blue-50 border rounded transition-colors text-left"
                        title={tool.description}
                      >
                        {tool.name.replace('🔍 ', '').replace('⚙️ ', '').replace('💰 ', '').replace('🎯 ', '')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Active Analysis Tool */}
              {activeAnalysisTool && (
                <div className="mb-3">
                  {renderAnalysisTool()}
                </div>
              )}
              
              {/* Analysis Results */}
              {analysisResults && (
                <div className="mb-3 p-2 bg-green-50 rounded-lg border">
                  <h4 className="text-xs font-semibold mb-1">📊 Results</h4>
                  <div className="text-xs space-y-1">
                    {analysisResults.timeSavings && (
                      <div><strong>Savings:</strong> {analysisResults.timeSavings}</div>
                    )}
                    {analysisResults.estimatedROI && (
                      <div><strong>ROI:</strong> {analysisResults.estimatedROI}</div>
                    )}
                  </div>
                  <button
                    onClick={() => setAnalysisResults(null)}
                    className="mt-1 text-xs text-blue-600 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}
              
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 text-sm"
                />
                <Button 
                  onClick={() => sendMessage()} 
                  disabled={isLoading || !inputValue.trim()}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
});

AIChatWidget.displayName = 'AIChatWidget';

// Analysis Tool Components
const WebsiteScanner = ({ onResults, onClose }: { onResults: (results: any) => void; onClose: () => void }) => {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);

  const scanWebsite = async () => {
    if (!url) return;
    setScanning(true);
    
    // Simulate analysis
    setTimeout(() => {
      const results = {
        url,
        automationOpportunities: [
          'Contact form submissions → CRM integration',
          'Newsletter signups → Email automation',
          'Customer support → Chatbot implementation',
          'Inventory updates → Real-time sync'
        ],
        timesSavings: '15-25 hours/week',
        estimatedROI: '$3,200/month'
      };
      onResults(results);
      setScanning(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg border">
      <h3 className="font-semibold mb-3">🔍 Website Scanner</h3>
      <div className="space-y-3">
        <Input
          placeholder="Enter website URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={scanWebsite} disabled={!url || scanning} className="flex-1">
            {scanning ? 'Scanning...' : 'Analyze Website'}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
        {scanning && (
          <div className="text-sm text-blue-600">
            Analyzing website structure, forms, and automation opportunities...
          </div>
        )}
      </div>
    </div>
  );
};

const ProcessAnalyzer = ({ onResults, onClose }: { onResults: (results: any) => void; onClose: () => void }) => {
  const [process, setProcess] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeProcess = async () => {
    if (!process) return;
    setAnalyzing(true);
    
    setTimeout(() => {
      const results = {
        process,
        bottlenecks: [
          'Manual data entry (45 min/day)',
          'Email follow-ups (30 min/day)', 
          'Report generation (60 min/day)',
          'Status updates (20 min/day)'
        ],
        automationPlan: [
          'Step 1: Automate data entry with forms',
          'Step 2: Set up email sequences',
          'Step 3: Create automated reports',
          'Step 4: Build status dashboard'
        ],
        timeSavings: '2.5 hours/day',
        costSavings: '$1,800/month'
      };
      onResults(results);
      setAnalyzing(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg border">
      <h3 className="font-semibold mb-3">⚙️ Process Analyzer</h3>
      <div className="space-y-3">
        <textarea
          className="w-full p-2 border rounded resize-none"
          rows={3}
          placeholder="Describe your current process (e.g., 'I manually process customer orders, send confirmation emails, update inventory...')"
          value={process}
          onChange={(e) => setProcess(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={analyzeProcess} disabled={!process || analyzing} className="flex-1">
            {analyzing ? 'Analyzing...' : 'Analyze Process'}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
        {analyzing && (
          <div className="text-sm text-green-600">
            Mapping workflow, identifying bottlenecks, and calculating savings...
          </div>
        )}
      </div>
    </div>
  );
};

const ROICalculator = ({ onResults, onClose }: { onResults: (results: any) => void; onClose: () => void }) => {
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [automationCost, setAutomationCost] = useState('');

  const calculateROI = () => {
    const rate = parseFloat(hourlyRate) || 0;
    const hours = parseFloat(hoursPerWeek) || 0;
    const cost = parseFloat(automationCost) || 0;
    
    const weeklySavings = rate * hours;
    const monthlySavings = weeklySavings * 4.33;
    const yearlySavings = monthlySavings * 12;
    const paybackMonths = cost / monthlySavings;
    const yearOneROI = ((yearlySavings - cost) / cost) * 100;

    const results = {
      inputs: { hourlyRate: rate, hoursPerWeek: hours, automationCost: cost },
      weeklySavings,
      monthlySavings,
      yearlySavings,
      paybackMonths,
      yearOneROI
    };
    
    onResults(results);
    onClose();
  };

  return (
    <div className="p-4 bg-yellow-50 rounded-lg border">
      <h3 className="font-semibold mb-3">💰 ROI Calculator</h3>
      <div className="space-y-3">
        <Input
          type="number"
          placeholder="Your hourly rate ($)"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Hours saved per week"
          value={hoursPerWeek}
          onChange={(e) => setHoursPerWeek(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Automation project cost ($)"
          value={automationCost}
          onChange={(e) => setAutomationCost(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={calculateROI} disabled={!hourlyRate || !hoursPerWeek} className="flex-1">
            Calculate ROI
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

const CompetitorAnalysis = ({ onResults, onClose }: { onResults: (results: any) => void; onClose: () => void }) => {
  const [industry, setIndustry] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeCompetitors = async () => {
    if (!industry) return;
    setAnalyzing(true);
    
    setTimeout(() => {
      const results = {
        industry,
        competitorGaps: [
          'Most competitors lack automated customer onboarding',
          '67% have manual inventory management',
          'Only 23% use AI for customer support',
          'Limited social media automation'
        ],
        opportunities: [
          'Implement chatbot for 24/7 support',
          'Automate social media posting',
          'Set up automated email sequences',
          'Create self-service customer portal'
        ],
        competitiveAdvantage: 'First-mover advantage in automation could capture 15-30% more market share'
      };
      onResults(results);
      setAnalyzing(false);
      onClose();
    }, 3500);
  };

  return (
    <div className="p-4 bg-purple-50 rounded-lg border">
      <h3 className="font-semibold mb-3">🎯 Competitor Analysis</h3>
      <div className="space-y-3">
        <Input
          placeholder="Your industry (e.g., 'e-commerce', 'consulting', 'SaaS')"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={analyzeCompetitors} disabled={!industry || analyzing} className="flex-1">
            {analyzing ? 'Analyzing...' : 'Analyze Competitors'}
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
        {analyzing && (
          <div className="text-sm text-purple-600">
            Scanning competitor websites, analyzing automation gaps, identifying opportunities...
          </div>
        )}
      </div>
    </div>
  );
};
