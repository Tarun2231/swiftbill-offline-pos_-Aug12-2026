const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  saveBackupFile: (dataString, defaultFilename) => ipcRenderer.invoke('dialog:saveBackup', { dataString, defaultFilename }),
  loadBackupFile: () => ipcRenderer.invoke('dialog:loadBackup')
});
