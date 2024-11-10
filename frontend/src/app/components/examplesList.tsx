export type Example = {
  name: string;
  description: string;
  integrations: string[];
  workflowName: string;
  input: Record<string, unknown>;
};

export const examples = [
  {
    name: "Idea Refinement Assistant",
    description: "AI assistant that helps refine your project ideas through interactive dialogue",
    integrations: ["together"],
    workflowName: "ideaRefinementWorkflow",
    input: { 
      message: "Hi! I'm here to help refine your project idea. Tell me about what you'd like to build.",
      stage: "initial" 
    },
  },
];
