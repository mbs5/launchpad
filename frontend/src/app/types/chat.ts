export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachment?: {
    type: "pdf";
    name: string;
    content: string;
  };
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

export type ChatContext = {
  refinedPRD?: string;
  techStack?: string;
  architecture?: string;
};

export type ChatInterfaceProps = {
  example: ChatExample;
  previousPRD?: string;
  initialMessage?: string;
  onMessagesUpdate?: (messages: Message[]) => void;
  context?: ChatContext;
}; 