// API Keys interface
export interface ApiKeys {
  openAIKey: string;
  anthropicKey: string;
}

// Message interface for chat messages
export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Return type for useChat hook
export interface ChatHookReturn {
  messages: Message[];
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  isStreaming: boolean;
  sendMessage: () => Promise<void>;
}

// Return type for useSidebarResize hook
export interface SidebarResizeReturn {
  sidebarWidth: number;
  sidebarRef: React.RefObject<HTMLDivElement>;
  resizeRef: React.RefObject<HTMLDivElement>;
}

// Props for Sidebar component
export interface SidebarProps {
  isOpen: boolean;
  apiKeys: ApiKeys;
}

export interface ModelWrapper {
  context: string;
  chat(
    messages: string[],
    modelPreference?: "openai" | "anthropic"
  ): AsyncGenerator<string, void, unknown>;
}

export interface ModelWrapperConstructor {
  new (openAIKey: string, anthropicKey: string, context: string): ModelWrapper;
}
