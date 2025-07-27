'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIChatWidget } from './ai-chat-widget';
import { AI_PERSONALITIES } from '@/lib/mistral';
import { MessageCircle, Sparkles } from 'lucide-react';

export function AIShowcaseGrid() {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const personalityEntries = Object.entries(AI_PERSONALITIES);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold">AI-Powered Business Solutions</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience different AI specialists designed to solve specific business challenges. 
          Each assistant is trained with domain expertise to provide targeted solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personalityEntries.map(([id, personality]) => (
          <Card key={id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-full ${personality.color} flex items-center justify-center text-white text-xl mb-3`}>
                  {personality.avatar}
                </div>
                <Badge variant="secondary" className="text-xs">
                  AI Specialist
                </Badge>
              </div>
              <CardTitle className="text-xl">{personality.name}</CardTitle>
              <CardDescription className="text-sm">
                {personality.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Specializes in:</h4>
                <div className="flex flex-wrap gap-1">
                  {getSpecializations(id).map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <Button
                  onClick={() => setActiveChat(activeChat === id ? null : id)}
                  className="w-full"
                  variant={activeChat === id ? "secondary" : "default"}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {activeChat === id ? 'Close Chat' : 'Start Conversation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Chat Display */}
      {activeChat && (
        <div className="mt-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">
              Chat with {AI_PERSONALITIES[activeChat].name}
            </h3>
            <p className="text-muted-foreground">
              This is a fully functional AI assistant powered by Mistral AI
            </p>
          </div>
          <AIChatWidget 
            personalityId={activeChat as keyof typeof AI_PERSONALITIES} 
            embedded={true}
            className="shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

function getSpecializations(personalityId: string): string[] {
  const specializations: Record<string, string[]> = {
    business: ['Process Automation', 'Workflow Optimization', 'Efficiency Analysis', 'ROI Calculation'],
    technical: ['API Integration', 'System Architecture', 'Database Design', 'Cloud Solutions'],
    marketing: ['Lead Generation', 'Funnel Optimization', 'Email Automation', 'Analytics'],
    support: ['Chatbot Development', 'Ticket Automation', 'Customer Experience', 'Response Systems'],
    finance: ['Invoice Automation', 'Expense Tracking', 'Financial Reporting', 'Compliance']
  };
  
  return specializations[personalityId] || [];
}