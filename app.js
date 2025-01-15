'use strict';

const { app, BrowserWindow } = require('electron');

let mainWindow;

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