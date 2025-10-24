import { app } from 'electron';
import { join } from 'path'

export const getUserDataPath = (): string => {
    return app.getPath('userData');
}

export const getSessionStoragePath = (): string => {
    return join(getUserDataPath(), 'ChatSessions');
}