/**
 * Mock Email Data - 25 High-Quality Diverse Emails
 * Categories: Meeting Request, Urgent Task, Newsletter, Spam/Phishing, Project Update
 * Using realistic Indian names and professional context
 */

import { Email } from './types';

// Helper to generate dates relative to now
const getRelativeDate = (hoursAgo: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

export const mockEmails: Email[] = [
  // ========== MEETING REQUESTS ==========
  {
    id: 'email-001',
    sender: 'Rajesh Kumar',
    senderEmail: 'rajesh.kumar@infosys.com',
    subject: 'Q4 Planning Meeting - Your Input Needed',
    body: `Hi Team,

I'd like to schedule a Q4 planning meeting for next Tuesday at 2:00 PM IST. We need to discuss:

1. Budget allocation for new projects
2. Team restructuring proposals
3. Year-end performance reviews

Please confirm your availability and come prepared with your department updates. We'll be using the Bengaluru conference room or Teams for remote participants.

Best regards,
Rajesh Kumar
Senior Engineering Manager
Infosys Limited`,
    date: getRelativeDate(2),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-001',
  },
  {
    id: 'email-002',
    sender: 'Priya Sharma',
    senderEmail: 'priya.sharma@wipro.com',
    subject: 'RE: Project Proposal - Follow Up Call',
    body: `Hi,

Thank you for sending over the project proposal. After reviewing it with my team in Hyderabad, we have a few questions:

1. Can you provide a more detailed timeline for Phase 2?
2. What's the contingency plan if we exceed the budget by 10%?
3. Who will be the primary point of contact during implementation?

Could we schedule a call this Friday at 3 PM IST to discuss these points? I'll send a Teams invite.

Looking forward to your response.

Best,
Priya Sharma
Director of Operations
Wipro Technologies`,
    date: getRelativeDate(4),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-002',
  },
  {
    id: 'email-003',
    sender: 'TCS HR Department',
    senderEmail: 'hr.communications@tcs.com',
    subject: 'RSVP Required: Annual Town Hall Meeting',
    body: `Dear Employees,

You are cordially invited to our Annual Town Hall Meeting:

Date: Next Friday, 10:00 AM - 12:00 PM IST
Location: TCS Campus Auditorium, Chennai (Virtual option available via WebEx)

Agenda:
- CEO's address on company performance and vision for 2025
- Recognition of outstanding employees and TCS Gems awards
- Q&A session with leadership team
- Networking lunch with regional leaders

Please RSVP by Wednesday to help us plan arrangements. Virtual attendees will receive a gift hamper.

Best regards,
Human Resources Team
Tata Consultancy Services`,
    date: getRelativeDate(18),
    read: true,
    category: 'Important',
    actionItems: [{ task: 'RSVP by Wednesday', deadline: 'Wednesday' }, { task: 'Mark calendar for Friday 10 AM', deadline: 'Friday' }],
    threadId: 'thread-003',
  },
  {
    id: 'email-004',
    sender: 'Zoho Calendar',
    senderEmail: 'calendar@zoho.com',
    subject: 'Weekly Standup Rescheduled to Thursday 10 AM',
    body: `Meeting Update

The weekly standup meeting has been rescheduled.

Original: Wednesday 9:30 AM IST
New Time: Thursday 10:00 AM IST

Reason: Conference room conflict at Mumbai office

Location: Virtual - Zoho Meeting link in calendar invite

Required attendees:
- Engineering Team
- Product Management
- QA Team

Please update your calendars accordingly. If you have a conflict with the new time, contact the meeting organizer.

This is an automated notification from Zoho Calendar.`,
    date: getRelativeDate(6),
    read: true,
    category: null,
    actionItems: null,
    threadId: 'thread-004',
  },
  {
    id: 'email-005',
    sender: 'Meera Iyer',
    senderEmail: 'meera.iyer@mindtree.com',
    subject: 'Partnership Kickoff Meeting - December 5th',
    body: `Hi,

Exciting news! We're ready to kick off our partnership initiative.

I'd like to propose a kickoff meeting on December 5th at 11:00 AM IST. This will be a 2-hour session covering:

1. Partnership objectives and KPIs
2. Team introductions from both sides
3. Communication protocols
4. First 90-day roadmap
5. Q&A session

Please confirm your attendance and let me know if any key stakeholders from your side should be included.

I'll send the calendar invite once we have confirmation.

Looking forward to working together!

Meera Iyer
Partnership Manager
Mindtree Limited`,
    date: getRelativeDate(8),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-005',
  },

  // ========== URGENT TASKS ==========
  {
    id: 'email-006',
    sender: 'Arjun Nair',
    senderEmail: 'arjun.nair@flipkart.com',
    subject: 'URGENT: API Bug in Production - Need Review',
    body: `Hi,

We've discovered a critical bug in the payment API that's causing intermittent failures on the Flipkart platform.

I need you to:
1. Review the error logs in AWS CloudWatch by EOD today
2. Check the database connection pooling settings
3. Submit a hotfix PR by tomorrow morning (9 AM IST)

The issue is affecting approximately 5% of transactions. I've attached the stack trace for reference.

Please prioritize this above other tasks. The Diwali sale is coming up and we can't afford downtime.

Thanks,
Arjun Nair
Senior Software Engineer
Flipkart`,
    date: getRelativeDate(1),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-006',
  },
  {
    id: 'email-007',
    sender: 'Infosys HR',
    senderEmail: 'hr.compliance@infosys.com',
    subject: 'Action Required: Complete Annual Compliance Training by Dec 15',
    body: `Dear Employee,

This is a reminder that you need to complete your annual compliance training by December 15th, 2024.

Required courses:
1. Information Security Awareness (2 hours)
2. Workplace Ethics and POSH Training (1 hour)
3. Data Privacy & GDPR Compliance (1.5 hours)

Please log into the Infosys Learning Portal and complete all modules. Failure to complete by the deadline may result in access restrictions.

If you have any questions, contact HR at hr.compliance@infosys.com.

Thank you for your cooperation.

HR Compliance Team
Infosys Limited`,
    date: getRelativeDate(24),
    read: true,
    category: null,
    actionItems: null,
    threadId: 'thread-007',
  },
  {
    id: 'email-008',
    sender: 'Kavitha Sundaram',
    senderEmail: 'kavitha.cfo@razorpay.com',
    subject: 'Budget Approval Needed - Marketing Campaign by Thursday',
    body: `Hi,

I need your approval for the Q1 marketing campaign budget. The total requested amount is ₹35,00,000, broken down as follows:

- Social media advertising: ₹15,00,000
- Content creation: ₹8,00,000
- Influencer partnerships: ₹8,00,000
- Analytics tools: ₹4,00,000

Please review and either approve or provide feedback by this Thursday (November 28th) so we can finalize the annual budget.

Required action: Reply with APPROVED or schedule a meeting to discuss concerns.

Thanks,
Kavitha Sundaram
Chief Financial Officer
Razorpay`,
    date: getRelativeDate(7),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-008',
  },
  {
    id: 'email-009',
    sender: 'Aditya Verma',
    senderEmail: 'aditya.lead@zomato.com',
    subject: 'Sprint Retrospective Notes & Action Items',
    body: `Hi Team,

Here are the action items from our sprint retrospective:

FOR YOU SPECIFICALLY:
- Update the CI/CD pipeline documentation by Friday
- Mentor the new intern Rahul on our testing framework (ongoing)
- Create Jira tickets for the technical debt items we discussed

TEAM ACTION ITEMS:
- Everyone: Update your time tracking in Zoho by EOW
- Dev team: Review and approve pending PRs before Wednesday

Let me know if you have any questions about these items.

Thanks,
Aditya Verma
Tech Lead
Zomato`,
    date: getRelativeDate(3),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-009',
  },
  {
    id: 'email-010',
    sender: 'IT Security - Paytm',
    senderEmail: 'security@paytm.com',
    subject: 'CRITICAL: Password Reset Required Within 48 Hours',
    body: `Security Notice

Our security audit has identified that your password has not been changed in over 90 days, which violates our security policy.

ACTION REQUIRED:
Please reset your password within the next 48 hours using the Paytm SSO portal.

Password Requirements:
- Minimum 12 characters
- At least one uppercase letter
- At least one number
- At least one special character
- Cannot be any of your last 10 passwords

Failure to comply will result in temporary account suspension until password is reset.

If you need assistance, contact the IT Help Desk at helpdesk@paytm.com.

IT Security Team
Paytm`,
    date: getRelativeDate(12),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-010',
  },

  // ========== NEWSLETTERS ==========
  {
    id: 'email-011',
    sender: 'YourStory Tech',
    senderEmail: 'newsletter@yourstory.com',
    subject: 'This Week in Indian Tech: Startup Funding & AI Updates',
    body: `YOURSTORY TECH WEEKLY
=====================

Top Stories This Week:

1. ZEPTO RAISES $200M IN SERIES E
Quick commerce unicorn expands to 10 new cities...

2. INDIA'S AI AMBITIONS
Government announces ₹10,000 crore AI Mission for 2025...

3. INFOSYS Q3 RESULTS
Revenue beats estimates, announces 50% special dividend...

Read more at yourstory.com

Unsubscribe | Update Preferences`,
    date: getRelativeDate(5),
    read: true,
    category: null,
    actionItems: null,
    threadId: 'thread-011',
  },
  {
    id: 'email-012',
    sender: 'LinkedIn India',
    senderEmail: 'no-reply@linkedin.com',
    subject: 'You have 5 new connection requests',
    body: `LinkedIn

Hi there,

You have 5 new connection requests waiting for you:

1. Nandini Gupta - Senior Developer at Google India
2. Ravi Krishnan - CTO at Razorpay
3. Sneha Reddy - Technical Recruiter at Flipkart
4. Karthik Subramaniam - Engineering Manager at Amazon India
5. Divya Menon - Product Manager at Microsoft IDC

Log in to LinkedIn to accept these connections.

Best,
The LinkedIn Team

You are receiving this email because you have a LinkedIn account.`,
    date: getRelativeDate(26),
    read: true,
    category: null,
    actionItems: null,
    threadId: 'thread-012',
  },
  {
    id: 'email-013',
    sender: 'Hashnode India',
    senderEmail: 'digest@hashnode.dev',
    subject: 'Top Posts This Week: Building Scalable Apps with Node.js',
    body: `HASHNODE INDIA WEEKLY DIGEST
=============================

Trending This Week:

1. "Building Scalable Microservices at Swiggy" by @tech_swiggy
   2.4k reactions | 156 comments

2. "My Journey from IIT to Silicon Valley and Back" by @indian_dev
   1.8k reactions | 89 comments

3. "Why Indian Startups Are Choosing Golang" by @gopherindian
   3.1k reactions | 245 comments

4. "Mastering DSA for FAANG Interviews" by @placement_guru
   1.2k reactions | 67 comments

5. "How We Built Dunzo's Real-Time Tracking" by @dunzo_tech
   2.0k reactions | 312 comments

Read more on hashnode.dev

Unsubscribe from digest emails`,
    date: getRelativeDate(48),
    read: true,
    category: null,
    actionItems: null,
    threadId: 'thread-013',
  },
  {
    id: 'email-014',
    sender: 'Inc42',
    senderEmail: 'hello@inc42.com',
    subject: 'Daily Digest: Top 5 Indian Startups to Watch',
    body: `INC42 DAILY

Top Indian Startups - November 28, 2024

1. CreditBee
   AI-powered personal finance app
   892 upvotes

2. Groww
   Investment platform for millennials
   734 upvotes

3. PhonePe
   Digital payments and financial services
   621 upvotes

4. Urban Company
   Home services marketplace
   589 upvotes

5. Meesho
   Social commerce platform
   456 upvotes

Discover more at inc42.com

Manage email preferences | Unsubscribe`,
    date: getRelativeDate(30),
    read: true,
    category: null,
    actionItems: null,
    threadId: 'thread-014',
  },
  {
    id: 'email-015',
    sender: 'Meetup Bengaluru',
    senderEmail: 'events@meetup.com',
    subject: 'Reminder: Bengaluru Python Developers Meetup Tomorrow',
    body: `Meetup Reminder

Bengaluru Python Developers Meetup - Monthly Session
Tomorrow at 6:30 PM IST

Location: WeWork Galaxy, Residency Road
Near UB City Mall, Bengaluru

Agenda:
- 6:30 PM: Networking & Chai
- 7:00 PM: Talk - "Advanced AsyncIO Patterns" by Rohit Agarwal
- 8:00 PM: Lightning Talks
- 8:30 PM: Q&A and Wrap-up

Don't forget to bring your laptop for the hands-on session!

RSVP: Yes (You're going!)

See you there!
Bengaluru Python Community`,
    date: getRelativeDate(12),
    read: true,
    category: null,
    actionItems: null,
    threadId: 'thread-015',
  },

  // ========== SPAM / PHISHING ==========
  {
    id: 'email-016',
    sender: 'Shopping Deals',
    senderEmail: 'promo@shopping-deals.net',
    subject: 'FLASH SALE! 90% OFF - LIMITED TIME ONLY!!!',
    body: `INCREDIBLE DEALS

YOU WON'T BELIEVE THESE PRICES!!!

Designer watches - $19.99 (was $999)
Luxury handbags - $29.99 (was $1,500)
Electronics - UP TO 95% OFF

CLICK HERE NOW - OFFER EXPIRES IN 2 HOURS!

This is a limited time offer. Don't miss out!

To unsubscribe click here (but why would you?)`,
    date: getRelativeDate(8),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-016',
  },
  {
    id: 'email-017',
    sender: 'Bank Security',
    senderEmail: 'security@bankofamerica-secure.xyz',
    subject: 'URGENT: Your Account Has Been Compromised!',
    body: `SECURITY ALERT
==============

Dear Valued Customer,

We have detected suspicious activity on your account. Your account has been temporarily LIMITED.

To restore full access, you must verify your identity immediately:

CLICK HERE TO VERIFY >>> [Suspicious Link]

You will need to provide:
- Full name
- Social Security Number
- Account password
- Mother's maiden name

Failure to verify within 24 hours will result in permanent account closure.

Bank of America Security Team`,
    date: getRelativeDate(6),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-017',
  },
  {
    id: 'email-018',
    sender: 'Lottery Winner Notification',
    senderEmail: 'winner@lottery-international.scam',
    subject: 'CONGRATULATIONS! You have Won $5,000,000!!!',
    body: `DEAR LUCKY WINNER,

CONGRATULATIONS!!! YOU HAVE BEEN SELECTED AS THE WINNER OF OUR INTERNATIONAL LOTTERY PROGRAM!!!

YOUR WINNING TICKET NUMBER: 7749-2234-8891

PRIZE AMOUNT: $5,000,000.00 USD

To claim your prize, you must:
1. Send your full name and address
2. Pay the processing fee of $500 via wire transfer
3. Provide your bank account details for direct deposit

Contact our claims agent immediately:
Mr. James Williams
Email: claims@totally-legit-lottery.net

ACT NOW! This offer expires in 48 hours!

INTERNATIONAL LOTTERY COMMISSION`,
    date: getRelativeDate(52),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-018',
  },
  {
    id: 'email-019',
    sender: 'Nigerian Prince',
    senderEmail: 'prince.abdul@royalty-ng.info',
    subject: 'Confidential Business Proposal - $15.5 Million USD',
    body: `Dear Trusted Friend,

I am Prince Abdul Mohammed, son of the late King of a small African nation. I am contacting you regarding a confidential matter of the utmost importance.

My father left behind $15,500,000 USD which I need to transfer out of the country urgently. I am seeking a trustworthy foreign partner to assist with this transfer.

In exchange for your assistance, I am prepared to offer you 30% of the total sum.

To proceed, please provide:
- Your full legal name
- Bank account details
- Copy of your passport

Reply immediately for further instructions.

Your trusted friend,
Prince Abdul Mohammed`,
    date: getRelativeDate(72),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-019',
  },
  {
    id: 'email-020',
    sender: 'Amazon Support',
    senderEmail: 'support@amaz0n-orders.com',
    subject: 'Your Order #A7723 Has Been Cancelled - Action Required',
    body: `Amazon Customer Service

Dear Customer,

Your recent order #A7723 has been cancelled due to payment verification issues.

Order Details:
- iPhone 15 Pro Max (256GB)
- Total: $1,199.99

To reinstate your order, please verify your payment information immediately by clicking the link below:

[VERIFY PAYMENT NOW]

If you did not place this order, your account may have been compromised. Click here to secure your account.

Note: This verification must be completed within 24 hours or your account will be permanently suspended.

Amazon Customer Service Team`,
    date: getRelativeDate(14),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-020',
  },

  // ========== PROJECT UPDATES ==========
  {
    id: 'email-021',
    sender: 'GitHub',
    senderEmail: 'noreply@github.com',
    subject: '[swiggy-delivery] Pull Request #142: Fix order tracking bug',
    body: `GitHub

@sanjay-kumar opened a pull request in swiggy/delivery-service:

#142 Fix order tracking bug

This PR fixes the GPS location sync issue that was causing delayed updates.

Changes:
- Updated location refresh logic
- Added retry mechanism for failed GPS pings
- Updated unit tests

Reviewers requested: @you, @senior-dev

Please review this pull request.

View on GitHub: https://github.com/swiggy/delivery-service/pull/142

You are receiving this because you were requested for review.`,
    date: getRelativeDate(2.5),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-021',
  },
  {
    id: 'email-022',
    sender: 'Pooja Mehta',
    senderEmail: 'pooja.pm@ola.com',
    subject: 'Feature Spec Review - Driver Dashboard v2',
    body: `Hi team,

I've attached the feature specification for the Driver Dashboard v2 redesign. I need your feedback before we move into development.

Key items to review:
1. User flow diagrams (pages 3-7)
2. Technical requirements (pages 8-12)
3. Timeline estimates (page 13)

Please add your comments directly to the Google Doc or reply to this email with your feedback.

Deadline for feedback: Monday, December 2nd

After collecting feedback, I'll schedule a 30-minute call to align on the final spec.

Thanks for your input!

Pooja Mehta
Product Manager
Ola Cabs`,
    date: getRelativeDate(5.25),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-022',
  },
  {
    id: 'email-023',
    sender: 'IT Support - Wipro',
    senderEmail: 'it-support@wipro.com',
    subject: 'Scheduled Maintenance: Email Server - Sunday 2AM IST',
    body: `IT NOTIFICATION

Scheduled Maintenance Notice
============================

What: Email server maintenance and security updates
When: Sunday, December 1st, 2:00 AM - 6:00 AM IST
Impact: Email services will be unavailable during this window

What you need to do:
- No action required
- Save any draft emails before Saturday midnight
- Expect delays in email delivery immediately after maintenance

This maintenance is necessary to apply critical security patches and improve system performance.

If you have urgent emails to send, please do so before Saturday 11:59 PM IST.

For questions, contact IT Support at it-support@wipro.com

Thank you for your patience.

IT Support Team
Wipro Technologies`,
    date: getRelativeDate(29),
    read: true,
    category: null,
    actionItems: null,
    threadId: 'thread-023',
  },
  {
    id: 'email-024',
    sender: 'DevOps Team - Myntra',
    senderEmail: 'devops@myntra.com',
    subject: 'Deployment Complete: v2.4.1 Now Live in Production',
    body: `Deployment Notification

Version 2.4.1 has been successfully deployed to production.

Deployment Summary:
- Start Time: 2:00 AM IST
- End Time: 2:15 AM IST
- Status: SUCCESS
- Rollback Plan: Available for 72 hours

Changes in this release:
- Performance improvements for product listing (30% faster)
- Bug fix: Cart synchronization issue resolved
- New feature: Dark mode support for mobile app
- Security patch: Updated payment authentication library

All automated tests passed. Monitoring shows healthy system status.

If you notice any issues, please report to #prod-incidents on Slack.

DevOps Team
Myntra`,
    date: getRelativeDate(36),
    read: true,
    category: null,
    actionItems: null,
    threadId: 'thread-024',
  },
  {
    id: 'email-025',
    sender: 'Bangalore PMO',
    senderEmail: 'pmo@hcl.com',
    subject: 'Q4 Project Status Report - Review Required',
    body: `Q4 PROJECT STATUS REPORT
========================

Hi Team,

Please find the Q4 project status summary below:

PROJECT ALPHA (Digital Transformation - SBI)
Status: ON TRACK
Progress: 78% complete
Next Milestone: UAT Testing (Dec 10)

PROJECT BETA (Mobile Banking Redesign - ICICI)
Status: AT RISK
Progress: 45% complete
Blocker: Awaiting design approval from client

PROJECT GAMMA (API Integration - HDFC)
Status: COMPLETED
Delivered: November 25

ACTION ITEMS:
1. Project leads: Submit updated timelines by Friday
2. Beta team: Escalate design approval to ICICI stakeholders
3. All teams: Complete resource allocation forms

Next PMO review meeting: December 5th, 3:00 PM IST

Please reach out if you have questions.

PMO Team
HCL Technologies, Bengaluru`,
    date: getRelativeDate(20),
    read: false,
    category: null,
    actionItems: null,
    threadId: 'thread-025',
  },
];

export default mockEmails;
