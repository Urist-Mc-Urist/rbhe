import { Session, SessionInfo } from "../models/chat";


declare global {
  interface Window {
    electronAPI: {
      listSessions: () => Promise<SessionInfo[]>;
      getLastActiveSession: () => Promise<Session>;
      createNewSession: () => Promise<Session>;
    };
  }
}

export {}; // Mark as a module to avoid global scope pollution