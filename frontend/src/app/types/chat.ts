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

export type ProjectPreferences = {
  complexity: string;
  timeline: string;
};

export type TabStatus = "inactive" | "active" | "completed";

export type TabState = {
  status: TabStatus;
  preferences?: ProjectPreferences;
  refinedPRD?: string;
  initialMessage?: string;
  messages?: Message[];
}; 