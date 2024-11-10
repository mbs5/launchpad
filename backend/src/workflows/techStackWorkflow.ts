import { step } from "@restackio/ai/workflow";
import * as functions from "../functions";

type TechStackInput = {
  message: string;
  stage: 'skills_assessment' | 'preferences' | 'recommendation';
  previousMessages?: Array<{ role: string; content: string }>;
};

export async function techStackWorkflow({ 
  message,
  stage,
  previousMessages = []
}: TechStackInput) {
  const context = previousMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  
  let prompt = '';
  
  switch(stage) {
    case 'skills_assessment':
      prompt = `
Context: ${context}
User message about their skills: ${message}

You are a tech stack advisor. Analyze the user's skills and experience, then ask specific questions about:
1. Their experience with different programming languages
2. Their familiarity with various frameworks
3. Any specific areas they want to improve

Format your response with:
- A brief analysis of their current skill level
- 2-3 focused follow-up questions about their technical background
- Keep the tone professional but approachable

Response:`;
      break;
      
    case 'preferences':
      prompt = `
Context: ${context}
User preferences: ${message}

Based on the user's skills and preferences, ask about:
1. Project timeline and deadlines
2. Scalability requirements
3. Deployment preferences (cloud, self-hosted, etc.)
4. Any specific technical constraints

Format your response with:
- A summary of their preferences so far
- 2-3 specific questions about project requirements
- Maintain a consultative tone

Response:`;
      break;
      
    case 'recommendation':
      prompt = `
Context: ${context}
Final input: ${message}

Provide a comprehensive tech stack recommendation:
1. Frontend framework and libraries
2. Backend technologies
3. Database solutions
4. DevOps tools
5. Additional tools and services

Format your response with:
- A clear breakdown of recommended technologies
- Brief justification for each choice
- Learning resources for unfamiliar technologies
- Alternative options where relevant

Response:`;
      break;
  }

  const response = await step<typeof functions>({
    taskQueue: 'together',
  }).togetherChatCompletionBasic({
    messages: [{ role: "user", content: prompt }],
    model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
  });

  return response;
} 