import type { 
  Email, InsertEmail, 
  Prompt, InsertPrompt, 
  Draft, InsertDraft,
  ChatMessage, InsertChatMessage,
  User, InsertUser,
  EmailCategory
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllEmails(): Promise<Email[]>;
  getEmail(id: number): Promise<Email | undefined>;
  createEmail(email: InsertEmail): Promise<Email>;
  updateEmail(id: number, data: Partial<Email>): Promise<Email | undefined>;
  deleteEmail(id: number): Promise<boolean>;
  
  getAllPrompts(): Promise<Prompt[]>;
  getPrompt(id: string): Promise<Prompt | undefined>;
  getPromptByType(type: string): Promise<Prompt | undefined>;
  updatePrompt(id: string, content: string): Promise<Prompt | undefined>;
  resetPrompt(id: string): Promise<Prompt | undefined>;
  
  getAllDrafts(): Promise<Draft[]>;
  getDraft(id: number): Promise<Draft | undefined>;
  createDraft(draft: InsertDraft): Promise<Draft>;
  updateDraft(id: number, data: Partial<Draft>): Promise<Draft | undefined>;
  deleteDraft(id: number): Promise<boolean>;
  
  getChatMessages(emailId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearChatMessages(emailId: number): Promise<void>;
}

const defaultPrompts: Prompt[] = [
  {
    id: "categorization",
    name: "Categorization Prompt",
    description: "Categorize emails into predefined categories",
    type: "categorization",
    content: `Categorize this email into exactly ONE of these categories: Important, Newsletter, Spam, To-Do.

Rules:
- "Important": Urgent matters, direct requests from people, time-sensitive content
- "Newsletter": Promotional content, subscriptions, regular updates from services
- "Spam": Unsolicited messages, suspicious content, irrelevant promotions
- "To-Do": Emails containing direct action requests or tasks requiring user response

Respond with ONLY the category name, nothing else.`,
  },
  {
    id: "action_extraction",
    name: "Action Item Extraction Prompt",
    description: "Extract tasks and action items from emails",
    type: "action_extraction",
    content: `Extract all action items and tasks from this email. For each task, identify:
1. The task description
2. Any deadline mentioned (or null if none)

Respond ONLY with a valid JSON array in this exact format:
[{"task": "description here", "deadline": "date or null"}]

If there are no action items, respond with an empty array: []
Do not include any explanation, only the JSON array.`,
  },
  {
    id: "auto_reply",
    name: "Auto-Reply Draft Prompt",
    description: "Generate professional email reply drafts",
    type: "auto_reply",
    content: `Generate a professional email reply draft for this email. Consider:

1. If it's a meeting request: Draft a polite reply asking for agenda details or confirming availability
2. If it's a task request: Acknowledge receipt and indicate you'll review/respond
3. If it's informational: Thank them for the information and note any follow-up needed
4. If it's promotional/newsletter: No reply needed, respond with "NO_REPLY_NEEDED"

Keep the tone professional but friendly. Be concise.
Format as a complete email body, ready to send.`,
  },
];

const mockEmails: Email[] = [
  {
    id: 1,
    sender: "Sarah Johnson",
    senderEmail: "sarah.johnson@techcorp.com",
    subject: "Urgent: Q4 Project Review Meeting Tomorrow",
    body: `Hi,

I hope this email finds you well. I wanted to remind you about our Q4 project review meeting scheduled for tomorrow at 2:00 PM.

Please come prepared with:
- Your quarterly progress report
- Budget utilization summary
- Key achievements and blockers
- Proposed timeline for Q1 initiatives

The meeting will be held in Conference Room B. Please confirm your attendance by end of day.

Best regards,
Sarah Johnson
Project Manager`,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: null,
    actionItems: null,
  },
  {
    id: 2,
    sender: "TechDigest Weekly",
    senderEmail: "newsletter@techdigest.com",
    subject: "This Week in Tech: AI Breakthroughs & Industry News",
    body: `TechDigest Weekly Newsletter

Top Stories This Week:
━━━━━━━━━━━━━━━━━━━

1. Major AI Company Announces Revolutionary Language Model
Read about the latest breakthrough that's changing the industry...

2. Cybersecurity Alert: New Vulnerabilities Discovered
Stay informed about the latest security patches you need to apply...

3. Future of Remote Work: 2024 Trends Report
What experts predict for the evolving workplace...

4. Startup Spotlight: Companies to Watch
Discover the innovative startups making waves...

━━━━━━━━━━━━━━━━━━━
Unsubscribe | Update Preferences | View in Browser`,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: null,
    actionItems: null,
  },
  {
    id: 3,
    sender: "Mike Chen",
    senderEmail: "mike.chen@clientco.com",
    subject: "RE: Contract Renewal - Action Required by Friday",
    body: `Hello,

Following up on our discussion last week regarding the contract renewal.

I need you to:
1. Review the updated terms in the attached document
2. Send your feedback by this Friday (Dec 1st)
3. Schedule a call for next Monday to finalize

The legal team is waiting for our response, so your timely feedback is crucial.

Also, please share the updated pricing structure we discussed. I need it for our budget meeting on Thursday.

Let me know if you have any questions.

Thanks,
Mike`,
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: null,
    actionItems: null,
  },
  {
    id: 4,
    sender: "AMAZING DEALS!!!",
    senderEmail: "deals@sp4m-offers.xyz",
    subject: "🎉 YOU WON!!! Claim Your $10,000 Prize NOW!!!",
    body: `CONGRATULATIONS!!!

You have been RANDOMLY SELECTED to receive $10,000 USD!!!

This is NOT a joke! You are our LUCKY WINNER!

To claim your prize, simply:
1. Click the link below
2. Enter your bank details
3. Receive your money INSTANTLY!

>>> CLAIM NOW: http://totally-legit-prize.xyz/claim <<<

This offer expires in 24 HOURS! Don't miss out!

*This is a limited time offer. Terms and conditions apply.`,
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: null,
    actionItems: null,
  },
  {
    id: 5,
    sender: "Emily Rodriguez",
    senderEmail: "emily.r@designstudio.io",
    subject: "Design Assets Ready for Review",
    body: `Hi there,

Great news! The design assets for the new marketing campaign are ready for your review.

I've uploaded everything to our shared drive:
- Brand guidelines update (PDF)
- Social media templates (Figma)
- Email banner designs (PNG/SVG)
- Landing page mockups (Figma)

Please review and provide feedback by Wednesday so we can make any necessary revisions before the campaign launch on Monday.

Looking forward to your thoughts!

Best,
Emily Rodriguez
Senior Designer`,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: null,
    actionItems: null,
  },
  {
    id: 6,
    sender: "HR Department",
    senderEmail: "hr@company.com",
    subject: "Reminder: Complete Annual Training by Dec 15",
    body: `Dear Team Member,

This is a friendly reminder that all employees must complete the following mandatory training modules by December 15th:

Required Courses:
□ Workplace Safety (1 hour)
□ Data Privacy & Security (45 min)
□ Anti-Harassment Training (30 min)
□ Code of Conduct Review (20 min)

Access the training portal: training.company.com

Your current completion status: 1/4 modules completed

Please allocate time this week to complete the remaining modules. Non-compliance may affect your performance review.

Questions? Contact hr@company.com

Human Resources Team`,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: null,
    actionItems: null,
  },
  {
    id: 7,
    sender: "Alex Thompson",
    senderEmail: "alex.t@startup.io",
    subject: "Partnership Opportunity - Let's Connect!",
    body: `Hi,

I came across your company's work and I'm impressed by what you're building.

I'm the Business Development lead at StartupIO, and I think there could be a great synergy between our platforms.

Would you be open to a 30-minute call next week to explore potential partnership opportunities? I'm thinking:
- API integration possibilities
- Co-marketing initiatives
- Referral program

Let me know your availability and I'll send a calendar invite.

Looking forward to connecting!

Best regards,
Alex Thompson
BD Lead, StartupIO`,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: null,
    actionItems: null,
  },
  {
    id: 8,
    sender: "Cloud Services",
    senderEmail: "billing@cloudservices.com",
    subject: "Invoice #INV-2024-1128 - Payment Due",
    body: `Cloud Services Invoice

Invoice Number: INV-2024-1128
Date: November 28, 2024
Due Date: December 12, 2024

━━━━━━━━━━━━━━━━━━━━━━━━━━━
Services:
- Cloud Hosting (Pro Plan)     $299.00
- Additional Storage (500GB)    $49.99
- CDN Bandwidth                 $25.00
- Premium Support               $99.00
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal:                      $472.99
Tax (8%):                       $37.84
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Due:                     $510.83

Pay online: billing.cloudservices.com/pay/INV-2024-1128

Questions about this invoice? Reply to this email.`,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: null,
    actionItems: null,
  },
  {
    id: 9,
    sender: "David Kim",
    senderEmail: "david.kim@engineering.co",
    subject: "Bug Report: Critical Issue in Production",
    body: `URGENT - Production Issue

Hi Team,

We've identified a critical bug in production that's affecting user authentication.

Issue Summary:
- Users intermittently getting logged out
- Session tokens expiring prematurely
- Affects approximately 15% of active users

Impact: HIGH
Priority: P0

I need someone to:
1. Check the authentication service logs immediately
2. Review recent deployments (last 48 hours)
3. Join the incident channel #prod-incident-1128
4. Prepare a root cause analysis by EOD

Currently monitoring. Will provide updates every 30 minutes.

David Kim
Engineering Lead`,
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    category: null,
    actionItems: null,
  },
  {
    id: 10,
    sender: "LinkedIn",
    senderEmail: "notifications@linkedin.com",
    subject: "You have 5 new connection requests",
    body: `LinkedIn Updates

You have pending connection requests:

• John Smith - Senior Developer at TechCorp
• Maria Garcia - Product Manager at InnovateCo
• Chris Johnson - Startup Founder
• Lisa Wang - VP Engineering at ScaleUp
• Robert Brown - Tech Recruiter

━━━━━━━━━━━━━━━━━━━━━━

Other updates:
• 12 people viewed your profile this week
• Your post received 45 reactions
• 3 new job recommendations for you

View all updates on LinkedIn

━━━━━━━━━━━━━━━━━━━━━━
Unsubscribe from these emails`,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: null,
    actionItems: null,
  },
  {
    id: 11,
    sender: "Jennifer Walsh",
    senderEmail: "jennifer.walsh@client.org",
    subject: "Meeting Notes & Action Items from Today",
    body: `Hi everyone,

Thank you for joining today's project kickoff meeting. Here are the key takeaways:

Meeting Notes:
- Project timeline confirmed: Jan 15 - April 30
- Budget approved: $150,000
- Team assignments finalized

Action Items:
1. @You: Create project plan draft by Monday Dec 4
2. @You: Set up project tracking in Jira by Dec 6
3. @Marketing: Prepare brand assets by Dec 8
4. @Engineering: Complete technical requirements by Dec 10

Next Steps:
- Weekly sync every Tuesday at 10 AM
- First milestone review: January 15

Please confirm you've received this and let me know if I missed anything.

Thanks,
Jennifer`,
    date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: null,
    actionItems: null,
  },
  {
    id: 12,
    sender: "System Administrator",
    senderEmail: "sysadmin@company.com",
    subject: "Scheduled Maintenance: Dec 2, 2-4 AM EST",
    body: `IT Notification

Scheduled System Maintenance

When: Saturday, December 2, 2024
Time: 2:00 AM - 4:00 AM EST
Duration: ~2 hours

Affected Services:
• Internal email (brief interruption)
• VPN access
• Cloud file storage
• Development servers

What to expect:
- Services may be unavailable during this window
- All work should be saved before 2:00 AM
- No action required from users

This maintenance is required to apply security patches and performance improvements.

If you have concerns, contact IT Support.

Thank you for your patience.
IT Operations Team`,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: null,
    actionItems: null,
  },
  {
    id: 13,
    sender: "Get Rich Quick!!!",
    senderEmail: "money@fake-investments.net",
    subject: "Make $50,000/week from home! Secret method revealed!",
    body: `ATTENTION: This message contains LIFE-CHANGING information!

I was BROKE just 6 months ago... now I make $50,000 EVERY WEEK!

And I want to share my SECRET with YOU!

No experience needed!
No investment required!
Work only 2 hours per day!

This PROVEN SYSTEM has helped thousands of people achieve FINANCIAL FREEDOM!

Just click the link below to get started:
>> www.fake-money-scheme.net/start <<

Don't wait! Only 10 spots left!

To your success,
"Rich" Bob

P.S. - My Lamborghini is waiting for you too! 🚗💰`,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: null,
    actionItems: null,
  },
  {
    id: 14,
    sender: "Product Team",
    senderEmail: "product@company.com",
    subject: "New Feature Request: Customer Feedback Summary",
    body: `Hi Team,

Based on our Q3 user research, we're proposing a new feature for the dashboard.

Feature: Customer Feedback Summary
Priority: Medium
Target: Q1 2024

User Problem:
Customers want a quick overview of their feedback history without navigating through multiple pages.

Proposed Solution:
- Add feedback summary widget to main dashboard
- Show last 5 feedback items with sentiment indicators
- Quick-reply functionality

We need your input:
1. Review the attached wireframes
2. Provide technical feasibility assessment by Dec 8
3. Estimate development effort

Let's discuss in our next product sync.

Thanks,
Product Team`,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: null,
    actionItems: null,
  },
  {
    id: 15,
    sender: "Rachel Green",
    senderEmail: "rachel.green@partner.com",
    subject: "Thank You - Great Presentation Yesterday!",
    body: `Hi,

Just wanted to drop you a quick note to say thank you for the excellent presentation yesterday. 

Your insights on market trends were particularly valuable, and my team was impressed with the depth of your analysis.

I've shared your slides with our leadership team, and they're excited about the potential collaboration opportunities.

Let's schedule a follow-up call next week to discuss next steps. How does Thursday at 3 PM work for you?

Looking forward to continuing our conversation!

Warm regards,
Rachel Green
Director of Partnerships`,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: null,
    actionItems: null,
  },
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emails: Map<number, Email>;
  private prompts: Map<string, Prompt>;
  private drafts: Map<number, Draft>;
  private chatMessages: Map<number, ChatMessage[]>;
  private nextEmailId: number;
  private nextDraftId: number;
  private nextChatMessageId: number;
  private defaultPromptContents: Map<string, string>;

  constructor() {
    this.users = new Map();
    this.emails = new Map();
    this.prompts = new Map();
    this.drafts = new Map();
    this.chatMessages = new Map();
    this.nextEmailId = 100;
    this.nextDraftId = 1;
    this.nextChatMessageId = 1;
    this.defaultPromptContents = new Map();

    mockEmails.forEach(email => {
      this.emails.set(email.id, email);
    });

    defaultPrompts.forEach(prompt => {
      this.prompts.set(prompt.id, prompt);
      this.defaultPromptContents.set(prompt.id, prompt.content);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllEmails(): Promise<Email[]> {
    return Array.from(this.emails.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getEmail(id: number): Promise<Email | undefined> {
    return this.emails.get(id);
  }

  async createEmail(email: InsertEmail): Promise<Email> {
    const id = this.nextEmailId++;
    const newEmail: Email = { ...email, id };
    this.emails.set(id, newEmail);
    return newEmail;
  }

  async updateEmail(id: number, data: Partial<Email>): Promise<Email | undefined> {
    const email = this.emails.get(id);
    if (!email) return undefined;
    
    const updated = { ...email, ...data };
    this.emails.set(id, updated);
    return updated;
  }

  async deleteEmail(id: number): Promise<boolean> {
    return this.emails.delete(id);
  }

  async getAllPrompts(): Promise<Prompt[]> {
    return Array.from(this.prompts.values());
  }

  async getPrompt(id: string): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async getPromptByType(type: string): Promise<Prompt | undefined> {
    return Array.from(this.prompts.values()).find(p => p.type === type);
  }

  async updatePrompt(id: string, content: string): Promise<Prompt | undefined> {
    const prompt = this.prompts.get(id);
    if (!prompt) return undefined;
    
    const updated = { ...prompt, content };
    this.prompts.set(id, updated);
    return updated;
  }

  async resetPrompt(id: string): Promise<Prompt | undefined> {
    const prompt = this.prompts.get(id);
    if (!prompt) return undefined;
    
    const defaultContent = this.defaultPromptContents.get(id);
    if (!defaultContent) return undefined;
    
    const updated = { ...prompt, content: defaultContent };
    this.prompts.set(id, updated);
    return updated;
  }

  async getAllDrafts(): Promise<Draft[]> {
    return Array.from(this.drafts.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getDraft(id: number): Promise<Draft | undefined> {
    return this.drafts.get(id);
  }

  async createDraft(draft: InsertDraft): Promise<Draft> {
    const id = this.nextDraftId++;
    const now = new Date().toISOString();
    const newDraft: Draft = { ...draft, id, createdAt: now, updatedAt: now };
    this.drafts.set(id, newDraft);
    return newDraft;
  }

  async updateDraft(id: number, data: Partial<Draft>): Promise<Draft | undefined> {
    const draft = this.drafts.get(id);
    if (!draft) return undefined;
    
    const updated = { ...draft, ...data, updatedAt: new Date().toISOString() };
    this.drafts.set(id, updated);
    return updated;
  }

  async deleteDraft(id: number): Promise<boolean> {
    return this.drafts.delete(id);
  }

  async getChatMessages(emailId: number): Promise<ChatMessage[]> {
    return this.chatMessages.get(emailId) || [];
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.nextChatMessageId++;
    const newMessage: ChatMessage = { ...message, id, timestamp: new Date().toISOString() };
    
    const emailId = message.emailId || 0;
    const messages = this.chatMessages.get(emailId) || [];
    messages.push(newMessage);
    this.chatMessages.set(emailId, messages);
    
    return newMessage;
  }

  async clearChatMessages(emailId: number): Promise<void> {
    this.chatMessages.delete(emailId);
  }
}

export const storage = new MemStorage();
