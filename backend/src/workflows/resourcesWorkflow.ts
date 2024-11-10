import { step } from "@restackio/ai/workflow";
import * as functions from "../functions";

type ResourcesInput = {
  message: string;
  previousMessages?: Array<{ role: string; content: string }>;
  refinedPRD?: string;
  techStack?: string;
  selectedTopics?: string[];
};

export async function resourcesWorkflow({ 
  message,
  previousMessages = [],
  refinedPRD = "",
  techStack = "",
  selectedTopics = []
}: ResourcesInput) {
  const context = previousMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  
  const prompt = `
Context:
Project Overview: ${refinedPRD}
Recommended Tech Stack: ${techStack}
Selected Topics: ${selectedTopics.join(", ")}
Previous Conversation: ${context}
User Input: ${message}

You are a learning resource advisor specializing in Llama development. Based on the project requirements and selected topics, provide targeted learning recommendations focusing on Llama and related technologies. Format your response exactly as follows:

# Learning Path Overview
[Brief summary of how these resources will help with Llama development]

# Core Technologies
${selectedTopics.map(topic => `
## ${topic}
* What you'll learn: [One line explaining how this helps with Llama]
* Essential Resources:
  * Documentation: [Link to official Llama/Together AI docs]
  * Tutorial: [Link to specific tutorial]
  * Video: [Link to specific YouTube video]
* Advanced Topics:
  * Blog Post: [Link to technical blog post]
  * GitHub: [Link to example repository]`).join('\n')}

# Implementation Guide
1. Getting Started (Week 1):
   * Setup Llama environment
   * Basic API integration
   * Key concepts

2. Core Development (Week 2):
   * Building workflows
   * Data handling
   * Testing and debugging

3. Advanced Features (Week 3):
   * Performance optimization
   * Production deployment
   * Monitoring and scaling

Focus on practical, hands-on resources that directly contribute to Llama development.

Response:`;

  const response = await step<typeof functions>({
    taskQueue: 'together',
  }).togetherChatCompletionBasic({
    messages: [{ role: "user", content: prompt }],
    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response;
} 