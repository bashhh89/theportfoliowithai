export interface AssessmentQuestion {
  id: string;
  category: 'foundation' | 'operations' | 'technology' | 'goals' | 'investment';
  type: 'single-choice' | 'multiple-choice' | 'text' | 'scale';
  question: string;
  description?: string;
  options?: string[];
  weight: number;
  phase: number;
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Phase 1: Business Foundation (3 questions)
  {
    id: 'business-type',
    category: 'foundation',
    type: 'single-choice',
    question: 'What type of business do you run?',
    description: 'This helps us understand your industry and common automation opportunities.',
    options: [
      'E-commerce/Online Store',
      'SaaS/Software Company', 
      'Service-based Business (Consulting, Agency, etc.)',
      'Local Business (Restaurant, Retail, etc.)',
      'B2B Sales & Marketing',
      'Healthcare/Medical Practice',
      'Real Estate',
      'Other'
    ],
    weight: 2,
    phase: 1
  },
  {
    id: 'team-size',
    category: 'foundation',
    type: 'single-choice',
    question: 'How many people work in your business?',
    description: 'Team size affects automation complexity and ROI potential.',
    options: [
      'Just me (Solo entrepreneur)',
      '2-5 people',
      '6-15 people',
      '16-50 people',
      '50+ people'
    ],
    weight: 2,
    phase: 1
  },
  {
    id: 'biggest-time-waster',
    category: 'operations',
    type: 'text',
    question: 'What manual task takes up the most time in your business each week?',
    description: 'Be specific - this helps identify your biggest automation opportunity.',
    weight: 3,
    phase: 1
  },

  // Phase 2: Current Operations (4 questions)
  {
    id: 'customer-inquiries',
    category: 'operations',
    type: 'single-choice',
    question: 'How do you currently handle customer inquiries and support?',
    options: [
      'Manually respond to each email/message',
      'Basic email templates and canned responses',
      'Simple chatbot for FAQ + manual follow-up',
      'Ticketing system with some automation',
      'Advanced support system with AI assistance'
    ],
    weight: 2.5,
    phase: 2
  },
  {
    id: 'lead-management',
    category: 'operations',
    type: 'single-choice',
    question: 'How do you manage leads and sales processes?',
    options: [
      'Spreadsheets and manual tracking',
      'Basic CRM with manual data entry',
      'CRM with some automated workflows',
      'Advanced CRM with lead scoring and automation',
      'Fully automated lead nurturing system'
    ],
    weight: 2.5,
    phase: 2
  },
  {
    id: 'repetitive-tasks',
    category: 'operations',
    type: 'multiple-choice',
    question: 'Which of these repetitive tasks do you do regularly?',
    description: 'Select all that apply - these are prime automation candidates.',
    options: [
      'Data entry between different systems',
      'Sending follow-up emails',
      'Scheduling appointments',
      'Creating reports',
      'Social media posting',
      'Invoice generation and follow-up',
      'Lead qualification',
      'Customer onboarding'
    ],
    weight: 2,
    phase: 2
  },
  {
    id: 'biggest-bottleneck',
    category: 'operations',
    type: 'text',
    question: 'What is your biggest operational bottleneck right now?',
    description: 'What prevents you from serving more customers or growing faster?',
    weight: 3,
    phase: 2
  },

  // Phase 3: Technology & Goals (3 questions)
  {
    id: 'current-tools',
    category: 'technology',
    type: 'multiple-choice',
    question: 'What tools/software does your business currently use?',
    description: 'Select all that apply - this helps us understand integration opportunities.',
    options: [
      'CRM (Salesforce, HubSpot, etc.)',
      'Email marketing (Mailchimp, ConvertKit, etc.)',
      'Project management (Asana, Trello, etc.)',
      'Accounting software (QuickBooks, Xero, etc.)',
      'E-commerce platform (Shopify, WooCommerce, etc.)',
      'Communication tools (Slack, Teams, etc.)',
      'Analytics tools (Google Analytics, etc.)',
      'Custom software/databases'
    ],
    weight: 2,
    phase: 3
  },
  {
    id: 'automation-priority',
    category: 'goals',
    type: 'single-choice',
    question: 'What would you most like to automate first?',
    options: [
      'Customer support and inquiries',
      'Lead generation and nurturing',
      'Sales process and follow-up',
      'Administrative tasks and reporting',
      'Marketing and social media',
      'Operations and fulfillment',
      'Financial processes and invoicing'
    ],
    weight: 3,
    phase: 3
  },
  {
    id: 'success-metric',
    category: 'goals',
    type: 'single-choice',
    question: 'What would success look like for you with automation?',
    options: [
      'Save 10+ hours per week on manual tasks',
      'Handle 2x more customers with same team',
      'Improve customer response time significantly',
      'Increase revenue without hiring',
      'Reduce errors and improve consistency',
      'Better data and insights for decisions'
    ],
    weight: 2,
    phase: 3
  },

  // Phase 4: Investment & Implementation (2 questions)
  {
    id: 'current-tool-spend',
    category: 'investment',
    type: 'single-choice',
    question: 'What do you typically spend monthly on business tools/software?',
    options: [
      'Under $200/month',
      '$200-500/month',
      '$500-1,500/month',
      '$1,500-5,000/month',
      'Over $5,000/month'
    ],
    weight: 2,
    phase: 4
  },
  {
    id: 'implementation-timeline',
    category: 'investment',
    type: 'single-choice',
    question: 'What is your ideal timeline for implementing automation solutions?',
    options: [
      'ASAP - we need help now',
      'Within the next month',
      'Next 2-3 months',
      'Next 6 months',
      'Just exploring for future planning'
    ],
    weight: 2,
    phase: 4
  }
];