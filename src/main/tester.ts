import { createSession, writeConversation, readConversation } from "./modules/storage/sessionHandler";
import { Conversation } from "../models/chat";
import { getChatStream, updateChatWithAsstResponse } from './modules/llm/llmHandler'

export const runTests = async (): Promise<void> => {
    console.log("Starting tests");

    const testConfig = { temperature: 0.7, maxTokens: 2048}

    // Create a session first
    const session = await createSession(testConfig);
    console.log("Created session:", session.id);
    console.log(JSON.stringify(session, null, 2));

    const testWriteConversation: Conversation = {
        "id": "d0b0311b-81b4-42af-a44e-f4299073ea9c",
        "title": "Test Write Conversation",
        "createdAt": "2025-10-23T21:49:42.273Z",
        "updatedAt": "2025-10-23T21:49:42.273Z",
        "messages": [{
            "id": "0",
            "role": "system",
            "content": "You are a helpful assistant",
            "timestamp": "Now"
        },
        {
            "id": "1",
            "role": "user",
            "content": "Hello!",
            "timestamp": "Now"
        },
        {
            "id": "2",
            "role": "assistant",
            "content": "Hello, how can I help you?",
            "timestamp": "Now"
        },
        {
            "id": "3",
            "role": "user",
            "content": "How far away is the moon?",
            "timestamp": "Now"
        },
    ]}

    await writeConversation(session.id, testWriteConversation);

    console.log("Result from conversation read:");
    console.log(JSON.stringify(await readConversation(session.id, testWriteConversation.id), null, 2));

    const stream = await getChatStream(session.id, testWriteConversation.id);
    console.log();
    for await (const partial of stream) {
        process.stdout.write(`${partial}\r`);
    }

    await updateChatWithAsstResponse(session.id, testWriteConversation.id, await stream.getFinalResponse());

    console.log("tests completed");
}
