import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, generateStreamingChatResponse, AI_PERSONALITIES, ChatMessage } from '@/lib/mistral';

export async function POST(request: NextRequest) {
  try {
    const { messages, personalityId, stream = false } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const personality = AI_PERSONALITIES[personalityId] || AI_PERSONALITIES.business;
    
    // Handle streaming response
    if (stream) {
      return generateStreamingChatResponse(messages, personality);
    }
    
    // Handle regular response
    const response = await generateChatResponse(messages, personality);
    return NextResponse.json({ response });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}