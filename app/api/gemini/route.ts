/**
 * Gemini API Route Handler
 * Secure server-side API calls to Google Generative AI
 * Model: gemini-2.5-flash
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for request/response
interface GeminiRequestBody {
  prompt: string;
  emailContent: string;
  context?: string;
  type: 'categorize' | 'extract' | 'reply' | 'chat';
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not configured. Set GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // Parse request body
    const body: GeminiRequestBody = await request.json();
    const { prompt, emailContent, context, type } = body;

    if (!prompt || !emailContent) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: prompt and emailContent' },
        { status: 400 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build the full prompt based on type
    let fullPrompt = '';
    
    switch (type) {
      case 'categorize':
        fullPrompt = `${prompt}\n\nEmail Content:\n${emailContent}`;
        break;
        
      case 'extract':
        fullPrompt = `${prompt}\n\nEmail Content:\n${emailContent}`;
        break;
        
      case 'reply':
        fullPrompt = `${prompt}\n\nOriginal Email:\n${emailContent}`;
        break;
        
      case 'chat':
        fullPrompt = `You are an intelligent email assistant. Help the user understand and respond to their emails.

Email Context:
${emailContent}

${context ? `Previous conversation:\n${context}\n` : ''}
User Question: ${prompt}

Provide a helpful, concise response. If asked to summarize, be brief and highlight key points. If asked about tasks or action items, list them clearly. If asked to draft a reply, write it professionally.`;
        break;
        
      default:
        fullPrompt = `${prompt}\n\n${emailContent}`;
    }

    // Call Gemini API
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      data: text.trim(),
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { success: false, error: `API Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}
