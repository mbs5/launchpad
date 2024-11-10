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
  previousMessages = [],
  pdfContent = ""
}: TechStackInput & { pdfContent?: string }) {
  const context = previousMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  
  let prompt = '';
  
  switch(stage) {
    case 'skills_assessment':
      prompt = `
Context: ${context}
${pdfContent ? `Resume Content: ${pdfContent}\n` : ''}
User message about their skills: ${message}

You are a tech stack advisor. Based on the user's project requirements and skills${pdfContent ? ' (from their resume)' : ''}, provide a direct, comprehensive tech stack recommendation. Format your response as follows:

# Recommended Tech Stack

## Frontend
[List recommended frontend technologies with brief justifications]

## Backend
[List recommended backend technologies with brief justifications]

## Database
[List recommended database solutions with brief justifications]

## DevOps & Infrastructure
[List recommended DevOps tools and infrastructure with brief justifications]

## Additional Tools
[List any additional tools or services that would benefit the project]

# Learning Resources
[Provide 2-3 key resources for any unfamiliar technologies]

Keep the response concise but thorough, focusing on practical, modern solutions that match the user's skill level and project needs.

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
    model: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo',
    temperature: 0.7,
    max_tokens: 20000,
  });

  return response;
} 