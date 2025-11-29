'use client';

/**
 * Drafts Page - Responsive Design
 * Phase 4: Drafts & Safety
 * Professional icons only - NO Send button
 */

import React, { useState } from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { useApp } from '@/lib/context';
import DraftCard from '@/components/DraftCard';
import ResponsiveSidebar, { MobileMenuButton } from '@/components/ResponsiveSidebar';

export default function DraftsPage() {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Left Sidebar */}
      <ResponsiveSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <MobileMenuButton onClick={() => setSidebarOpen(true)} />
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">Drafts</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {state.drafts.length} draft{state.drafts.length !== 1 ? 's' : ''} saved
                </p>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="flex items-start gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl p-3 sm:p-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1 text-sm sm:text-base">Safety Mode Active</h3>
              <p className="text-xs sm:text-sm text-amber-800/80 leading-relaxed">
                Drafts can only be <strong>saved</strong> or <strong>deleted</strong>. 
                No send functionality to prevent accidental emails.
              </p>
            </div>
          </div>
        </div>

        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {state.drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-inner">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
                No drafts yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed px-4">
                Generate a draft reply from the Inbox by selecting an email and clicking the 
                <span className="inline-flex items-center mx-1 px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium text-xs">Draft Reply</span>
                button.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
              {state.drafts.map((draft) => (
                <DraftCard key={draft.id} draft={draft} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
