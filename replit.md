# Email Productivity Agent

## Overview

An AI-powered email productivity application that helps users manage their inbox by automatically categorizing emails, extracting action items, and generating draft replies using Google's Gemini AI. The application features a modern, clean interface built with React and shadcn/ui components, following design patterns from Gmail, Linear, and Notion for optimal user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling

**Design System:**
- Custom theme system with light/dark mode support
- Typography: Inter (primary), JetBrains Mono (monospace)
- Component library follows "new-york" shadcn style variant
- Design influenced by Gmail/Outlook (email patterns), Linear (modern aesthetics), Notion (information hierarchy), and Slack (chat interface)
- Emphasis on information density, scan-ability, and professional aesthetics

**State Management:**
- Client-side state managed through React hooks
- Server state synchronized via TanStack Query with custom query client
- Theme persistence in localStorage
- Query invalidation pattern for optimistic updates

**Key UI Patterns:**
- Tab-based navigation for main features (Inbox, Email Agent, Agent Brain, Drafts)
- Modal dialogs for detailed email views and editing
- Toast notifications for user feedback
- Skeleton loaders for async data states

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- In-memory storage implementation (no database persistence)
- RESTful API design
- Development mode uses Vite middleware for HMR

**API Structure:**
- `/api/emails` - Email CRUD operations and inbox processing
- `/api/prompts` - AI prompt configuration management
- `/api/drafts` - Draft reply management
- `/api/chat` - Conversational AI interactions

**AI Integration:**
- Google Gemini AI (gemini-2.5-flash model) via `@google/genai`
- Three core AI operations:
  1. Email categorization (Important, Newsletter, Spam, To-Do, Uncategorized)
  2. Action item extraction with structured JSON responses
  3. Draft reply generation
  4. Chat-based email analysis

**Data Models:**
- Email: sender, subject, body, date, read status, category, action items
- Prompt: configurable system prompts for AI operations (categorization, action extraction, auto-reply)
- Draft: generated email responses linked to original emails
- ChatMessage: conversation history for email-specific AI interactions
- User: basic user model (authentication not fully implemented)

**Storage Layer:**
- `IStorage` interface defines data access patterns
- In-memory implementation using Map data structures
- Mock inbox with 10 varied sample emails on initialization
- Default AI prompts with reset capability

### Build and Deployment

**Build Process:**
- Separate client and server builds via custom build script
- Client: Vite production build to `dist/public`
- Server: esbuild bundles with selective dependency bundling (allowlist for cold start optimization)
- Single output directory structure for deployment

**Development Workflow:**
- Vite dev server with HMR for client
- tsx for running TypeScript server directly
- Development-specific plugins: error overlay, cartographer, dev banner

**Production:**
- Bundled server runs from `dist/index.cjs`
- Static client assets served from Express
- Environment variables for configuration (DATABASE_URL placeholder, GEMINI_API_KEY)

## External Dependencies

### AI Services
- **Google Gemini API**: Core AI functionality via `@google/genai` package
  - Model: gemini-2.5-flash
  - Used for email categorization, action extraction, reply generation, and chat
  - API key required via `GEMINI_API_KEY` environment variable

### Database (Configured but Not Used)
- **Neon Postgres**: Database driver included (`@neondatabase/serverless`)
- **Drizzle ORM**: Schema definition and migrations configured
  - Schema file: `shared/schema.ts`
  - Migration output: `./migrations`
  - Currently using in-memory storage instead of actual database
  - Database can be provisioned later using `DATABASE_URL` environment variable

### UI Component Libraries
- **Radix UI**: Unstyled, accessible component primitives (20+ components)
- **shadcn/ui**: Pre-styled component layer on top of Radix
- **cmdk**: Command palette component
- **vaul**: Drawer component
- **lucide-react**: Icon library

### Development Tools
- **Replit Plugins**: Development banner, error modal, cartographer (dev mode only)
- **TypeScript**: Full type safety across client and server
- **Tailwind CSS**: Utility-first styling with PostCSS

### Utility Libraries
- **date-fns**: Date formatting and manipulation
- **zod**: Runtime type validation and schema definition
- **nanoid**: Unique ID generation
- **class-variance-authority**: Component variant management
- **clsx/tailwind-merge**: Conditional className utilities

### Planned/Future Integrations
- Email provider integration (Gmail API, IMAP, etc.) - currently uses mock data
- User authentication system (passport infrastructure present but unused)
- Database persistence (Drizzle schema defined, not connected)
- WebSocket support for real-time updates (ws package included)