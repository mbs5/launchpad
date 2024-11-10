import { step } from "@restackio/ai/workflow";
import * as functions from "../functions";

export async function ideaRefinementWorkflow({ 
  message,
  previousMessages = []
}: { 
  message: string;
  previousMessages?: Array<{ role: string; content: string }>;
}) {
  const context = previousMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  
  const prompt = `
Context of previous conversation:
${context}

User message: ${message}

As an AI assistant helping refine project ideas, provide a helpful response that:
1. Analyzes the current state of the idea
2. Asks relevant follow-up questions
3. Offers constructive suggestions
4. Maintains a conversational tone

Response:`;

  const response = await step<typeof functions>({
    taskQueue: 'together',
  }).togetherChatCompletionBasic({
    messages: [{ role: "user", content: prompt }],
    model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
  });

  return response;
} 