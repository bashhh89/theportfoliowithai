'use client';

import { useState, useEffect } from 'react';
import { AIChatWidget } from './ai-chat-widget';
import { AI_PERSONALITIES } from '@/lib/mistral';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shuffle, X } from 'lucide-react';

export function FloatingAIAssistant() {
  const [currentPersonality, setCurrentPersonality] = useState<string>('business');
  const [showPersonalityPicker, setShowPersonalityPicker] = useState(false);

  const personalityEntries = Object.entries(AI_PERSONALITIES);

  const switchPersonality = () => {
    const currentIndex = personalityEntries.findIndex(([id]) => id === currentPersonality);
    const nextIndex = (currentIndex + 1) % personalityEntries.length;
    setCurrentPersonality(personalityEntries[nextIndex][0]);
  };

  const randomPersonality = () => {
    const availablePersonalities = personalityEntries.filter(([id]) => id !== currentPersonality);
    const randomIndex = Math.floor(Math.random() * availablePersonalities.length);
    setCurrentPersonality(availablePersonalities[randomIndex][0]);
  };

  return (
    <div className="relative">
      {/* Personality Picker Overlay */}
      {showPersonalityPicker && (
        <Card className="fixed bottom-24 right-6 w-80 shadow-xl z-40 max-h-96 overflow-y-auto">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Choose AI Assistant</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPersonalityPicker(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {personalityEntries.map(([id, personality]) => (
                <Button
                  key={id}
                  variant={currentPersonality === id ? "default" : "ghost"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => {
                    setCurrentPersonality(id);
                    setShowPersonalityPicker(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${personality.color} flex items-center justify-center text-white text-sm`}>
                      {personality.avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{personality.name}</div>
                      <div className="text-xs text-muted-foreground">{personality.role}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={randomPersonality}
                className="w-full"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Random Assistant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personality Switch Button */}
      <Button
        onClick={() => setShowPersonalityPicker(!showPersonalityPicker)}
        className="fixed bottom-24 right-20 w-12 h-12 rounded-full shadow-lg bg-secondary hover:bg-secondary/80 z-50"
        variant="secondary"
      >
        <Shuffle className="w-4 h-4" />
      </Button>

      {/* Current Personality Indicator */}
      <div className="fixed bottom-6 right-20 z-40">
        <Badge 
          variant="secondary" 
          className="mb-2 shadow-sm cursor-pointer hover:bg-secondary/80"
          onClick={() => setShowPersonalityPicker(!showPersonalityPicker)}
        >
          {AI_PERSONALITIES[currentPersonality].name}
        </Badge>
      </div>

      {/* Main Chat Widget */}
      <AIChatWidget 
        personalityId={currentPersonality as keyof typeof AI_PERSONALITIES}
        key={currentPersonality} // Force re-render when personality changes
      />
    </div>
  );
}