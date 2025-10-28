import { BamlStream } from '@boundaryml/baml'
import { b } from '../../../baml_client'
import { v4 } from 'uuid'
import { writeConversation, readConversation } from '../storage/sessionService'

export const getStreamFromUserMessage = async (
    sessionId: string,
    conversationId: string,
    userMessage: string):
    Promise<{
        stream: BamlStream<string, string>;
        completeWithAssistantResponse: (assistantContent: string) => Promise<void>
    }> => {
        await updateChatWithUserResponse(sessionId, conversationId, userMessage)
        const stream = await getChatStream(sessionId, conversationId);

        const completeWithAssistantResponse = async (assistantContent: string) => {
            await updateChatWithAsstResponse(sessionId, conversationId, assistantContent)
        }

        return {stream, completeWithAssistantResponse}
}


export const getChatStream = async (sessionId: string, conversationId: string): Promise<BamlStream<string, string>> => {
    const messages = (await readConversation(sessionId, conversationId)).messages
    return b.stream.Chat(messages)
}

const addMessageToConversation = async (
  sessionId: string,
  conversationId: string,
  role: "user" | "assistant",
  content: string,
): Promise<void> => {
  // Shared validation
  if (!sessionId?.trim() || !conversationId?.trim()) {
    throw new Error("Session ID and Conversation ID are required")
  }
  if (!content?.trim()) {
    throw new Error(`${role === "user" ? "User" : "Assistant"} content cannot be empty`)
  }

  try {
    const convo = await readConversation(sessionId, conversationId)
    if (!convo) throw new Error(`Conversation "${conversationId}" not found for session "${sessionId}"`)

    const message = {
      id: v4(), // Use provided key or generate new
      role,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    convo.messages.push(message)
    await writeConversation(sessionId, convo)
  } catch (error) {
    console.error(`Failed to add ${role} message`, { sessionId, conversationId, error })
    throw new Error(`Add ${role} message failed: ${(error as Error).message}`)
  }
}

// Refactored: Reuse helper for user messages
export const updateChatWithUserResponse = async (
  sessionId: string,
  conversationId: string,
  content: string,
): Promise<void> => {
  return addMessageToConversation(sessionId, conversationId, "user", content)
}

// Refactored: Reuse helper for assistant messages
export const updateChatWithAsstResponse = async (
  sessionId: string,
  conversationId: string,
  content: string,
): Promise<void> => {
  return addMessageToConversation(sessionId, conversationId, "assistant", content)
}