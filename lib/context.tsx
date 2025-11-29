'use client';

/**
 * Inbox Context - Global State Management
 * Manages emails, drafts, prompts, and chat history
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, Email, Draft, SystemPrompts, ChatMessage } from './types';
import { mockEmails } from './mockData';
import { defaultPrompts } from './prompts';

// Initial state
const initialState: AppState = {
  emails: mockEmails,
  drafts: [],
  prompts: defaultPrompts,
  chatHistory: {},
  isProcessing: false,
  selectedEmailId: null,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_EMAILS':
      return { ...state, emails: action.payload };

    case 'UPDATE_EMAIL':
      return {
        ...state,
        emails: state.emails.map((email) =>
          email.id === action.payload.id ? action.payload : email
        ),
      };

    case 'ADD_DRAFT':
      return { ...state, drafts: [...state.drafts, action.payload] };

    case 'UPDATE_DRAFT':
      return {
        ...state,
        drafts: state.drafts.map((draft) =>
          draft.id === action.payload.id ? action.payload : draft
        ),
      };

    case 'DELETE_DRAFT':
      return {
        ...state,
        drafts: state.drafts.filter((draft) => draft.id !== action.payload),
      };

    case 'SET_PROMPTS':
      return { ...state, prompts: action.payload };

    case 'ADD_CHAT_MESSAGE':
      const { emailId, message } = action.payload;
      return {
        ...state,
        chatHistory: {
          ...state.chatHistory,
          [emailId]: [...(state.chatHistory[emailId] || []), message],
        },
      };

    case 'CLEAR_CHAT_HISTORY':
      const newHistory = { ...state.chatHistory };
      delete newHistory[action.payload];
      return { ...state, chatHistory: newHistory };

    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };

    case 'SET_SELECTED_EMAIL':
      return { ...state, selectedEmailId: action.payload };

    case 'RESET_APP':
      return {
        ...initialState,
        emails: mockEmails.map((email) => ({
          ...email,
          category: null,
          actionItems: null,
          read: email.read,
        })),
      };

    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  updateEmail: (email: Email) => void;
  addDraft: (draft: Draft) => void;
  updateDraft: (draft: Draft) => void;
  deleteDraft: (draftId: string) => void;
  updatePrompts: (prompts: SystemPrompts) => void;
  addChatMessage: (emailId: string, message: ChatMessage) => void;
  setProcessing: (isProcessing: boolean) => void;
  setSelectedEmail: (emailId: string | null) => void;
  resetApp: () => void;
  getEmailById: (id: string) => Email | undefined;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const updateEmail = (email: Email) => {
    dispatch({ type: 'UPDATE_EMAIL', payload: email });
  };

  const addDraft = (draft: Draft) => {
    dispatch({ type: 'ADD_DRAFT', payload: draft });
  };

  const updateDraft = (draft: Draft) => {
    dispatch({ type: 'UPDATE_DRAFT', payload: draft });
  };

  const deleteDraft = (draftId: string) => {
    dispatch({ type: 'DELETE_DRAFT', payload: draftId });
  };

  const updatePrompts = (prompts: SystemPrompts) => {
    dispatch({ type: 'SET_PROMPTS', payload: prompts });
  };

  const addChatMessage = (emailId: string, message: ChatMessage) => {
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { emailId, message } });
  };

  const setProcessing = (isProcessing: boolean) => {
    dispatch({ type: 'SET_PROCESSING', payload: isProcessing });
  };

  const setSelectedEmail = (emailId: string | null) => {
    dispatch({ type: 'SET_SELECTED_EMAIL', payload: emailId });
  };

  const resetApp = () => {
    dispatch({ type: 'RESET_APP' });
  };

  const getEmailById = (id: string) => {
    return state.emails.find((email) => email.id === id);
  };

  const value: AppContextType = {
    state,
    dispatch,
    updateEmail,
    addDraft,
    updateDraft,
    deleteDraft,
    updatePrompts,
    addChatMessage,
    setProcessing,
    setSelectedEmail,
    resetApp,
    getEmailById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { AppContext };
