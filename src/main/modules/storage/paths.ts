import { mkdir, access } from 'fs/promises'
import { app } from 'electron';
import { join } from 'path'

export const getUserDataPath = (): string => {
    return app.getPath('userData');
}

export const getSessionStoragePath = (): string => {
    return join(getUserDataPath(), 'ChatSessions');
}

export const ensureStorageDirectory = async(): Promise<void> => {
    const storagePath = getSessionStoragePath();
    try {
        await access(storagePath);
    } catch {
        console.error("StoragePath couldn't be accessed")
        await mkdir(storagePath, {recursive: true})
    }
}
