import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { categorizeEmail, extractActionItems, generateDraftReply, chatWithAgent } from "./gemini";
import { z } from "zod";
import type { EmailCategory } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/emails", async (req, res) => {
    try {
      const emails = await storage.getAllEmails();
      res.json(emails);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  app.get("/api/emails/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const email = await storage.getEmail(id);
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }
      res.json(email);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch email" });
    }
  });

  app.patch("/api/emails/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const email = await storage.updateEmail(id, req.body);
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }
      res.json(email);
    } catch (error) {
      res.status(500).json({ error: "Failed to update email" });
    }
  });

  app.post("/api/emails/process", async (req, res) => {
    try {
      const emails = await storage.getAllEmails();
      const categorizationPrompt = await storage.getPromptByType("categorization");
      const actionPrompt = await storage.getPromptByType("action_extraction");

      if (!categorizationPrompt || !actionPrompt) {
        return res.status(500).json({ error: "Prompts not configured" });
      }

      const results = [];

      for (const email of emails) {
        const category = await categorizeEmail(email.body, categorizationPrompt.content);
        const actionItems = await extractActionItems(email.body, actionPrompt.content);

        const updated = await storage.updateEmail(email.id, {
          category: category as EmailCategory,
          actionItems: actionItems.length > 0 ? actionItems : null,
        });

        if (updated) {
          results.push(updated);
        }
      }

      res.json({ processed: results.length, emails: results });
    } catch (error) {
      console.error("Error processing emails:", error);
      res.status(500).json({ error: "Failed to process emails" });
    }
  });

  app.post("/api/emails/:id/extract-actions", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const email = await storage.getEmail(id);
      
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }

      const actionPrompt = await storage.getPromptByType("action_extraction");
      if (!actionPrompt) {
        return res.status(500).json({ error: "Action extraction prompt not configured" });
      }

      const actionItems = await extractActionItems(email.body, actionPrompt.content);
      const updated = await storage.updateEmail(id, {
        actionItems: actionItems.length > 0 ? actionItems : null,
      });

      await storage.createChatMessage({
        emailId: id,
        role: "assistant",
        content: actionItems.length > 0 
          ? `I found ${actionItems.length} action item(s):\n\n${actionItems.map((item, i) => 
              `${i + 1}. ${item.task}${item.deadline ? ` (Due: ${item.deadline})` : ""}`
            ).join("\n")}`
          : "I didn't find any specific action items in this email.",
      });

      res.json({ email: updated, actionItems });
    } catch (error) {
      console.error("Error extracting actions:", error);
      res.status(500).json({ error: "Failed to extract action items" });
    }
  });

  app.post("/api/emails/:id/generate-draft", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const email = await storage.getEmail(id);
      
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }

      const replyPrompt = await storage.getPromptByType("auto_reply");
      if (!replyPrompt) {
        return res.status(500).json({ error: "Auto-reply prompt not configured" });
      }

      const draftContent = await generateDraftReply(
        {
          sender: email.sender,
          senderEmail: email.senderEmail,
          subject: email.subject,
          body: email.body,
        },
        replyPrompt.content
      );

      if (!draftContent) {
        await storage.createChatMessage({
          emailId: id,
          role: "assistant",
          content: "Based on my analysis, this email doesn't require a reply (e.g., newsletter or promotional content).",
        });
        return res.json({ draft: null, message: "No reply needed for this type of email" });
      }

      const draft = await storage.createDraft({
        emailId: id,
        to: email.senderEmail,
        subject: draftContent.subject,
        body: draftContent.body,
      });

      await storage.createChatMessage({
        emailId: id,
        role: "assistant",
        content: `I've created a draft reply for you. You can find it in the Drafts tab.\n\nSubject: ${draftContent.subject}\n\nPreview:\n${draftContent.body.substring(0, 200)}...`,
      });

      res.json({ draft });
    } catch (error) {
      console.error("Error generating draft:", error);
      res.status(500).json({ error: "Failed to generate draft reply" });
    }
  });

  app.get("/api/prompts", async (req, res) => {
    try {
      const prompts = await storage.getAllPrompts();
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prompts" });
    }
  });

  app.patch("/api/prompts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Content is required" });
      }

      const prompt = await storage.updatePrompt(id, content);
      if (!prompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error) {
      res.status(500).json({ error: "Failed to update prompt" });
    }
  });

  app.post("/api/prompts/:id/reset", async (req, res) => {
    try {
      const { id } = req.params;
      const prompt = await storage.resetPrompt(id);
      if (!prompt) {
        return res.status(404).json({ error: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error) {
      res.status(500).json({ error: "Failed to reset prompt" });
    }
  });

  app.get("/api/drafts", async (req, res) => {
    try {
      const drafts = await storage.getAllDrafts();
      res.json(drafts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch drafts" });
    }
  });

  app.post("/api/drafts", async (req, res) => {
    try {
      const draft = await storage.createDraft(req.body);
      res.status(201).json(draft);
    } catch (error) {
      res.status(500).json({ error: "Failed to create draft" });
    }
  });

  app.patch("/api/drafts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const draft = await storage.updateDraft(id, req.body);
      if (!draft) {
        return res.status(404).json({ error: "Draft not found" });
      }
      res.json(draft);
    } catch (error) {
      res.status(500).json({ error: "Failed to update draft" });
    }
  });

  app.delete("/api/drafts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteDraft(id);
      if (!deleted) {
        return res.status(404).json({ error: "Draft not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete draft" });
    }
  });

  app.get("/api/chat/:emailId", async (req, res) => {
    try {
      const emailId = parseInt(req.params.emailId);
      const messages = await storage.getChatMessages(emailId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { emailId, message } = req.body;
      
      if (!emailId || !message) {
        return res.status(400).json({ error: "emailId and message are required" });
      }

      const email = await storage.getEmail(emailId);
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }

      await storage.createChatMessage({
        emailId,
        role: "user",
        content: message,
      });

      const existingMessages = await storage.getChatMessages(emailId);
      const history = existingMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await chatWithAgent(
        {
          sender: email.sender,
          subject: email.subject,
          body: email.body,
        },
        message,
        history
      );

      const assistantMessage = await storage.createChatMessage({
        emailId,
        role: "assistant",
        content: response,
      });

      res.json({ userMessage: message, assistantMessage });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  return httpServer;
}
