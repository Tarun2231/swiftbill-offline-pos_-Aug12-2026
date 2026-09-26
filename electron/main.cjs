const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: 'SwiftBill POS & Inventory - Offline Desktop Edition',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  // Remove default menu bar for clean native POS UI look
  mainWindow.setMenuBarVisibility(false);

  const isDev = !app.isPackaged && process.env.NODE_ENV === 'development';

  if (isDev) {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers for Windows Native Backup & Restore
ipcMain.handle('dialog:saveBackup', async (event, { dataString, defaultFilename }) => {
  try {
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save SwiftBill Database Backup',
      defaultPath: defaultFilename || `SwiftBill_Backup_${new Date().toISOString().slice(0, 10)}.json`,
      filters: [{ name: 'JSON Backup Files (*.json)', extensions: ['json'] }]
    });

    if (canceled || !filePath) {
      return { success: false, message: 'Save canceled by user.' };
    }

    fs.writeFileSync(filePath, dataString, 'utf-8');
    return { success: true, filePath, message: `Backup saved successfully to ${filePath}` };
  } catch (err) {
    return { success: false, message: `Failed to save backup: ${err.message}` };
  }
});

ipcMain.handle('dialog:loadBackup', async () => {
  try {
    const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
      title: 'Select SwiftBill JSON Backup File to Restore',
      properties: ['openFile'],
      filters: [{ name: 'JSON Backup Files (*.json)', extensions: ['json'] }]
    });

    if (canceled || !filePaths || filePaths.length === 0) {
      return { success: false, message: 'Restore canceled.' };
    }

    const content = fs.readFileSync(filePaths[0], 'utf-8');
    return { success: true, content, filePath: filePaths[0], message: 'Backup file loaded successfully.' };
  } catch (err) {
    return { success: false, message: `Failed to load backup file: ${err.message}` };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
