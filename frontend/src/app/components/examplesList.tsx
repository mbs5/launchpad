export type Example = {
  name: string;
  description: string;
  integrations: string[];
  workflowName: string;
  input: Record<string, unknown>;
};

export const examples = [
  {
    name: "Idea Refinement",
    description: "Refine your project ideas through interactive dialogue",
    integrations: ["together"],
    workflowName: "ideaRefinementWorkflow",
    input: { 
      message: "Hi! I'm here to help refine your project idea. Tell me about what you'd like to build.",
      stage: "initial" 
    },
  },
  {
    name: "Tech Stack",
    description: "Get personalized tech stack recommendations",
    integrations: ["together"],
    workflowName: "techStackWorkflow",
    input: {
      message: "Let's find the perfect tech stack for your project. First, could you tell me about your current programming experience and skill level?",
      stage: "skills_assessment"
    },
  },
  {
    name: "Architecture",
    description: "Design your system architecture",
    integrations: ["together"],
    workflowName: "architectureWorkflow",
    input: {
      message: "I'll help you design your system architecture. What type of application are you building?",
      stage: "initial"
    },
  },
  {
    name: "Resources",
    description: "Find learning resources and documentation",
    integrations: ["together"],
    workflowName: "resourcesWorkflow",
    input: {
      message: "I can help you find relevant learning resources. What topics are you interested in?",
      stage: "initial"
    },
  }
];
