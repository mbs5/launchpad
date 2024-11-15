import { together } from '@/lib/together';
import { NextResponse } from "next/server";
import { Message } from '@/app/types/chat';



export async function POST(req: Request) {
  try {
    
    const { message, input } = await req.json();
    const previousMessages: Message[] = input?.previousMessages || [];
    
    // Different system prompts based on stage
    const getSystemPrompt = (stage: string) => {
      switch (stage) {
        case 'initial':
          return `You are an AI assistant helping users refine their project ideas. 
Format your responses using the following markdown structure:

# Project Title

## Project Overview
[Vision, goals]

## Core Features
### Feature 1: [Name]
- Purpose: [Brief description]
- Specifications:
  - [Key technical details]
  - [Implementation requirements]
- Acceptance Criteria:
  - [Measurable outcomes]
  - [Success metrics]

## User Journeys
### Journey 1: [Name]
1. [Step description]
2. [Step description]
3. [Step description]

## Future Scope
### Feature 1: [Name]
- Purpose: [Description]
- Benefits: [List key advantages]`;

        case 'skills_assessment':
          return `You are a technical advisor helping choose the right tech stack.
Consider the following context for your recommendations:
${input.context ? `Project Overview: ${input.context}` : ''}
${input.preferences ? `
Preferences:
- Complexity: ${input.preferences.complexity}
- Timeline: ${input.preferences.timeline}
- Priority: ${input.preferences.priority}
- Deployment: ${input.preferences.deployment}
- Team Size: ${input.preferences.team}
` : ''}

Format your responses as a structured analysis:

# Tech Stack Recommendation

## Stack Overview
[High-level overview of recommended technologies]

## Frontend
- Recommended: [Technologies]
- Rationale: [Explanation]
- Learning Curve: [Assessment]

## Backend
- Recommended: [Technologies]
- Rationale: [Explanation]
- Learning Curve: [Assessment]

## Database
- Recommended: [Technologies]
- Rationale: [Explanation]
- Learning Curve: [Assessment]

## DevOps
- Recommended: [Technologies]
- Rationale: [Explanation]
- Learning Curve: [Assessment]

## Additional Considerations
- Scalability: [Notes]
- Cost: [Estimates]
- Time to Market: [Assessment]`;

        default:
          return input?.context || '';
      }
    };

    const systemMessage = [{
      role: "system" as const,
      content: `${getSystemPrompt(input.stage || 'initial')}\n\nStage: ${input.stage || 'initial'}`
    }];

    // Convert messages to Together AI format
    const messages = [
      ...previousMessages.map(msg => ({
        role: msg.role as "user" | "assistant" | "system" | "tool",
        content: msg.content
      })),
      { role: "user" as const, content: message }
    ];

    const completion = await together.chat.completions.create({
      messages: [...systemMessage, ...messages],
      model: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo',
      temperature: 0.7,
      max_tokens: 3000,
      stop: ["Human:", "Assistant:"]
    });

    const content = completion.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
    
    return NextResponse.json({ content });
  } catch (error) {
    if (error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" }, 
      { status: 500 }
    );
  }
} 