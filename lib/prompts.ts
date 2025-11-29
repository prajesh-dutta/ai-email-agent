/**
 * Default System Prompts for the Email Agent
 */

import { SystemPrompts } from './types';

export const defaultPrompts: SystemPrompts = {
  categorization: `Categorize emails into: Important, Newsletter, Spam, To-Do. 
To-Do must have a deadline or clear action required.
Respond with ONLY the category name, nothing else.`,

  actionExtraction: `Extract tasks as JSON: [{"task": "...", "deadline": "..."}].
Return ONLY valid JSON array, no other text.
If no tasks found, return empty array: []`,

  autoReply: `Draft a polite, professional reply asking for clarification or acknowledging the email.
If the email is spam or doesn't require a reply, respond with: NO_REPLY_NEEDED
Otherwise, write only the reply body (no subject line).`,
};
