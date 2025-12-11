'use client';

/**
 * Home Page - Inbox
 * Fully Responsive Split View Layout
 * Professional SaaS Aesthetic with Sorting
 */

import React, { useState, useMemo } from 'react';
import { 
  Loader2, 
  Inbox,
  CheckCircle,
  Search,
  MailOpen,
  AlertCircle,
  Archive,
  Zap,
  Star,
  XCircle,
  ArrowUpDown,
  Clock,
  User,
  AtSign,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { Email } from '@/lib/types';
import { cn } from '@/lib/utils';
import EmailCard from '@/components/EmailCard';
import EmailDetail from '@/components/EmailDetail';
import ResponsiveSidebar, { MobileMenuButton } from '@/components/ResponsiveSidebar';

type SortOption = 'date-desc' | 'date-asc' | 'sender-asc' | 'sender-desc' | 'subject-asc' | 'subject-desc';

export default function HomePage() {
  const { state, updateEmail, setProcessing } = useApp();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingProgress, setProcessingProgress] = useState<{current: number, total: number} | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAgentPanel, setShowAgentPanel] = useState(true);

  // Sort options configuration
  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'date-desc', label: 'Newest First', icon: <Clock className="w-4 h-4" /> },
    { value: 'date-asc', label: 'Oldest First', icon: <Clock className="w-4 h-4" /> },
    { value: 'sender-asc', label: 'Sender A-Z', icon: <User className="w-4 h-4" /> },
    { value: 'sender-desc', label: 'Sender Z-A', icon: <User className="w-4 h-4" /> },
    { value: 'subject-asc', label: 'Subject A-Z', icon: <AtSign className="w-4 h-4" /> },
    { value: 'subject-desc', label: 'Subject Z-A', icon: <AtSign className="w-4 h-4" /> },
  ];

  // Filter and sort emails
  const filteredAndSortedEmails = useMemo(() => {
    let emails = state.emails.filter(email => {
      // Apply category filter
      if (filter !== 'all') {
        if (filter === 'unread' && email.read) return false;
        if (filter === 'uncategorized' && email.category !== null) return false;
        if (!['all', 'unread', 'uncategorized'].includes(filter) && email.category !== filter) return false;
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          email.subject.toLowerCase().includes(query) ||
          email.sender.toLowerCase().includes(query) ||
          email.body.toLowerCase().includes(query)
        );
      }
      
      return true;
    });

    // Apply sorting
    emails = [...emails].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'sender-asc':
          return a.sender.localeCompare(b.sender);
        case 'sender-desc':
          return b.sender.localeCompare(a.sender);
        case 'subject-asc':
          return a.subject.localeCompare(b.subject);
        case 'subject-desc':
          return b.subject.localeCompare(a.subject);
        default:
          return 0;
      }
    });

    return emails;
  }, [state.emails, filter, searchQuery, sortBy]);

  // Process inbox - categorize all emails
  const processInbox = async () => {
    setProcessing(true);
    const uncategorized = state.emails.filter(e => !e.category);
    const total = uncategorized.length;
    
    if (total === 0) {
      setProcessing(false);
      return;
    }

    setProcessingProgress({ current: 0, total });

    for (let i = 0; i < uncategorized.length; i++) {
      const email = uncategorized[i];
      setProcessingProgress({ current: i + 1, total });

      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: state.prompts.categorization,
            emailContent: `From: ${email.sender}\nSubject: ${email.subject}\n\n${email.body}`,
            type: 'categorize',
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          const result = data.data.trim();
          const validCategories = ['Important', 'Newsletter', 'Spam', 'To-Do', 'Uncategorized'];
          let category = 'Uncategorized';
          
          for (const cat of validCategories) {
            if (result.toLowerCase().includes(cat.toLowerCase())) {
              category = cat;
              break;
            }
          }

          updateEmail({ ...email, category: category as Email['category'] });
        }
      } catch (error) {
        console.error('Error processing email:', email.id, error);
      }

      // 6.5 second delay to stay within Gemini free tier rate limit (10 requests/minute)
      await new Promise(resolve => setTimeout(resolve, 6500));
    }

    setProcessingProgress(null);
    setProcessing(false);
  };

  const stats = {
    total: state.emails.length,
    unread: state.emails.filter(e => !e.read).length,
    uncategorized: state.emails.filter(e => !e.category).length,
  };

  const filterOptions = [
    { value: 'all', label: 'All', fullLabel: 'All Mail', count: stats.total, icon: Inbox },
    { value: 'unread', label: 'Unread', fullLabel: 'Unread', count: stats.unread, icon: MailOpen },
    { value: 'uncategorized', label: 'New', fullLabel: 'Uncategorized', count: stats.uncategorized, icon: AlertCircle },
    { value: 'Important', label: 'Important', fullLabel: 'Important', count: state.emails.filter(e => e.category === 'Important').length, icon: Star },
    { value: 'To-Do', label: 'To-Do', fullLabel: 'To-Do', count: state.emails.filter(e => e.category === 'To-Do').length, icon: CheckCircle },
    { value: 'Newsletter', label: 'News', fullLabel: 'Newsletter', count: state.emails.filter(e => e.category === 'Newsletter').length, icon: Archive },
    { value: 'Spam', label: 'Spam', fullLabel: 'Spam', count: state.emails.filter(e => e.category === 'Spam').length, icon: XCircle },
  ];

  const currentSort = sortOptions.find(s => s.value === sortBy);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      {/* Left Sidebar */}
      <ResponsiveSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Email List Panel */}
        <div className={cn(
          'flex flex-col bg-white/95 backdrop-blur-xl transition-all duration-300 border-r border-slate-200/80 shadow-xl relative',
          // Mobile: Full width when no email selected, hidden when email selected
          selectedEmail ? 'hidden md:flex' : 'flex',
          // Tablet & Desktop sizing
          'md:w-full',
          selectedEmail ? 'lg:w-[380px] xl:w-[420px]' : 'lg:flex-1',
          // Critical: Ensure proper height and scrolling on all viewports
          'h-full max-h-screen'
        )}>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 via-transparent to-purple-50/10 pointer-events-none" />
          
          {/* Header */}
          <div className="p-3 sm:p-4 lg:p-5 border-b border-slate-200/80 bg-gradient-to-r from-white/90 via-indigo-50/40 to-purple-50/30 backdrop-blur-sm relative z-10">
            {/* Top Row: Menu, Title, Process Button */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <MobileMenuButton onClick={() => setSidebarOpen(true)} />
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    Inbox
                    <span className="text-[10px] sm:text-xs font-semibold text-indigo-600 bg-indigo-100 px-1.5 sm:px-2 py-0.5 rounded-full">
                      {stats.total}
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:flex items-center gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse" />
                      {stats.unread} unread
                    </span>
                    {stats.uncategorized > 0 && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-amber-600 font-medium">{stats.uncategorized} new</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={processInbox}
                disabled={state.isProcessing || stats.uncategorized === 0}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 relative overflow-hidden',
                  state.isProcessing || stats.uncategorized === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:scale-105 shadow-strong shadow-indigo-500/40 ring-2 ring-indigo-300/50 hover:shadow-glow'
                )}
              >
                {state.isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                    <span className="hidden sm:inline">
                      {processingProgress ? `${processingProgress.current}/${processingProgress.total}` : 'Processing...'}
                    </span>
                    <span className="sm:hidden">{processingProgress?.current || '...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Process</span>
                    {stats.uncategorized > 0 && (
                      <span className="bg-white/25 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold">
                        {stats.uncategorized}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3 glow-focus rounded-xl sm:rounded-2xl">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emails..."
                className="w-full pl-9 sm:pl-11 pr-9 sm:pr-10 py-2.5 sm:py-3 bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-200/80 rounded-xl sm:rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:outline-none focus:bg-white transition-all shadow-soft focus:shadow-medium placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>

            {/* Filters and Sort Row */}
            <div className="flex items-center gap-2 min-w-0">
              {/* Sort Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all font-medium border',
                    showSortMenu 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  )}
                >
                  <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{currentSort?.label}</span>
                  <span className="sm:hidden">Sort</span>
                </button>

                {/* Sort Menu Dropdown */}
                {showSortMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowSortMenu(false)} 
                    />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-20 py-1 animate-scale-in">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortMenu(false);
                          }}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors',
                            sortBy === option.value 
                              ? 'bg-indigo-50 text-indigo-700 font-medium' 
                              : 'text-slate-600 hover:bg-slate-50'
                          )}
                        >
                          {option.icon}
                          {option.label}
                          {sortBy === option.value && (
                            <CheckCircle className="w-4 h-4 ml-auto text-indigo-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Filter Tabs - Horizontal Scrollable */}
              <div className="flex-1 flex items-center gap-1 overflow-x-auto pb-1 scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c7d2fe #f1f5f9' }}>
                {filterOptions.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={cn(
                      'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-200 whitespace-nowrap font-medium flex-shrink-0',
                      filter === f.value
                        ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 shadow-sm border border-indigo-200/50'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    )}
                  >
                    <f.icon className={cn('w-3 h-3 sm:w-3.5 sm:h-3.5', filter === f.value ? 'text-indigo-600' : 'text-slate-400')} />
                    <span className="hidden sm:inline">{f.fullLabel}</span>
                    <span className="sm:hidden">{f.label}</span>
                    {f.count > 0 && (
                      <span className={cn(
                        'text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full font-bold',
                        filter === f.value ? 'bg-indigo-200/80 text-indigo-700' : 'bg-slate-200 text-slate-600'
                      )}>
                        {f.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
            {filteredAndSortedEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 sm:p-8 animate-fade-in">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-slate-100 via-slate-100 to-indigo-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 shadow-inner">
                  {filter === 'all' ? (
                    <Inbox className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-400" />
                  ) : (
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-400" />
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-700 mb-1 sm:mb-2">
                  {filter === 'all' ? 'No emails yet' : 'No matching emails'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xs">
                  {searchQuery ? 'Try adjusting your search.' : `No emails match "${filter}" filter.`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100/80">
                {filteredAndSortedEmails.map((email, index) => (
                  <div key={email.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 20, 200)}ms` }}>
                    <EmailCard
                      email={email}
                      isSelected={selectedEmail?.id === email.id}
                      onClick={() => setSelectedEmail(email)}
                      isCompact={!!selectedEmail}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email Detail Panel */}
        {selectedEmail ? (
          <div className={cn(
            'flex-1 overflow-hidden animate-fade-in',
            // Mobile: Full width
            'w-full md:w-auto'
          )}>
            <EmailDetail 
              email={selectedEmail} 
              onBack={() => setSelectedEmail(null)}
              showAgentPanel={showAgentPanel}
              onToggleAgentPanel={() => setShowAgentPanel(!showAgentPanel)}
            />
          </div>
        ) : (
          /* Empty State - Decorative Pattern Panel */
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
              {/* Floating Orbs with enhanced animation */}
              <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-indigo-300/40 via-purple-300/40 to-pink-300/40 rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-300/40 via-rose-300/40 to-orange-300/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-blue-200/30 via-cyan-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse-slow" />
              
              {/* Grid Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
              
              {/* Decorative Lines with glow */}
              <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path d="M0,50 Q250,0 500,50 T1000,50" fill="none" stroke="url(#lineGrad)" strokeWidth="2" filter="url(#glow)" className="animate-dash" />
                <path d="M0,150 Q250,100 500,150 T1000,150" fill="none" stroke="url(#lineGrad)" strokeWidth="2" filter="url(#glow)" className="animate-dash" style={{ animationDelay: '0.5s' }} />
                <path d="M0,250 Q250,200 500,250 T1000,250" fill="none" stroke="url(#lineGrad)" strokeWidth="2" filter="url(#glow)" className="animate-dash" style={{ animationDelay: '1s' }} />
              </svg>
            </div>
            
            {/* Center Content with enhanced styling */}
            <div className="relative z-10 flex flex-col items-center animate-fade-in-scale">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative w-28 h-28 bg-white/95 backdrop-blur-xl rounded-[2rem] flex items-center justify-center shadow-strong shadow-indigo-500/30 border border-white/80 ring-4 ring-indigo-100/50 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-12 h-12 text-indigo-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-strong shadow-emerald-500/40 ring-4 ring-white/80 animate-bounce group-hover:scale-110 transition-transform" style={{ animationDuration: '2s' }}>
                  <Zap className="w-5 h-5 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
              <div className="mt-8 text-center space-y-2">
                <p className="text-base font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">AI-Powered Email Assistant</p>
                <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-indigo-100/50">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-glow" />
                  <p className="text-xs font-semibold text-slate-600">Powered by Gemini 2.5 Flash</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
