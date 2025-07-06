const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');

let win = null;
let tray = null;
const isDev = true;

function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 700,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'public/preload.js'),
      contextIsolation: true,
    }
  });

  if (isDev) {
    win.loadURL('https://vectorshades-frontend.vercel.app/auth/login'); // Vite dev server
  } else {
    win.loadFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  }

  win.on('minimize', (e) => {
    e.preventDefault();
    win.hide();
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
  console.error('Failed to load page', errorCode, errorDescription);
});

  win.on('close', () => {
    tray.destroy();
    app.quit();
  });
}

ipcMain.on('minimize-window', () => {
  if (win) win.minimize();
});

app.whenReady().then(() => {
  createWindow();

  tray = new Tray(path.join(__dirname, 'public/icon.png'));
  const menu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => win.show() },
    { label: 'Quit', click: () => { tray.destroy(); app.quit(); } }
  ]);
  tray.setContextMenu(menu);
  tray.setToolTip('Task Timer');

  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show();
  });
});

app.on('window-all-closed', (e) => {
  e.preventDefault(); // prevent quitting when all windows closed
});
