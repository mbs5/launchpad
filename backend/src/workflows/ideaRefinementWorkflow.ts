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

Current user input: ${message}

Generate a structured PRD following this exact format:

# Project Overview
[Provide a concise vision statement and 2-3 key goals, making reasonable assumptions where needed]

# Core Features

## Feature 1: [Feature Name]
* Primary Functionality: [One-line description of main use]
* Description: [2-3 sentences explaining the feature]
* Purpose: [Clear value proposition]
* Acceptance Criteria:
  * [Specific measurable criteria 1]
  * [Specific measurable criteria 2]
  * [Specific measurable criteria 3]

## Feature 2: [Feature Name]
* Primary Functionality: [One-line description of main use]
* Description: [2-3 sentences explaining the feature]
* Purpose: [Clear value proposition]
* Acceptance Criteria:
  * [Specific measurable criteria 1]
  * [Specific measurable criteria 2]
  * [Specific measurable criteria 3]

## Feature 3: [Feature Name]
* Primary Functionality: [One-line description of main use]
* Description: [2-3 sentences explaining the feature]
* Purpose: [Clear value proposition]
* Acceptance Criteria:
  * [Specific measurable criteria 1]
  * [Specific measurable criteria 2]
  * [Specific measurable criteria 3]

# User Journeys

1. Primary User Flow
   * [First key action]
   * [Second key action]
   * [Third key action]

2. Secondary User Flow
   * [First key action]
   * [Second key action]
   * [Third key action]

3. Optional User Flow
   * [First key action]
   * [Second key action]
   * [Third key action]

How does this sound? Let me know if you'd like to fine-tune any section.

Instructions:
- Maintain exact formatting with headers, bullet points, and indentation
- Make reasonable assumptions to fill any gaps
- Keep descriptions concise but comprehensive
- Focus on actionable, measurable criteria
- Ensure consistent formatting across all sections

Response:`;

  const response = await step<typeof functions>({
    taskQueue: 'together',
  }).togetherChatCompletionBasic({
    messages: [{ role: "user", content: prompt }],
    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    temperature: 0.7,
    max_tokens: 1500,
  });

  return response;
}
