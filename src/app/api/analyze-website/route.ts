import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, AI_PERSONALITIES } from '@/lib/mistral';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Scrape and analyze the website
    const analysisResults = await analyzeWebsite(url);

    return NextResponse.json(analysisResults);
  } catch (error) {
    console.error('Website analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze website' },
      { status: 500 }
    );
  }
}

async function analyzeWebsite(url: string) {
  try {
    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract key information from the HTML
    const websiteInfo = extractWebsiteInfo(html, url);
    
    // Use AI to analyze the website and generate recommendations
    const aiAnalysis = await getAIAnalysis(websiteInfo, url);
    
    return aiAnalysis;
  } catch (error) {
    console.error('Error analyzing website:', error);
    
    // Return a fallback analysis if scraping fails
    return getFallbackAnalysis(url);
  }
}

function extractWebsiteInfo(html: string, url: string) {
  // Extract basic information from HTML
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  const descriptionMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i);
  const description = descriptionMatch ? descriptionMatch[1].trim() : '';
  
  // Look for common automation tools and platforms
  const hasShopify = html.includes('shopify') || html.includes('Shopify');
  const hasWordPress = html.includes('wp-content') || html.includes('wordpress');
  const hasWooCommerce = html.includes('woocommerce');
  const hasHubSpot = html.includes('hubspot') || html.includes('HubSpot');
  const hasMailchimp = html.includes('mailchimp') || html.includes('Mailchimp');
  const hasGoogleAnalytics = html.includes('google-analytics') || html.includes('gtag');
  const hasIntercom = html.includes('intercom') || html.includes('Intercom');
  const hasZendesk = html.includes('zendesk') || html.includes('Zendesk');
  const hasChatbot = html.includes('chatbot') || html.includes('chat-widget');
  
  // Look for forms and contact methods
  const hasContactForm = html.includes('<form') && (html.includes('contact') || html.includes('email'));
  const hasNewsletterSignup = html.includes('newsletter') || html.includes('subscribe');
  const hasLiveChat = html.includes('live-chat') || html.includes('livechat');
  
  // Detect business type based on content
  let businessType = 'General Business';
  if (hasShopify || hasWooCommerce || html.includes('cart') || html.includes('shop')) {
    businessType = 'E-commerce';
  } else if (html.includes('saas') || html.includes('software') || html.includes('api')) {
    businessType = 'SaaS/Software';
  } else if (html.includes('consulting') || html.includes('agency') || html.includes('services')) {
    businessType = 'Service-based';
  } else if (html.includes('restaurant') || html.includes('local') || html.includes('location')) {
    businessType = 'Local Business';
  }
  
  return {
    title,
    description,
    businessType,
    currentTools: {
      hasShopify,
      hasWordPress,
      hasWooCommerce,
      hasHubSpot,
      hasMailchimp,
      hasGoogleAnalytics,
      hasIntercom,
      hasZendesk,
      hasChatbot
    },
    features: {
      hasContactForm,
      hasNewsletterSignup,
      hasLiveChat
    },
    url
  };
}

async function getAIAnalysis(websiteInfo: any, url: string) {
  const analysisPrompt = `
Analyze this website and provide automation recommendations:

Website: ${url}
Title: ${websiteInfo.title}
Business Type: ${websiteInfo.businessType}
Current Tools: ${JSON.stringify(websiteInfo.currentTools)}
Features: ${JSON.stringify(websiteInfo.features)}

Based on this information, provide a JSON response with:
1. Top 3-5 automation opportunities with impact level (high/medium/low)
2. Estimated monthly time/cost savings
3. Urgency score (1-10)
4. Specific next steps

Focus on practical, implementable automation solutions that would provide real ROI.
`;

  try {
    const aiResponse = await generateChatResponse(
      [{ role: 'user', content: analysisPrompt }],
      AI_PERSONALITIES.technical
    );

    // Try to parse AI response as JSON, fallback to structured analysis
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      parsedResponse = parseAIResponseText(aiResponse, websiteInfo);
    }

    return formatAnalysisResults(parsedResponse, websiteInfo, url);
  } catch (error) {
    console.error('AI analysis failed:', error);
    return getFallbackAnalysis(url);
  }
}

function parseAIResponseText(aiResponse: string, websiteInfo: any) {
  // Parse AI response text into structured format
  const opportunities = [];
  
  // Extract opportunities from AI response
  const lines = aiResponse.split('\n');
  let currentOpportunity = null;
  
  for (const line of lines) {
    if (line.includes('automation') || line.includes('opportunity')) {
      if (currentOpportunity) {
        opportunities.push(currentOpportunity);
      }
      currentOpportunity = {
        area: line.trim(),
        description: '',
        impact: 'medium',
        timeToImplement: '2-4 weeks',
        estimatedROI: '200-300%'
      };
    } else if (currentOpportunity && line.trim()) {
      currentOpportunity.description += line.trim() + ' ';
    }
  }
  
  if (currentOpportunity) {
    opportunities.push(currentOpportunity);
  }
  
  return {
    opportunities: opportunities.slice(0, 5),
    estimatedSavings: '$2,000-5,000',
    urgencyScore: 7,
    nextSteps: [
      'Implement basic workflow automation',
      'Set up customer communication automation',
      'Integrate existing tools for better data flow'
    ]
  };
}

function formatAnalysisResults(analysis: any, websiteInfo: any, url: string) {
  return {
    url,
    businessType: websiteInfo.businessType,
    currentAutomation: Object.entries(websiteInfo.currentTools)
      .filter(([_, hasIt]) => hasIt)
      .map(([tool, _]) => tool.replace('has', '')),
    opportunities: analysis.opportunities || getDefaultOpportunities(websiteInfo.businessType),
    urgencyScore: analysis.urgencyScore || 7,
    estimatedSavings: analysis.estimatedSavings || '$2,000-5,000',
    nextSteps: analysis.nextSteps || [
      'Audit current manual processes',
      'Implement basic automation workflows',
      'Set up customer communication automation',
      'Integrate existing tools for better efficiency'
    ]
  };
}

function getDefaultOpportunities(businessType: string) {
  const opportunitiesByType: Record<string, any[]> = {
    'E-commerce': [
      {
        area: 'Order Processing Automation',
        description: 'Automate order confirmations, shipping notifications, and inventory updates.',
        impact: 'high',
        timeToImplement: '2-3 weeks',
        estimatedROI: '300-500%'
      },
      {
        area: 'Customer Support Chatbot',
        description: 'Handle common customer inquiries automatically, reducing response time.',
        impact: 'high',
        timeToImplement: '1-2 weeks',
        estimatedROI: '200-400%'
      },
      {
        area: 'Abandoned Cart Recovery',
        description: 'Automatically follow up with customers who abandon their shopping carts.',
        impact: 'medium',
        timeToImplement: '1 week',
        estimatedROI: '150-300%'
      }
    ],
    'SaaS/Software': [
      {
        area: 'User Onboarding Automation',
        description: 'Create automated email sequences and in-app guidance for new users.',
        impact: 'high',
        timeToImplement: '3-4 weeks',
        estimatedROI: '400-600%'
      },
      {
        area: 'Lead Scoring & Nurturing',
        description: 'Automatically score and nurture leads based on behavior and engagement.',
        impact: 'high',
        timeToImplement: '2-3 weeks',
        estimatedROI: '300-500%'
      }
    ],
    'Service-based': [
      {
        area: 'Appointment Scheduling Automation',
        description: 'Allow clients to book appointments automatically with calendar integration.',
        impact: 'high',
        timeToImplement: '1-2 weeks',
        estimatedROI: '200-400%'
      },
      {
        area: 'Client Onboarding Workflow',
        description: 'Automate contract sending, payment collection, and project kickoff.',
        impact: 'medium',
        timeToImplement: '2-3 weeks',
        estimatedROI: '250-350%'
      }
    ]
  };

  return opportunitiesByType[businessType] || opportunitiesByType['Service-based'];
}

function getFallbackAnalysis(url: string) {
  return {
    url,
    businessType: 'General Business',
    currentAutomation: [],
    opportunities: [
      {
        area: 'Email Marketing Automation',
        description: 'Set up automated email sequences for customer engagement and nurturing.',
        impact: 'high',
        timeToImplement: '1-2 weeks',
        estimatedROI: '200-400%'
      },
      {
        area: 'Customer Support Automation',
        description: 'Implement chatbots and automated ticket routing for faster response times.',
        impact: 'medium',
        timeToImplement: '2-3 weeks',
        estimatedROI: '150-300%'
      },
      {
        area: 'Social Media Automation',
        description: 'Automate social media posting and engagement tracking.',
        impact: 'medium',
        timeToImplement: '1 week',
        estimatedROI: '100-250%'
      }
    ],
    urgencyScore: 6,
    estimatedSavings: '$1,500-3,000',
    nextSteps: [
      'Identify your most time-consuming manual processes',
      'Start with simple automation tools like Zapier',
      'Implement basic email marketing automation',
      'Consider customer support automation solutions'
    ]
  };
}