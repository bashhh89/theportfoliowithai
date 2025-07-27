import { AgentConfig, AgentTool, LeadData, AgentMessage } from './types';
import { Mistral } from '@mistralai/mistralai';

// Initialize Mistral (we'll use this for now, can switch to GPT-4 later)
const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export const LEAD_QUALIFICATION_AGENT: AgentConfig = {
  id: 'lead-qualification-v1',
  name: 'Lead Qualification Agent',
  type: 'lead-qualification',
  model: 'mistral-large',
  systemPrompt: `You are Ahmad's Lead Qualification Agent - a professional AI assistant that helps qualify potential clients for business automation services.

Your personality:
- Professional but friendly and conversational
- Curious about their business challenges
- Focused on understanding their automation needs
- Helpful in explaining how automation can solve their problems

Your goal is to:
1. Understand their business and current challenges
2. Identify automation opportunities
3. Qualify them as a potential client (budget, timeline, decision-making authority)
4. Book a consultation call if they're a good fit

Key qualification questions to work into the conversation naturally:
- What type of business do they run?
- What manual processes are taking up their time?
- What's their team size?
- What's their budget range for automation solutions?
- What's their timeline for implementing solutions?
- Are they the decision maker?

Tools available to you:
- book_meeting: Book a consultation call
- add_to_crm: Add qualified leads to CRM
- send_follow_up: Send follow-up emails
- calculate_roi: Calculate potential ROI from automation

Always be helpful and focus on their needs, not just selling. If they're not a good fit, be honest but still provide value.`,
  
  tools: [
    {
      id: 'book_meeting',
      name: 'Book Meeting',
      description: 'Book a consultation call with Ahmad',
      category: 'scheduling',
      config: {
        calendarUrl: 'https://calendly.com/ahmad-automation/consultation',
        duration: 30,
        availableSlots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']
      },
      enabled: true
    },
    {
      id: 'add_to_crm',
      name: 'Add to CRM',
      description: 'Add qualified lead to CRM system',
      category: 'data',
      config: {
        pipeline: 'lead-qualification',
        defaultStage: 'new-lead'
      },
      enabled: true
    },
    {
      id: 'send_follow_up',
      name: 'Send Follow-up Email',
      description: 'Send automated follow-up emails',
      category: 'communication',
      config: {
        templates: ['qualification-follow-up', 'meeting-confirmation', 'resources-email']
      },
      enabled: true
    },
    {
      id: 'calculate_roi',
      name: 'ROI Calculator',
      description: 'Calculate potential ROI from automation',
      category: 'analysis',
      config: {
        factors: ['team-size', 'manual-hours', 'hourly-rate', 'automation-cost']
      },
      enabled: true
    }
  ],
  
  settings: {
    temperature: 0.7,
    maxTokens: 500,
    responseStyle: 'professional'
  },
  
  integrations: {
    calendar: {
      provider: 'calendly',
      bookingUrl: 'https://calendly.com/ahmad-automation/consultation',
      availableSlots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']
    },
    crm: {
      provider: 'pipedrive',
      apiKey: process.env.PIPEDRIVE_API_KEY || '',
      pipelineId: 'lead-qualification',
      defaultStage: 'new-lead'
    },
    email: {
      provider: 'sendgrid',
      apiKey: process.env.SENDGRID_API_KEY || '',
      fromEmail: 'ahmad@yourdomain.com',
      templates: [
        {
          id: 'qualification-follow-up',
          name: 'Qualification Follow-up',
          subject: 'Thanks for chatting - here are some automation ideas for {{company}}',
          body: `Hi {{name}},

Great chatting with you about {{company}}'s automation opportunities!

Based on our conversation, I think you could save significant time by automating:
{{automation_opportunities}}

I've seen similar businesses save 15-20 hours per week with the right setup.

Would you like to hop on a quick 30-minute call to discuss how this could work for your specific situation?

Best,
Ahmad`,
          trigger: 'lead-qualified'
        }
      ]
    }
  },
  
  createdAt: new Date(),
  updatedAt: new Date()
};

// Agent Tools Implementation
export class LeadQualificationTools {
  
  static async bookMeeting(leadData: LeadData, preferredTime?: string) {
    // In a real implementation, this would integrate with Calendly API
    console.log('Booking meeting for:', leadData);
    
    // Simulate booking
    const bookingId = `booking_${Date.now()}`;
    const meetingTime = preferredTime || 'Next available slot';
    
    return {
      success: true,
      bookingId,
      meetingTime,
      calendarUrl: 'https://calendly.com/ahmad-automation/consultation',
      message: `Great! I've reserved a 30-minute consultation slot for you. You'll receive a calendar invite shortly.`
    };
  }
  
  static async addToCRM(leadData: LeadData) {
    // In a real implementation, this would use Pipedrive/HubSpot API
    console.log('Adding to CRM:', leadData);
    
    // Simulate CRM addition
    const leadId = `lead_${Date.now()}`;
    
    return {
      success: true,
      leadId,
      message: `Lead added to CRM successfully`
    };
  }
  
  static async sendFollowUp(leadData: LeadData, templateId: string) {
    // In a real implementation, this would use SendGrid/Mailgun API
    console.log('Sending follow-up email:', { leadData, templateId });
    
    return {
      success: true,
      emailId: `email_${Date.now()}`,
      message: `Follow-up email sent to ${leadData.email}`
    };
  }
  
  static calculateROI(teamSize: number, manualHours: number, hourlyRate: number) {
    const weeklyTimeSaved = manualHours * 0.7; // Assume 70% time savings
    const weeklySavings = weeklyTimeSaved * hourlyRate;
    const monthlySavings = weeklySavings * 4;
    const yearlySavings = monthlySavings * 12;
    
    const automationCost = 500; // Monthly cost estimate
    const yearlyROI = ((yearlySavings - (automationCost * 12)) / (automationCost * 12)) * 100;
    
    return {
      weeklyTimeSaved,
      monthlySavings,
      yearlySavings,
      yearlyROI: Math.round(yearlyROI),
      message: `Based on your team size and current manual processes, automation could save you approximately ${weeklyTimeSaved} hours per week, which equals $${monthlySavings.toLocaleString()} per month in time savings.`
    };
  }
}

// Main Agent Processing Function
export async function processLeadQualificationChat(
  messages: AgentMessage[],
  leadData?: LeadData
): Promise<{ response: string; toolCalls?: any[]; updatedLeadData?: LeadData }> {
  
  try {
    // Prepare messages for AI
    const systemMessage = {
      role: 'system' as const,
      content: LEAD_QUALIFICATION_AGENT.systemPrompt
    };
    
    const chatMessages = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];
    
    // Get AI response
    const response = await mistral.chat.complete({
      model: 'mistral-large-latest',
      messages: chatMessages,
      temperature: 0.7,
      maxTokens: 500,
    });
    
    const aiResponse = response.choices[0]?.message?.content || 'I apologize, but I\'m having trouble responding right now.';
    
    // Analyze if we should trigger any tools
    const toolCalls = await analyzeForToolTriggers(aiResponse, messages, leadData);
    
    return {
      response: aiResponse,
      toolCalls,
      updatedLeadData: leadData
    };
    
  } catch (error) {
    console.error('Lead qualification chat error:', error);
    return {
      response: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.'
    };
  }
}

// Analyze conversation to determine if tools should be triggered
async function analyzeForToolTriggers(
  aiResponse: string, 
  messages: AgentMessage[], 
  leadData?: LeadData
) {
  const toolCalls = [];
  
  // Check if user wants to book a meeting
  if (aiResponse.toLowerCase().includes('book') && aiResponse.toLowerCase().includes('meeting')) {
    if (leadData?.email) {
      const bookingResult = await LeadQualificationTools.bookMeeting(leadData);
      toolCalls.push({
        tool: 'book_meeting',
        result: bookingResult
      });
    }
  }
  
  // Check if lead is qualified and should be added to CRM
  if (leadData?.email && leadData?.name && leadData.score >= 7) {
    const crmResult = await LeadQualificationTools.addToCRM(leadData);
    toolCalls.push({
      tool: 'add_to_crm',
      result: crmResult
    });
  }
  
  return toolCalls;
}