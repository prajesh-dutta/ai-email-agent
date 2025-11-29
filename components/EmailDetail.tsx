'use client';

/**
 * Email Detail Component - Polished Professional Design
 * Split View with email content and AI Agent Companion
 * Professional icons only with tooltips - smooth animations
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ListTodo, 
  MessageSquarePlus, 
  Loader2,
  CheckCircle,
  Calendar,
  Clock,
  Bot,
  Star
} from 'lucide-react';
import { Email, ActionItem, Draft } from '@/lib/types';
import { useApp } from '@/lib/context';
import { cn, formatFullDate, getCategoryColor, generateId } from '@/lib/utils';
import ChatWindow from './ChatWindow';

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
  showAgentPanel?: boolean;
  onToggleAgentPanel?: () => void;
}

export default function EmailDetail({ email, onBack, showAgentPanel = true, onToggleAgentPanel }: EmailDetailProps) {
  const { state, updateEmail, addDraft } = useApp();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [showActionSuccess, setShowActionSuccess] = useState(false);
  const [showDraftSuccess, setShowDraftSuccess] = useState(false);

  // Mark as read when viewing
  React.useEffect(() => {
    if (!email.read) {
      updateEmail({ ...email, read: true });
    }
  }, [email.id]);

  const extractActions = async () => {
    setIsExtracting(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: state.prompts.actionExtraction,
          emailContent: `From: ${email.sender}\nSubject: ${email.subject}\n\n${email.body}`,
          type: 'extract',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        try {
          // Parse JSON from response (handle markdown code blocks)
          let jsonStr = data.data.trim();
          if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.split('```')[1];
            if (jsonStr.startsWith('json')) {
              jsonStr = jsonStr.substring(4);
            }
          }
          const actionItems: ActionItem[] = JSON.parse(jsonStr.trim());
          updateEmail({ ...email, actionItems });
          setShowActionSuccess(true);
          setTimeout(() => setShowActionSuccess(false), 3000);
        } catch {
          console.error('Failed to parse action items');
        }
      }
    } catch (error) {
      console.error('Error extracting actions:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  const generateDraft = async () => {
    setIsDrafting(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: state.prompts.autoReply,
          emailContent: `From: ${email.sender} <${email.senderEmail}>\nSubject: ${email.subject}\nDate: ${email.date}\n\n${email.body}`,
          type: 'reply',
        }),
      });

      const data = await response.json();
      
      if (data.success && !data.data.includes('NO_REPLY_NEEDED')) {
        const draft: Draft = {
          id: generateId(),
          emailId: email.id,
          to: email.senderEmail,
          toName: email.sender,
          subject: `Re: ${email.subject}`,
          body: data.data,
          createdAt: new Date().toISOString(),
        };
        addDraft(draft);
        setShowDraftSuccess(true);
        setTimeout(() => setShowDraftSuccess(false), 3000);
      } else if (data.data?.includes('NO_REPLY_NEEDED')) {
        // Could show a different notification here
      }
    } catch (error) {
      console.error('Error generating draft:', error);
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-fade-in">
      {/* Header */}
      <div className="p-3 sm:p-4 lg:p-5 border-b border-slate-200/80 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/30">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 sm:gap-2 text-slate-600 hover:text-indigo-600 transition-all group px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl hover:bg-indigo-50"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs sm:text-sm font-semibold">Back</span>
          </button>

          {/* Tool Buttons - With Labels on Desktop */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* AI Agent Toggle Button - Mobile Only */}
            {onToggleAgentPanel && (
              <button
                onClick={onToggleAgentPanel}
                className={cn(
                  'lg:hidden flex items-center gap-1.5 px-2.5 py-2 rounded-lg border-2 transition-all duration-300 text-xs font-medium',
                  showAgentPanel
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-purple-50 border-purple-200 text-purple-600 hover:border-purple-300'
                )}
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">Agent</span>
              </button>
            )}

            {/* Extract Actions Button */}
            <button
              onClick={extractActions}
              disabled={isExtracting}
              className={cn(
                'flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg border-2 transition-all duration-300 text-xs font-medium',
                isExtracting
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:shadow-md'
              )}
            >
              {isExtracting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ListTodo className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Extract</span>
            </button>

            {/* Draft Reply Button */}
            <button
              onClick={generateDraft}
              disabled={isDrafting}
              className={cn(
                'flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg border-2 transition-all duration-300 text-xs font-medium',
                isDrafting
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 text-indigo-700 hover:border-indigo-400 hover:shadow-md'
              )}
            >
              {isDrafting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MessageSquarePlus className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Draft</span>
            </button>
          </div>
        </div>

        {/* Email Metadata */}
        <div className="mt-3 sm:mt-4 lg:mt-5">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-2 sm:mb-3 lg:mb-4 leading-tight tracking-tight line-clamp-2">
            {email.subject}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 relative overflow-hidden">
                <span className="relative z-10">{email.sender.charAt(0).toUpperCase()}</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{email.sender}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate max-w-[120px] sm:max-w-none">{email.senderEmail}</p>
              </div>
            </div>
            <span className="hidden sm:flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-medium">{formatFullDate(email.date)}</span>
            </span>
            {email.category && (
              <span className={cn(
                'inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold border shadow-sm',
                getCategoryColor(email.category)
              )}>
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {email.category}
              </span>
            )}
          </div>
        </div>

        {/* Success Notifications - Animated */}
        {showActionSuccess && (
          <div className="mt-4 flex items-center gap-2 text-emerald-700 text-sm bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 rounded-xl border border-emerald-200/50 shadow-sm animate-slide-up">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">Action items extracted successfully!</span>
          </div>
        )}
        {showDraftSuccess && (
          <div className="mt-4 flex items-center gap-2 text-indigo-700 text-sm bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 rounded-xl border border-indigo-200/50 shadow-sm animate-slide-up">
            <CheckCircle className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">Draft saved! Check the Drafts page.</span>
          </div>
        )}
      </div>

      {/* Split View Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Email Body */}
        <div className={cn(
          "flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/20",
          showAgentPanel ? "hidden lg:block" : "block"
        )}>
          <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
            <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-700 leading-relaxed">
              {email.body}
            </pre>
          </div>

          {/* Action Items Card */}
          {email.actionItems && email.actionItems.length > 0 && (
            <div className="mt-4 sm:mt-6 animate-slide-up">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 relative overflow-hidden">
                  <ListTodo className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Action Items</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium">{email.actionItems.length} task{email.actionItems.length > 1 ? 's' : ''} extracted by AI</p>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {email.actionItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3 hover:shadow-lg hover:border-amber-300/50 transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="mt-0.5">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-slate-300 group-hover:border-amber-500 transition-colors flex items-center justify-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-transparent group-hover:bg-amber-500 transition-colors" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-slate-700 font-medium">{item.task}</p>
                      {item.deadline && (
                        <p className="text-[10px] sm:text-xs text-amber-600 mt-1.5 sm:mt-2 flex items-center gap-1 sm:gap-1.5 font-semibold bg-amber-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md w-fit">
                          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {item.deadline}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - AI Agent Companion */}
        {showAgentPanel && (
          <div className="flex-1 lg:flex-none lg:w-[360px] xl:w-[400px] border-l border-slate-200/80 bg-white flex flex-col">
            <div className="p-3 sm:p-4 border-b border-slate-200/80 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 relative overflow-hidden animate-float">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">AI Agent</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">Gemini 2.5 Flash</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </div>
                {onToggleAgentPanel && (
                  <button
                    onClick={onToggleAgentPanel}
                    className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-500" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatWindow email={email} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
