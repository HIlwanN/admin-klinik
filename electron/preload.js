import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: (name) => ipcRenderer.invoke('get-app-path', name),
  platform: process.platform,
  isElectron: true
});

console.log('Preload script loaded');

