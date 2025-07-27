// Agent System Types
export interface AgentTool {
  id: string;
  name: string;
  description: string;
  category: 'communication' | 'scheduling' | 'data' | 'analysis';
  config: Record<string, any>;
  enabled: boolean;
}

export interface AgentConfig {
  id: string;
  name: string;
  type: 'lead-qualification' | 'customer-support' | 'content-creation' | 'data-analysis';
  model: 'gpt-4-turbo' | 'mistral-large' | 'claude-3';
  systemPrompt: string;
  tools: AgentTool[];
  settings: {
    temperature: number;
    maxTokens: number;
    responseStyle: 'professional' | 'casual' | 'technical';
  };
  integrations: {
    calendar?: CalendarIntegration;
    crm?: CRMIntegration;
    email?: EmailIntegration;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarIntegration {
  provider: 'calendly' | 'google-calendar' | 'outlook';
  apiKey?: string;
  calendarId?: string;
  bookingUrl?: string;
  availableSlots: string[];
}

export interface CRMIntegration {
  provider: 'hubspot' | 'pipedrive' | 'salesforce';
  apiKey: string;
  pipelineId?: string;
  defaultStage?: string;
}

export interface EmailIntegration {
  provider: 'gmail' | 'outlook' | 'sendgrid';
  apiKey: string;
  fromEmail: string;
  templates: EmailTemplate[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: 'lead-qualified' | 'meeting-booked' | 'follow-up';
}

export interface AgentConversation {
  id: string;
  agentId: string;
  userId?: string;
  messages: AgentMessage[];
  leadData?: LeadData;
  status: 'active' | 'qualified' | 'meeting-booked' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  toolId: string;
  action: string;
  parameters: Record<string, any>;
  result?: any;
  timestamp: Date;
}

export interface LeadData {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  budget?: string;
  timeline?: string;
  needs: string[];
  score: number; // 1-10 qualification score
  source: string;
}