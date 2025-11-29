'use client';

/**
 * Draft Card Component - Astonishing Design
 * Displays a draft email with edit and delete options
 * Professional icons only - NO Send button
 */

import React, { useState } from 'react';
import { 
  Trash2, 
  Save,
  Edit3,
  X,
  User,
  Clock,
  Mail,
  ShieldAlert,
  CheckCircle
} from 'lucide-react';
import { Draft } from '@/lib/types';
import { useApp } from '@/lib/context';
import { formatFullDate, cn } from '@/lib/utils';

interface DraftCardProps {
  draft: Draft;
}

export default function DraftCard({ draft }: DraftCardProps) {
  const { updateDraft, deleteDraft } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(draft.body);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSave = () => {
    updateDraft({
      ...draft,
      body: editedBody,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleDelete = () => {
    if (confirm('Delete this draft? This action cannot be undone.')) {
      deleteDraft(draft.id);
    }
  };

  const handleCancel = () => {
    setEditedBody(draft.body);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <Mail className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate text-lg">
                {draft.subject}
              </h3>
              <div className="flex flex-wrap items-center gap-4 mt-1.5 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  To: <span className="font-medium text-slate-700">{draft.toName}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatFullDate(draft.updatedAt || draft.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/25 font-semibold"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-all font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Save Success Message */}
        {showSaveSuccess && (
          <div className="mt-3 flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 px-3 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span>Draft saved successfully!</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {isEditing ? (
          <textarea
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            className="w-full h-56 p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none text-sm leading-relaxed transition-all"
            placeholder="Write your draft reply..."
          />
        ) : (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">
              {draft.body}
            </pre>
          </div>
        )}
      </div>

      {/* Safety Notice Footer */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200/30 rounded-lg p-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Safety Mode:</strong> This draft can only be saved or deleted. No send functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
