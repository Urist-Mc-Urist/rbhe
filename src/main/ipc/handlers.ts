import { Session } from "../../models/chat";
import { listSessions, getLastActiveSession, createSession  } from "../modules/storage/sessionHandler"

export const handleListSessions = async (event: Electron.IpcMainInvokeEvent): Promise<Session[]> => {
    return listSessions();
}

export const handleGetLastActiveSession = async (event: Electron.IpcMainInvokeEvent): Promise<Session> => {
    return getLastActiveSession();
}

export const handleCreateSession = async (event: Electron.IpcMainInvokeEvent): Promise<Session> => {
    return createSession();
}

