import { ProjectPreferences } from "../components/dialogs/PreferencesDialog";

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type ChatExample = {
  name: string;
  description: string;
  integrations: string[];
  input: {
    message: string;
    context?: string;
    stage?: string;
  };
  disabled?: boolean;
};

export type TabStatus = "inactive" | "active" | "completed";

export type TabState = {
  status: TabStatus;
  context?: string;
  messages?: Message[];
  refinedPRD?: string;
  preferences?: ProjectPreferences;
  initialMessage?: string;
};

export type ChatContext = {
  previousMessages?: Message[];
  stage?: string;
  context?: string;
  refinedPRD?: string;
  techStack?: string;
  preferences?: ProjectPreferences;
};

export type ChatInterfaceProps = {
  example: ChatExample;
  context?: ChatContext;
  initialMessage?: string;
  onMessagesUpdate?: (messages: Message[]) => void;
  onCopyToSidebar?: (content: string) => void;
}; 