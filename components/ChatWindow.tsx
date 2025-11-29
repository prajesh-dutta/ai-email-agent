'use client';

/**
 * Chat Window Component - Astonishing Design
 * AI chat interface for email interactions
 * Bubble style with professional icons
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Loader2, 
  User, 
  Bot, 
  Sparkles,
  FileText,
  ListTodo,
  HelpCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Email, ChatMessage } from '@/lib/types';
import { useApp } from '@/lib/context';
import { cn, generateId } from '@/lib/utils';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatWindowProps {
  email: Email;
}

export default function ChatWindow({ email }: ChatWindowProps) {
  const { state, addChatMessage } = useApp();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatHistory = state.chatHistory[email.id] || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
    };
    addChatMessage(email.id, userMessage);
    setInput('');
    setIsLoading(true);

    try {
      // Build context from previous messages
      const context = chatHistory
        .slice(-6)
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      // Call API
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: messageText,
          emailContent: `From: ${email.sender} <${email.senderEmail}>
Subject: ${email.subject}
Date: ${email.date}

${email.body}`,
          context,
          type: 'chat',
        }),
      });

      const data = await response.json();

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.success ? data.data : `Error: ${data.error}`,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(email.id, assistantMessage);

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date().toISOString(),
      };
      addChatMessage(email.id, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Summarize', prompt: 'Summarize this email concisely.', icon: FileText },
    { label: 'Key Points', prompt: 'What are the key points in this email?', icon: ListTodo },
    { label: 'Deadlines', prompt: 'What deadlines are mentioned in this email?', icon: Clock },
    { label: 'Questions', prompt: 'What questions does this email ask?', icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-3 sm:px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-inner">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1 sm:mb-2 text-sm sm:text-base">Start a Conversation</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 max-w-xs">
              Ask questions about this email or use quick actions.
            </p>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.prompt)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-lg sm:rounded-xl transition-all text-left group"
                >
                  <action.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                  <span className="text-slate-600 group-hover:text-slate-900 truncate">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2 sm:gap-3',
                  message.role === 'user' && 'flex-row-reverse'
                )}
              >
                <div className={cn(
                  'w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm',
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200'
                )}>
                  {message.role === 'user' ? (
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                  )}
                </div>
                <div className={cn(
                  'max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-100'
                )}>
                  {message.role === 'user' ? (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  ) : (
                    <MarkdownRenderer content={message.content} className="text-xs sm:text-sm" />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                </div>
                <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-indigo-500" />
                    <span className="text-xs sm:text-sm text-slate-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Actions (shown when there are messages) */}
      {chatHistory.length > 0 && (
        <div className="px-3 sm:px-4 pb-2 flex flex-wrap gap-1 sm:gap-1.5">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => sendMessage(action.prompt)}
              disabled={isLoading}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-md sm:rounded-lg transition-all disabled:opacity-50"
            >
              <action.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Ask about this email..."
              disabled={isLoading}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none disabled:opacity-50 transition-all pr-10 sm:pr-12"
            />
            <Zap className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className={cn(
              'flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl transition-all duration-200',
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-500/25'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
