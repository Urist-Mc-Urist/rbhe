export interface Conversation {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: Message[];
    settings: LLMConfig
}

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
    metadata?: Metadata;
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