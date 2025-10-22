import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    getGreeting: (name: string) => ipcRenderer.invoke('get-greeting', name),
});