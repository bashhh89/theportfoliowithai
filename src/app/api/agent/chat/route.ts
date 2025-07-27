import { NextRequest, NextResponse } from 'next/server';
import { processLeadQualificationChat } from '@/lib/agents/lead-qualification';
import { AgentMessage, LeadData } from '@/lib/agents/types';

export async function POST(request: NextRequest) {
  try {
    const { messages, leadData, agentId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // For now, we only have lead qualification agent
    if (agentId !== 'lead-qualification-v1') {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Process the chat with our lead qualification agent
    const result = await processLeadQualificationChat(messages, leadData);

    return NextResponse.json({
      response: result.response,
      toolCalls: result.toolCalls || [],
      updatedLeadData: result.updatedLeadData,
      agentId
    });

  } catch (error) {
    console.error('Agent chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process agent chat' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve agent configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // For now, return lead qualification agent config
    if (agentId === 'lead-qualification-v1') {
      const { LEAD_QUALIFICATION_AGENT } = await import('@/lib/agents/lead-qualification');
      
      // Remove sensitive data before sending to client
      const publicConfig = {
        id: LEAD_QUALIFICATION_AGENT.id,
        name: LEAD_QUALIFICATION_AGENT.name,
        type: LEAD_QUALIFICATION_AGENT.type,
        tools: LEAD_QUALIFICATION_AGENT.tools.map(tool => ({
          id: tool.id,
          name: tool.name,
          description: tool.description,
          category: tool.category,
          enabled: tool.enabled
        })),
        settings: LEAD_QUALIFICATION_AGENT.settings
      };

      return NextResponse.json({ agent: publicConfig });
    }

    return NextResponse.json(
      { error: 'Agent not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Agent config API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve agent configuration' },
      { status: 500 }
    );
  }
}