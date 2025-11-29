'use client';

/**
 * Email Card Component - Polished Professional Design
 * Displays email summary in inbox list with smooth animations
 * Icons only - no emojis
 */

import React from 'react';
import { 
  Mail, 
  MailOpen,
  AlertCircle,
  CheckSquare,
  Newspaper,
  ShieldAlert,
  Clock,
  Star
} from 'lucide-react';
import { Email } from '@/lib/types';
import { cn, formatDate, getCategoryColor } from '@/lib/utils';

interface EmailCardProps {
  email: Email;
  isSelected?: boolean;
  isCompact?: boolean;
  onClick: () => void;
}

export default function EmailCard({ email, isSelected, isCompact, onClick }: EmailCardProps) {
  const getCategoryIcon = () => {
    switch (email.category) {
      case 'Important':
        return <Star className="w-3 h-3" />;
      case 'To-Do':
        return <CheckSquare className="w-3 h-3" />;
      case 'Newsletter':
        return <Newspaper className="w-3 h-3" />;
      case 'Spam':
        return <ShieldAlert className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer card-transition',
        isCompact ? 'p-2.5 sm:p-3' : 'p-3 sm:p-4',
        'hover:bg-gradient-to-r hover:from-indigo-50/80 hover:to-purple-50/50',
        isSelected && 'bg-gradient-to-r from-indigo-50 to-purple-50/60 border-l-[3px] border-l-indigo-600',
        !email.read && !isSelected && 'bg-gradient-to-r from-blue-50/40 to-indigo-50/20',
        email.read && !isSelected && 'bg-white hover:bg-slate-50/80'
      )}
    >
      {/* Unread Indicator - Animated */}
      {!email.read && !isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full shadow-sm shadow-indigo-500/30" />
      )}

      <div className="flex items-start gap-2 sm:gap-3">
        {/* Avatar / Read indicator */}
        <div className={cn(
          'flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center font-semibold text-xs sm:text-sm card-transition relative overflow-hidden',
          !email.read 
            ? 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25' 
            : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600',
          isSelected && 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
        )}>
          <span className="relative z-10">{email.sender.charAt(0).toUpperCase()}</span>
          {(!email.read || isSelected) && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={cn(
              'truncate text-xs sm:text-sm max-w-[150px] sm:max-w-none',
              !email.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'
            )}>
              {email.sender}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 whitespace-nowrap flex items-center gap-1 sm:gap-1.5 font-medium">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60" />
              {formatDate(email.date)}
            </span>
          </div>

          {/* Subject */}
          <h3 className={cn(
            'text-xs sm:text-sm truncate mb-0.5 sm:mb-1',
            !email.read ? 'font-semibold text-slate-900' : 'text-slate-700'
          )}>
            {email.subject}
          </h3>

          {/* Preview - hidden in compact mode */}
          {!isCompact && (
            <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 leading-relaxed hidden sm:block">
              {email.body.split('\n')[0].slice(0, 120)}
            </p>
          )}

          {/* Footer Row - Category Badge + Action Items */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2.5 flex-wrap">
            {email.category && (
              <span className={cn(
                'inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-bold uppercase tracking-wider border shadow-sm',
                getCategoryColor(email.category)
              )}>
                {getCategoryIcon()}
                <span className="hidden sm:inline">{email.category}</span>
              </span>
            )}
            {email.actionItems && email.actionItems.length > 0 && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-amber-50 text-amber-700 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-bold border border-amber-200/50">
                <CheckSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {email.actionItems.length}
                <span className="hidden sm:inline">task{email.actionItems.length > 1 ? 's' : ''}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover highlight effect */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none',
        'bg-gradient-to-r from-transparent via-indigo-500/[0.02] to-transparent'
      )} />
    </div>
  );
}
