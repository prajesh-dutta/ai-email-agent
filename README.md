# 📧 AI Email Productivity Agent

A modern, AI-powered email management application built with **Next.js 14** and **Google Gemini AI**. This intelligent email agent automatically categorizes emails, extracts key information, generates smart replies, and provides an interactive chat interface for email-related queries.

🔗 **Live Demo:** [https://ai-email-agent-xvtm-j8t5yvvbu-prajesh-duttas-projects.vercel.app/](https://ai-email-agent-xvtm-j8t5yvvbu-prajesh-duttas-projects.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Gemini AI](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)

## ✨ Features

### 🤖 AI-Powered Email Processing
- **Smart Categorization** - Automatically classifies emails into Primary, Promotions, Social, Updates, or Spam
- **Key Information Extraction** - Extracts dates, action items, contacts, and important details
- **AI Reply Generation** - Creates contextual, professional email replies
- **Interactive Chat** - Ask questions about your emails and get intelligent responses

### 🎨 Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode** - Toggle between themes with smooth transitions
- **Glass Morphism Effects** - Beautiful frosted glass UI elements
- **Smooth Animations** - Polished micro-interactions and transitions
- **Split-View Layout** - Email list and detail panel side-by-side

### 📱 Key Components
- **Inbox View** - Browse, sort, and filter emails with multiple sorting options
- **Email Detail Panel** - Read emails with AI agent integration
- **Drafts Page** - Manage AI-generated draft replies
- **Collapsible Sidebar** - Space-efficient navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prajesh-dutta/ai-email-agent.git
   cd ai-email-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── gemini/
│   │       └── route.ts      # Gemini AI API endpoint
│   ├── drafts/
│   │   └── page.tsx          # Drafts management page
│   ├── globals.css           # Global styles with animations
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Main inbox page
├── components/
│   ├── ChatWindow.tsx        # AI chat interface
│   ├── DraftCard.tsx         # Draft email card component
│   ├── EmailCard.tsx         # Email list item component
│   ├── EmailDetail.tsx       # Email detail view with AI panel
│   ├── MarkdownRenderer.tsx  # Markdown rendering for AI responses
│   └── ResponsiveSidebar.tsx # Responsive navigation sidebar
├── lib/
│   ├── context.tsx           # React Context for state management
│   ├── mockData.ts           # Sample email data
│   ├── prompts.ts            # AI prompt templates
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS styling |
| **Gemini 2.5 Flash** | Google's AI model for email processing |
| **Lucide React** | Beautiful icon library |
| **React Context** | State management |

## 🎯 AI Capabilities

### Email Categorization
The AI analyzes email content and categorizes into:
- 📥 **Primary** - Important personal/work emails
- 🏷️ **Promotions** - Marketing and promotional content
- 👥 **Social** - Social network notifications
- 🔔 **Updates** - Automated updates and notifications
- 🚫 **Spam** - Unwanted or suspicious emails

### Information Extraction
Automatically extracts:
- 📅 Important dates and deadlines
- ✅ Action items and tasks
- 👤 Contact information
- 🔗 Key links and references

### Smart Replies
Generates professional replies considering:
- Email context and tone
- Sender relationship
- Required actions
- Professional etiquette

## ⚙️ Configuration

### Rate Limiting
The app includes built-in rate limiting for the Gemini API free tier (10 requests/minute). When processing multiple emails, there's a 6.5-second delay between API calls to prevent quota errors.

### Vercel Deployment
The project includes `vercel.json` with optimized settings:
- Extended function timeout (60s) for AI processing
- Increased memory allocation (1024MB)

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variable:
   - `GEMINI_API_KEY`: Your Google Gemini API key
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/prajesh-dutta/ai-email-agent)

## 📸 Screenshots

### Inbox View (Desktop)
- Split-view layout with email list and detail panel
- Category tabs for filtering emails
- Sort options (Date, Sender, Subject)

### Mobile View
- Responsive drawer navigation
- Touch-friendly interface
- Optimized for small screens

### AI Chat Interface
- Context-aware conversations
- Markdown-rendered responses
- Email-specific queries

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the powerful AI capabilities
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Lucide](https://lucide.dev/) for the beautiful icons

---

<p align="center">
  Made with ❤️ for the AI-powered future of email management
</p>
