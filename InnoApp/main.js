const { app, BrowserWindow, ipcMain, net, session } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { pathToFileURL } = require('url');

const configuredApi = process.env.SECURE_PRINT_API_URL || 'http://127.0.0.1:5000/api';
const apiUrl = new URL(configuredApi);
if (apiUrl.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(apiUrl.hostname)) {
  throw new Error('SECURE_PRINT_API_URL must use loopback HTTP for this local prototype');
}

let mainWindow;
let accessToken;

function secureWindowOptions(extra = {}) {
  return {
    ...extra,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      devTools: process.env.NODE_ENV !== 'production',
    },
  };
}

function protectWindow(window) {
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, target) => {
    if (!target.startsWith('file:')) event.preventDefault();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow(secureWindowOptions({ width: 900, height: 700 }));
  protectWindow(mainWindow);
  void mainWindow.loadFile('login.html');
}

async function apiRequest(relativePath, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const response = await net.fetch(new URL(relativePath, `${apiUrl.toString().replace(/\/$/, '')}/`), {
    ...options,
    headers,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'API request failed');
  }
  return response;
}

ipcMain.handle('auth:login', async (_event, credentials) => {
  const phoneNumber = String(credentials?.phoneNumber || '').trim();
  const password = String(credentials?.password || '');
  if (!phoneNumber || !password || password.length > 128) throw new Error('Invalid credentials');
  const response = await apiRequest('auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, password }),
  });
  const body = await response.json();
  accessToken = body.token;
  await mainWindow.loadFile('index.html');
  return true;
});

ipcMain.handle('documents:list', async () => {
  if (!accessToken) throw new Error('Sign in required');
  const response = await apiRequest('documents');
  const body = await response.json();
  return body.documents;
});

ipcMain.handle('printers:list', async () => {
  if (!accessToken) throw new Error('Sign in required');
  const printers = await mainWindow.webContents.getPrintersAsync();
  return printers.map(({ name, displayName, isDefault }) => ({ name, displayName, isDefault }));
});

ipcMain.handle('documents:print', async (_event, { documentId, printerName }) => {
  if (!accessToken) throw new Error('Sign in required');
  if (!/^[a-f\d]{24}$/i.test(String(documentId))) throw new Error('Invalid document');
  const printers = await mainWindow.webContents.getPrintersAsync();
  if (!printers.some((printer) => printer.name === printerName)) throw new Error('Select an available printer');

  const response = await apiRequest(`documents/${documentId}/content`);
  const tempPath = path.join(app.getPath('temp'), `secure-print-${crypto.randomUUID()}.pdf`);
  await fs.writeFile(tempPath, Buffer.from(await response.arrayBuffer()), { mode: 0o600 });
  const printWindow = new BrowserWindow(secureWindowOptions({ show: false }));
  protectWindow(printWindow);

  try {
    await printWindow.loadURL(pathToFileURL(tempPath).toString());
    await new Promise((resolve, reject) => {
      printWindow.webContents.print(
        { silent: true, printBackground: true, deviceName: printerName },
        (success) => (success ? resolve() : reject(new Error('Printer rejected the job'))),
      );
    });
    await apiRequest(`documents/${documentId}`, { method: 'DELETE' });
    return { printed: true, deleted: true };
  } finally {
    printWindow.destroy();
    await fs.rm(tempPath, { force: true });
  }
});

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  createWindow();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
