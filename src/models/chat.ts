export interface Session {
    id: string,
    activeConversationId: string;
    conversations: Conversation[]
    createdAt: string,
    updatedAt: string,
    settings: LLMConfig
}

export interface SessionInfo {
    id: string,
    createdAt: string,
    updatedAt: string
}

export interface Conversation {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: Message[];
}

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
    metadata?: Metadata;
}

export const defaultLLMConfig: LLMConfig = {
    temperature: 0.7,
    maxTokens: 4096,
    top_p: 0.9
}

export interface LLMConfig {
    temperature: number;
    maxTokens: number;
    top_p?: number;
}

export interface Metadata {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}