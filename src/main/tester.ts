import { createConversation } from "./modules/storage/ioHandler";
import { LLMConfig } from "../models/conversation";

export const runTests = (): void => {
    console.log("Starting tests");

    const testConfig = { temperature: 0.7, maxTokens: 2048}

    createConversation(testConfig);

    console.log("tests completed");
}