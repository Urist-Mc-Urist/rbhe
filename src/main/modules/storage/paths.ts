import { app } from 'electron';
import { join } from 'path'

export const getUserDataPath = (): string => {
    return app.getPath('userData');
}

export const getConversationStoragePath = (): string => {
    return join(getUserDataPath(), 'conversations');
}