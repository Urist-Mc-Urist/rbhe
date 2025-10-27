import { contextBridge, ipcRenderer } from "electron";
import { createSession } from "./main/modules/storage/sessionHandler";

contextBridge.exposeInMainWorld('electronAPI', {
    listSessions: () => ipcRenderer.invoke('session:list'),
    getLastActiveSession: () => ipcRenderer.invoke('session:getActive'),
    createNewSession: () => ipcRenderer.invoke('session:create')
});