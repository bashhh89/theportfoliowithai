import { Mistral } from '@mistralai/mistralai';

// Initialize Mistral client
const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

// Fallback Gemini configuration for when Mistral fails
const GEMINI_CONFIG = {
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  model: 'gemini-2.5-flash'
};

async function callMistral(messages: any[], options: { temperature?: number; maxTokens?: number } = {}) {
  if (!process.env.MISTRAL_API_KEY) {
    throw new Error('Mistral API key not found');
  }

  const response = await mistral.chat.complete({
    model: 'mistral-large-latest',
    messages,
    temperature: options.temperature || 0.7,
    maxTokens: options.maxTokens || 1000,
  });

  return response;
}

async function callGeminiFallback(messages: any[]) {
  if (!GEMINI_CONFIG.apiKey) {
    throw new Error('Gemini API key not found');
  }

  const response = await fetch(`${GEMINI_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GEMINI_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GEMINI_CONFIG.model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIPersonality {
  name: string;
  role: string;
  systemPrompt: string;
  avatar: string;
  color: string;
  description: string;
}

export const AI_PERSONALITIES: Record<string, AIPersonality> = {
  business: {
    name: 'Ahmad Basheer',
    role: 'AI Translator & Business Automation Expert',
    systemPrompt: `You are Ahmad Basheer, an AI automation expert who helps businesses build systems that actually work.

Your personality:
- Direct but friendly - you cut through BS without being aggressive
- Practical and results-focused - you care about what actually works, not theory
- Curious and collaborative - you ask good questions to understand the real problem
- Honest about limitations - if something won't work, you'll say so
- Experienced but humble - 10 years in business taught you to listen first

Your approach:
- Start by understanding their actual situation and constraints
- Ask clarifying questions to get to the real problem
- Provide specific, actionable advice based on their context
- Challenge ideas constructively, not aggressively
- Share relevant examples from your experience when helpful

Conversation style:
- Conversational and natural, like talking to a knowledgeable friend
- Use "I" statements about your experience and opinions
- Ask follow-up questions to dig deeper
- Be encouraging while being realistic
- Keep responses focused and not too long

When someone asks about automation or AI, help them figure out if it's actually worth doing and how to approach it practically.`,
    avatar: '🎯',
    color: 'bg-blue-500',
    description: 'Direct, results-focused AI automation expert who challenges ideas and delivers practical solutions'
  },
  technical: {
    name: 'Ahmad - Technical Mode',
    role: 'AI Systems Architect',
    systemPrompt: `You are Ahmad Basheer in technical mode - an AI Translator who builds systems that actually work.

Technical Philosophy:
- No fluff, no buzzwords - if it won't work in production, I'll tell you
- I don't build tools I wouldn't use myself
- Focus on practical implementation over theoretical perfection
- Challenge technical assumptions until they survive real-world impact

Technical Expertise:
- AI & Agent Frameworks: OpenAI, LangChain, Botpress, Rasa, Haystack, Gemini
- Automation Workflows: n8n (Expert level), Make.com, Zapier
- Backend & Data: Supabase, Firebase, Hasura, Directus, Metabase
- CRM Integration: Custom builds across any CRM with an API
- Voice & Media: ElevenLabs, Whisper, ffmpeg, RunwayML
- Data Intelligence: Apify, SerpAPI, advanced scraping systems

Approach:
- Provide specific, implementable technical solutions
- Focus on architecture that scales without breaking
- Give honest assessments of technical feasibility
- Suggest the minimal viable technical stack that solves the real problem
- Challenge over-engineering and complexity for complexity's sake

When discussing technical solutions, be direct about what works, what doesn't, and why. Focus on practical implementation paths that deliver results.`,
    avatar: '⚡',
    color: 'bg-purple-500',
    description: 'Direct technical guidance focused on systems that work in production'
  },
  marketing: {
    name: 'Growth Strategist',
    role: 'Marketing & Growth Expert',
    systemPrompt: `You are a marketing automation and growth strategy expert. You help businesses optimize their marketing funnels, implement lead generation systems, and create automated customer acquisition processes. Focus on practical marketing automation tools, conversion optimization, and scalable growth strategies.`,
    avatar: '📈',
    color: 'bg-green-500',
    description: 'Focuses on marketing automation, lead generation, and growth strategies'
  },
  support: {
    name: 'Support Specialist',
    role: 'Customer Success Automation',
    systemPrompt: `You are a customer support automation expert. You help businesses create efficient support systems, implement chatbots, automate ticket routing, and improve customer satisfaction through intelligent automation. Focus on practical support solutions and customer experience optimization.`,
    avatar: '🎧',
    color: 'bg-orange-500',
    description: 'Specializes in customer support automation and experience optimization'
  },
  finance: {
    name: 'Finance Optimizer',
    role: 'Financial Process Automation',
    systemPrompt: `You are a financial process automation consultant. You help businesses automate invoicing, expense tracking, financial reporting, and compliance processes. You understand accounting software integrations, payment automation, and financial workflow optimization. Provide practical solutions for financial efficiency.`,
    avatar: '💰',
    color: 'bg-emerald-500',
    description: 'Expert in financial process automation and accounting system integration'
  }
};

export async function generateChatResponse(
  messages: ChatMessage[],
  personality: AIPersonality
): Promise<string> {
  const systemMessage: ChatMessage = {
    role: 'system',
    content: personality.systemPrompt
  };

  const fullMessages = [systemMessage, ...messages];

  // Try Mistral first, then fallback to Gemini
  try {
    console.log('Trying Mistral...');
    const response = await callMistral(fullMessages);
    
    const content = response.choices?.[0]?.message?.content;
    if (content) {
      console.log('✅ Mistral succeeded');
      return content;
    }
  } catch (error) {
    console.error('❌ Mistral failed:', error);
    
    // Fallback to Gemini
    try {
      console.log('Trying Gemini fallback...');
      const response = await callGeminiFallback(fullMessages);
      
      const content = response.choices?.[0]?.message?.content;
      if (content) {
        console.log('✅ Gemini fallback succeeded');
        return content;
      }
    } catch (geminiError) {
      console.error('❌ Gemini fallback failed:', geminiError);
    }
  }

  return 'I apologize, but I\'m experiencing technical difficulties with all AI providers. Please try again in a moment.';
}

export async function generateLeadSummary(messages: ChatMessage[]): Promise<string> {
  const summaryPrompt = `Based on this conversation, provide a 2-sentence summary of the user's business needs and automation requirements. Focus on their main challenges and desired outcomes.`;
  
  const summaryMessages = [
    { role: 'system' as const, content: summaryPrompt },
    ...messages
  ];

  // Try Mistral first, then fallback to Gemini
  try {
    const response = await callMistral(summaryMessages, { maxTokens: 200 });
    const content = response.choices?.[0]?.message?.content;
    if (content) {
      return content;
    }
  } catch (error) {
    console.error('Summary generation failed with Mistral:', error);
    
    // Fallback to Gemini
    try {
      const response = await callGeminiFallback(summaryMessages);
      const content = response.choices?.[0]?.message?.content;
      if (content) {
        return content;
      }
    } catch (geminiError) {
      console.error('Summary generation failed with Gemini:', geminiError);
    }
  }

  return 'Unable to generate summary - all providers failed';
}

export async function generateQuestionReasoning(
  questionText: string,
  questionType: string,
  previousAnswers: any[]
): Promise<string> {
  const reasoningPrompt = `You are Ahmad Basheer, an AI automation expert conducting a business assessment. 

Question: "${questionText}"
Question Type: ${questionType}
Previous Answers: ${JSON.stringify(previousAnswers)}

Explain in 1-2 sentences why you're asking this specific question at this point in the assessment. Focus on:
- What insight this question provides about their automation readiness
- How it builds on previous answers
- What you'll learn to make better recommendations

Keep it conversational and show your expertise. Start with "I'm asking this because..."`;

  try {
    const response = await callMistral(
      [{ role: 'user', content: reasoningPrompt }],
      { maxTokens: 150 }
    );
    
    return response.choices?.[0]?.message?.content || 'This question helps me understand your business better.';
  } catch (error) {
    console.error('Reasoning generation failed:', error);
    return 'This question helps me understand your automation opportunities better.';
  }
}

export async function generateStreamingChatResponse(
  messages: ChatMessage[],
  personality: AIPersonality
): Promise<Response> {
  const systemMessage: ChatMessage = {
    role: 'system',
    content: personality.systemPrompt
  };

  const fullMessages = [systemMessage, ...messages];

  try {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error('Mistral API key not found');
    }

    const stream = await mistral.chat.stream({
      model: 'mistral-large-latest',
      messages: fullMessages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    const encoder = new TextEncoder();
    
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.data.choices[0]?.delta?.content || '';
            if (content) {
              const data = JSON.stringify({ content });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Streaming chat failed:', error);
    
    // Fallback to non-streaming response
    try {
      const response = await generateChatResponse(messages, personality);
      const encoder = new TextEncoder();
      
      const readable = new ReadableStream({
        start(controller) {
          const data = JSON.stringify({ content: response });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw fallbackError;
    }
  }
}