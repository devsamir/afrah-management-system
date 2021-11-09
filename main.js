const { app, BrowserWindow } = require("electron");
const path = require("path");
// Check mode is development or production
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 600,
    minWidth: 800,
    // frame: false,
    autoHideMenuBar: true,
    backgroundColor: "rgb(222,225,230)",
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: false,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
    },
  });
  win.loadFile("index.html");
}
if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}
app.whenReady().then(createWindow);
