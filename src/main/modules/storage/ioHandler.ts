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
    try {
        await ensureStorageDirectory();

        const conversationFilePath = join(getConversationStoragePath(), `${conversation.id}.json`);
        await writeFile(conversationFilePath, JSON.stringify(conversation, null, 2), 'utf8');
    } catch (error) {
        console.error(`Failed to write conversation: ${conversation.id}`, error);
        throw error;
    }

    
}

export const readConversation = async (id:string): Promise<Conversation> => {
    try {
        await ensureStorageDirectory();

        const conversationFilePath = join(getConversationStoragePath(), `${id}.json`);
        return JSON.parse(await readFile(conversationFilePath, {encoding: 'utf8'}));
    } catch (error) {
        console.error(`Failed to read conversation ${id}: `, error);
        throw error;
    }
}

export const listConversations = async (): Promise<{id: string; title: string; createdAt: string}[]> => {


    return
}

export const ensureStorageDirectory = async(): Promise<void> => {
    const storagePath = getConversationStoragePath();
    try {
        await access(storagePath);
    } catch {
        console.error("StoragePath couldn't be accessed")
        await mkdir(storagePath, {recursive: true})
    }
}