import { Session, SessionInfo } from "../../models/chat";
import { listSessions, getLastActiveSessionId, createSession  } from "../modules/storage/sessionHandler"

export const handleListSessions = async (event: Electron.IpcMainInvokeEvent): Promise<SessionInfo[]> => {
    return listSessions();
}

export const handleGetLastActiveSessionId = async (event: Electron.IpcMainInvokeEvent): Promise<string> => {
    return getLastActiveSessionId();
}

export const handleCreateSession = async (event: Electron.IpcMainInvokeEvent): Promise<Session> => {
    return createSession();
}

