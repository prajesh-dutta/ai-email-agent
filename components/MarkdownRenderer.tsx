'use client';

/**
 * Markdown Renderer Component
 * Renders markdown text with proper formatting
 * Supports bold, italic, code, lists, links, etc.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Parse and render markdown content
  const renderMarkdown = (text: string) => {
    const elements: React.ReactNode[] = [];
    
    // Split by double newlines to get paragraphs/blocks
    const blocks = text.split(/\n\n+/);
    
    blocks.forEach((block, blockIndex) => {
      const trimmedBlock = block.trim();
      if (!trimmedBlock) return;
      
      // Check if it's a bullet list
      if (/^[\-\*•]\s/.test(trimmedBlock) || /^\d+\.\s/.test(trimmedBlock)) {
        const listItems = trimmedBlock.split(/\n/).filter(line => line.trim());
        const isOrdered = /^\d+\./.test(listItems[0]);
        
        const ListTag = isOrdered ? 'ol' : 'ul';
        elements.push(
          <ListTag 
            key={blockIndex} 
            className={cn(
              "my-2 space-y-1",
              isOrdered ? "list-decimal" : "list-disc",
              "pl-4 sm:pl-5"
            )}
          >
            {listItems.map((item, itemIndex) => {
              // Remove bullet/number prefix
              const cleanItem = item.replace(/^[\-\*•]\s*/, '').replace(/^\d+\.\s*/, '');
              return (
                <li key={itemIndex} className="text-inherit leading-relaxed">
                  {renderInlineMarkdown(cleanItem)}
                </li>
              );
            })}
          </ListTag>
        );
      }
      // Check if it's a code block
      else if (trimmedBlock.startsWith('```')) {
        const codeContent = trimmedBlock.replace(/^```\w*\n?/, '').replace(/```$/, '');
        elements.push(
          <pre 
            key={blockIndex} 
            className="my-2 p-3 bg-slate-800 text-slate-100 rounded-lg text-xs sm:text-sm overflow-x-auto font-mono"
          >
            <code>{codeContent}</code>
          </pre>
        );
      }
      // Check if it's a heading
      else if (trimmedBlock.startsWith('#')) {
        const match = trimmedBlock.match(/^(#{1,6})\s+(.+)/);
        if (match) {
          const level = match[1].length;
          const headingText = match[2];
          const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
          const headingStyles: Record<number, string> = {
            1: 'text-lg font-bold mt-3 mb-2',
            2: 'text-base font-bold mt-2.5 mb-1.5',
            3: 'text-sm font-semibold mt-2 mb-1',
            4: 'text-sm font-semibold mt-1.5 mb-1',
            5: 'text-xs font-semibold mt-1 mb-0.5',
            6: 'text-xs font-medium mt-1 mb-0.5',
          };
          elements.push(
            <HeadingTag key={blockIndex} className={headingStyles[level]}>
              {renderInlineMarkdown(headingText)}
            </HeadingTag>
          );
        }
      }
      // Check if it's a blockquote
      else if (trimmedBlock.startsWith('>')) {
        const quoteContent = trimmedBlock.replace(/^>\s*/gm, '');
        elements.push(
          <blockquote 
            key={blockIndex} 
            className="my-2 pl-3 border-l-2 border-indigo-300 text-slate-600 italic"
          >
            {renderInlineMarkdown(quoteContent)}
          </blockquote>
        );
      }
      // Regular paragraph with possible line breaks
      else {
        const lines = trimmedBlock.split('\n');
        elements.push(
          <p key={blockIndex} className="my-1.5 leading-relaxed">
            {lines.map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {renderInlineMarkdown(line)}
                {lineIndex < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      }
    });
    
    return elements;
  };
  
  // Render inline markdown (bold, italic, code, links)
  const renderInlineMarkdown = (text: string): React.ReactNode => {
    if (!text) return null;
    
    const elements: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;
    
    // Pattern to match markdown inline elements
    // Order matters: check longer patterns first
    const patterns: Array<{ regex: RegExp; render: (match: string, extra?: string) => React.ReactNode }> = [
      // Bold + Italic (***text*** or ___text___)
      { regex: /\*\*\*(.+?)\*\*\*|___(.+?)___/, render: (match: string) => <strong key={key++} className="font-bold italic">{match}</strong> },
      // Bold (**text** or __text__)
      { regex: /\*\*(.+?)\*\*|__(.+?)__/, render: (match: string) => <strong key={key++} className="font-semibold">{match}</strong> },
      // Italic (*text* or _text_)
      { regex: /\*([^*]+)\*|_([^_]+)_/, render: (match: string) => <em key={key++} className="italic">{match}</em> },
      // Inline code (`code`)
      { regex: /`([^`]+)`/, render: (match: string) => <code key={key++} className="px-1.5 py-0.5 bg-slate-100 text-indigo-600 rounded text-[0.9em] font-mono">{match}</code> },
      // Links [text](url)
      { regex: /\[([^\]]+)\]\(([^)]+)\)/, render: (match: string, url?: string) => <a key={key++} href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2">{match}</a> },
    ];
    
    while (remaining.length > 0) {
      let earliestMatch: { index: number; length: number; node: React.ReactNode } | null = null;
      
      for (const pattern of patterns) {
        const match = remaining.match(pattern.regex);
        if (match && match.index !== undefined) {
          if (!earliestMatch || match.index < earliestMatch.index) {
            let node: React.ReactNode;
            if (pattern.regex.source.includes('\\]\\(')) {
              // Link pattern
              node = pattern.render(match[1], match[2]);
            } else {
              // Other patterns - get the captured group
              const content = match[1] || match[2] || match[0];
              node = pattern.render(content);
            }
            earliestMatch = {
              index: match.index,
              length: match[0].length,
              node,
            };
          }
        }
      }
      
      if (earliestMatch) {
        // Add text before the match
        if (earliestMatch.index > 0) {
          elements.push(remaining.substring(0, earliestMatch.index));
        }
        // Add the matched element
        elements.push(earliestMatch.node);
        // Continue with remaining text
        remaining = remaining.substring(earliestMatch.index + earliestMatch.length);
      } else {
        // No more matches, add remaining text
        elements.push(remaining);
        break;
      }
    }
    
    return elements.length === 1 ? elements[0] : elements;
  };
  
  return (
    <div className={cn("markdown-content", className)}>
      {renderMarkdown(content)}
    </div>
  );
}
