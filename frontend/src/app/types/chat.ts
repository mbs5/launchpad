export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type ChatExample = {
  name: string;
  description: string;
  integrations: string[];
  workflowName: string;
  input: Record<string, unknown>;
  initialMessage?: string;
}; 