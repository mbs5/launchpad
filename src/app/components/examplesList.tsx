export type Example = {
  name: string;
  description: string;
  integrations: string[];
  input: {
    message: string;
    stage?: string;
    context?: string;
    [key: string]: unknown;
  };
  disabled?: boolean;
};

export const examples = [
  {
    name: "Idea Refinement",
    description: "Refine your project ideas through interactive dialogue",
    integrations: ["together"],
    input: { 
      message: "# Hi! I'm here to help refine your project idea. Tell me about what you'd like to build.",
      stage: "initial",
      context: "You are an AI assistant helping users refine their project ideas. Ask probing questions to understand their needs and goals."
    },
  },
  {
    name: "Tech Stack",
    description: "Get personalized tech stack recommendations",
    integrations: ["together"],
    input: {
      message: "# Let's find the perfect tech stack for your project. First, could you tell me about your current programming experience and skill level?",
      stage: "skills_assessment",
      context: "You are an AI assistant helping users choose appropriate technologies for their project. Consider their experience level and project requirements."
    },
  },
  {
    name: "Architecture",
    description: "Coming Soon",
    integrations: ["together"],
    input: {
      message: "Coming Soon",
      stage: "initial"
    },
    disabled: true
  },
  {
    name: "Figma Design",
    description: "Coming Soon",
    integrations: ["together"],
    input: {
      message: "Coming Soon",
      stage: "initial"
    },
    disabled: true
  }
];
