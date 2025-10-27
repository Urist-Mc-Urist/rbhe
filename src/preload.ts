import { contextBridge, ipcRenderer } from "electron";
import { createSession } from "./main/modules/storage/sessionHandler";

contextBridge.exposeInMainWorld('electronAPI', {
    listSessions: () => ipcRenderer.invoke('listSessions'),
    getLastActiveSession: () => ipcRenderer.invoke('getLastActive'),
    createNewSession: () => ipcRenderer.invoke('createSession')
});