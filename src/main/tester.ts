import { createConversation, writeConversation, readConversation } from "./modules/storage/ioHandler";
import { Conversation, LLMConfig } from "../models/conversation";
import { write } from "fs";

export const runTests = async (): Promise<void> => {
    console.log("Starting tests");

    const testConfig = { temperature: 0.7, maxTokens: 2048}

    createConversation(testConfig);

    const testWriteConversation: Conversation = {
        "id": "d0b0311b-81b4-42af-a44e-f4299073ea9c",
        "title": "New Conversation",
        "createdAt": "2025-10-23T21:49:42.273Z",
        "updatedAt": "2025-10-23T21:49:42.273Z",
        "messages": [{
            "id": "123",
            "role": "user",
            "content": "Test",
            "timestamp": "Now"
        }],
        "settings": {
            "temperature": 0.7,
            "maxTokens": 2048
        }
    }

    writeConversation(testWriteConversation);

    console.log("Result from conversation read:");
    console.log(JSON.stringify(await readConversation("d0b0311b-81b4-42af-a44e-f4299073ea9c"), null, 2));

    console.log("tests completed");
}