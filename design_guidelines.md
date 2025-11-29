# Design Guidelines: Email Productivity Agent

## Design Approach

**Selected Approach:** Design System + Reference Hybrid

**Primary References:**
- Gmail/Outlook for email interface patterns
- Linear for modern productivity aesthetics
- Notion for clean information hierarchy
- Slack for chat interface patterns

**Key Principles:**
- Information density over decoration
- Scan-ability and quick recognition
- Clear functional hierarchy
- Professional, focused aesthetic

---

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for email addresses, timestamps, JSON outputs)

**Type Scale:**
- Hero/Page Titles: text-3xl font-bold (30px)
- Section Headers: text-xl font-semibold (20px)
- Tab Labels: text-base font-medium (16px)
- Email Subjects: text-base font-medium (16px)
- Email Body/Content: text-sm (14px)
- Metadata (timestamps, senders): text-xs (12px)
- Action Buttons: text-sm font-medium (14px)

**Line Heights:**
- Headers: leading-tight
- Body text: leading-relaxed
- Code/JSON: leading-normal

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Micro spacing (gaps, padding within cards): p-2, gap-2
- Standard spacing (between elements): p-4, gap-4, mb-4
- Section spacing: p-6, mb-6
- Major sections: p-8, gap-8

**Container Structure:**
- Maximum width: max-w-7xl for main application container
- Sidebar width: w-64 (256px) for "Agent Brain" configuration panel
- Main content area: Flexible, fills remaining space
- Email viewer panel: max-w-3xl for optimal reading width

**Grid Layouts:**
- Inbox list: Single column with full-width rows
- Draft cards: grid-cols-1 md:grid-cols-2 for draft previews
- Action items: Single column list format
- No multi-column text reading areas

---

## Component Library

### A. Application Shell

**Top Navigation Bar:**
- Height: h-16
- Contains: App logo/title (left), user menu/settings (right)
- Sticky positioning for persistent access
- Border bottom for definition

**Sidebar ("Agent Brain" Panel):**
- Fixed left sidebar, w-64
- Collapsible on mobile (hamburger menu)
- Contains: Prompt configuration forms
- Sections separated by borders

**Main Content Area:**
- Tabbed interface with 4 primary tabs: Inbox, Email Agent, Prompts, Drafts
- Tab bar: border-b, active tab indicator with bottom border
- Content padding: p-6

### B. Email Components

**Email List Item:**
- Full-width row with hover state
- Left section: Sender avatar (w-10 h-10 circle), sender name, timestamp
- Middle section: Subject line (truncate with ellipsis), preview snippet
- Right section: Category badge, unread indicator
- Height: min-h-20
- Spacing: p-4, gap-4

**Email Viewer (Full Detail):**
- Header section: Sender info, subject (text-xl), full timestamp
- Separator line
- Body: max-w-3xl, prose-like formatting, p-6
- Action bar: Buttons for Extract Actions, Generate Reply, etc.
- Spacing between sections: gap-6

**Category Badges:**
- Pill-shaped, rounded-full
- Padding: px-3 py-1
- Font: text-xs font-medium
- Icons from Heroicons (envelope, flag, trash, clipboard-list)

### C. Prompt Configuration

**Prompt Editor Card:**
- Border, rounded-lg
- Header: Prompt name (text-lg font-semibold), edit/save icons
- Textarea: Full-width, min-h-32, monospace font for prompt text
- Helper text below: text-xs explaining prompt purpose
- Spacing: p-6, gap-4

**Prompt List:**
- Vertical stack of cards
- Expandable/collapsible sections
- Gap between cards: gap-4

### D. Chat Interface (Email Agent)

**Layout:**
- Two-column split: Email preview (left, 40%), Chat panel (right, 60%)
- Chat panel: Fixed height, scrollable messages

**Message Bubbles:**
- User messages: Right-aligned, max-w-md
- AI responses: Left-aligned, max-w-md
- Padding: p-4, rounded-2xl
- Gap between messages: gap-2
- Timestamp: text-xs below each message

**Input Area:**
- Fixed bottom position within chat panel
- Textarea with auto-resize
- Send button: Icon button (Heroicons paper-airplane)
- Border top for separation

**Quick Action Buttons:**
- Row of chips above input: "Summarize", "Extract Tasks", "Draft Reply"
- Small size: px-4 py-2, text-sm

### E. Draft Management

**Draft Card:**
- Border, rounded-lg
- Header: Subject line (truncate), timestamp, status label
- Body preview: Truncated to 3 lines
- Footer: Action buttons (Edit, Delete, View Full)
- Padding: p-6, gap-4

**Draft Editor Modal/Panel:**
- Full-screen overlay or slide-in panel
- Fields: To, Subject, Body (rich textarea)
- Toolbar: Save Draft, Discard
- No "Send" button anywhere

### F. Form Elements

**Text Inputs/Textareas:**
- Border, rounded-lg
- Padding: p-3
- Focus state: ring-2 offset pattern
- Labels: text-sm font-medium, mb-2

**Buttons:**
- Primary: Solid background, rounded-lg, px-6 py-3, font-medium
- Secondary: Border, transparent background, same size
- Icon buttons: Square, p-2, rounded-lg
- Button groups: gap-2, flex layout

**Dropdowns/Selects:**
- Email selector: Full-width, border, rounded-lg, p-3
- Options: Truncated email subject with sender name
- Icon: Chevron down (Heroicons)

### G. Status & Feedback

**Loading States:**
- Spinner: Heroicons arrow-path with animate-spin
- Skeleton loaders: animate-pulse for email list during processing

**Empty States:**
- Centered content: Icon (large, Heroicons), heading, description
- Call-to-action button if applicable
- Padding: p-12

**Error Messages:**
- Border-l-4 alert pattern
- Icon: exclamation-triangle
- Padding: p-4, gap-3

**Success Messages:**
- Border-l-4 alert pattern
- Icon: check-circle
- Auto-dismiss or manual close

### H. Data Display

**JSON Output Viewer:**
- Monospace font (JetBrains Mono)
- Border, rounded-lg
- Syntax highlighted appearance using different text weights
- Copy button (top-right corner)
- Padding: p-4

**Action Items List:**
- Checkbox items (non-interactive, visual only)
- Task name, deadline, source email
- Border between items
- Padding: p-4

---

## Icons

**Library:** Heroicons (via CDN)
**Common Icons:**
- envelope: Email/inbox
- chat-bubble-left-right: Chat/conversation
- pencil-square: Edit/draft
- adjustments-horizontal: Settings/prompts
- sparkles: AI/processing
- clipboard-document-list: Action items
- trash: Delete
- check-circle: Success
- exclamation-triangle: Warning/error

---

## Accessibility

**Focus Management:**
- Visible focus rings on all interactive elements (ring-2)
- Skip to content link for keyboard navigation
- Logical tab order through forms and lists

**ARIA Labels:**
- All icon-only buttons have aria-label
- Email list items have proper semantic structure
- Chat messages marked with appropriate roles

**Keyboard Shortcuts:**
- Display hint text for common actions (e.g., "Press Enter to send")
- Escape to close modals/panels

---

## Responsive Behavior

**Mobile (< 768px):**
- Sidebar collapses to hamburger menu
- Email detail opens as full-screen overlay
- Chat interface stacks vertically
- Single-column layouts throughout

**Tablet (768px - 1024px):**
- Sidebar toggleable
- Email/chat split maintains
- Reduced padding: p-4 instead of p-6

**Desktop (> 1024px):**
- Full sidebar visible
- Optimal spacing and layout as specified
- Multi-column drafts grid

---

## Images

**No hero images for this application.** This is a utility-focused productivity tool where screen space is premium. All visual space should be dedicated to functional elements.

**Avatar Placeholders:**
- Use Heroicons user-circle for sender avatars
- Size: w-10 h-10 (or w-8 h-8 for compact views)