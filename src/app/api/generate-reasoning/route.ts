import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { questionText, questionType, previousAnswers } = await request.json();

    // Generate AI-powered reasoning using Mistral
    const reasoning = await generateAIReasoning(questionText, questionType, previousAnswers);

    return NextResponse.json({ reasoning });
  } catch (error) {
    console.error('Generate reasoning API error:', error);
    
    // Fallback to default reasoning if AI fails
    const fallbackReasoning = generateContextualReasoning(questionText || "", questionType || "", previousAnswers || []);
    return NextResponse.json({ reasoning: fallbackReasoning });
  }
}

async function generateAIReasoning(questionText: string, questionType: string, previousAnswers: any[]): Promise<string> {
  const prompt = `You are Ahmad, a business automation expert helping potential clients understand why you're asking specific questions during a business readiness assessment.

Question: "${questionText}"
Question Type: ${questionType}
Previous Answers: ${previousAnswers.length > 0 ? JSON.stringify(previousAnswers) : 'None yet'}

Generate a brief, personal explanation (2-3 sentences max) of why you're asking this question. Write in first person as Ahmad, focusing on:
- How this question helps identify automation opportunities
- What specific business insights you're gathering
- How this connects to providing better recommendations

Keep it conversational, expert, and focused on the business value. Don't be generic - be specific about what this question reveals about their automation potential.`;

  const response = await mistral.chat.complete({
    model: 'mistral-large-latest',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    maxTokens: 150
  });

  const aiContent = response.choices[0]?.message?.content;
  return typeof aiContent === 'string' ? aiContent : generateContextualReasoning(questionText, questionType, previousAnswers);
}

function generateContextualReasoning(questionText: string, questionType: string, previousAnswers: any[]): string {
  // Enhanced reasoning based on question content and context
  const questionLower = questionText.toLowerCase();
  
  // Business type questions
  if (questionLower.includes('business') && questionLower.includes('type')) {
    return "I need to understand your business model because different industries have unique automation opportunities. E-commerce businesses benefit from inventory and order automation, while service businesses need client communication and scheduling automation.";
  }
  
  // Team size questions
  if (questionLower.includes('team') && (questionLower.includes('size') || questionLower.includes('people'))) {
    return "Team size is crucial for automation planning. Smaller teams (1-5 people) need simple, high-impact automations, while larger teams can handle more complex workflows and integrations.";
  }
  
  // Time management questions
  if (questionLower.includes('time') && (questionLower.includes('waste') || questionLower.includes('spend'))) {
    return "Identifying your biggest time drains helps me prioritize automations with the highest ROI. The goal is to eliminate repetitive tasks so you can focus on strategic work that grows your business.";
  }
  
  // Customer service questions
  if (questionLower.includes('customer') && (questionLower.includes('inquir') || questionLower.includes('support'))) {
    return "Customer support automation can transform your business. Automated responses, ticket routing, and FAQ bots can handle 60-80% of common inquiries, dramatically improving response times while reducing workload.";
  }
  
  // Lead management questions
  if (questionLower.includes('lead') || questionLower.includes('prospect')) {
    return "Lead management automation is often the highest ROI investment. Automated lead scoring, nurture sequences, and follow-up reminders can increase conversion rates by 30-50% while ensuring no opportunities slip through the cracks.";
  }
  
  // Process and workflow questions
  if (questionLower.includes('process') || questionLower.includes('workflow') || questionLower.includes('repetitive')) {
    return "Repetitive processes are automation goldmines. Even simple automations like data entry, report generation, or file organization can save hours per week and eliminate human error.";
  }
  
  // Bottleneck questions
  if (questionLower.includes('bottleneck') || questionLower.includes('slow')) {
    return "Bottlenecks limit your growth potential. By automating around these constraints, we can unlock significant scaling opportunities and improve overall business efficiency.";
  }
  
  // Tool and technology questions
  if (questionLower.includes('tool') || questionLower.includes('software') || questionLower.includes('system')) {
    return "Understanding your current tech stack is essential for seamless automation. I'll recommend solutions that integrate with your existing tools, minimizing disruption while maximizing efficiency gains.";
  }
  
  // Priority and goal questions
  if (questionLower.includes('priority') || questionLower.includes('important') || questionLower.includes('goal')) {
    return "Your priorities shape my recommendations. Whether you're focused on saving time, reducing costs, or improving customer experience, I'll tailor automation suggestions to align with your specific business objectives.";
  }
  
  // Budget and investment questions
  if (questionLower.includes('budget') || questionLower.includes('spend') || questionLower.includes('cost')) {
    return "Budget considerations help me recommend appropriate solutions. There are automation options for every budget - from free tools like Zapier's basic plan to enterprise solutions. ROI is always the key metric.";
  }
  
  // Timeline questions
  if (questionLower.includes('timeline') || questionLower.includes('when') || questionLower.includes('implement')) {
    return "Implementation timeline affects which solutions I recommend. Some automations can be set up in hours (like email sequences), while others need weeks of planning (like CRM integrations). I'll match recommendations to your timeline.";
  }
  
  // Default reasoning with context from previous answers
  let contextualReasoning = "This question helps me understand your unique business situation so I can provide targeted automation recommendations that will have the biggest impact on your specific challenges and goals.";
  
  // Add context based on previous answers if available
  if (previousAnswers && previousAnswers.length > 0) {
    const hasBusinessType = previousAnswers.some(answer => answer.questionId === 'business-type');
    const hasTeamSize = previousAnswers.some(answer => answer.questionId === 'team-size');
    
    if (hasBusinessType && hasTeamSize) {
      contextualReasoning += " Based on your previous answers, I'm building a comprehensive picture of your automation needs to ensure my recommendations are perfectly tailored to your situation.";
    }
  }
  
  return contextualReasoning;
}
