import { createSession, createConversation, writeConversation, readConversation, listConversations, readSession } from "./modules/storage/ioHandler";
import { Conversation, LLMConfig } from "../models/chat";

export const runTests = async (): Promise<void> => {
    console.log("Starting tests");

    const testConfig = { temperature: 0.7, maxTokens: 2048}

    // Create a session first (Session is now the atomic unit)
    const session = await createSession(testConfig);
    console.log("Created session:", session.id);
    console.log(JSON.stringify(session, null, 2));
    
    // Create a conversation using the session ID
    const conversation = await createConversation(session.id);
    console.log("Created conversation:", conversation.id);

    const testWriteConversation: Conversation = {
        "id": "d0b0311b-81b4-42af-a44e-f4299073ea9c",
        "title": "Test Write Conversation",
        "createdAt": "2025-10-23T21:49:42.273Z",
        "updatedAt": "2025-10-23T21:49:42.273Z",
        "messages": [{
            "id": "123",
            "role": "user",
            "content": "Test",
            "timestamp": "Now"
        }],
    }

    await writeConversation(session.id, testWriteConversation);

    console.log("Result from conversation read:");
    console.log(JSON.stringify(await readConversation(session.id, "d0b0311b-81b4-42af-a44e-f4299073ea9c"), null, 2));

    console.log("Current session:")
    console.log(JSON.stringify(session, null, 2));


    console.log("List conversations:");
    console.log(JSON.stringify(await listConversations(session.id), null, 2))

    console.log("tests completed");
}
