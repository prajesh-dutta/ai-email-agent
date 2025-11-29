import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes <= 1 ? 'Just now' : `${diffMinutes}m ago`;
  }
  
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format full date with time
 */
export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get category badge color classes
 */
export function getCategoryColor(category: string | null): string {
  switch (category) {
    case 'Important':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'To-Do':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Newsletter':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Spam':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'Uncategorized':
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

/**
 * Get category icon name
 */
export function getCategoryIcon(category: string | null): string {
  switch (category) {
    case 'Important':
      return 'AlertCircle';
    case 'To-Do':
      return 'CheckSquare';
    case 'Newsletter':
      return 'Newspaper';
    case 'Spam':
      return 'ShieldAlert';
    default:
      return 'Mail';
  }
}
