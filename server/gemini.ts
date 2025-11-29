import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function categorizeEmail(emailBody: string, prompt: string): Promise<string> {
  try {
    const fullPrompt = `${prompt}\n\nEmail Content:\n${emailBody}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const text = response.text?.trim() || "Uncategorized";
    
    const validCategories = ["Important", "Newsletter", "Spam", "To-Do"];
    const category = validCategories.find(c => text.includes(c)) || "Uncategorized";
    
    return category;
  } catch (error) {
    console.error("Error categorizing email:", error);
    return "Uncategorized";
  }
}

export interface ActionItem {
  task: string;
  deadline: string | null;
}

export async function extractActionItems(emailBody: string, prompt: string): Promise<ActionItem[]> {
  try {
    const fullPrompt = `${prompt}\n\nEmail Content:\n${emailBody}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const text = response.text?.trim() || "[]";
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return [];
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(parsed)) {
      return [];
    }
    
    return parsed.map((item: any) => ({
      task: String(item.task || ""),
      deadline: item.deadline ? String(item.deadline) : null,
    })).filter((item: ActionItem) => item.task.length > 0);
  } catch (error) {
    console.error("Error extracting action items:", error);
    return [];
  }
}

export async function generateDraftReply(
  originalEmail: { sender: string; senderEmail: string; subject: string; body: string },
  prompt: string
): Promise<{ subject: string; body: string } | null> {
  try {
    const fullPrompt = `${prompt}

Original Email:
From: ${originalEmail.sender} <${originalEmail.senderEmail}>
Subject: ${originalEmail.subject}

${originalEmail.body}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const text = response.text?.trim() || "";
    
    if (text.includes("NO_REPLY_NEEDED")) {
      return null;
    }
    
    return {
      subject: `Re: ${originalEmail.subject}`,
      body: text,
    };
  } catch (error) {
    console.error("Error generating draft reply:", error);
    throw new Error("Failed to generate draft reply");
  }
}

export async function chatWithAgent(
  emailContext: { sender: string; subject: string; body: string },
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  try {
    let conversationContext = "";
    if (conversationHistory.length > 0) {
      conversationContext = "\n\nPrevious conversation:\n" + 
        conversationHistory.slice(-6).map(msg => 
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        ).join("\n");
    }

    const fullPrompt = `You are an intelligent email assistant. Help the user understand and respond to their emails.

Email Context:
From: ${emailContext.sender}
Subject: ${emailContext.subject}

Email Body:
${emailContext.body}
${conversationContext}

User Question: ${userMessage}

Provide a helpful, concise response. If asked to summarize, be brief and highlight key points. If asked about tasks or action items, list them clearly. If asked to draft a reply, write it professionally.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    return response.text?.trim() || "I'm sorry, I couldn't process your request. Please try again.";
  } catch (error) {
    console.error("Error in chat:", error);
    throw new Error("Failed to process your message");
  }
}
