'use client';

/**
 * Sidebar Component - Astonishing Design
 * Sleek, collapsible sidebar with Agent Brain (editable prompts) and navigation
 * Professional icons only - no emojis
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Brain, 
  Inbox, 
  Mail, 
  FileText, 
  Settings,
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
  Zap
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { state, updatePrompts, resetApp } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [brainExpanded, setBrainExpanded] = useState(true);
  const [editedPrompts, setEditedPrompts] = useState(state.prompts);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync with context prompts when they change
  useEffect(() => {
    setEditedPrompts(state.prompts);
  }, [state.prompts]);

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

  if (isCollapsed) {
    return (
      <aside className="w-16 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col h-screen border-r border-slate-700/50">
        {/* Collapsed Logo */}
        <div className="p-4 border-b border-slate-700/50 flex justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Mail className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Collapsed Navigation */}
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
          
          {/* Brain Icon */}
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

        {/* Expand Button */}
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

  return (
    <aside className="w-80 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col h-screen border-r border-slate-700/50">
      {/* Logo */}
      <div className="p-5 border-b border-slate-700/50">
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
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
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
              Customize how the AI processes and responds to emails. Changes take effect immediately.
            </p>

            {/* Categorization Prompt */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                Categorization Prompt
              </label>
              <textarea
                value={editedPrompts.categorization}
                onChange={(e) => handlePromptChange('categorization', e.target.value)}
                className="w-full h-24 text-xs bg-slate-800/50 border border-slate-600/50 rounded-lg p-3 resize-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-500"
                placeholder="Instructions for email categorization..."
              />
            </div>

            {/* Action Extraction Prompt */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <ListTodo className="w-3.5 h-3.5 text-emerald-400" />
                Action Extraction Prompt
              </label>
              <textarea
                value={editedPrompts.actionExtraction}
                onChange={(e) => handlePromptChange('actionExtraction', e.target.value)}
                className="w-full h-24 text-xs bg-slate-800/50 border border-slate-600/50 rounded-lg p-3 resize-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-500"
                placeholder="Instructions for extracting action items..."
              />
            </div>

            {/* Auto-Reply Prompt */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <MessageSquareReply className="w-3.5 h-3.5 text-blue-400" />
                Auto-Reply Prompt
              </label>
              <textarea
                value={editedPrompts.autoReply}
                onChange={(e) => handlePromptChange('autoReply', e.target.value)}
                className="w-full h-24 text-xs bg-slate-800/50 border border-slate-600/50 rounded-lg p-3 resize-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-500"
                placeholder="Instructions for generating email replies..."
              />
            </div>

            {/* Save Button */}
            {hasChanges && (
              <button
                onClick={handleSavePrompts}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            )}

            {/* Success Message */}
            {saveSuccess && (
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Prompts saved successfully!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:bg-white/5 py-2.5 rounded-lg text-sm transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Application
        </button>
      </div>
    </aside>
  );
}
