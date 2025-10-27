import { Session, Conversation } from "../models/chat";


declare global {
  interface Window {
    electronAPI: {
      // Session methods (existing)
      listSessions: () => Promise<Session[]>;
      getLastActiveSession: () => Promise<Session>;
      createNewSession: () => Promise<Session>;

      // Conversation methods (new - matches preload.ts/index.ts)
      createConversation: (sessionId: string) => Promise<Conversation>;
      readConversation: (sessionId: string, conversationId: string) => Promise<Conversation>;
      updateConversation: (sessionId: string, conversation: Conversation) => Promise<Session>;
      listConversations: (sessionId: string) => Promise<Conversation[]>;
      setActiveConversation: (sessionId: string, conversationId: string) => Promise<Session>;
    };
  }
}

export {}; // Mark as a module to avoid global scope pollution