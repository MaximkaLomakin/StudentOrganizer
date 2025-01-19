'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
const dataFilePath = path.join(app.getPath('userData'), 'data.json');

if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ schedule: [], reminders: [], grades: [] }, null, 2));
}

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        minHeight: 400,
        minWidth: 600,
        height: 800,
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: false,
            nodeIntegration: true,
        },
    });
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadFile('index.html');
});

ipcMain.handle('save-data', (event, data) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        return { success: true };
    } catch (error) {
        console.error('Error saving data:', error);
        return { success: false, error: error.message };
    }
});