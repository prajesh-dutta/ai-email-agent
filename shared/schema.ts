import { z } from "zod";

export const emailCategorySchema = z.enum(["Important", "Newsletter", "Spam", "To-Do", "Uncategorized"]);
export type EmailCategory = z.infer<typeof emailCategorySchema>;

export const emailSchema = z.object({
  id: z.number(),
  sender: z.string(),
  senderEmail: z.string(),
  subject: z.string(),
  body: z.string(),
  date: z.string(),
  read: z.boolean(),
  category: emailCategorySchema.nullable(),
  actionItems: z.array(z.object({
    task: z.string(),
    deadline: z.string().nullable(),
  })).nullable(),
});

export type Email = z.infer<typeof emailSchema>;
export type InsertEmail = Omit<Email, "id">;

export const promptSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  content: z.string(),
  type: z.enum(["categorization", "action_extraction", "auto_reply"]),
});

export type Prompt = z.infer<typeof promptSchema>;
export type InsertPrompt = Omit<Prompt, "id">;

export const draftSchema = z.object({
  id: z.number(),
  emailId: z.number().nullable(),
  to: z.string(),
  subject: z.string(),
  body: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Draft = z.infer<typeof draftSchema>;
export type InsertDraft = Omit<Draft, "id" | "createdAt" | "updatedAt">;

export const chatMessageSchema = z.object({
  id: z.number(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.string(),
  emailId: z.number().nullable(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type InsertChatMessage = Omit<ChatMessage, "id" | "timestamp">;

export const insertEmailSchema = emailSchema.omit({ id: true });
export const insertPromptSchema = promptSchema.omit({ id: true });
export const insertDraftSchema = draftSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertChatMessageSchema = chatMessageSchema.omit({ id: true, timestamp: true });

export const users = {} as any;
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };
