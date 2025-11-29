/**
 * Type Definitions for Email Productivity Agent
 */

// Email Categories
export type EmailCategory = 
  | 'Important' 
  | 'Newsletter' 
  | 'Spam' 
  | 'To-Do' 
  | 'Uncategorized' 
  | null;

// Action Item extracted from email
export interface ActionItem {
  task: string;
  deadline: string | null;
}

// Email structure
export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  category: EmailCategory;
  actionItems: ActionItem[] | null;
  threadId: string;
}

// Draft structure
export interface Draft {
  id: string;
  emailId: string;
  to: string;
  toName: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

// Chat message structure
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// System Prompts structure
export interface SystemPrompts {
  categorization: string;
  actionExtraction: string;
  autoReply: string;
}

// API Request types
export interface GeminiRequest {
  prompt: string;
  emailContent: string;
  context?: string;
  type: 'categorize' | 'extract' | 'reply' | 'chat';
}

export interface GeminiResponse {
  success: boolean;
  data?: string;
  error?: string;
}

// Context state
export interface AppState {
  emails: Email[];
  drafts: Draft[];
  prompts: SystemPrompts;
  chatHistory: Record<string, ChatMessage[]>;
  isProcessing: boolean;
  selectedEmailId: string | null;
}

// Context actions
export type AppAction =
  | { type: 'SET_EMAILS'; payload: Email[] }
  | { type: 'UPDATE_EMAIL'; payload: Email }
  | { type: 'ADD_DRAFT'; payload: Draft }
  | { type: 'UPDATE_DRAFT'; payload: Draft }
  | { type: 'DELETE_DRAFT'; payload: string }
  | { type: 'SET_PROMPTS'; payload: SystemPrompts }
  | { type: 'ADD_CHAT_MESSAGE'; payload: { emailId: string; message: ChatMessage } }
  | { type: 'CLEAR_CHAT_HISTORY'; payload: string }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_SELECTED_EMAIL'; payload: string | null }
  | { type: 'RESET_APP' };
