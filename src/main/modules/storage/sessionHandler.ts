import { readFile, writeFile, readdir } from "fs/promises";
import { join } from 'path';
import { v4 } from "uuid";

import type { Session, Conversation, LLMConfig } from '../../../models/chat';
import { defaultLLMConfig } from "../../../models/chat";
import { getSessionStoragePath, ensureStorageDirectory } from "./paths";

export const createSession = async (config?: LLMConfig): Promise<Session> => {
    try {
        await ensureStorageDirectory();

        const sessionId = v4();
        const initialConversationId = v4();
        const initialConversation: Conversation = {
            id: initialConversationId,
            title: "New Conversation",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [],
        };

        const newSession: Session = {
            id: sessionId,
            activeConversationId: initialConversationId,
            conversations: [initialConversation],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            settings: config ?? defaultLLMConfig, // Use default if config not provided
        };

        await writeSession(newSession);
        return newSession;
    } catch (error) {
        console.error("Failed to create a new session: ", error);
        throw error;
    }
};

export const writeSession = async (session: Session): Promise<void> => {
    try {
        await ensureStorageDirectory();
        session.updatedAt = new Date().toISOString();
        const sessionFilePath = join(getSessionStoragePath(), `${session.id}.json`);
        await writeFile(sessionFilePath, JSON.stringify(session, null, 2), 'utf8');
    } catch (error) {
        console.error(`Failed to write session: ${session.id}`, error);
        throw error;
    }
};

export const readSession = async (id: string): Promise<Session> => {
    try {
        await ensureStorageDirectory();
        const sessionFilePath = join(getSessionStoragePath(), `${id}.json`);
        return JSON.parse(await readFile(sessionFilePath, { encoding: 'utf8' })) as Session;
    } catch (error) {
        console.error(`Failed to read session ${id}: `, error);
        throw error;
    }
};

export const listConversations = async (sessionId: string): Promise<{ id: string; title: string; createdAt: string }[]> => {
    try {
        const session = await readSession(sessionId);
        return session.conversations.map(conversation => ({
            id: conversation.id,
            title: conversation.title,
            createdAt: conversation.createdAt,
        }));
    } catch (error) {
        console.error(`Failed to list conversations for session ${sessionId}: `, error);
        throw error;
    }
};

export const setActiveConversation = async (sessionId: string, conversationId: string): Promise<Session> => {
  await ensureStorageDirectory();
  const session = await readSession(sessionId);
  const conversationExists = session.conversations.some(c => c.id === conversationId);
  if (!conversationExists) throw new Error(`Conversation ${conversationId} not found`);
  
  session.activeConversationId = conversationId;
  session.updatedAt = new Date().toISOString();
  await writeSession(session);
  return session; // Return updated session for frontend state sync
};

export const createConversation = async (sessionId: string): Promise<Conversation> => {
    try {
        await ensureStorageDirectory();

        const conversationId = v4();
        const newConversation: Conversation = {
            id: conversationId,
            title: "New Conversation",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [],
        }
        
        // Update the session to include the new conversation
        const session = await readSession(sessionId);
        session.conversations.push(newConversation);
        session.activeConversationId = conversationId;
        session.updatedAt = new Date().toISOString();
        await writeSession(session);
        
        return newConversation;
} catch (error) {
        console.error("Failed to create a new conversation: ", error);
        throw error;
    }
}

export const writeConversation = async (sessionId: string, conversation: Conversation): Promise<Session> => {
  await ensureStorageDirectory();
  const session = await readSession(sessionId);
  
  const index = session.conversations.findIndex(c => c.id === conversation.id);
  if (index !== -1) session.conversations[index] = conversation;
  else {
    session.conversations.push(conversation);
    session.activeConversationId = conversation.id;
  }
  
  session.updatedAt = new Date().toISOString();
  await writeSession(session);
  return session;
};

export const readConversation = async (sessionId: string, conversationId: string): Promise<Conversation> => {
    try {
        await ensureStorageDirectory();
        
        // Get the session first
        const session = await readSession(sessionId);
        
        // Find the conversation in the session
        const conversation = session.conversations.find(c => c.id === conversationId);
        
        if (!conversation) {
            throw new Error(`Conversation ${conversationId} not found in session ${sessionId}`);
        }
        
        return conversation;
    } catch (error) {
        console.error(`Failed to read conversation ${conversationId} from session ${sessionId}: `, error);
        throw error;
    }
}

export const listSessions = async (): Promise<Session[]> => {
    try {
        await ensureStorageDirectory();
        const sessionStoragePath = getSessionStoragePath();
        const sessionFiles = await readdir(sessionStoragePath);
        
        const sessions = await Promise.all(
            sessionFiles.filter(file => file.endsWith('.json')).map(async (file) => {
                const sessionFilePath = join(sessionStoragePath, file);
                const sessionData = await readFile(sessionFilePath, { encoding: 'utf8' });
                return JSON.parse(sessionData) as Session;
            })
        );
        
        return sessions;
    } catch (error) {
        console.error('Failed to list sessions: ', error);
        throw error;
    }
};

export const getLastActiveSession = async (): Promise<Session | null> => {
    try {
        const sessions = await listSessions();
        
        if (sessions.length === 0) {
            return null;
        }
        
        // Sort sessions by updatedAt in descending order to get the most recent first
        sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        
        return sessions[0];
    } catch (error) {
        console.error('Failed to get last active session: ', error);
        throw error;
    }
};
