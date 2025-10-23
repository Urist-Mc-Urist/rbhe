import { readFile, writeFile, mkdir, access } from "fs/promises";
import { join } from 'path';
import { getConversationStoragePath } from "./paths";
import { v4 } from "uuid";
import type { Conversation, LLMConfig } from '../../../models/conversation';

export const createConversation = async (config: LLMConfig): Promise<Conversation> => {
    try {
        await ensureStorageDirectory();

        const conversationId = v4();
        const newConversation: Conversation = {
            id: conversationId,
            title: "New Conversation",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [],
            settings: config
        }

        const conversationFilePath = join(getConversationStoragePath(), `${conversationId}.json`);
        await writeFile(conversationFilePath, JSON.stringify(newConversation, null, 2), 'utf8');
        return newConversation
    } catch (error) {
        console.error("Failed to createa a new conversation: ", error);
        throw error;
    }
    
}

export const writeConversation = async (conversation: Conversation): Promise<void> => {

    return
}

export const readConversation = async (id:string): Promise<Conversation> => {

    return
}

export const listConversations = async (): Promise<{id: string; title: string; createdAt: string}[]> => {


    return
}


export const ensureStorageDirectory = async(): Promise<boolean> => {
    const storagePath = getConversationStoragePath();
    try {
        // Check if the directory exists (throws if not)
        await access(storagePath);
        return true; // Directory exists—do nothing
    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code === 'ENOENT') { // "No such file or directory" = directory missing
            // Create the directory (recursive: true handles missing parent dirs, though userData should exist)
            await mkdir(storagePath, { recursive: true });
            return true; // Directory created successfully
        }
        // Rethrow other errors (e.g., permission denied) so the caller can handle them
        throw new Error(`Failed to access storage directory: ${err.message}`);
    }
};
