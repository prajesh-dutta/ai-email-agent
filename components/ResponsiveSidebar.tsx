'use client';

/**
 * Responsive Sidebar Component
 * Fully responsive with mobile drawer support
 * Collapsible on all screen sizes
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Brain, 
  Inbox, 
  Mail, 
  FileText, 
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
  Tag,
  ListTodo,
  MessageSquareReply,
  Sparkles,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { cn } from '@/lib/utils';

interface ResponsiveSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function ResponsiveSidebar({ isOpen, onToggle, onClose }: ResponsiveSidebarProps) {
  const pathname = usePathname();
  const { state, updatePrompts, resetApp } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [brainExpanded, setBrainExpanded] = useState(false);
  const [editedPrompts, setEditedPrompts] = useState(state.prompts);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(false); // Don't collapse on mobile, use drawer instead
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync with context prompts
  useEffect(() => {
    setEditedPrompts(state.prompts);
  }, [state.prompts]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      onClose();
    }
  }, [pathname]);

  const navItems = [
    { href: '/', label: 'Inbox', icon: Inbox, badge: state.emails.filter(e => !e.read).length },
    { href: '/drafts', label: 'Drafts', icon: FileText, badge: state.drafts.length },
  ];

  const handlePromptChange = (key: keyof typeof editedPrompts, value: string) => {
    setEditedPrompts(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSavePrompts = () => {
    updatePrompts(editedPrompts);
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Reset all data? This will clear categories, drafts, and chat history.')) {
      resetApp();
      setEditedPrompts(state.prompts);
      setHasChanges(false);
    }
  };

  // Desktop collapsed view
  if (!isMobile && isCollapsed) {
    return (
      <aside className="hidden lg:flex w-16 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex-col h-screen border-r border-slate-700/50 flex-shrink-0">
        <div className="p-4 border-b border-slate-700/50 flex justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Mail className="w-4 h-4 text-white" />
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center justify-center p-3 rounded-xl transition-all duration-200',
                'hover:bg-white/10',
                pathname === item.href && 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/25'
              )}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </Link>
          ))}
          
          <button
            onClick={() => {
              setIsCollapsed(false);
              setBrainExpanded(true);
            }}
            className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-colors"
            title="Agent Brain"
          >
            <Brain className="w-5 h-5 text-amber-400" />
          </button>
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // Sidebar content (shared between mobile drawer and desktop)
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 lg:p-5 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Email Agent</h1>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                <Zap className="w-3 h-3 text-amber-400" />
                Gemini 2.5 Flash
              </div>
            </div>
          </div>
          {isMobile ? (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden lg:block"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isMobile && onClose()}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
              'hover:bg-white/10',
              pathname === item.href && 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/25'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1 font-medium">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className={cn(
                'px-2 py-0.5 text-xs font-semibold rounded-full',
                pathname === item.href ? 'bg-white/20' : 'bg-slate-700 text-slate-300'
              )}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Agent Brain Section */}
      <div className="flex-1 overflow-hidden flex flex-col border-t border-slate-700/50 mt-2">
        <button
          onClick={() => setBrainExpanded(!brainExpanded)}
          className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-semibold">Agent Brain</span>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">System Prompts</p>
          </div>
          {brainExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {brainExpanded && (
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Customize how the AI processes emails.
            </p>

            {/* Prompts */}
            {[
              { key: 'categorization', label: 'Categorization', icon: Tag, color: 'text-indigo-400' },
              { key: 'actionExtraction', label: 'Action Extraction', icon: ListTodo, color: 'text-emerald-400' },
              { key: 'autoReply', label: 'Auto-Reply', icon: MessageSquareReply, color: 'text-blue-400' },
            ].map((prompt) => (
              <div key={prompt.key} className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <prompt.icon className={cn('w-3.5 h-3.5', prompt.color)} />
                  {prompt.label}
                </label>
                <textarea
                  value={editedPrompts[prompt.key as keyof typeof editedPrompts]}
                  onChange={(e) => handlePromptChange(prompt.key as keyof typeof editedPrompts, e.target.value)}
                  className="w-full h-20 text-xs bg-slate-800/50 border border-slate-600/50 rounded-lg p-3 resize-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            ))}

            {hasChanges && (
              <button
                onClick={handleSavePrompts}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white py-2.5 rounded-lg text-sm font-semibold transition-all"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            )}

            {saveSuccess && (
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Saved!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 py-2.5 rounded-lg text-sm transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Application
        </button>
      </div>
    </div>
  );

  // Mobile: Drawer overlay
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={onClose}
          />
        )}
        
        {/* Drawer */}
        <aside 
          className={cn(
            'fixed inset-y-0 left-0 w-[280px] sm:w-[320px] bg-gradient-to-b from-slate-900 to-slate-800 text-white z-50 transform transition-transform duration-300 ease-out lg:hidden',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop: Regular sidebar
  return (
    <aside className="hidden lg:flex w-80 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex-col h-screen border-r border-slate-700/50 flex-shrink-0">
      {sidebarContent}
    </aside>
  );
}

// Mobile menu button component
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
    >
      <Menu className="w-5 h-5 text-slate-700" />
    </button>
  );
}
