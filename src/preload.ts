import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    // Existing session methods
    listSessions: () => ipcRenderer.invoke('session:list'),
    getLastActiveSession: () => ipcRenderer.invoke('session:getActive'),
    createNewSession: () => ipcRenderer.invoke('session:create'),
    
    // conversation methods (matches your IPC handlers)
    createConversation: (sessionId: string) => ipcRenderer.invoke('conversation:create', sessionId),
    readConversation: (sessionId: string, conversationId: string) => ipcRenderer.invoke('conversation:read', sessionId, conversationId),
    updateConversation: (sessionId: string, conversation: any) => ipcRenderer.invoke('conversation:update', sessionId, conversation),
    listConversations: (sessionId: string) => ipcRenderer.invoke('conversation:list', sessionId),
    setActiveConversation: (sessionId: string, conversationId: string) => ipcRenderer.invoke('conversation:setActive', sessionId, conversationId)
});