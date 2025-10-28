import { BamlStream } from '@boundaryml/baml'
import { b } from '../../../baml_client'
import { v4 } from 'uuid'
import { writeConversation, readConversation } from '../storage/sessionService'

export const getChatStream = async (sessionId: string, conversationId: string): Promise<BamlStream<string, string>> => {
    const messages = (await readConversation(sessionId, conversationId)).messages
    return b.stream.Chat(messages)
}

export const updateChatWithAsstResponse = async (sessionId: string, conversationId: string, content: string): Promise<void> => {
    let convo = await readConversation(sessionId, conversationId);

    convo.messages.push({
        id: v4(),
        role: "assistant",
        content: content,
        timestamp: new Date().toISOString(),
    })

await writeConversation(sessionId, convo);
}

export const updateChatWithUserResponse = async (sessionId: string, conversationId: string, content: string): Promise<void> => {
    let convo = await readConversation(sessionId, conversationId);

    convo.messages.push({
        id: v4(),
        role: "user",
        content: content,
        timestamp: new Date().toISOString(),
    })

    await writeConversation(sessionId, convo);
}
